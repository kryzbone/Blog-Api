//403 status code errors
function create403Error(res) {
    res.status(403).json({
        error: {
            message: "Access Denied You don't have permission to perform this action"
        }
    })
}

//400 status code errors
function create400Error(res, msg) {
    res.status(400).json({
        error: {
            message: msg
        }
    })
}


//exports
module.exports = {
    create400Error,
    create403Error
}