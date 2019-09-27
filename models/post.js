const mongoose = require('mongoose');

// User schema

const PostSchema = mongoose.Schema({
    title:{
        type: String
    },
    decription:{
        type: String
    },
    publisher:{
        type:String
    },
    url:{type:String},
    likes:[],
    comments:[],
    live:{type:Boolean},
});


let Post = module.exports = mongoose.model('Post', PostSchema);