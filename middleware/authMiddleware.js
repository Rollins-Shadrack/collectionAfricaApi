const jwt = require('jsonwebtoken')
const asynHandler = require('express-async-handler')
const Users  =  require('../models/Users')

const protect = asynHandler(async(req,res, next) =>{
    let token;
    console.log(`in the auth middleware ${req.user}`)

    token = req.cookies.jwt;
    if(token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await Users.findById(decoded.userId).select('-password')

            next()

        }catch(error){
            res.status(401)
            throw new Error('Not authorized, invalid token')
        }
    }else{
        res.status(401);
        throw new Error('Not authorized, no token')
    }
})

module.exports = {
    protect
}
