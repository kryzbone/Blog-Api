require("dotenv").config()
const User = require("../models/user")
const bcrypt = require("bcrypt")
const { generateToken } = require("../utils/authentication")

const saltRound = parseInt(process.env.SALT)

//user sign up
exports.signup = async (req, res, next) => {
    try {
        const exist = await User.find({$or: [{email:req.body.email}, {username: req.body.username}]})
        console.log(exist)
        //if user exist
        if(exist.length > 1 ) {
            return res.status(400).json({ 
                error: {
                    meassge: "Username and Email already exist"
                }
             })
        } else if(exist.length > 0) {
            if(exist[0].email === req.body.email) {
                return res.status(400).json({
                    error: {
                        message: "Email already Exist"
                    }
                })
            }else {
                return res.status(400).json({
                    error: {
                        message: "Username already Exist"
                    }
                })
            }
        }

        //hash password
        const hashed = await bcrypt.hash(req.body.password, saltRound)

        //create user
        const newUser = User({
            fullname: req.body.fullname,
            username: req.body.username,
            email: req.body.email,
            password: hashed,
        })

        //save to db
        const doc = await newUser.save()
        res.status(201).json({
            message: "User Created",
            data: sanitize(doc)
        })
        
    }catch(err) {
        next(err)
    }
}

//user login
exports.login = async (req, res, next) => {
    try {
        //het user from db
        const user = await User.findOne({$or: [{email: req.body.username}, {username: req.body.username}]})

        //if no user
        if(!user) {
            return res.status(400).json({
                error: {
                    message: "Wrong Email/Username or Password"
                }
            })
        }

        //check password for match
        const match = await bcrypt.compare(req.body.password, user.password)
        if(!match) {
            return res.status(400).json({
                error: {
                    message: "Wrong Email/Username or Password"
                }
            })
        }
        
        //generate token
        const token = generateToken({id: user._id})
        res.status(200).json({
            message: "Login Success",
            token
        })

    }catch(err) {
        next(err)
    }
}

//check if username or email is taken 
exports.userTaken = async (req, res, next) => {
    try {
        const exist = await User.findOne({$or: [{email: req.body.username}, {username: req.body.username}]})
        if(exist) {
            return res.status(200).json({
                taken: true
            })
        }else {
            return res.status(200).json({
                taken: false
            })
        }

    }catch(err) {
        next(err)
    }
}



//remove password
function sanitize(obj) {
    const newObj = Object.assign({}, obj._doc);
    delete newObj.password
    return newObj
}


exports.sanitize = sanitize 