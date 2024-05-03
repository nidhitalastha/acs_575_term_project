import sequelize, { Datatypes } from "./index.js";

const RDSInstance = sequelize.define(
  "RDSInstance",
  {
    instance_type: {
      type: Datatypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    generation: {
      type: Datatypes.STRING,
    },
    family: {
      type: Datatypes.STRING,
    },
    vcpu: {
      type: Datatypes.INTEGER,
    },
    memory: {
      type: Datatypes.INTEGER,
    },
    physical_processor: {
      type: Datatypes.STRING,
    },
    processor_architecture: {
      type: Datatypes.JSON,
    }
  },
  {
    timestamps: false,
    tableName: "rds_instance_types",
  }
);

export default RDSInstance;
