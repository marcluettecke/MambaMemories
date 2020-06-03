const express = require("express"),
    router = express.Router(),
    Memories = require("../models/memories"),
    middleware = require("../middleware")

// memory route
router.get("/", (req, res) => {
        //get all memories from DB
        Memories.find({}, (err, allMemories) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render("memories/index", {memories: allMemories})
                }
            }
        )
    }
)

// CREATE - post route for new entry
router.post("/", middleware.isLoggedIn, (req, res) => {
        let name = req.body.name
        let image = req.body.image
        let date = new Date(req.body.date).toDateString()
        // let date = mongoose_date.getDate()
        let description = req.body.description
        let author = {
            id: req.user._id,
            username: req.user.username
        }
        let newMemory = {name: name, image: image, description: description, author: author, date: date}

        Memories.create(newMemory, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    res.redirect("/memories")
                }
            }
        )
    }
)


// form route new entry
router.get("/new", middleware.isLoggedIn, (req, res) => {
        res.render("memories/new.ejs")
    }
)

// show route - show individual entries
router.get("/:id", (req, res) => {
    Memories.findById(req.params.id).populate("comments likes").exec((err, foundMemory) => {
        if (err) {
            console.log(err)
        } else {
            res.render("memories/show", {"memory": foundMemory})
        }
    })
})

//EDIT ROUTE get portion
router.get("/:id/edit", middleware.checkMemoryOwnership, (req, res) => {
    // is user logged in
    Memories.findById(req.params.id, (err, foundMemory) => {
        res.render("memories/edit", {memory: foundMemory})
    })
})


//EDIT ROUTE put portion
router.put("/:id", middleware.checkMemoryOwnership, (req, res) => {
    Memories.findByIdAndUpdate(req.params.id, req.body.memory, (err, updatedMemory) => {
        if (err) {
            res.redirect("/memories")
        } else {
            res.redirect("/memories/" + req.params.id)
        }
    })
})


// DELETE ROUTE
router.delete("/:id", middleware.checkMemoryOwnership, (req, res) => {
    Memories.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/memories")
        } else {
            res.redirect("/memories")
        }
    })
})

// Campground Like Route
router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
    Memories.findById(req.params.id, function (err, foundMemory) {
        if (err) {
            console.log(err);
            return res.redirect("/memories");
        }

        // check if req.user._id exists in foundCampground.likes
        var foundUserLike = foundMemory.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundMemory.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundMemory.likes.push(req.user);
        }

        foundMemory.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/memories");
            }
            return res.redirect("/memories/" + foundMemory._id);
        });
    });
});


module.exports = router
