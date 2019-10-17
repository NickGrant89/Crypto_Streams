const mongoose = require('mongoose');

// User schema

const UserSchema = mongoose.Schema({
    admin:{
        type: String
    },
    name:{
        type: String
    },
    nickname:{
        type:String
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
    friends:[],
    streamkey:{type: String},
    createdate:{type: String},
    
});


let User = module.exports = mongoose.model('User', UserSchema);