const Comment = require("../models/comment");
const Blog = require("../models/blog")
const { create403Error, create400Error } = require("../utils/errors");





//get one comment 
exports.commentGetOne = async (req, res, next) => {
    try {
        const id = req.params.id

        //get comment from db
        const comment = await Comment.findById(id)

        if(!comment) {
            const err = new Error("Comment Not Available");
            err.status = 404;
            next(err)
        }

        //on success
        res.status(200).json({
            data: comment
        })

    }catch(err) {
        next(err)
    }
}


//create comment
exports.commentPost = async (req, res, next) => {
    try {
        if(req.isAuthenticated) {
            //prevent duplicate
            const isDuplicate = await Comment.findOne({author: req.user._id, message: req.body.message})
            if(isDuplicate) return create400Error(res, "Comment is already created")
            //create comment
            const newComment = Comment({
                author: req.user._id,
                message: req.body.message,
                blog: req.body.blog
            })

            //save comment
            const doc = await newComment.save()

            //Link comment to blog
            const blog = await Blog.findById(req.body.blog)
            blog.comments.push(doc._id)
            await blog.save()

            //on success
            res.status(200).json({
                data: doc
            })

        }else {
            create403Error(res)
        }
    
    }catch(err) {
        next(err)
    }
}


//edit comment
exports.commentEdit = async (req, res, next) => {
    try {
        const id = req.params.id
        if(req.isAuthenticated) {
            //get comment from db
            const comment = await Comment.findById(id)
            //check if user created the comment
            if(comment.author.toString() !== req.user._id.toString()) return create403Error(res)

            //edit comment and save
            comment.message = req.body.message
            const doc = await comment.save()

            //on success
            res.status(200).json({
                message: "Comment Updated",
                data: doc
            })

        }else {
            create403Error(res)
        }

    }catch(err) {
        next(err)
    }
}


exports.commentDelete = async (req, res, next) => {
    try {
        if(req.isAuthenticated) {
            const id = req.params.id
            const doc = await Comment.findOneAndDelete({_id: id, author: req.user._id})
            if(!doc) return res.status(200).json({ message: "Comment Not Found"})

            //delete comment from Blog
            await Blog.updateOne({_id: doc.blog}, {$pull: {comments: id}})

            //on success
            res.status(200).json({ message: "Comment Deleted" })

        }else {
            create403Error(res)
        }
    }catch(err) {
        next(err)
    }
}