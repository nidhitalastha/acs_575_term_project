import sequelize, { Datatypes } from "./index.js";
import Region from "./region.js";
import EC2Instance from "./ec2Instance.js";

const EC2Pricing = sequelize.define(
  "EC2Pricing",
  {
      id: {type: Datatypes.UUID, primaryKey: true, allowNull: false},
      instance_type: {type: Datatypes.STRING, allowNull: false},
      operation: {type: Datatypes.STRING},
      region: {type: Datatypes.STRING},
      operating_system: {type: Datatypes.STRING},
      description: {type: Datatypes.STRING},
      unit: {type: Datatypes.STRING},
      price: {type: Datatypes.DOUBLE},
  },
  {
    timestamps: false,
    tableName: "ec2_pricing",
  }
);

EC2Pricing.belongsTo(
  Region,
  {
    foreignKey: "region",
    targetKey: "code",
  }
)
EC2Pricing.belongsTo(
  EC2Instance,
  {
    foreignKey: "instance_type",
    targetKey: "instance_type",
  })


  EC2Instance.hasMany(EC2Pricing, {
    foreignKey: "instance_type",
    sourceKey: "instance_type",
  });
export default EC2Pricing;
