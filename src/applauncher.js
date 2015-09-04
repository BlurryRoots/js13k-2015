module.exports = (function () {
  // Holds last iteration timestamp.
  var _time;
  var _ctx;

  /**
   * Calls `fn` on next frame.
   *
   * @param  {Function} fn The function
   * @return {int} The request ID
   * @api private
   */
  function callNextFrame (fn) {
    var onAnimationFrame = function () {
      var now = Date.now ();
      var elapsed = now - _time;

      if (elapsed > 999) {
        elapsed = 1 / 60;
      }
      else {
        elapsed /= 1000;
      }

      _time = now;
      fn (elapsed);
    };

    return window.requestAnimationFrame (onAnimationFrame);
  }

  var AppLauncherClass = function (canvas) {
    _time = 0;
    _ctx = canvas.getContext ('2d');
  }

  /**
   * Calls `fn` on every frame with `elapsed` set to the elapsed
   * time in milliseconds.
   *
   * @param  {Function} fn The function
   * @return {int} The request ID
   * @api public
   */
  AppLauncherClass.prototype.start = function (game) {
    return callNextFrame (function tick (elapsed) {
      game.update (elapsed);
      game.render (_ctx);
      // call again later
      callNextFrame (tick);
    });
  };

  /**
   * Cancels the specified animation frame request.
   *
   * @param {int} id The request ID
   * @api public
   */
  AppLauncherClass.prototype.stop = function (id) {
    window.cancelAnimationFrame (id);
  };

  return AppLauncherClass;
}) ();
