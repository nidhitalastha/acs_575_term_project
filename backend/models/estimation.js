import sequelize, { Datatypes } from "./index.js";
import Region from "./region.js";

const Estimate = sequelize.define(
  "Estimate",
  {
      id: {type: Datatypes.UUID, primaryKey: true, allowNull: false},
      title: {type: Datatypes.STRING, notNull: true},
      description: {type: Datatypes.STRING, notNull: true},
      duration: {type: Datatypes.INTEGER, notNull: true},
      services: {type: Datatypes.ARRAY(Datatypes.STRING), notNull: true},
  },
  {
    timestamps: true,
    tableName: "estimates",
  }
);
export default Estimate;
