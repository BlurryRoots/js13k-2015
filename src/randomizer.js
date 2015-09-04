module.exports = (function () {
  var _seed = 0;

  function random () {
    var x = Math.sin (0.8765111159592828 + _seed++) * 1e4
    return x - Math.floor (x)
  }

  var RandomizerClass = function (seed) {
    _seed = seed;
  }

  /**
   * Return an integer within [0, max).
   *
   * @param  {int} [max]
   * @return {int}
   * @api public
   */
  RandomizerClass.prototype.int = function (max) {
    return random () * (max || 0xfffffff) | 0;
  };

  /**
   * Return a float within [0.0, 1.0).
   *
   * @return {float}
   * @api public
   */
  RandomizerClass.prototype.float = function () {
    return random ();
  };

  /**
   * Return a boolean.
   *
   * @return {Boolean}
   * @api public
   */
  RandomizerClass.prototype.bool = function () {
    return random () > 0.5;
  };

  /**
   * Return an integer within [min, max).
   *
   * @param  {int} min
   * @param  {int} max
   * @return {int}
   * @api public
   */
  RandomizerClass.prototype.range = function (min, max) {
    return this.int (max - min) + min;
  };

  /**
   * Pick an element from the source.
   *
   * @param  {mixed[]} source
   * @return {mixed}
   * @api public
   */
  RandomizerClass.prototype.pick = function (source) {
    return source[this.range (0, source.length)];
  };

  return RandomizerClass;
}) ();
