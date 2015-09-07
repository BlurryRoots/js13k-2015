module.exports = (function () {

  var Util = require ('./util');
  var Randomizer = require ('./randomizer');
  var Superformular = require ('./superformular');
  var Color = require ('./color');
  var SuperformularCollection = require ('./superformularcollection');
  var ShapeDataBase = require ('./shapedatabase.js');

  var _randomizer;
  var _shapeValues = [];
  var _sfc = new SuperformularCollection (4.2);
  var _timeRunning = 0;
  var _frames = 0;

  function TransitionApp () {
    _randomizer = new Randomizer (Date.now ());

    function pickColor () {
      return new Color (
        _randomizer.range (0, 256),
        _randomizer.range (0, 256),
        _randomizer.range (0, 256)
      );
    }

    var db = new ShapeDataBase ();
    db.shapes.forEach (function (shape) {
      _shapeValues.push ([shape, pickColor ()]);
    });

    _shapeValues.sort (function (a, b) {
      return _randomizer.pick ([-1, 0, 1]);
    });

    _shapeValues.forEach (function (entry) {
      var m = entry[0][0];
      var n1 = entry[0][1];
      var n2 = entry[0][2];
      var n3 = entry[0][3];
      var a = entry[0][4]; // undefined by default
      var b = entry[0][5]; // undefined by default
      var color = entry[1];

      _sfc.add (new Superformular (m, n1, n2, n3, a, b), color);
    });
  }

  TransitionApp.prototype.update = function (dt) {
    _timeRunning += dt;
    ++_frames;

    _sfc.update (dt);
  };

  TransitionApp.prototype.render = function (ctx) {
    var canvas = ctx.canvas;

    ctx.clearRect (0, 0, canvas.width, canvas.height);
    _sfc.draw (ctx);

    ctx.fillStyle = new Color (0, 0, 0).toHex ();
    var text = 't in s: ' + Util.roundToTwo (_timeRunning).toString ();
    ctx.fillText (text, 10, 50);
    text = '@ ' + Util.roundToTwo (_frames / _timeRunning).toString () + ' fps';
    ctx.fillText (text, 10, 50 + 48 + 10);
  };

  return TransitionApp;

}) ();
