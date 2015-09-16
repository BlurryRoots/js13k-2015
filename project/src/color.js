module.exports = (function () {

  var Util = require ('./util');

  function componentToHexString (comp) {
    var str = comp.toString (16);

    return str.length == 1
      ? "0" + str
      : str
      ;
  }

  function checkComponent (x) {
    var c = x || 0;

    if (255 < c) return 255;
    if (0 > c) return 0;

    return c;
  }

  var Color = function (r, g, b) {
    this.r = checkComponent (r);
    this.g = checkComponent (g);
    this.b = checkComponent (b);
  }

  Color.prototype.toHex = function () {
    return "#"
      + componentToHexString (this.r)
      + componentToHexString (this.g)
      + componentToHexString (this.b)
      ;
  };

  Color.prototype.interpolate = function (other, currentTime, intervalLength) {
    return new Color (
      Math.floor (Util.linearInterpolation (this.r, other.r, currentTime, intervalLength)),
      Math.floor (Util.linearInterpolation (this.g, other.g, currentTime, intervalLength)),
      Math.floor (Util.linearInterpolation (this.b, other.b, currentTime, intervalLength))
    );
  };

  return Color;

}) ();
