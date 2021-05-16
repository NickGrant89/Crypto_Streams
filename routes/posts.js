const express = require('express');
const router = express.Router();

const ensureAuthenticated = require('../middleware/login-auth');

//Bring in Users Model
let User = require('../models/user');

let Relay = require('../models/relay');

let Post = require('../models/post');


//Get all posts
router.get('/', ensureAuthenticated, function(req, res){
    Post.find({}, function(err, posts){
        //console.log(req.params.id);
        res.json(posts);
        //console.log(relay);
    });
});

//Get single Post
router.get('/:id', ensureAuthenticated, function(req, res){
    Relay.findById(req.params.id, function(err, relay){
        //console.log(req.params.id);
        res.json(relay);
        //console.log(relay);
    });
});

//Delete relay
router.delete('/:id' , ensureAuthenticated, (req, res) => {

    let query = {_id:req.params.id}
    //console.log(query);

    Relay.deleteOne(query, function(err){
         if(err){
             console.log(err);
             return;
         }
         else{
             //res.redirect('/')
             //res.send('200');
             res.sendStatus(200);
         }
    });
    console.log()

});

// Go Live
router.post('/goLive', ensureAuthenticated, (req, res) => {
    
    User.findOne({streamkey:req.body.streamkey}, function(err, user){ 
        console.log(req.body.streamkey + "hello world");

    let post = new Post();
    post.live = true;
    post.title = req.body.title;
    post.description = req.body.description;
    post.streamurl = "https://rtmp.mystreams.co.uk:8443/live/" + req.body.streamurl + '/index.m3u8';
    post.datecreated = "";
    post.user = user.id;


  
    let query = {_id:req.params.id}

    post.save(function(err){
         if(err){
             console.log(err);
             return;
         }
         else{
             //res.redirect('/')
             res.send('Success');
             
         }
    });
 });
});


module.exports = router;