import EC2Instance from "../models/ec2Instance.js";
import EC2Pricing from "../models/ec2Pricing.js";
import EC2Resource from "../models/ec2Resources.js";
import Estimate from "../models/estimation.js";
import RDSInstance from "../models/rdsInstance.js";
import RDSPricing from "../models/rdsPricing.js";
import RDSResource from "../models/rdsResources.js";
import Region from "../models/region.js";
import logger from "../utils/logger.js";
import {v4 as uuid4} from "uuid";

const getRegions = async (req, res) => {
  try {
    const regions = await Region.findAll();
    res.status(200).json({ data: regions });
  } catch (error) {
    res.json({ error: "Unable to get regions" });
  }
};

const getEC2Pricing = async (req, res) => {
  try {
    const pricing = await EC2Pricing.findAll({
      limit: 10,
      include: [
        {
          model: Region,
          attributes: ["name"],
        },
        {
          model: EC2Instance,
          attributes: ["instance_type", "vcpu", "memory"],
        },
      ],
    });
    res.status(200).json({ data: pricing });
  } catch (error) {
    res.json({ error: "Unable to get pricing" });
  }
};

const getEC2Instances = async (req, res) => {
  try {
    const instances = await EC2Instance.findAll({
      include: [
        {
          model: EC2Pricing,
          attributes: ["price"],
        },
      ],
    });
    res.status(200).json({ data: instances });
  } catch (error) {
    logger.error(error);
    res.json({ error: "Unable to get instances" });
  }
};
const getEC2InstancesByType = async (req, res) => {
  try {
    const instances = await EC2Instance.findOne({
      where: { instance_type: req.params.instance_type },
      include: [
        {
          model: EC2Pricing,
          attributes: ["operating_system","region","price"],
        },
      ],
    });
    res.status(200).json({ data: instances });
  } catch (error) {
    logger.error(error);
    res.json({ error: "Unable to get instances" });
  }
};

const getRDSPricing = async (req, res) => {
  try {
    const pricing = await RDSPricing.findAll({
      limit: 10,
      include: [
        {
          model: Region,
          attributes: ["name"],
        },
        {
          model: RDSInstance,
          attributes: ["instance_type", "vcpu", "memory"],
        },
      ],
    });
    res.status(200).json({ data: pricing });
  } catch (error) {
    res.json({ error: "Unable to get pricing" });
  }
};

const getRDSInstances = async (req, res) => {
  try {
    const instances = await RDSInstance.findAll({
      include: [
        {
          model: RDSPricing,
          attributes: ["price","region","database_engine","deployment_option"],
          where: { database_engine: "PostgreSQL" },
        },
      ],
    });
    res.status(200).json({ data: instances });
  } catch (error) {
    logger.error(error);
    res.json({ error: "Unable to get instances" });
  }
};

const getRDSInstancesByType = async (req, res) => {
  try {
    const instances = await RDSInstance.findOne({
      where: { instance_type: req.params.instance_type },
      include: [
        {
          model: RDSPricing,
          attributes: ["price","region","database_engine","deployment_option"],
          where: { database_engine: "PostgreSQL" },
        },
      ],
    });
    res.status(200).json({ data: instances });
  } catch (error) {
    logger.error(error);
    res.json({ error: "Unable to get instances" });
  }
};


const getEstimates = async (req, res) => {
  try {
    let estimates = await Estimate.findAll({
      include: [
        {
          model: EC2Resource,
          attributes: ["qty", "pricing_id"],
          include: [
            {
              model: EC2Pricing,
              attributes: ["instance_type","region","operating_system","price"],
              include: [
                {
                  model: Region,
                  attributes: ["name"],
                },
                {
                  model: EC2Instance,
                  attributes: ["vcpu", "memory"],
                },
              ],
            },
          ],
        },
        {
          model: RDSResource,
          attributes: ["qty", "pricing_id"],
          include: [
            {
              model: RDSPricing,
              attributes: ["instance_type","region","database_engine","deployment_option","price"],
              include: [
                {
                  model: Region,
                  attributes: ["name"],
                },
                {
                  model: RDSInstance,
                  attributes: ["vcpu", "memory"],
                },
              ],
            },
          ],
        }
      ],
    });

    estimates = estimates.map((estimate) => {
      let total = 0;
      if(estimate.EC2Resources.length >0)
        for (const ec2 of estimate.EC2Resources) {
          total += ec2.qty * ec2.EC2Pricing.price;
        }
      if(estimate.RDSResources.length >0)
        for (const rds of estimate.RDSResources) {
          total += rds.qty * rds.RDSPricing.price;
        }
      return { ...estimate.toJSON(), total_cost: "USD "+(total* estimate.duration) + " for " + estimate.duration + " running Hours" };
    })
    res.status(200).json({ data: estimates });
  } catch (error) {
    logger.error(error )
    res.json({ error: "Unable to get estimates" });
  }
}


