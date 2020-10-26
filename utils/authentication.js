require("dotenv").config()
const jwt = require("jsonwebtoken")
const secret = process.env.SECRET




//general authentication
exports.generalAuth = (req, res, next) => {
    //extract token from req body
    const token = req.authorization.split(" ")[1]

}


//author authentication
exports.generalAuth = (req, res, next) => {

}


exports.generateToken = (obj) => {
    return jwt.sign(obj, secret, {expiresIn: "3d"})
}



