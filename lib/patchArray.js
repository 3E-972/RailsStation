/**
 * Monkey patch some handy funcitons for arrays
 */

exports.apply = function() {
	// Don't apply the patch more than once
	if (Array.last !== undefined)
		return;

	Array.__defineGetter__('last', function() {
		if (this.length === 0)
		throw new Error('Array is empty, this should never happenned when last is called');

	return this[this.length - 1];
	});
}
