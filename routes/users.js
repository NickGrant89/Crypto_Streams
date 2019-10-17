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

//login form
router.get('/register', function(req, res){
    res.render('register', {title:'Register'});

})

//login form
router.get('/profile', function(req, res){
    res.render('profile', {title:'Profile'});

})

//login form
router.get('/settings', function(req, res){
    res.render('settings', {title:'Settings'});

})

//login form
router.get('/go-live', function(req, res){
    res.render('go-live', {title:'Go Live'});

})

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

router.get('/:id', (req, res) => {
    User.findById(req.params.id, function(err, users){
        const q = {'user': users.email} 
        Relay.find(q, function(err, relay){
            Trans.findOne({'user':users.email}, function(err, trans){
            res.render('user', {
                users:users,
                title: users.name,
                trans:trans,
                relay:relay,
                hls:trans.hls,
                dash:trans.dash,
                mp4:trans.mp4,
            }); 
            console.log(users.email)
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
router.post('/streamkey/:id',  (req, res) => {
    
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
             res.redirect('/')
             
         }
    });
    console.log()
 });
});

//Edit Stream Settings User 
router.post('/edit/streamset/:id',  (req, res) => {
    
    User.findById(req.params.id, function(err, users){ 
        console.log(req.body);

     //console.log(hello(device));
     let trans = {};
            trans.app = users.email, 
            trans.hls = req.body.hls,
            trans.hlsFlags ='[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
            trans.dash = req.body.dash,
            trans.dashFlags = '[f=dash:window_size=3:extra_window_size=5]',
            trans.mp4 = req.body.mp4,
            trans.mp4Flags = '[movflags=faststart]',
            trans.updatedtime = Date.now();
        
   //console.log(trans);
     let query = {'user': users.email}
     //console.log(query);
    Trans.updateMany(query, trans, function(err){
         if(err){
             console.log(err);
             return;
         }
         else{
             res.redirect('/')
             
         }
    }); 
   
    //console.log(users.trans)
 });
});

// ...rest of the initial code omitted for simplicity.
const { check, validationResult } = require('express-validator/check');

router.post('/register', checkEmail, [

    //Name
    check('name').isLength({min:3}).trim().withMessage('Name required'),
    //Company
    //check('nickname').isLength({min:3}).trim().withMessage('Company required'),
    //Company
    check('phone').isLength({min:11}).trim().withMessage('Phone Number required'),
    //Username
    check('dateofbirth').isLength({ min: 6}).trim().withMessage('Date Of Birth required'),
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
  user.nickname = req.body.nickname;
  user.dateofbirth = req.body.dateofbirth;
  user.email = req.body.email;
  user.phone = req.body.phone;
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