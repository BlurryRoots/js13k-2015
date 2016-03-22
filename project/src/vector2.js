/**
* @module Vector2
*/
module.exports = (function () {

  /**
   * Creates a new Vector2
   *
   * @class Vector2
   * @constructor
   * @param {int} x X component
   * @param {int} y Y Component
   *
   */
  function Vector2 (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  /**
   * Sets x and y component of vector.
   *
   * @method setPosition
   * @param {int} x X component
   * @param {int} y Y Component
   *
   */
  Vector2.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
  };

  /**
   * Translates vector by given offset.
   *
   * @method translate
   * @param {int} x X component
   * @param {int} y Y Component
   *
   */
  Vector2.prototype.translate = function (x, y) {
    var offX = x || 0;
    var offY = y || 0;

    this.setPosition (this.x + offX, this.y + offY);
  };

  /**
   * Adds compontes of given vector to this vector.
   *
   * @method add
   * @param {Vector2} other Other vector.
   *
   */
  Vector2.prototype.add = function (other) {
    return new Vector2 (
      this.x + other.x,
      this.y + other.y
    );
  };

  /**
   * Subtracts compontes of given vector to this vector.
   *
   * @method subtract
   * @param {Vector2} other Other vector.
   *
   */
  Vector2.prototype.subtract = function (other) {
    return new Vector2 (
      this.x - other.x,
      this.y - other.y
    );
  };

  /**
   * Calculates the magnitude of this vector.
   *
   * @method magnitude
   * @return {float} Magnitude.
   *
   */
  Vector2.prototype.magnitude = function () {
    return Math.sqrt (this.magnitude2 ());
  }

  /**
   * Calculates the squared magnitude of this vector.
   * (Faster than magnitude, no square root operation needed!)
   *
   * @method magnitude2
   * @return {float} Magnitude squared.
   *
   */
  Vector2.prototype.magnitude2 = function () {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Calculates the dot product of this vector.
   *
   * @method dot
   * @param {Object} other Other vector.
   * @return {float} Dot product.
   *
   */
  Vector2.prototype.dot = function (other) {
    return this.x * other.x + this.y * other.x;
  };

  /**
   * Calculates the angle between this and give vector.
   *
   * @method angle
   * @param {Vector2} other Other vector.
   * @return {float} Angle between vectors.
   *
   */
  Vector2.prototype.angle = function (other) {
    var magprod = this.magnitude () * other.magnitude ();

    return Math.acos (this.dot (other) / magprod);
  }

  /**
   * String representation of this vector.
   *
   * @method toString
   * @return {string} String representation.
   *
   */
  Vector2.prototype.toString = function () {
    return "{x: " + this.x + ", y: " + this.y + "}";
  }

  return Vector2;

}) ();
