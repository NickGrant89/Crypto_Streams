

let User = require('../models/user');


module.exports = (req, res, next) => {

    try{
        console.log(req.body.email);
        User.findOne({email:req.body.email}, function (err, user) {
            if (err) {
                req.flash('danger', 'Something went wrong, try again.');
                res.redirect('/users/register');
            }
            if (user) {
                req.flash('danger', 'Email address already exists');
                res.redirect('/users/register');
               
            }
            else{next();}
            //console.log(user);
        });
    }
    catch(error){
        req.flash('danger', 'email address already exists');
        res.redirect('/users/register');
    }
}