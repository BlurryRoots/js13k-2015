module.exports = (function () {

	return {
		linearInterpolation: function (from, to, currentTime, intervalLength) {
		  return ((to - from) * (currentTime / intervalLength)) + from;
		},
	}

}) ();
