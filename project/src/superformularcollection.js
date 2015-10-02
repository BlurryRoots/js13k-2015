/**
* @module SuperformularCollection
*/
module.exports = (function () {

  // Import modules
  var Util = require ('./util');
  var Color = require ('./color');
  var Vector2 = require ('./vector2');

  // Private variables
  var _collection = [];
  var _currentFormularIndex = 0;
  var _elapsedTime = 0;
  var _vertices = [];
  var _res = 360;
  var _fillColor = new Color (0, 0, 0);
  var _zoom = 150;
  var _transitionTime = 1;

  /**
   * Creates a new Color
   *
   * @class SuperformularCollection
   * @constructor
   * @param {float} transitionTime Time between each transition
   *
   */
  function SuperformularCollection (transitionTime) {
    transitionTime = transitionTime || _transitionTime;

    _transitionTime = transitionTime;
  }

  /**
   * Adds new formular to collection.
   *
   * @method add
   * @param {Superformular} formular Superformular.
   * @param {Color} color Color used to fill this superformular.
   *
   */
  SuperformularCollection.prototype.add = function (formular, color) {
    _collection.push ({
      formular: formular,
      color: color,
    });
  };

  /**
   * Iterates each formular in the collection.
   *
   * @method each
   * @param {Function} callback Callback used each iteration step.
   *
   */
  SuperformularCollection.prototype.each = function (callback) {
    _collection.forEach (function (v) {
      callback (v.formular, v.color);
    });
  };

  /**
   * Updates this collections state.
   *
   * @method update
   * @param {float} dt Time between this and last update.
   *
   */
  SuperformularCollection.prototype.update = function (dt) {
    _elapsedTime += dt;

    if (_elapsedTime > _transitionTime) {
      _elapsedTime = 0;

      var nextIndex = _currentFormularIndex + 1;
      _currentFormularIndex = nextIndex >= _collection.length
        ? 0
        : nextIndex
        ;
    }

    var tansitionFormularIndex = _currentFormularIndex + 1;
    if (tansitionFormularIndex >= _collection.length) {
      tansitionFormularIndex = 0;
    }

    var sf1 = _collection[_currentFormularIndex].formular;
    var sf2 = _collection[tansitionFormularIndex].formular;

    var shapePointDistance = 10;
    var shapePointDistance2 = shapePointDistance * shapePointDistance;

    _vertices = [];
    for (var i = 1; i <= _res; ++i) {
      var radians = (i / _res) * (2 * Math.PI);
      // move point 2 shapePointDistance from point 1d
      // can i cut the center of the shape? or do i have to
      // get a 'bend' shape by connecting the end points ?
      var point1 = sf1.calculatePoint (radians, 1);
      var point2 = sf2.calculatePoint (radians, 1);

      var x = Util.linearInterpolation (
        point1.x, point2.x, _elapsedTime, _transitionTime
      );
      var y = Util.linearInterpolation (
        point1.y, point2.y, _elapsedTime, _transitionTime
      );

      _vertices.push (new Vector2 (x, y));
    }

    var sf1color = _collection[_currentFormularIndex].color;
    var sf2color = _collection[tansitionFormularIndex].color;
    _fillColor = sf1color.interpolate (sf2color, _elapsedTime, _transitionTime);
  };

  /**
   * Draws this collection to given canvas.
   *
   * @method draw
   * @param {Object} ctx Canvas context.
   *
   */
  SuperformularCollection.prototype.draw = function (ctx) {
    ctx.save ();
    ctx.translate (ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.scale (_zoom, _zoom);
    ctx.beginPath ();
    _vertices.forEach (function (v) {
      ctx.lineTo (v.x, v.y);
    });
    ctx.closePath ();
    ctx.restore ();

    var fillStyleBuffer = ctx.fillStyle;
    ctx.fillStyle = _fillColor.toHex ();
    ctx.fill ();
    ctx.fillStyle = fillStyleBuffer;
  };

  return SuperformularCollection;

}) ();
