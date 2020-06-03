// setup
const bodyParser = require("body-parser"),
    express = require('express'),
    mongoose = require("mongoose"),
    seedDB = require("./seeds"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    port = 3000

// routes imports
const memoriesRoutes = require("./routes/memories"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index")

//clear DB and fill it with example data for debugging
//seed the DB
seedDB()
mongoose.connect("mongodb+srv://m1gnoc:B-ball1234@cluster0-bmh3h.mongodb.net/test?retryWrites=true&w=majority"
, {useNewUrlParser: true,useCreateIndex: true}).then(() => {
        console.log("Connected to DB")
}
).catch(err => {
        console.log('Error: ', err.message)
}
)
mongoose.connect("mongodb://localhost:27017/memories", {useNewUrlParser: true, useUnifiedTopology: true})
let app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs")
app.use(methodOverride("_method"))
app.use(flash())


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again RIP Mamba",
    resave: false,
    saveUninitialized: false
}))
app.locals.moment = require('moment');
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//middleware to add currentUser variable globally
app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
        next()
    }
)

// route initializer
app.use("/", indexRoutes)
app.use("/memories", memoriesRoutes)
app.use("/memories/:id/comments", commentRoutes)

//start server
var server_port = process.env.YOUR_PORT || process.env.PORT || port;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
server.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});
