

let Alert = require('../models/alert');


module.exports = (req, res, next) => {

    try{
        console.log(req.user._id);
        Alert.find({user:req.user._id}, function (err, alert) {
            Alert.countDocuments({user:req.user._id}, function(err, alertcount){
            //console.log(alert)
            alerts = []

            if(alert.length < 1 || alert == undefined){
                //console.log('Empty')
                 alert = []
            }
            else{
                for (let i = 0; i < 5; i++) {
                    //const element = alert[index];
                    //console.log(alert[i]);
                    if(alert[i] == undefined){
                        //alert[i] = '';
                        alerts.push();
                    }
                    else{
                        
                        alerts.push(alert[i]);

                    }
                }
            }
            if (err) {
                console.log(err);
            }
            else{
                req.alert = alerts
                req.allalerts = alert
                req.alertcount = alertcount
                //console.log(alert);
                next();
            }
            
        });
    });
    }
    catch(error){
          
    }
}