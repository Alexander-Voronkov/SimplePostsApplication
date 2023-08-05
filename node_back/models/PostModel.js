import db from '../config/MySqlPostsDb.js'
import sequelize from 'sequelize'

const PostModel = db.define("posts", {
    id: {
        type: sequelize.DataTypes.UUID,
        defaultValue: sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    postText:{
        type: sequelize.TEXT('long'),
        allowNull: false
    }
})

export default PostModel