import sequelize, {Datatypes} from "./index.js";


const Region = sequelize.define("Region", {
  code: {
    type: Datatypes.STRING,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Datatypes.STRING,
  },
},{
  timestamps: false,
  tableName: "regions",
});

export default Region
