require("dotenv").config()
const User = require("../models/user")
const bcrypt = require("bcrypt")

const saltRound = parseInt(process.env.SALT)

//user sign up
exports.signup = async (req, res, next) => {
    try {
        const exist = await User.find({$or: [{email:req.body.email}, {username: req.body.username}]})

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
exports.login = () => {}


//remove password
function sanitize(obj) {
    const newObj = Object.assign({}, obj._doc);
    delete newObj.password
    return newObj
}