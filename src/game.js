module.exports = (function () {
  Util = require ('./util');
  Vector2 = require ('./vector2');

  var _text;
  var _clickPos;

  function GameClass (canvas) {
    _text = 'what the shit?';
    _canvas = canvas;
  }

  GameClass.prototype.onupdate = function (dt) {

  };

  GameClass.prototype.onrender = function (ctx) {
    ctx.clearRect (0, 0, ctx.canvas.width, ctx.canvas.height);

    if (_clickPos) {
      var p = Util.clientToCanvasPosition (_canvas, _clickPos);
      ctx.fillText (_text, p.x, p.y);
    }
  };

  GameClass.prototype.onmousedown = function (e) {
    console.log (e);

    _clickPos = new Vector2 (e.clientX, e.clientY);
  };

  return GameClass;

}) ();
