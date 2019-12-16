const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const shortid = require('shortid');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

//Passport Config
require('../config/passport')(passport);

const DateTime = require('../middleware/timedate');

const ensureAuthenticated = require('../middleware/login-auth');

const checkAlerts = require('../middleware/check-alerts');

const checkEmail = require('../middleware/check-email');

//Bring  Users Model
let User = require('../models/user');

let Relay = require('../models/relay');

//Get all users
router.get('/', ensureAuthenticated, checkAlerts, function(req, res){        
    User.find({}, function(err, users){
        res.render('users', {
            title:'Users',
            users: users,
        });
        console.log();
    }); 
});
 
//Edit User Profile
router.post('/edit/:id',  (req, res) => {
    //console.log(req.body);

    var user = {
        name:{
            firstname: req.body.firstname,
            lastname: req.body.lastname
        },
        phone: req.body.phone,

        addressdetails:{
            address: req.body.address,
            address2: req.body.address2,
            city: req.body.city,
            county: req.body.county,
            postcode: req.body.postcode
        }
        
    }

    let query = {_id:req.body.id}

    console.log(query, user);
    User.updateOne(query, user, function(err){
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

//login form
router.get('/login', function(req, res){
    res.render('login', {title:'Login'});

})

//password reset form
router.get('/passwordreset', function(req, res){
    res.render('passwordreset', {title:'Login'});

})


//password reset form
router.post('/passwordreset', function(req, res){
    if(req.body.email === ' '){
        req.flash('danger', 'error');
        res.redirect('/users/passwordreset');
    }
    User.findOne({email: req.body.email}, function(err, user){
        if(user === null || err){
            req.flash('danger', err);
            res.redirect('/users/passwordreset');
        };
        console.error(user)
        if(user === null){
            //req.flash('danger', 'error');
            //res.redirect('/users/passwordreset');
        }
        else{
            const token = crypto.randomBytes(20).toString('hex');
            var resetDetails = {
                resetPasswordToken: token,
                resetPasswordExpiers: Date.now() + 3600000,
            };

            User.updateOne({_id:user._id}, resetDetails, function(err){
                if(err){
                    console.log(err);
                    return;
                }
                else{
                    //res.redirect('/')
                    //res.send('Success');
                    
                }
           });

            const transporter = nodemailer.createTransport({
                service: '',
                host: 'mail.mystreams.co.uk',
                port:'465',
                secure: 'true',
                auth: {
                    user: 'hello@mystreams.co.uk',
                    pass: 'Bea27yee1989.',
                },
            });

            const mailOptions = {
                from: 'hello@mystreams.co.uk',
                to: user.email,
                subject: 'Link to Password Reset',
                text: 'http://192.168.178.23:3000/users/reset/'+ token,
            };

            console.log('sending mail');

            transporter.sendMail(mailOptions, (err, responce) => {
                if(err){
                    req.flash('danger', err);
                    res.redirect('/users/passwordreset');
                    console.error('there was an error', err);
                }else{
                    console.log('here is the res:', responce);
                    req.flash('recovery sent');
                    res.redirect('/users/passwordreset');
                }
            });
        }
    });
})


//Reset password
router.get('/reset/:id', function(req, res){
    console.log(req.params.id);
    User.findOne({resetPasswordToken: req.params.id}, function(err, user){
        console.log(user);
        if(user === null){
            res.redirect('/');
        }
        else{
            if(user.resetPasswordExpiers > Date.now()){
                console.log(true);
                res.render('passwordresetnow', {email:user.email});
            }
            else{
                console.log(false);
                req.flash('danger', 'password reset link is invalid or had expired!')
                res.redirect('/')
            }
        }
        
        
    });
});

//Password Reset
router.post('/passwordresetnow', function(req, res){
    User.findOne({email: req.body.email}, function(err, user){
        console.log(req.body.email);
        if(err || user == null){
            res.redirect('/');
        }
        else{
            
            bcrypt.genSalt(10, function(errors, salt){
                bcrypt.hash(req.body.password, salt, function(err, hash){
                    if(errors){
                        console.log(err);
                    }else{
                        //user.password = hash;
                        var password = {
                            password: hash,
                            resetPasswordToken: null,
                            resetPasswordExpiers: null,
                        }
                        //console.log(hash)
                        User.updateOne({_id:user._id}, password, function(err){
                            if(err){
                                console.log(err);
                                return;
                            }
                            else{
                                res.redirect('/')
                                
                            }
                        });
                    }
                });
            });    
        }
    });
});

//Register form
router.get('/register', function(req, res){
    res.render('register', {title:'Register'});
    
});

//Settings Form
router.get('/settings', ensureAuthenticated, checkAlerts, function(req, res){
    User.findById(req.user.id, function(err, users){
        Relay.find({'user': users._id}, function(err, relays){
            res.render('settings', 
            {title:'Settings', 
            users:users, 
            alert:req.alert,
            alertcount:req.alertcount,
            relays:relays 
            });
        });
    });
});


//login form
router.get('/logout', function(req, res){
    req.logout();
    //req.flash('success', 'You have logged out');
    res.redirect('/users/login');
});

//login process
router.post('/login', function(req, res, next){
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Get User by id
router.get('/:id', ensureAuthenticated, checkAlerts, (req, res) => {
    User.findById(req.params.id, function(err, users){
        res.render('user', {
            users:users,
            title: users.name,
            alert:req.alert,
            alertcount:req.alertcount, 
        }); 
        //console.log(users.email)
    });
});

//Edit Streamkey 
router.post('/streamkey/:id', ensureAuthenticated, (req, res) => {
    
    User.findById(req.params.id, function(err, users){ 
        console.log(users);
    let user = {};
    user.name = users.name;
    user.email = users.email;
    user.streamkey = shortid.generate();
  
    let query = {_id:req.params.id}

    User.updateOne(query, user, function(err){
         if(err){
             console.log(err);
             return;
         }
         else{
             //res.redirect('/')
             res.send('Success');
             
         }
    });
    console.log()
 });
});

// ...rest of the initial code omitted for simplicity.
const { check, validationResult } = require('express-validator/check');

router.post('/register', checkEmail, [

    //Name
    check('firstname').isLength({min:2}).trim().withMessage('Name required'),
    //Company
    check('lastname').isLength({min:2}).trim().withMessage('Last name required'),
    // username must be an email
    check('email').isEmail().trim().withMessage('Email required'),
    // password must be at least 5 chars long
    check('password').isLength({ min: 8 }).trim().withMessage('Password required'),

    //check('password2').equals('password')
], (req, res) => {


  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    var errorsArray = errors.array();
    var errorsArray1 = [];
    console.log(errorsArray);
    //res.render('register',)
    errorsArray.forEach(errorss => {
        errorsArray1.push(errorss.msg);
    });
    console.log(errorsArray1);
    req.flash('danger', 'Please try again' ,{error:errorsArray1} );
    res.redirect('/users/register');
    

   return { error: errorsArray1 };
  }
  if(req.body.password !== req.body.password2) {
    req.flash('danger' , ('Password confirmation does not match password'));
    res.redirect('/');
    return new Error('Password confirmation does not match password');
    }

  let user = new User();
  user.admin = 'User';
  user.name = req.body.name;
  user.name.firstname = req.body.firstname;
  user.name.lastname = req.body.lastname
  user.email = req.body.email;
  user.password = req.body.password;
  user.password2 = req.body.password2;
  user.streamkey = shortid.generate();
  user.createdate = DateTime.timeStampFull();

  bcrypt.genSalt(10, function(errors, salt){
        bcrypt.hash(user.password, salt, function(err, hash){
            if(errors){
                console.log(err);
            }else{
                user.password = hash;
                //console.log(hash)

                user.save(function(err){
                    if(errors){
                        console.log(err);
                        return;
                    }else{
                        req.flash('success', 'You are now registered');
                        res.redirect('/');
                    }
                });
            }
        });
    });
});

module.exports = router;