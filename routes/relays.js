const express = require('express');
const router = express.Router();

const ensureAuthenticated = require('../middleware/login-auth');

//Bring in Users Model
let User = require('../models/user');

let Relay = require('../models/relay');


//Get single relay
router.get('/:id', ensureAuthenticated, function(req, res){
    Relay.findById(req.params.id, function(err, relay){
        //console.log(req.params.id);
        res.json(relay);
        console.log(relay);
    });
});

//Delete relay
router.delete('/:id' , ensureAuthenticated, (req, res) => {

    let query = {_id:req.params.id}
    console.log(query);

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

// Add relay 
router.post('/addDest', ensureAuthenticated, (req, res) => {
    
    User.findOne({user:req.params.streamkey}, function(err, users){ 
        console.log(users);

    let relay = new Relay();
    relay.user = users._id;
    relay.name = req.body.name;
    relay.streamurl = req.body.streamurl;

  
    let query = {_id:req.params.id}

    relay.save(function(err){
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

//Edit Relay 
router.post('/edit/:id',  (req, res) => {

    let relay = {};
    relay.name = req.body.name;
    relay.streamurl = req.body.streamurl;
    //console.log(req.body);
  
    let query = {_id:req.params.id}

    Relay.updateOne(query, relay, function(err){
         if(err){
             console.log(err);
             return;
         }
         else{
             res.redirect('/')
             
         }
    });
    console.log()
 });

module.exports = router;