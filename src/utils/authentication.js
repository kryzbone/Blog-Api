require("dotenv").config()
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const secret = process.env.SECRET


//general authentication
exports.generalAuth = async (req, res, next) => {
    try {
        const { sanitize } = require("../controllers/userController")

        if(!req.headers.authorization) return next()

        //extract token from req body 
        const token = req.headers.authorization.split(" ")[1]

        //decode token
        if(token) {
            const userId = jwt.verify(token, secret)

            if(userId) {
                const user = await User.findById(userId.id)
                req.isAuthenticated = true
                req.user = sanitize(user)
            }else {
                req.isAuthenticated = false 
            }

            next()
        }  
    }catch(err) {
        next(err)
    } 
}

exports.setAuthor = (req, res, next) => {
    req.author = true
    next()
}

//generate token
exports.generateToken = (obj) => {
    return jwt.sign(obj, secret, {expiresIn: "1d"})
}

