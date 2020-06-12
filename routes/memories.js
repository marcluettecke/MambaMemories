const express = require("express"),
    router = express.Router(),
    Memories = require("../models/memories"),
    User = require("../models/user"),
    middleware = require("../middleware"),
    Notification = require("../models/notification")

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
// router.post("/", middleware.isLoggedIn, async function (req, res) {
//         let name = req.body.name
//         let image = req.body.image
//         let date = new Date(req.body.date).toDateString()
//         let description = req.body.description
//         let author = {
//             id: req.user._id,
//             username: req.user.username
//         }
//         let newMemory = {name: name, image: image, description: description, author: author, date: date}
//         try {
//             let memory = await Memories.create(newMemory)
//             let user = await User.findById(req.user._id).populate('followers').exec()
//             let newNotification = {
//                 username: req.user.username,
//                 memoryID: memory.id
//             }
//             for (const follower of user.followers) {
//                 let notification = await Notification.create(newNotification)
//                 follower.notifications.push(notification)
//                 follower.save()
//             }
//             res.redirect(`/memories/${memory.id}`)
//         } catch (err) {
//             req.flash('error', err.message)
//             res.redirect('back')
//         }
//     }
// )

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, async function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    let date = new Date(req.body.date).toDateString();
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newMemory = {name: name, image: image, description: desc, author:author, date: date}

    try {
      let memory = await Memories.create(newMemory);
      let user = await User.findById(req.user._id).populate('followers').exec();
      let newNotification = {
        username: req.user.username,
        memoryId: memory.id
      }
      for(const follower of user.followers) {
        let notification = await Notification.create(newNotification);
        follower.notifications.push(notification);
        follower.save();
      }

      //redirect back to campgrounds page
      res.redirect(`/memories/${memory.id}`);
    } catch(err) {
      req.flash('error', err.message);
      res.redirect('back');
    }
});


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
