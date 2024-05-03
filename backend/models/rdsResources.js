import Estimate from "./estimation.js";
import sequelize, { Datatypes } from "./index.js";
import RDSPricing from "./rdsPricing.js";

const RDSResource = sequelize.define(
  "RDSResource",
  {
      estimate_id: {type: Datatypes.UUID, primaryKey: true, allowNull: false},
      pricing_id: {type: Datatypes.UUID, notNull: true},
      qty: {type: Datatypes.INTEGER, notNull: true},
  },
  {
    timestamps: true,
    tableName: "rds_resources",
  }
);

RDSResource.belongsTo(
  Estimate,
  {
    foreignKey: "estimate_id",
    targetKey: "id",
  }
)

RDSResource.belongsTo(RDSPricing, {
  foreignKey: "pricing_id",
  targetKey: "id",
})

Estimate.hasMany(RDSResource, {
  foreignKey: "estimate_id",
  sourceKey: "id",
})
// RDSResource.sync({force: true})
export default RDSResource;
