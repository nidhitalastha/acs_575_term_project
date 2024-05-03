import sequelize, { Datatypes } from "./index.js";
import Region from "./region.js";
import RDSInstance from "./rdsInstance.js";

const RDSPricing = sequelize.define(
  "RDSPricing",
  {
    id: { type: Datatypes.UUID, primaryKey: true, allowNull: false },
    instance_type: {
      type: Datatypes.STRING,
      allowNull: false,
    },
    operation: { type: Datatypes.STRING },
    region: { type: Datatypes.STRING },
    deployment_option: { type: Datatypes.STRING },
    engine_code: { type: Datatypes.STRING },
    database_engine: { type: Datatypes.STRING },
    description: { type: Datatypes.STRING },
    unit: { type: Datatypes.STRING },
    price: { type: Datatypes.DOUBLE },
  },
  {
    timestamps: false,
    tableName: "rds_pricing",
  }
);

RDSPricing.belongsTo(Region, {
  foreignKey: "region",
  targetKey: "code",
});
RDSPricing.belongsTo(RDSInstance, {
  foreignKey: "instance_type",
  targetKey: "instance_type",
});

RDSInstance.hasMany(RDSPricing, {
  foreignKey: "instance_type",
  sourceKey: "instance_type",
});
export default RDSPricing;
