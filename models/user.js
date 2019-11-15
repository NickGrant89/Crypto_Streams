const mongoose = require('mongoose');

// User schema

const UserSchema = mongoose.Schema({
    activated:{
        type:Boolean,
        default: false,
    },
    admin:{
        type: String
    },
    name:{
        firstname: String,
        lastname: String
    },
    dateofbirth:{
        type: String
    },
    email:{
        type: String
    },
    phone:{
        type: String
    },
    password:{
        type: String
    },
    addressdetails:{
        address: String,
        address2: String,
        city: String,
        county: String,
        postcode: String,
    },
    friends:[],
    streamkey:{type: String},
    createdate:{type: String},
    
});


let User = module.exports = mongoose.model('User', UserSchema);