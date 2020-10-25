const { Schema, model } = require("mongoose")
const ObjectID = Schema.ObjectID


const blogSchema = new Schema({
    title: { 
        type: String,
        trim: true,
        maxlength: 50
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    comment: [
        {type: ObjectID, ref: "Comment"}
    ],
    author: {
        type: ObjectID,
        required: true,
        ref: "User"
    },
    published: {
        type: Boolean,
        required: true,
        default: false
    },
    iat: {
        type: Date,
        default: Date.now
    }

})


module.exports = model("Blog", blogSchema)