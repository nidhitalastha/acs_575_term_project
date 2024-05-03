import {Sequelize, DataTypes as DTypes} from 'sequelize'
import * as dotEnv from 'dotenv'
import logger from '../utils/logger.js';

dotEnv.config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        port: Number(process.env.DB_PORT),
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        pool: {
            max: 10,
            min: 0,
            idle: 10000
        },
        logging: function (str) {
          // console.info(str);

            if ((process.env.SEQ_LOGGING === 'true')) {
                console.info(str);
            }
        },
    }
);

sequelize.sync().then(function () {
    logger.info('DB connection success.');
}, function (err) {
    logger.error(JSON.stringify(err));
});

export const Datatypes = DTypes;

export default sequelize
