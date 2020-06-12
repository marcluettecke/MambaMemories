const mongoose = require("mongoose")

let notificationSchema = new mongoose.Schema({
    username: String,
    memoryID: String,
    isRead: {type:Boolean, default: false}
})

module.exports = mongoose.model('Notification', notificationSchema)
