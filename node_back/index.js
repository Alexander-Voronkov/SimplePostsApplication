import express from 'express'
const app = express()

import sequelize from './config/MySqlPostsDb.js'

await sequelize.sync()

app.use(express.json({limit: '200mb'}))
app.use(express.urlencoded({ extended: false, limit: '200mb' }))

import accountController from './controllers/AccountController.js'
import jwtMiddleware from './middlewares/VerifyJwtMiddleware.js'

import multer from 'multer'

app.post('/login', accountController.login)
app.post('/register', multer({ storage: multer.memoryStorage() }).single('avatar'), accountController.register)
app.get('/posts', jwtMiddleware, accountController.getPosts)
app.get('/profile', jwtMiddleware, accountController.getProfileInfo)
app.post('/addpost', jwtMiddleware, accountController.addPost)


import {createAdapter} from '@socket.io/redis-adapter'
import {Server} from 'socket.io'
import http from 'http'

const server = http.createServer(app)

const socket = new Server(server, {
    cors:{
        origin: '*'
    }
})

import {UserModel} from './models/Relations.js'
import {PostModel} from './models/Relations.js'
import {ReactionModel} from './models/Relations.js'
import jwtUtils from './services/TokenVerificationService.js'

socket.on('connection', (innersocket) => {
    console.log('a user connected');
    innersocket.on('reaction', async (data)=>
    {
        try
        {
            const reactionData = JSON.parse(data)
            const user = jwtUtils.verifyToken(reactionData.token, process.env.JWT_SECRET)

            const existingReaction = await ReactionModel.findAll({
                where:{
                    type: reactionData.type,
                    userId: user.id,
                    postId: reactionData.postId
                }
            })

            if(existingReaction.length!==0)
                return

            await ReactionModel.destroy({
                where: {
                    type: (reactionData.type === 'dislike')? 'like':'dislike',
                    userId: user.id,
                    postId: reactionData.postId
                }
            })

            await ReactionModel.create({
                type: reactionData.type,
                postId: reactionData.postId,
                userId: user.id
            })

            const reactions = await ReactionModel.findAll({
                where:{
                    postId: reactionData.postId
                }
            })

            socket.emit('reactionUpdate', JSON.stringify({
                postId:reactionData.postId, 
                reactions
            }))
        }
        catch(err)
        {
            console.log(err)
        }
    })
  })



server.listen(3000)