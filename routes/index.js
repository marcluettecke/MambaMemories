const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user")

// root route
router.get("/", (req, res) => {
        res.render("landing")
    }
)

//register account route
router.get("/register", (req, res) => {
    res.render("register")
})

//post route to register
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message)
            return res.render("register")
        }
        passport.authenticate("local")(req, res, () => {
         req.flash("success", "Welcome to MambaMemories " + user.username)
            res.redirect("/memories")
        })
    })
})


//log in route
router.get("/login", (req, res) => {
    res.render("login")
})

//handle login logic (via middleware)
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/memories",
        failureRedirect: "/login"
    }))

//logout route
router.get("/logout", (req, res) => {
    req.logout()
    req.flash("success", "Logged you out!")
    res.redirect("/memories")
})

module.exports = router

