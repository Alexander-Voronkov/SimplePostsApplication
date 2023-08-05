import db from '../config/MySqlPostsDb.js'
import sequelize from "sequelize"

const UserModel = db.define("users", {
    id: {
        type: sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize.UUIDV4
    },
    name:{
        type: sequelize.STRING,
        allowNull: false
    },
    birthDate:{
        type: sequelize.DATE,
        allowNull : false
    },
    phoneNumber:{
        type: sequelize.STRING,
        allowNull : true,
        unique: true
    },
    email: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    }
})


export default UserModel