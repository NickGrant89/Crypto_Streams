const mongoose = require('mongoose');

// Notifications schema

const NotificationsSchema = mongoose.Schema({
    
    user:{
        type: String
    },
    notification:{
        type: String
    },
    datecreated:{
        type: String
    },
});


let Notifications = module.exports = mongoose.model('Notifications', NotificationsSchema);