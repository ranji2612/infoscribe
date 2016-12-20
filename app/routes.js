
module.exports = function(app, passport) {

	// api ---------------------------------------------------------------------
	//Importing other APIS
	app.use('/api/project', require('./api/project'));
	app.use('/api/transcribe', require('./api/transcribe'));
	app.use('/api/files', require('./api/files'));
	app.use('/api', require('./api/upload'));

    // application -------------------------------------------------------------
	app.get('/login', function(req, res) {
		res.sendfile('./public/html/login.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

	app.get('/logout', function(req, res) {
		req.logout();
        console.log('Logging out');
		res.redirect('/login');
	});

    //GET function for signup page
	app.get('/signup', function(req, res){
		res.sendfile('./public/html/signup.html');
	});


	app.get('/*', isLoggedIn, function(req, res){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.sendfile('./public/html/home.html');
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/home', // redirect to the secure profile section
		// failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));





};

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/login');
}
