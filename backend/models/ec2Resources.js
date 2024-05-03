import EC2Instance from "./ec2Instance.js";
import EC2Pricing from "./ec2Pricing.js";
import Estimate from "./estimation.js";
import sequelize, { Datatypes } from "./index.js";

const EC2Resource = sequelize.define(
  "EC2Resource",
  {
      estimate_id: {type: Datatypes.UUID, primaryKey: true, allowNull: false},
      pricing_id: {type: Datatypes.UUID, primaryKey: true, allowNull: false},
      qty: {type: Datatypes.INTEGER, notNull: true},
  },
  {
    timestamps: true,
    tableName: "ec2_resources",
  }
);

EC2Resource.belongsTo(
  Estimate,
  {
    foreignKey: "estimate_id",
    targetKey: "id",
  }
)

EC2Resource.belongsTo(EC2Pricing, {
  foreignKey: "pricing_id",
  targetKey: "id",
})

Estimate.hasMany(EC2Resource, {
  foreignKey: "estimate_id",
  sourceKey: "id",
})
export default EC2Resource;
