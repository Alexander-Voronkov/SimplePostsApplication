import jwtUtils from '../services/TokenVerificationService.js'
const jwt_secret = process.env.JWT_SECRET
import bcrypt from 'bcrypt'
import redisJwt from '../config/RedisCacheJwt.js'
import {uploadImageToMINIO, downloadImageFromMINIO} from '../config/MinioConfig.js'
import {UserModel} from '../models/Relations.js'
import {PostModel} from '../models/Relations.js'
import {ReactionModel} from '../models/Relations.js'

async function register(request, response)
{
    try
    {
        let bodyUser = {...request.body}

        if(bodyUser.password.length < 8)
            return response.status(419).send('Too short password')

        bodyUser.password = await bcrypt.hash(bodyUser.password, 10)
        
        let file = request.file

        UserModel
        .create(bodyUser)
        .then(async (data) =>{
            const token =  jwtUtils.generateToken({
                id: data.dataValues.id,
                email: data.dataValues.email,
                name: data.dataValues.name
            }, jwt_secret)

            await redisJwt.set(data.dataValues.id, token)

            if(file)
                await uploadImageToMINIO('minio-avatars', data.dataValues.email, file.buffer, 
                {
                    'Content-Type' : file.mimetype
                })
        
            return response.status(201).json({
                token: token
            })
        })
        .catch(err => {
            console.log(err)
            return response.status(419).json({
                err
            })
        })
    }
    catch(err)
    {
        console.log(err)
        return response.status(419).json({
                err
            })
    }
}

async function login(req, res)
{
    try
    {
        let userData = req.body

        const user = await UserModel.findOne({where:{
            email: userData.email
        }})

        if(user)
        {
            const compareResult = await bcrypt.compare(userData.password, user.password)

            if(!compareResult)
            {
                return res.status(403).json({
                    err: 'Wrong password'
                })
            }
            else
            {
                const cachedJwt = await redisJwt.get(user.id)

                if(cachedJwt)
                {
                    return res.status(201).json({
                        token: cachedJwt
                    })
                }
                else
                {
                    const token = jwtUtils.generateToken({
                        id: user.id,
                        email: user.email,
                        name: user.name
                    }, jwt_secret)
    
                    await redisJwt.set(user.id, token, 3600)
    
                    return res.status(201).json({
                        token
                    })
                }
            }            
        }    
        else
        {
            return res.status(403).json({err:'Un'})
        }     
    }
    catch(err)
    {
        console.log(err)
        return res.status(419).json({
            err
        })
    }
}

async function getProfileInfo(req, res)
{
    try{
        const userid = req.user.id
        const user = await UserModel.findByPk(userid)
        if(user)
        {
            const {id, password, ...datatosend} = user.dataValues
            const avatar = await downloadImageFromMINIO('minio-avatars', datatosend.email)
            console.log(avatar)
            if(avatar)
                datatosend.avatar = avatar
            return res.status(201).json({
                datatosend
            })
        }
    }
    catch(err){
        console.log(err)
        return res.status(419).json({err})
    }
}

async function addPost(req, res)
{
    try
    {
        console.log(req.body)
        let post = {}
        post.postText = req.body.converted
        const userid = req.user.id
        post.userId = userid
        PostModel.create(post)
        .then((data)=>{
            const {id, ...otherData} = data.dataValues
            return res.status(201).json({
                id
            })
        })
        .catch((err)=>{
            console.log(err)
            return res.status(419).json({err})
        })
    }
    catch(err){
        console.log(err)
        return res.status(419).json({err})
    }
}

async function getPosts(req, res)
{
    try
    {
        const id = req.query.id
        const userId = req.query.userid

        let posts
        if(id && userId)
        {
            posts = await PostModel.findAll({include:{
                model: UserModel,
                as:'user'
            },
            where: {
                id,
                userId
            }})
        }
        else if(id && !userId)
        {
            posts = await PostModel.findAll({include:{
                model: UserModel,
                as:'user'
            },
            where: {
                id
            }})
        }
        else if(userId && !id)
        {
            posts = await PostModel.findAll({include:{
                model: UserModel,
                as:'user'
            }, 
            limit: 10,
            where: {
                userId
            }})
        }
        else if(!id && !userId)
        {
            posts = await PostModel.findAll({include:{
                model: UserModel,
                as:'user'
            }, 
            limit: 10,})
        }
    
        return res.status(201).json([...posts])
    }
    catch(err)
    {
        console.log(err)
        return res.status(419).json({err})
    }
}

export default {
    login,
    register,
    getProfileInfo,
    addPost,
    getPosts
}