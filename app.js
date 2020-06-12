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
    port = 4000

// routes imports
const memoriesRoutes = require("./routes/memories"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index")

//clear DB and fill it with example data for debugging
//seed the DB
seedDB()

//add backup environmental variable in case something happens to the set variable here
const url = process.env.DATABASEURL || "mongodb://localhost:27017/memories"
mongoose.connect(url
    , {useNewUrlParser: true, useCreateIndex: true}).then(() => {
        console.log("Connected to DB")
    }
).catch(err => {
        console.log('Error: ', err.message)
    }
)

console.log(process.env.DATABASEURL)
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
app.use(async function (req, res, next) {
        res.locals.currentUser = req.user;
        if (req.user) {
            try {
                let user = await User.findById(req.user._id).populate('notifications', null, {isRead: false}).exec();
                res.locals.notifications = user.notifications.reverse()
            } catch (err) {
                console.log(err.message)
            }
        }
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
const server_port = process.env.YOUR_PORT || process.env.PORT || port;
const server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, function () {
    console.log('Listening on port %d', server_port);
});
