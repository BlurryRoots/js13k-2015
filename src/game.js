module.exports = (function () {
  Util = require ('./util');

  var _text;

  function GameClass () {
    _text = 'what the shit?';
  }

  GameClass.prototype.onupdate = function (dt) {

  };

  GameClass.prototype.onrender = function (ctx) {
    var height = Util.fontHeight (ctx);

    ctx.fillText (_text, 10, height);
  };

  return GameClass;

}) ();
