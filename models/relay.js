const mongoose = require('mongoose');

// User schema

const RelaySchema = mongoose.Schema({
    name: String,
    switch: String,
    app: String,
    mode: String,
    edge: String,
    user: String,
    streamkey: String,
    currenttime: String,
    updatedtime: String

});


let Relay = module.exports = mongoose.model('Relay', RelaySchema);