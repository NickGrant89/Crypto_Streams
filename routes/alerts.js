const express = require('express');
const router = express.Router();

const ensureAuthenticated = require('../middleware/login-auth');

const checkAlerts = require('../middleware/check-alerts');

//Bring in Users Model
let User = require('../models/user');

let Alert = require('../models/alert');

let Relay = require('../models/relay');

//List all alerts
router.get('/', ensureAuthenticated, checkAlerts, function(req, res){
    User.findById(req.user.id, function(err, users){

                res.render('alerts',{
                title:'Alerts', 
                users:users, 
                alert:req.alert,
                alertcount:req.alertcount, 
                });
    });
});


//List single alert
router.get('/:id', ensureAuthenticated, checkAlerts, function(req, res){
    User.findById(req.param.id, function(err, user){
        //console.log(req.params.id, user)
        Alert.find({'user': req.params.id}, function(err, Alert){
            Alert.countDocuments({'user': req.params.id}, function(err, alertcount){
                res.json(
                    Alert
                );
            });
        });
    });
}); 

//Delete single alret
router.delete('/:id' , ensureAuthenticated, (req, res) => {

    let query = {_id:req.params.id}
    //console.log(query);

    Alert.deleteOne(query, function(err){
         if(err){
             console.log(err);
             return;
         }
         else{
             //res.redirect('/')
             //res.send('200');
             res.send('Success');
             
         }
    });
    console.log()

});

//Delete all alerts
router.delete('/all/:id' , ensureAuthenticated, (req, res) => {

    let query = {user:req.params.id}
    console.log(query);

    Alert.deleteMany(query, function(err){
         if(err){
             console.log(err);
             return;
         }
         else{
             //res.redirect('/')
             //res.send('200');
             res.send('Success');
             
         }
    });
    console.log()

});

module.exports = router;