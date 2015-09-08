/*
Basis for AppLauncher and Randomizer by ooflorent at https://github.com/ooflorent/js13k-boilerplate
*/

module.exports = (function () {
  // Holds last iteration timestamp.
  var _time;
  var _ctx;
  var _options;

  /**
   * Calls `fn` on next frame.
   *
   * @param  {Function} fn The function
   * @return {int} The request ID
   * @api private
   */
  function _callNextFrame (fn) {
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

  function _register (element, game, handlerName) {
    if ('function' === typeof game[handlerName]) {
      console.log ('registering ' + handlerName);
      // fix element attached to window
      element[handlerName] = function (e) {
        var handler = game[handlerName];
        e = e || window.event;
        handler (e);
      };
    }
  }

  function _registerMouseHandlers (element, game) {
    // onclick   Invoked when the user clicked on the object.
    _register (element, game, 'onclick');
    // onmousedown   The cursor moved over the object and mouse/pointing device was pressed down.
    _register (element, game, 'onmousedown');
    // onmousemove   The cursor moved while hovering over an object.
    _register (element, game, 'onmousemove');
    // onmouseup   The mouse/pointing device was released after being pressed down.
    _register (element, game, 'onmouseup');
  }

  function _registerKeyHandlers (element, game) {
    // onkeydown   Invoked when a key was pressed over an element.
    _register (element, game, 'onkeydown');
    // onkeypress  Invoked when a key was pressed over an element then released.
    _register (element, game, 'onkeypress');
    // onkeyup   Invoked when a key was released over an element.
    _register (element, game, 'onkeyup');
  }

  /**
   * Constructor.
   * @param {domElement} The canvas element
   * @api public
   */
  var AppLauncherClass = function (canvas, options) {
    _time = 0;
    _ctx = canvas.getContext ('2d');
    _options = options || {
      aspect: 1.7777777777777777
    };
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
    _registerMouseHandlers (_ctx.canvas, game);
    _registerKeyHandlers (document, game);

    /*document.body.onresize = function (e) {
      _ctx.canvas.width = _ctx.canvas.clientWidth;
      _ctx.canvas.height = _ctx.canvas.width / _options.aspect;
    };*/

    return _callNextFrame (function tick (elapsed) {
      game.onupdate (elapsed);
      game.onrender (_ctx);
      // call again later
      _callNextFrame (tick);
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
