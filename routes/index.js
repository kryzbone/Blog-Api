const router = require("express").Router()

router.get("/", (req, res, next) => {
    res.json({message: "welcome to the blog api"})
})



module.exports = router