import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config()
const sequelize = new Sequelize(
    `${process.env.DB}`,
    `${process.env.DBUSER}`,
    `${process.env.PASSWORD}`, {
        host: `${process.env.HOST}`,
        dialect: 'mariadb',
        logging: false
    }
) 

export default sequelize;