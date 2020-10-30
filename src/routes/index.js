const router = require("express").Router()
const { blogValidation, commentValidation, signupValidation, loginValidation, takenValidation, results  } = require("../utils/validattion")
const { generalAuth, setAuthor } = require("../utils/authentication")
const { login, signup, userTaken } = require("../controllers/userController")
const { blogsGet, blogsPost, blogsEdit, blogsDelete, blogsGetOne } = require("../controllers/blogController")
const { commentGetOne, commentPost, commentEdit, commentDelete } = require("../controllers/commentController")


router.get("/", generalAuth, (req, res) => {
    res.json({ message: "welcome to the blog api" })
})

//user routes
router.post("/signup", signupValidation(), results, signup)
router.post("/login", loginValidation(), results, login)
router.post("/author/signup", signupValidation(), results, setAuthor, signup)
router.post("/author/login", loginValidation(), results, setAuthor, login)
//username or email is taken route
router.post("/user/taken", takenValidation(), results, userTaken )


//blog routes
router.get("/blogs", blogsGet)
router.get("/author/blogs", setAuthor, blogsGet)
router.get("/blogs/:id", blogsGetOne)
router.get("/author/blogs/:id", setAuthor, blogsGetOne)
router.post("/blogs",blogValidation(), results, blogsPost)
router.post("/blogs/:id/edit", blogValidation(), results, blogsEdit)
router.post("/blogs/:id/delete", blogsDelete)


//comment routes
router.get("/comments/:id", commentGetOne)
router.post("/comments", commentValidation(), results, commentPost )
router.post("/comments/:id/edit", commentValidation(), results, commentEdit)
router.post("/comments/:id/delete", commentDelete)



module.exports = router