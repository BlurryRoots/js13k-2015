/**
@module Randomizer
*/
module.exports = (function () {
  // inspired by ooflorent at https://github.com/ooflorent/js13k-boilerplate

  var _seed = 0;

  /**
  Creates a random number between (0.0, 1.0]

  @method random
  @return {float} A random float.

  @private
  */
  function random () {
    var x = Math.sin (0.8765111159592828 + _seed++) * 1e4
    return x - Math.floor (x)
  }

  /**
  Creates a new randomizer object.

      var r = new Randomizer (1337);

  @class Randomizer
  @constructor
  @param {int} [seed] Seed used to initialze.
  */
  var Randomizer = function (seed) {
    // either set the given seed or initialize with the current date
    _seed = seed || Date.now ();
  }

  /**
  Return an integer within [0, max).

      var r = new Randomizer (1337);
      var i = r.int ();
      console.log (i);

  @method int
  @param {int} [max]
  @return {int}
  */
  Randomizer.prototype.int = function (max) {
    return random () * (max || 0xfffffff) | 0;
  };

  /**
  Return a float within [0.0, 1.0).

      var r = new Randomizer (1337);
      var i = r.float ();
      console.log (i);

  @method float
  @return {float}
  */
  Randomizer.prototype.float = function () {
    return random ();
  };

  /**
  Return a boolean.

      var r = new Randomizer (1337);
      var i = r.bool ();
      console.log (i);

  @method bool
  @return {Boolean}
  */
  Randomizer.prototype.bool = function () {
    return random () > 0.5;
  };

  /**
  Return an integer within [min, max).

      var r = new Randomizer (1337);
      var i = r.range (23, 42);
      console.log (i);

  @method range
  @param {int} min
  @param {int} max
  @return {int}
  */
  Randomizer.prototype.range = function (min, max) {
    return this.int (max - min) + min;
  };

  /**
  Return a float within [min, max).

      var r = new Randomizer (1337);
      var i = r.rangef (1.618, 3.141);
      console.log (i);

  @method rangef
  @param {int} min
  @param {int} max
  @return {int}
  */
  Randomizer.prototype.rangef = function (min, max) {
    return (this.float () * (max - min)) + min;
  };

  /**
  Pick an element from the source.

      var r = new Randomizer (1337);
      var i = r.pick (['han', 'lea', 'luke']);
      console.log (i);

  @method pick
  @param {mixed[]} source
  @return {mixed}
   */
  Randomizer.prototype.pick = function (source) {
    return source[this.range (0, source.length)];
  };

  return Randomizer;

}) ();
