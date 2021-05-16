const mongoose = require('mongoose');

// User schema

const PostSchema = mongoose.Schema({
    live:{
        type:Boolean,
        default: true,
    },
    title:{
        type: String
    },
    description:{
        type: String
    },
    streamURL:{
        type: String
    },
    user:{
        type: String
    },
    datecreated:{
        type: String
    },
  
    
});


let Post = module.exports = mongoose.model('Post', PostSchema);