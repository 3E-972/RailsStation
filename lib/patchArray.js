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

	Array.__defineGetter__('areAllDifferents', function() {
		var copy = this.map(function(e) {return e;}); // TODO find a better way to copy
		copy.sort();

		var tmp;
		for (var i = 0; i < copy.length; i++) {
			if (tmp === copy[i])
				return false;

			tmp = copy[i];
		}

		return true;
	});
};
