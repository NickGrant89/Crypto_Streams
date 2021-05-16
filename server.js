//Using modual

const morgan = require('morgan'); // Console Logger
const express = require('express'); // Express Framework
const path = require('path');
const bodyParser = require('body-parser')
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database')
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);

const helmet = require('helmet');

// This calls the Device model to intergate the DB

const ensureAuthenticated = require('./middleware/login-auth');

const checkAlerts = require('./middleware/check-alerts');

let User = require('./models/user');

let Relay = require('./models/relay');

// Call Moongoose connection
const mongoose = require('mongoose');
mongoose.connect(config.database,{ useNewUrlParser: true, useUnifiedTopology: true  });

// Starting DB connection

let db = mongoose.connection;

db.once('open', function(){
    console.log('MongoDB Live');

})

db.on('error', function(err){
    console.log(err);

});

const app = express();
app.use(express.json());

app.use(helmet());

//Logs all requests to the consol.
app.use(morgan('dev'));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Set Public folder

app.use(express.static(path.join(__dirname, 'public')))

app.use('/uploads', express.static('uploads'));


//Express session Middleware

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'Fam!lyGuy2o19',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection, 
                            ttl: 1 * 24 * 60 * 60 })
  }));

  //Express message middleware

  app.use(require('connect-flash')());
  app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Passport Config
require('./config/passport')(passport);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
})


var getAlerts = function (req, res, next) {
    req.getAlerts = Date.now()
    next()
}

//app.use(checkAlerts)  

//GET display SB Admin page
app.get('/', ensureAuthenticated, checkAlerts, function(req, res){
    User.findById(req.user.id, function(err, users){
        Relay.find({'user': users._id}, function(err, relays){
            console.log(req.alert);
            res.render('index', {
                title:'Dashboard',
                users:users,
                alert:req.alert,
                alertcount:req.alertcount,
                relays:relays,
            });
        }); 
    });            
});            


// Route File

let users = require('./routes/users');
let relays = require('./routes/relays');
let auth = require('./routes/apiJWT');
let alerts = require('./routes/alerts');
let posts = require('./routes/posts');


//Display Routess

app.use('/users', users);
app.use('/relays', relays);
app.use('/auth', auth);
app.use('/alerts', alerts);
app.use('/posts', posts);

/* app.use('*', function(req, res) {
    res.status(404).end();
    res.redirect('/');
});  */


const port = process.env.Port || 3000;

app.listen(port, process.env.IP || '192.168.178.120', () => console.log('Example app listening on port' + ' ' + port +  '!'))