const postEstimates = async (req, res) => {
  try {
    const { title, description, duration, services } = req.body;
    const estimate = await Estimate.create({ id:uuid4(),title, description, duration, services});
    res.status(201).json({ data: estimate });
  } catch (error) {
    logger.error(error);
    res.json({ error: "Unable to create estimate" });
  }
}

const updateEstimates = async (req, res) => {
  try {
    const {id, title, description, duration, services } = req.body;
    let update_obj = {}
    if(title) update_obj.title = title
    if(description) update_obj.description = description
    if(duration) update_obj.duration = duration
    if(services) update_obj.services = services

    const estimate = await Estimate.update(update_obj, { where: { id } }, { returning: true })
    res.status(201).json({ data: estimate });
  } catch (error) {
    logger.error(error);
    res.json({ error: "Unable to create estimate" });
  }
}


const deleteEstimates = async (req, res) => {
  try {
    const {id } = req.body;
    await EC2Resource.destroy({ where: { estimate_id:id } });
    await RDSResource.destroy({ where: { estimate_id:id } });
    await Estimate.destroy({ where: { id } });

    res.status(201).json({ message:"Success" });
  } catch (error) {
    logger.error(error);
    res.json({ error: "Unable to create estimate" });
  }
}


const addResourceToEstimate = async (req, res) => {
  try {
    const { estimate_id, services, ec2_resources,rds_resources } = req.body;
    let resources = []
    if (services.includes("EC2")) {
      await EC2Resource.destroy({ where: { estimate_id } });
      for (const { pricing_id, qty } of ec2_resources) {
        const resource = await EC2Resource.create({ estimate_id, pricing_id, qty });
        resources.push(resource);
      }
    }
    if (services.includes("RDS")) {
      await RDSResource.destroy({ where: { estimate_id } });

      for (const { pricing_id, qty } of rds_resources) {
        const resource = await RDSResource.create({ estimate_id, pricing_id, qty });
        resources.push(resource);
      }
    }
    res.status(201).json({ data: resources });
  } catch (error) {
    logger.error(error);
    res.json({ error: "Unable to add resource to estimate" });
  }

}

const updateResourceToEstimate = async (req, res) => {
  try {
    const { estimate_id, services, ec2_resources,rds_resources } = req.body;
    let resources = []
    if (services.includes("EC2")) {
      await EC2Resource.destroy({ where: { estimate_id } });
      for (const { pricing_id, qty } of ec2_resources) {
        const resource = await EC2Resource.create({ estimate_id, pricing_id, qty });
        resources.push(resource);
      }
    }
    if (services.includes("RDS")) {
      await RDSResource.destroy({ where: { estimate_id } });

      for (const { pricing_id, qty } of rds_resources) {
        const resource = await RDSResource.create({ estimate_id, pricing_id, qty });
        resources.push(resource);
      }
    }
    res.status(201).json({ data: resources });
  } catch (error) {
    logger.error(error);
    res.json({ error: "Unable to add resource to estimate" });
  }

}
export default {
  getRegions,
  getEC2Pricing,
  getEC2Instances,
  getEC2InstancesByType,
  getRDSPricing,
  getRDSInstances,
  getRDSInstancesByType,
  getEstimates,
  postEstimates,
  updateEstimates,
  addResourceToEstimate,
  updateResourceToEstimate,
  deleteEstimates
};
