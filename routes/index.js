const router = require("express").Router()
const { blogValidation, results, signupValidation, loginValidation, takenValidation  } = require("../utils/validattion")
const { generalAuth } = require("../utils/authentication")
const { login, signup, userTaken } = require("../controllers/userController")
const { blogsGet, blogsPost, blogsEdit, blogsDelete, blogsGetOne } = require("../controllers/blogController")



router.get("/", generalAuth, (req, res) => {
    res.json({message: "welcome to the blog api"})
})

//user routes
router.post("/signup", signupValidation(), results, signup)
router.post("/login", loginValidation(), results, login)
//check if username or email is taken
router.post("/user/taken", takenValidation(), results, userTaken )


//blog routes
router.get("/blogs", blogsGet)
router.get("/blogs/:id", blogsGetOne)
router.post("/blogs", blogsPost)
router.post("/blogs/:id/edit", blogsEdit)
router.post("/blogs/:id/delete", blogsDelete)



module.exports = router