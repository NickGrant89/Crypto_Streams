

let Alert = require('../models/alert');


module.exports = (req, res, next) => {

    try{
        console.log(req.user._id);
        Alert.find({user:req.user._id}, function (err, alert) {
            Alert.countDocuments({user:req.user._id}, function(err, alertcount){
            //console.log(alert);
            
            if (err) {
                console.log(err);
            }
            else{
                req.alert = alert
                req.alertcount = alertcount
                next();
            }
            //console.log(user);
        });
    });
    }
    catch(error){
          
    }
}