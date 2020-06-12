const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    middleware = require("../middleware"),
    Notification = require("../models/notification")

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



//user profile route
router.get('/users/:id', async function (req, res) {
    try {
        let user = await User.findById(req.params.id).populate('followers').exec();
        res.render('profile', {user});
    } catch (err) {
        req.flash('error', err.message)
        return res.redirect('back')
    }
})

// follow user
router.get('/follow/:id', middleware.isLoggedIn, async function (req, res) {
    try {
        let user = await User.findById(req.params.id)
        user.followers.push(req.user._id)
        user.save()
        req.flash('success', 'Successfully followed ' + user.username + '!')
        res.redirect('/users/' + req.params.id)
    } catch (err) {
        req.flash('error', err.message)
        res.redirect('back')
    }
})

// view all notifications
router.get('/notifications', middleware.isLoggedIn, async function(req, res) {
  try {
    let user = await User.findById(req.user._id).populate({
      path: 'notifications',
      options: { sort: { "_id": -1 } }
    }).exec();
    let allNotifications = user.notifications;
    res.render('notifications/index', { allNotifications });
  } catch(err) {
    req.flash('error', err.message);
    res.redirect('back');
  }
});

// handle notification
router.get('/notifications/:id', middleware.isLoggedIn, async function(req, res) {
  try {
    let notification = await Notification.findById(req.params.id);
    notification.isRead = true;
    notification.save();
    res.redirect(`/memories/${notification.memoryId}`);
  } catch(err) {
    req.flash('error', err.message);
    res.redirect('back');
  }
});

module.exports = router

