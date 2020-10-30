const { Schema, model } = require("mongoose");
const ObjectID = Schema.Types.ObjectID;

const commentSchema = new Schema({
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 225
    },
    author: {
        type: ObjectID,
        ref: "User",
        required: true,
    },
    blog: {
        type: ObjectID,
        ref: "Blog",
        required: true
    },
    iat: {
        type: Date,
        default: Date.now
    }
})

module.exports = model("Comment", commentSchema)