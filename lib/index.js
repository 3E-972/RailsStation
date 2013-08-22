
'use strict';

// FIXME node predefined, remove this
var require = require || function() {};
var console = console || {};

// END node predefined

var express		= require('express'),
		passport	= require('passport'),
		path			= require('path'),
		fs				= require('fs'),
		utils			= require('utils'),
		ContextFactory = require('./ContextFactory'),
		routes		= require('./routes');

require('patchArray').apply();

// Utils function

function assert(cond, msg) {
	var ok = (typeof cond === 'function') ? cond() : cond;

	if (ok) return;
	throw new Error(msg || 'assert failed');
}

///////////// END OF Utils


// Verifie que les fonctions existent, pète une erreur au moindre pb
// Si OK, remplace les string par les fonctions idoines
function populateRoles(roles, context) {
	if (roles === {}) {
		console.warn('No roles specified ! Do you really want me to 401 everything ?');
		return;
	}

	for (var role in roles) {
		if (role === 'default' || role === 'everyone')
			continue;

		var str = roles[role];
		var i = str.indexOf('.');
		if (i === -1)
			throw new Error(utils.format('Role checking: `%s` is not a valid `Module.func` for role "%s" !',
																	str,
																	role));

		var modName = str.substr(0, i);
		if (undefined === context[modName])
			throw new Error(utils.format('Role checking: tried to assign module `%s` to role "%s", but forgot to require it',
																	modName,
																	role));

		// continue checking in the string
		var tmpContext = context;
		while (str.length) {
			str = str.substr(i + 1);
			i		= str.indexOf('.');

			if (i !== -1) {
				// the current word is a module, does it exists ?
				var submodule = str.substr(0, i);
				if (undefined === tmpContext[submodule])
					throw new Error(utils.format('Role checking: tried to assign `%s` to role "%s", but submodule "%s" does not exists',
																			str,
																			submodule,
																			role));

				tmpContext = tmpContext[submodule];
			}
			else {
				// this is the last word, we accept functions only
				if (undefined === tmpContext[str])
					throw new Error(utils.format('Role checking: tried to assign `%s` to role "%s", but `%s` is undefined',
																			roles[role],
																			role,
																			str));

				if (typeof tmpContext[str] !== 'function')
					throw new Error(utils.format('Role checking: tried to assign `%s` to role "%s", but `%s` is not a function',
																			roles[role],
																			role,
																			str));

				// ALL RIGHTS ! Keep the function
				roles[role] = tmpContext[str];
			}
		} // END while str.length
	} // END foreach role in roles
}

var railstation = {

	// routeFile is either a JSON file or a CommonJS file exporting a JS obj
	initialize: function(app, routeFile) {

		if (typeof app !== (typeof express())) {
			throw new Error('Railstation.initialize: first argument MUST be an express object');
		}

		if (typeof routeFile !== 'string') {
			throw new Error('RailStation.initialize: second argument MUST be a string !');
		}

		var routeObj;

		if (routeFile.endswith('json') || routeFile.endswith('JSON')) {
			var contents = fs.readSync(path.normalize(routeFile));
			routeObj = JSON.parse(contents);
		} else if (routeFile.endswith('js')) {
			routeObj = require(routeFile.substr(0, routeFile.length - 3));
		} else {
			routeObj = require(routeFile);
		}

		// Holds the loaded modules
		var context = ContextFactory.getFactory('Modules').new();
		context.load(routeObj.require || {});

		// Array of registered routes
		//+TODO recursive or flat ?
		//+TODO really needed ? Coherency check ?
		var routes = [];
		// Holds the roles, need a check
		var roles = routeObj.roles || {};
		populateRoles(roles, context);

		for (var elt in routeObj) {
			if (elt[0] === '/') {
				if (routes.checkRoute(elt))
					routes.parseRoute(app, roles, elt, routeObj[elt]);
				else
					return false;
			}
		} // END for elt in routeObj
	}

};
