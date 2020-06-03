const express = require("express"),
    router = express.Router({mergeParams: true}),
    Memories = require("../models/memories"),
    Comment = require("../models/comment"),
    middleware = require("../middleware")

//get route for new comment comment
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Memories.findById(req.params.id, (err, foundMemory) => {
        if (err) {
            console.log(err)
        } else {
            res.render("comments/new", {"memory": foundMemory})
        }
    })
})

// CREATE post route new comment
router.post("/", middleware.isLoggedIn, (req, res) => {
    // lookup memory using id
    Memories.findById(req.params.id, (err, foundMemory) => {
        if (err) {
            console.log(err)
            res.redirect("/memories")
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", "Oops, something went wrong")
                    console.log(err)
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    //save comment
                    comment.save()

                    foundMemory.comments.push(comment)
                    foundMemory.save()
                    req.flash("success", "Successfully added comment")
                    res.redirect("/memories/" + foundMemory._id)
                }
            })
        }
    })
})

//comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect("back")
        } else {
            res.render("comments/edit", {memory_id: req.params.id, comment: foundComment})
        }
    })
})

// Comment update
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect("back")
        } else {
            res.redirect("/memories/" + req.params.id)
        }
    })
})

// comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back")
        } else {
            req.flash("success", "Comment deleted")
            res.redirect("/memories/" + req.params.id)
        }
    })
})

module.exports = router
