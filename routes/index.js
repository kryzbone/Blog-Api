const router = require("express").Router()
const { blogValidation, results, signupValidation  } = require("../utils/validattion")
const { login, signup } = require("../controllers/userController")
const { blogsGet, blogsPost, blogsEdit, blogsDelete, blogsGetOne } = require("../controllers/blogController")





router.get("/", (req, res) => {
    res.json({message: "welcome to the blog api"})
})

//user routes
router.post("/signup", signupValidation(), results, signup)
router.post("/login", login)


//blog routes
router.get("/blogs", blogsGet)
router.get("/blogs/:id", blogsGetOne)
router.post("/blogs", blogsPost)
router.post("/blogs/:id/edit", blogsEdit)
router.post("/blogs/:id/delete", blogsDelete)



module.exports = router