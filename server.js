//------------------------------ set up -----------------------------------------
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 8080; 				// set the port
var database = require('./config/database'); 			// load the database config
var passport = require('passport');
var flash = require('connect-flash');

// ----------------------------------------- configuration -------------------------------------
var db = mongoose.connect(database.url);	// connect to mongoDB database on modulus.io
require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// For core functionality
	app.use(express.static(__dirname + '/public/html')); 	// For all HTML files
	app.use(express.static(__dirname + '/public/css')); 	// For all the corresponding css files
	app.use(express.static(__dirname + '/public/Bootstrap')); 	// For all the corresponding css files
	
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.cookieParser()); 						// read cookies (needed for auth)
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); 							// persistent login sessions
	app.use(flash()); 
});

//----------------------------------------- routes -----------------------------------------
require('./app/routes.js')(app, passport);

//------------------- Start your Engines :P (listen )-----------------------------------------
app.listen(port)
console.log("App listening on port " + port);
