//modules
var express = require('express'),
		app = express(),
		handlebars = require('express-handlebars').create({defaultLayout:'main'}),
		fs = require("fs"),
		port = process.env.PORT || 3000,
		cookieParser = require('cookie-parser'),
		session = require('express-session'),
		authConfig = require('./config/auth'),
		passport = require('passport'),
		GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


/**
 * Passport Authentication
 */
passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(obj, done){
	done(null, obj);
});

passport.use(new GoogleStrategy(
	authConfig.google,
	function(request, accessToken, refreshToken, profile, done) {
		return done(null, profile);
	}
));


/**
 * Configure Express
 */

//security app disable
app.disable('x-powered-by');

//setting up the port and engine
app.set('port', port);
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
	secret: 'cookie_secret',
	resave: true,
	saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());

// Restore Passport Session, if any
app.use(passport.session());


/**
 * Routes
 */
app.get('/', function(req,res, next){
	var model = {};
	model.title = 'Mars University';

	model.loggedIn = req.isAuthenticated();

	res.render('home', model);
});

app.get('/login', function(req,res){
	res.render('login');
});

// GET /auth/google
// Passport will authenticate using Google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read'] }));

// Get /auth/google/callback
// If authentication fails, we redirect back to login
// Otherwise if authentication is successful we redirect to the home page
app.get('/auth/google/callback',
  passport.authenticate('google',
	{ successRedirect: '/',
	 failureRedirect: '/'
 	}
));

app.get('/profile', ensureAuthenticated, function(req, res){
	var model = {};
	model.user = req.user;

	res.render('profile', {user: req.user});
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

//port starting and listening
app.listen(app.get('port'), function(){
	console.log('Server started at 3000');
});

//looking for page
app.use(function(req,res,next){
	console.log("Looking for "+ req.url);
	next();
});

//404 error - page not found
app.use(function(req,res){
	res.type('text/html');
	res.status(404);
	res.render('404');
});

//500 error - server error
app.use(function(err, req,res, next){
	console.log(err.stack);
	res.status(500);
	res.render('500');
});

function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}
