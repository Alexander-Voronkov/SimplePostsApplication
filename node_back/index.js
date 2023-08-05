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

app.listen(3000)
