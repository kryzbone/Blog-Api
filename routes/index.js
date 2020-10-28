const router = require("express").Router()
const { blogValidation, results, signupValidation, loginValidation, takenValidation  } = require("../utils/validattion")
const { generalAuth, setAuthor } = require("../utils/authentication")
const { login, signup, userTaken } = require("../controllers/userController")
const { blogsGet, blogsPost, blogsEdit, blogsDelete, blogsGetOne } = require("../controllers/blogController")


router.get("/", generalAuth, (req, res) => {
    res.json({message: "welcome to the blog api"})
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
router.get("/blogs/:id", blogsGetOne)
router.post("/blogs",blogValidation(), results, blogsPost)
router.post("/blogs/:id/edit", blogValidation(), results, blogsEdit)
router.post("/blogs/:id/delete", blogsDelete)



module.exports = router