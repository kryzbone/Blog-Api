const {body, validationResult} = require("express-validator")

exports.blogValidation = () => {
    return [
        body("title").isString().optional({checkFalsy: true}).trim().blacklist("<>"),
        body("message", "please Enter a message").notEmpty().bail().isString().trim().blacklist("<>")
    ]
}


exports.signupValidation = () => {
    return [
        body("fullname", "Enter fullname").notEmpty().bail().isString().trim().blacklist("<>"),
        body("username", "Enter Username").notEmpty().bail().isString().trim().blacklist("<>"),
        body("email", "Provide email").notEmpty().bail().isEmail().trim().blacklist("<>"),
        body("password", "Enter Password").notEmpty().bail().blacklist("<>"),
        body("comfirm_password", "Password does not much").notEmpty().custom((value, {req}) => value === req.body.password ).blacklist("<>")
    ]
}

exports.loginValidation = () => {
    return [
        body("username", "Enter Username/Email").notEmpty().bail().isString().trim().blacklist("<>"),
        body("password", "Enter Password").notEmpty().bail().trim().blacklist("<>")
    ]
}



exports.results = (req, res, next) => {
    //check for errors
    const errors = validationResult(req);
    //no errors
    if(errors.isEmpty()) return next()
    //on errors
    res.status(400).json({ error: errors.array() })
}