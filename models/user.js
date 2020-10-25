const { Schema, model } = require("mongoose");



const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 25
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    author: {
        type: Boolean,
        required: true,
    }

})



module.exports = model(User, userSchema)


