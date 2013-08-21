
var express		= require('express'),
		http			= require('http'),
		passport	= require('passport'),
		localPass	= require('passport-local'),
		railstation = require('railstation');

var app = express();

app.configure(function() {
	'use strict';

	app.set('port', 5000);
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({
		secret: 'AlaKastafluRoglafanglius+49265-5659'
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(__dirname + 'www/'));
});

railstation.initialize(app, 'routes.json');

