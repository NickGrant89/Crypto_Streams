const express = require('express');
const router = express.Router();
const passport = require('passport');

//Passport Config
require('../config/passport')(passport);

const of = require('../middleware/onec-functions');

const ensureAuthenticated = require('../middleware/login-auth');

//Bring in Users Model
let User = require('../models/user');
//Bring in Users Model

let Trans = require('../models/trans');

let Relay = require('../models/relay');



//Get all users
router.get('/', ensureAuthenticated, function(req, res){
    User.findById(req.user.id, function(err, user){
        const q = {}
        Trans.find({},'-_id -__v', function(err, userr){
            Relay.find({},'-_id -__v', function(err, userrr){
                 User.find(q, function(err, users){
                    res.render('users', {
                        title:'Users',
                        users: users,
                     
                        
                    });
                }); 
            });
        });             
    });
});

router.get('/:id', (req, res) => {   
    Relay.findOne({_id:req.params.id}, function(err, relay){
        res.render('relay', {
            relay:relay,
            title:relay.name
            
        }); 
        //console.log(relay)
    });
});

//Edit facebook 
router.post('/edit/:id',  (req, res) => {
    let q = {_id:req.params.id}
    //console.log(q)
    Relay.findOne({_id:req.params.id}, function(err, relay){
        if(relay.name == 'Facebook'){
            let relayUpdate = {};
            relayUpdate.edge = 'rtmps://live-api-s.facebook.com:443/rtmp/' + req.body.streamkey,
            relayUpdate.streamkey = req.body.streamkey,
            relayUpdate.updatedtime = Date.now()

            Relay.updateOne(q, relayUpdate, function(err){
                if(err){
                    console.log(err);
                    return;
                }
                else{
                    res.redirect('/users/')
                     
                }
            });
        }
        if(relay.name == 'Youtube'){
            let relayUpdate = {};
            relayUpdate.edge = 'rtmp://a.rtmp.youtube.com/live2/' + req.body.streamkey,
            relayUpdate.streamkey = req.body.streamkey,
            relayUpdate.updatedtime = Date.now()

            Relay.updateOne(q, relayUpdate, function(err){
                if(err){
                    console.log(err);
                    return;
                }
                else{
                    res.redirect('/relays/'+relay.id)
                     
                }
            });
        }
});
 });

module.exports = router;