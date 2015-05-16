/**
 * Version 1.0.0
 * Description helper functions
 */


Object.prototype.size = function () {
	var size = 0;
	for (var key in this) {
		if (this.hasOwnProperty(key)) size++;
	}
	return size;
}