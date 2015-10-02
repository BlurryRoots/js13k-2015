/**
* @module Superformular
*/
module.exports = (function () {

  // Import modules
  var Color = require ('./color');
  var Vector2 = require ('./vector2');

  /**
   * Creates a new Color
   *
   * @class Superformular
   * @constructor
   * @param {float} m m component
   * @param {float} n1 n1 component
   * @param {float} n2 n2 component
   * @param {float} n3 n3 component
   * @param {float} a a component
   * @param {float} b b component
   *
   */
  var Superformular = function (m, n1, n2, n3, a, b) {
    if (!a || a <= 0) a = 1;
    if (!b || b <= 0) b = 1;

    this.m = m;
    this.n1 = n1;
    this.n2 = n2;
    this.n3 = n3;
    this.a = a; // stretch in -x
    this.b = b; // stretch in +x
  }

  /**
   * Converts the color value into hexadecimal format.
   *
   * @method calculatePoint
   * @param {float} angle Angle (in radians) from which the point is calculated.
   * @return {Vector2} Point.
   *
   */
  Superformular.prototype.calculatePoint = function (angle) {
    var rpart = (this.m * angle) / 4;
    var apart = Math.abs (Math.cos (rpart) / this.a);
    var bpart = Math.abs (Math.sin (rpart) / this.b);

    var r = Math.pow (
      Math.pow (apart, this.n2) + Math.pow (bpart, this.n3),
      -1 / this.n1
    )

    var x = Math.cos (angle) * r;
    var y = Math.sin (angle) * r;

    return new Vector2 (x, y);
  };

  /**
   * Calculates all vertecies making up the poligon of this superformular shape.
   *
   * @method calculateVertices
   * @param {float} resolution Resoution (angle steps used to calculate vertices).
   * @return {Array} Array of Vector2.
   *
   */
  Superformular.prototype.calculateVertices = function (resolution) {
    resolution = resolution || 360;

    var pi2 = 2 * Math.PI;
    var vertices = [];
    for (var i = 1; i <= resolution; ++i) {
      var radians = (i / resolution) * pi2;

      var vertex = this.calculatePoint (radians, 1);

      vertices.push (vertex);
    }

    return vertices;
  }

  return Superformular;

}) ();
