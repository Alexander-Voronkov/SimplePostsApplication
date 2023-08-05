import {Sequelize} from "sequelize"
// import dotenv from 'dotenv'
// dotenv.config({path: '../.env'})

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
    dialect: "mysql",
    host: process.env.MYSQL_HOST || "db.mysql.posts"
})

export default sequelize