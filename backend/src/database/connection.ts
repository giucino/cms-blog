
import { Sequelize } from "sequelize-typescript";


export const connection = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'blog',
    port: 3307,
    models: [__dirname + '/../models']
});