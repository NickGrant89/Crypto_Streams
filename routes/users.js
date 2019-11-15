const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const multer = require('multer');
const shortid = require('shortid');
//const upload = multer({dest: '/uploads/'});

//Passport Config
require('../config/passport')(passport);


const ensureAuthenticated = require('../middleware/login-auth');

const checkEmail = require('../middleware/check-email');

//Bring in Users Model
let User = require('../models/user');

let Notification = require('../models/notifications');

let Relay = require('../models/relay');

//Get all users
router.get('/', ensureAuthenticated, function(req, res){        
    User.find({}, function(err, users){
        res.render('users', {
            title:'Users',
            users: users,
        });
        console.log();
    }); 
});
 
 //Register new user 
 router.get('/registerNewuser',  function(req, res){
    let user = new User();
  user.admin = 'Admin';
  user.name = 'Nick';
  user.email = 'jc@jc.com';
  user.company = 'req.body.company';
  user.phone = 'req.body.phone';
  user.username = 'req.body.username';
  user.password = 'jtech1234!';
  user.password2 = 'req.body.password2';

  //console.log(user);

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

//login form
router.get('/login', function(req, res){
    res.render('login1', {title:'Login'});

})

router.delete('/deletealerts/:id' , ensureAuthenticated, (req, res) => {

    let query = {user:req.params.id}
    console.log(query);

    Notification.deleteMany(query, function(err){
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

//login form
router.get('/register', function(req, res){
    res.render('register', {title:'Register'});

})

//login form
router.get('/notifications', function(req, res){
    User.findById(req.user.id, function(err, users){
        Notification.find({'user': users._id}, function(err, notification){
            Notification.count({'user': users._id}, function(err, notificationcount){
    res.render('notifications', 
    {title:'notifications', users:users, notification:notification,
    notificationcount:notificationcount, });

});
});
});
});


//login form
router.get('/settings', ensureAuthenticated, function(req, res){
    User.findById(req.user.id, function(err, users){
        Notification.find({'user': users._id}, function(err, notification){
            Notification.count({'user': users._id}, function(err, notificationcount){
                Relay.find({'user': users._id}, function(err, relays){
    res.render('settings', {title:'Settings', users:users, notification:notification,

    notificationcount:notificationcount,relays:relays });

});
});
});
});
});

//single relay
router.get('/relay/:id', ensureAuthenticated, function(req, res){
    Relay.findById(req.params.id, function(err, relay){
        //console.log(req.params.id);
        res.json(relay);
        console.log(relay);
    });
});

router.delete('/relay/delete/:id' , ensureAuthenticated, (req, res) => {

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

router.get('/:id', ensureAuthenticated, (req, res) => {
    User.findById(req.params.id, function(err, users){
        Notification.find({'user': users._id}, function(err, notification){
            Notification.count({'user': users._id}, function(err, notificationcount){
                res.render('user', {
                    users:users,
                    title: users.name,
                    notification:notification,
                    notificationcount:notificationcount, 
                }); 
                //console.log(users.email)
            });
        });
    });
});


//Edit User 
router.post('/edit/:id',  (req, res) => {
    
    User.findById(req.user.id, function(err, users){ 
        console.log(users);
    let user = {};
    user.admin = req.body.admin;
    user.name = req.body.name;
    user.email = req.body.email;
    //user.company = users.company;
    user.phone = req.body.phone;
    user.sites = req.body.sites;
    console.log(req.body.sites);
  
    let query = {_id:req.params.id}

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
});

//Edit User 
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
  user.firstname = req.body.firstname;
  user.lastname = req.body.lastname
  user.email = req.body.email;
  user.password = req.body.password;
  user.password2 = req.body.password2;
  user.streamkey = shortid.generate();
  user.createdate = Date.now();

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