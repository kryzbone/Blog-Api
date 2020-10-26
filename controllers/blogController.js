const Blog = require("../models/blog")


//get all blogs
exports.blogsGet = async (req, res, next) => {
    try {
        //get blogs from db
        const blogs = await Blog.find()

        res.status(200).json({ data: blogs })

    }catch(err) {
        next(err)
    }
}

//get on blog
exports.blogsGetOne = async (req, res, next) => {
    try {
        //get id & get blog from db
        const id = req.params.id
        const blog = await Blog.findById(id)

        //if no blog
        if(!blog) {
            const err = new Error("Blog Not Found")
            err.status = 404
            return next(err)
        }

        //on success
        res.status(200).json({ data: blog })

    }catch(err) {
        next(err)
    }
}

//create blog
exports.blogsPost = async (req, res, next) => { 
    try{
        //check if user is author

        const newBlog = Blog({
            title: req.body.title || "Title",
            message: req.body.message,
        })

        //save blog
        const doc = await newBlog.save()
        res.status(201).json({
            message: "Blog created",
            data: doc
        })

    }catch(err) {
        next(err)
    }
}

//edit blog
exports.blogsEdit = async (req, res, next) => {
    try {
        const id = req.params.id
        //get blog from db
        const blog = await Blog.findById(id)
        //no blog
        if(!blog) {
            const err = new Error("Blog not found")
            err.status = 404
            return next(err)
        }
        //update blog
        blog.title = req.body.title || "Title"
        blog
        const newBlog = await blog.save()
        //on success
        res.status(200).json({ 
            message: "Blog Updated",
            data: newBlog
         })

    }catch(err) {
        next(err)
    }
}

//delete blog
exports.blogsDelete = async (req, res, next) => {
    try {
        const id = req.params.id
        //delete blog
        await Blog.findByIdAndDelete(id)
        //delete comments
        await Comment.deleteMany({blog: id })
        //on success
        res.status(200).json({ message: " blog deleted"})

    }catch(err) {
        next(err)
    }
}
