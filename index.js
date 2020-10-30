require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").createServer(app)
const mongoose = require("mongoose");

const port = process.env.PORT || 5000
const blogRoute = require("./src/routes/index")
const { generalAuth } = require("./src/utils/authentication")

//mongo db setup
mongoose.connect(process.env.MONGO_URI, 
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
    () => console.log("DB Connected")
)



//cors function
app.use((req, res, next) => {
    res.header("access-control-allow-origin", "*");
    res.header("access-control-allow-headers", "Origin, X-Requested-With, Content-Type, cache-control, Accept");
    res.header("access-control-allow-method", "GET, POST, PUT, DELETE")

    if(req.method === "OPTIONS") {
        return res.sendStatus(200)
    }
    next()
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(generalAuth)


app.use("/api", blogRoute)

//404 handler
app.use((req, res, next) => {
    const err = new Error("Page Not Found")
    err.status = 404;
    next(err)
})

//error handling
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    })
})



server.listen(port, () => console.log("server is live..."))