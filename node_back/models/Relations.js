import PostModel from './PostModel.js'
import ReactionModel from './ReactionModel.js'
import UserModel from './UserModel.js'

UserModel.hasMany(PostModel)
PostModel.hasMany(ReactionModel)
UserModel.hasMany(ReactionModel)

PostModel.belongsTo(UserModel, {foreignKey:'userId'})
ReactionModel.belongsTo(PostModel, {foreignKey:'postId'})
ReactionModel.belongsTo(UserModel, {foreignKey:'userId'})


export {PostModel}
export {ReactionModel}
export {UserModel}