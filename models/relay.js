const mongoose = require('mongoose');

// Relay schema

const RelaySchema = mongoose.Schema({
    
    user:{
        type: String
    },
    name:{
        type: String
    },
    streamurl:{
        type: String
    },
});


let Relay = module.exports = mongoose.model('Relay', RelaySchema);