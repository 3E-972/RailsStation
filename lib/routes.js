/**
 * Routes checking, creation, management
 */
'use strict';

var exports = exports || {};
var console = console || {};
var require = require || function() {};

var Url			= require('url'),
		debug		= require('debug')('RailStation'),
		Methods = require('methods'),
		ContextFactory = require('./ContextFactory');

function populateApp(app, methods, path, callback) {
	methods = methods.toLowerCase();
	if (methods === 'all') {
		Methods.forEach(function(e) { app[e](path, callback); });
	} else if (methods instanceof Array) {
		methods.forEach(function(e) { app[e](path, callback); });
	} else {
		app[methods](path, callback);
	}
}

function populateZoneAndSubzones(app, methods, path, callback) {
	populateApp(app, methods, path, callback);
	populateApp(app, methods, path + '/*', callback);
}

exports.checkRoute = function checkRoute(route) {
	/* Yes, it can be largely shorter with just some regexes but I prefer verbose
	 * error reporting. Easier for everyone
	 */
	var url = Url.parse(route);

	var shouldBeUndefined = [
		'protocol', 'host', 'auth', 'hostname', 'port', 'search', 'query', 'hash'
		];
	var tmp;

	if (shouldBeUndefined.some(function(e) { tmp = e; return url[e] !== undefined; })) {
		console.error('Bad zone: %s; MUST NOT contains any %s', route, tmp);
		return false;
	}

	if (route.contains(':')) {
		console.warn("RailStation don't support parametized URL yet !");
		return false;
	}

	if (route.lastIndexOf('/') !== 0) {
		console.warn("RailStation need you to declare one zone at once ! (no '/a/b')");
		return false;
	}

	if (route !== '/' && !route.match(/\/\w+/)) {
		console.warn("Strange zone: %s; I accept it now but it doesn't fit the classic scheme",
								 route);
	}

	return true;
};

exports.parseRoute = function parseRoute(app, roles, routeName, route) {
	var context = ContextFactory.getFactory('Modules').new();
	context.load(route.require);

	if (route.access === undefined) {
		console.warn('Zone %s: no access defined. Defaulting to 401 for everyone', routeName);
		var p401 = route.error[401] || route.error[400] || route.error[0];
		if (p401 === undefined) {
			// no 401 file given
			populateZoneAndSubzones(app, 'all', route, function(req, res, next) {
				res.send(401);
				next();
			});
		} else {
			// send the 401 file
			populateZoneAndSubzones(app, 'all', route, function(req, res, next) {
				res.status (401);
				res.sendfile(p401);
				next();
			});
		}
	}

	context.destroy();
};
