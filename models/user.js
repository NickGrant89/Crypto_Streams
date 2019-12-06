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
        firstname: {type:String},
        lastname: {type:String},
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
        address:{type:String},
        address2: {type:String},
        city: {type:String},
        county: {type:String},
        postcode: {type:String},
    },
    streamkey:{type: String},
    createdate:{type: String},
    
});


let User = module.exports = mongoose.model('User', UserSchema);