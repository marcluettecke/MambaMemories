const Memories = require("../models/memories"),
    Comment = require("../models/comment")

// all the middleware goes here
let middlewareObj = {}

//middleware to check if user is logged in
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash("error", "You need to be logged in to do that")
    res.redirect("/login")
}

//check if post is by user
middlewareObj.checkMemoryOwnership = function(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        //     does user own memory
        Memories.findById(req.params.id, (err, foundMemory) => {
            if (err) {
                req.flash("error", "Memory not found")
                res.redirect("back")
            } else {
                if (foundMemory.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back")
    }
}

//check if comment is by user
middlewareObj.checkCommentOwnership = function(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        //     does user own memory
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                req.flash("error", "Comment not found")
                res.redirect("back")
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back")
    }
}


module.exports = middlewareObj
