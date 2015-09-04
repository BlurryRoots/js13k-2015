module.exports = (function () {
  var Util = require ('./util');
  var Color = require ('./color');

  var _collection = [];
  var _currentFormularIndex = 0;
  var _elapsedTime = 0;
  var _vertices = [];
  var _res = 360;
  var _fillColor = new Color (0, 0, 0);
  var _zoom = 150;
  var _transitionTime = 1;

  var SuperformularCollectionClass = function (transitionTime) {
    _transitionTime = transitionTime;
  }

  SuperformularCollectionClass.prototype.add = function (formular, color) {
    _collection.push ({
      formular: formular,
      color: color,
    });
  };
  SuperformularCollectionClass.prototype.each = function (callback) {
    _collection.forEach (function (v) {
      callback (v.formular, v.color);
    });
  };

  SuperformularCollectionClass.prototype.update = function (dt) {
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

    _vertices = [];
    for (var i = 1; i <= _res; ++i) {
      var radians = (i / _res) * (2 * Math.PI);
      var point1 = sf1.calculate_point (radians, 1);
      var point2 = sf2.calculate_point (radians, 1);

      _vertices.push ({
        x: Util.linearInterpolation (point1.x, point2.x, _elapsedTime, _transitionTime),
        y: Util.linearInterpolation (point1.y, point2.y, _elapsedTime, _transitionTime),
      });
    }

    var sf1color = _collection[_currentFormularIndex].color;
    var sf2color = _collection[tansitionFormularIndex].color;
    _fillColor = sf1color.interpolate (sf2color, _elapsedTime, _transitionTime);
  };

  SuperformularCollectionClass.prototype.draw = function (ctx) {
    ctx.save ();
    ctx.translate (ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.scale (_zoom, _zoom);
    ctx.beginPath ();
    _vertices.forEach (function (v) {
      ctx.lineTo (v.x, v.y);
    });
    ctx.closePath ();
    ctx.restore ();

    ctx.fillStyle = _fillColor.toHex ();
    ctx.fill ();
  };

  return SuperformularCollectionClass;

}) ();
