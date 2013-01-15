/*!
 * Throttle v0.3.0
 *
 * Copyright (c) 2012 Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license
 */

/**************************************************
 * Include required modules
 *************************************************/

var express = require('express')
  , routes  = require('./routes')
  , fs      = require('fs');

var app = module.exports = express();

/**************************************************
 * Configure the app
 *************************************************/

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat" }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

/**************************************************
 * Handle the very basic requets for this app
 *************************************************/

// show the basic page routes.index
app.get('/', function (req, res) {
	
	var on = false;
	
	// try reading the config file. won't exist on first go around so use defaults
	try {
		var config = fs.readFileSync('ipfw-rules/ipfw-pipe-config.txt', 'ascii').split("|");
		var bandwidthUp   = config[0];
		var bandwidthDown = config[1];
		var latency       = config[2];
	}
	catch (err) {
	  	var bandwidthUp   = "500";
		var bandwidthDown = "350";
		var latency       = "200";
	}
	
	var exists = fs.existsSync('ipfw-rules/ipfw-rm-include.sh');
	if (exists) {
		var rmFile = fs.readFileSync('ipfw-rules/ipfw-rm-include.sh', 'ascii');
		if (rmFile.length > 0) {
			on = true;
		}
	}
	
	if (typeof req.session.flash != 'undefined') {
		var flash             = req.session.flash;
		var flashType         = req.session.flashType;
		req.session.flash     = '';
		req.session.flashType = '';
	} else {
		var flash     = '';
		var flashType = '';
	}
	
	// render the page
	res.render('index.jade', { on: on, bandwidthDown: bandwidthDown, bandwidthUp: bandwidthUp, latency: latency, flash: flash, flashType: flashType });
});

// handle the POST of the new throttle values
app.post('/', function(req, res) {
	
	// grab the request vars
	var bandwidthUp   = req.body.throttle.bandwidthUp;
	var bandwidthDown = req.body.throttle.bandwidthDown;
	var latency       = req.body.throttle.latency;
	
	// validate the data
	var pattern       = /^[0-9]{1,5}$/;
	if (!pattern.test(bandwidthUp) || !pattern.test(bandwidthDown) || !pattern.test(latency)) {
		req.session.flash     = 'Please make sure youre only using numbers for the values.';
		req.session.flashType = 'error';
		res.redirect('/');
	} else {
		// save options to disk
		var dataC = bandwidthUp+"|"+bandwidthDown+"|"+latency;
		fs.writeFile("ipfw-rules/ipfw-pipe-config.txt", dataC, function(err) {
		    if (err) throw err;
		});

		// save new pipes config to disk
		var dataP = "sudo ipfw pipe 1 config ";
		if (latency != "0") {
			dataP += "delay "+latency+"ms ";
		}
		if (bandwidthDown != "0") {
			dataP += "bw "+bandwidthDown+"Kbit/s";
		}
		if (bandwidthUp != "0") {
			dataP += "\n";
			dataP += "sudo ipfw pipe 2 config bw "+bandwidthUp+"Kbit/s";
		}
		fs.writeFile("ipfw-rules/ipfw-mod-include.sh", dataP, function(err) {
		    if (err) throw err;
		});

		// if rm-include doesn't exist create it simply to make sure ipfw-mod runs the first time
		var exists = fs.existsSync('ipfw-rules/ipfw-rm-include.sh');
		if (!exists) {
			fs.writeFileSync("ipfw-rules/ipfw-rm-include.sh", '');
		}
		
		// run the configure script from command lined
		var util = require('util'), exec = require('child_process').exec, child; 
		child = exec('./ipfw-rules/ipfw-mod.sh', function(err, stdout) {

			// figure out which rules will have to be removed before creating new pipes
			var dataR = '';
			var matches = stdout.match(/[0-9]{5}/g);
			for (var i in matches) {
				dataR += "sudo ipfw delete "+matches[i]+"\n";
			}
			fs.writeFileSync("ipfw-rules/ipfw-rm-include.sh", dataR);
			fs.chmodSync('ipfw-rules/ipfw-rm-include.sh', 0755);
			
			// good so let's go back to the configure page
			req.session.flash     = 'Throttle has been updated.';
			req.session.flashType = 'info';
			res.redirect('/');
		});
	}
});

// remove the pipes that have been created with throttle
app.get("/remove/", function(req, res) {
	var util = require('util'), exec = require('child_process').exec, child; 
	child = exec('./ipfw-rules/ipfw-rm-include.sh', function(err, stdout) {
		fs.writeFile("ipfw-rules/ipfw-rm-include.sh", '', function(err) {
		    if (err) throw err;
		});
		req.session.flash     = 'Throttle has been turned off.';
		req.session.flashType = 'info';
		res.redirect('/');
	});
});

// show the about page
app.get("/about/", function(req, res) {
	res.render("about.jade");
});

/**************************************************
 * Set-up the server listening on port 3000
 *************************************************/

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", 3000, app.settings.env);
});
