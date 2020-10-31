const Blog = require("../models/blog")
const Comment = require("../models/comment")
const { create403Error } = require("../utils/errors")


//get all blogs
exports.blogsGet = async (req, res, next) => {
    try {
        //on author's page display only author's blog
        if(req.author) {
            if(req.isAuthenticated && req.user.author) {
                //get blogs from db
                const blogs = await Blog.find({ author: req.user._id })
                res.status(200).json({ data: blogs })
            }else {
                create403Error(res)
            }

        }else {
            //get blogs from db
            const blogs = await Blog.find({ published: true })
            res.status(200).json({ data: blogs })
        }

    }catch(err) {
        next(err)
    }
}


//get on blog 
exports.blogsGetOne = async (req, res, next) => {
    try {
        //get id from params
        const id = req.params.id

        //on authors page display only author's blog
        if(req.author) {
            if(req.isAuthenticated && req.user.author) {
                //get blog from db
                const blog = await Blog.findOne({ _id: id, author: req.user._id })
    
                //if no blog
                if(!blog) {
                    const err = new Error("Blog Not Found")
                    err.status = 404
                    return next(err)
                }
    
                //on success
                res.status(200).json({ data: blog })
            }else {
                create403Error(res)
            }
        
        }else {
            //get id & get blog from db
            const blog = await Blog.findOne({ _id: id, published: true })

            //if no blog
            if(!blog) {
                const err = new Error("Blog Not Found")
                err.status = 404
                return next(err)
            }

            //on success
            res.status(200).json({ data: blog })
        }
        
    }catch(err) {
        next(err)
    }
}

//create blog
exports.blogsPost = async (req, res, next) => { 
    try{
        //check if user is authenticated and is author
        if(req.isAuthenticated && req.user.author) {
            //prevent duplicate blog creaion
            const isDuplicate = await Blog.findOne({ message: req.body.message, author: req.user._id })
            if(isDuplicate) return res.status(400).json({
                error: {
                    message: "Blog Already created"
                }
            })

            //create new blog
            const newBlog = Blog({
                title: req.body.title || "Title",
                message: req.body.message,
                author: req.user._id
            })
    
            //save blog
            const doc = await newBlog.save()
            res.status(201).json({
                message: "Blog created",
                data: doc
            })    
            
        }else {
            return res.status(403).json({
                error: {
                    message: "Access Denied You don't have permission to perform this action"
                }
            })
        }
        
    }catch(err) {
        next(err)
    }
}

//edit blog
exports.blogsEdit = async (req, res, next) => {
    try {
        //check if user is authenticated and is author
        if(req.isAuthenticated && req.user.author) {
            const id = req.params.id
            //get blog from db
            const blog = await Blog.findById(id)

            //check if author is authorised to edit blog
            if(blog.author !== req.user._id) return create403Error(res)

            //no blog
            if(!blog) {
                const err = new Error("Blog not found")
                err.status = 404
                return next(err)
            }

            //update and save blog
            blog.title = req.body.title || "Title"
            blog.message = req.body.message
            const newBlog = await blog.save()

            //on success
            res.status(200).json({ 
                message: "Blog Updated",
                data: newBlog
            })
        }else {
            return res.status(403).json({
                error: {
                    message: "Access Denied You don't have permission to perform this action"
                }
            })
        }
        
    }catch(err) {
        next(err)
    }
}

//delete blog
exports.blogsDelete = async (req, res, next) => {
    try {
        //check if user is authenticated and is author
        if(req.isAuthenticated && req.user.author) {
            const id = req.params.id

            //delete blog
            await Blog.findByIdAndDelete(id)

            //delete comments
            await Comment.deleteMany({ blog: id })

            //on success
            res.status(200).json({ message: " blog deleted"})

        }else {
            return res.status(403).json({
                error: {
                    message: "Access Denied You don't have permission to perform this action"
                }
            })
        }
        
    }catch(err) {
        next(err)
    }
}


//Publish blog
exports.blogsPublish = async (req, res, next) => {
    try {
        if(req.isAuthenticated && req.user.author) {
            const id = req.params.id
            const blog = await Blog.findById(id)

            //Unpublish blog
            if(blog.published) {
                blog.published = false
                await blog.save()

                return res.status(200).json({ message: "Unpublished Blog"})
            } 

            //check if author created this blog
            const match = blog.author.toString() === req.user._id.toString()
            if(match) {
                blog.published = true
                await blog.save()

                //on success
                res.status(200).json({ message: "Blog Published successfully" })
            }else {
                create403Error(res)
            }
        }else {
            create403Error(res)
        }

    }catch(err) {
        next(err)
    }
}