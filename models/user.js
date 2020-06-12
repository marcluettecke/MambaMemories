const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose")

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Notification'
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema)
