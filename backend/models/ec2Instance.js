import sequelize, { Datatypes } from "./index.js";

const EC2Instance = sequelize.define(
  "EC2Instance",
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
    cpu_info: {
      type: Datatypes.JSON,
    },
    memory: {
      type: Datatypes.INTEGER,
    },
    memory_per_vcpu: {
      type: Datatypes.INTEGER,
    },
    networking: {
      type: Datatypes.JSON,
    },
    storage: {
      type: Datatypes.JSON,
    },
  },
  {
    timestamps: false,
    tableName: "ec2_instance_types",
  }
);

export default EC2Instance;
