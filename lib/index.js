
'use strict';

// FIXME remove this
var require = require || function() {};

var express		= require('express'),
		passport	= require('passport'),
		path			= require('path'),
		fs				= require('fs'),
		utils			= require('utils');

// Utils function

function assert(cond, msg) {
	var ok = (typeof cond === 'function') ? cond() : cond;

	if (ok) return;
	throw new Error(msg || 'assert failed');
}

///////////// END OF Utils


// Used to keep trace of requires scopes
var contextStack = [];

// small handy getter
contextStack.__defineGetter__('last', function() {
	if (contextStack.length === 0) {
		throw new Error('Context stack not clean: empty stack, this should never happened');
	}
	return contextStack[contextStack.length -1 ];
});

var Context = function() {
	utils.inherits(this, contextStack.last);
	contextStack.push(this);
};

Context.prototype.destroy = function() {
	if (contextStack.last !== this) {
		throw new Error('Context stack not clean: I\'m not the last ! We left no friend behind !');
	}
	contextStack.pop();
};

Context.prototype.load = function(modules) {
	for (var name in modules) {
		if (typeof modules[name] !== 'string')
			throw new Error('require properties MUST be strings');

		this[name] = require(name);
	}
};

// Verifie que les fonctions existent
function checkRoles(roles, context) {
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
			}
		} // END while str.length
	} // END foreach role in roles
}

var railstation = {

	initialize: function(app, routeFile) {

		if (typeof app !== (typeof express())) {
			throw new Error('Railstation.initialize: first argument MUST be an express object');
		}

		if (typeof routeFile !== 'string') {
			throw new Error('RailStation.initialize: second argument MUST be a string !');
		}

		var contents = fs.readSync(path.normalize(routeFile));
		var routeObj = JSON.parse(contents);

		// Holds the loaded modules
		var context = new Context();
		context.load(routeObj.require || {});

		// Array of registered routes
		//+TODO recursive or flat ?
		//+TODO really needed ? Coherency check ?
		var routes = [];
		// Holds the roles, need a check
		var roles = routeObj.roles || {};
		checkRoles(roles, context);

		for (var elt in routeObj) {
			if (elt[0] === '/') {
				routes.push(elt);
			}
		}

	}

};
