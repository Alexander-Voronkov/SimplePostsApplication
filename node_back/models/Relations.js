import PostModel from './PostModel.js'
import ReactionModel from './ReactionModel.js'
import UserModel from './UserModel.js'

PostModel.belongsTo(UserModel, {as:'user'})
PostModel.hasMany(ReactionModel)

ReactionModel.belongsTo(PostModel)

UserModel.hasMany(PostModel)
UserModel.hasMany(ReactionModel)

export {PostModel}
export {ReactionModel}
export {UserModel}