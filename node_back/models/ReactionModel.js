import db from '../config/MySqlPostsDb.js'
import sequelize from "sequelize"

const ReactionModel = db.define("reactions", {
    id: {
        type: sequelize.UUID,
        defaultValue: sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    type:{
        type: sequelize.STRING,
        allowNull: false
    }
})

export default ReactionModel