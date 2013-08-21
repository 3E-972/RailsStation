/**
 * The context factory is used to keep trace of the differetns scopes
 * ex: requires scopes, access scopes, errors, etc.
 */

'use strict';

var utils = require('utils');

var i = 0;
var catalog = {};

var ContextFactory = exports.ContextFactory = function(name) {

	this.name = name || ('ContextFactory' + (i += 1));
	// register ourselve
	catalog[this.name] = this;
	this._stack = [];
};

ContextFactory.__defineGetter__('stack', function() { return this._stack; });

exports.getFactory = function getFactory(name) {
	return catalog[name] || new ContextFactory(name);
};

var Context = function(stack) {
	this.stack = stack;
	return this;
};

ContextFactory.prototype.new = function() {
	var c = new Context(this.stack);
	utils.inherit(c, this.stack.last);
	this.stack.push(c);
	return c;
};

Context.prototype.destroy = function() {
	if (this.stack.last !== this)
		throw new Error('Context stack not clean: I\'m not the last ! We left no friend behind !');

	this.stack.last.pop();
};

Context.prototype.load = function(modules) {
	for (var name in modules) {
		if (typeof modules[name] !== 'string')
			throw new Error('require properties MUST be strings');

		this[name] = require(name);
	}
};
