const mongoose = require('mongoose');

// Notifications schema

const AlertSchema = mongoose.Schema({
    
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


let Alert = module.exports = mongoose.model('Alert', AlertSchema);