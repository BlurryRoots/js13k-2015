module.exports = (function () {

	var Util = {}
	Util.linearInterpolation = function (from, to, currentTime, intervalLength) {
	  return ((to - from) * (currentTime / intervalLength)) + from;
	};

	return Util;

}) ();
