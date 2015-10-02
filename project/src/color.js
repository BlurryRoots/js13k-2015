/**
* @module Color
*/
module.exports = (function () {

  // Import utillity module
  var Util = require ('./util');

  /**
  * Converts color component to hex string.
  *
  * @method _componentToHexString
  * @param {int} comp Color component value.
  * @return {String} String representing the hexadecimal value of the color component.
  *
  * @private
  */
  function _componentToHexString (comp) {
    var str = comp.toString (16);

    return str.length == 1
      ? "0" + str
      : str
      ;
  }

  /**
  * Checks weather a component has a valid value. Clamps it if necessary.
  *
  * @method _checkComponent
  * @param {int} x Color component value.
  * @return {Boolean} Clamped color value.
  *
  * @private
  */
  function _checkComponent (x) {
    var c = x || 0;

    if (255 < c) {
      return 255;
    }

    if (0 > c) {
      return 0;
    }

    return c;
  }

  /**
   * Creates a new Color
   *
   * @class Color
   * @constructor
   * @param {int} r Red color component
   * @param {int} g Green Color component
   * @param {int} b Blue color component
   */
  var Color = function (r, g, b) {
    this.r = _checkComponent (r);
    this.g = _checkComponent (g);
    this.b = _checkComponent (b);
  }

  /**
   * Converts the color value into hexadecimal format.
   *
   * @method toHex
   * @return {String} String representing the hexadecimal color value.
   */
  Color.prototype.toHex = function () {
    return "#"
      + _componentToHexString (this.r)
      + _componentToHexString (this.g)
      + _componentToHexString (this.b)
      ;
  };

  /**
   * Component wise linear interpolation of this color and given color.
   *
   * @method interpolate
   * @param  {Color} other Other color to interpolate to.
   * @param  {float} currentTime Current time.
   * @param  {float} interval Interpolation interval.
   * @return {Color} color Color holding interpolated components.
   */
  Color.prototype.interpolate = function (other, currentTime, intervalLength) {
    return new Color (
      Math.floor (Util.linearInterpolation (
        this.r, other.r, currentTime, intervalLength
      )),
      Math.floor (Util.linearInterpolation (
        this.g, other.g, currentTime, intervalLength
      )),
      Math.floor (Util.linearInterpolation (
        this.b, other.b, currentTime, intervalLength
      ))
    );
  };

  return Color;

}) ();
