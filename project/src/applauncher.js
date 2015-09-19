/**
* @module AppLauncher
*/
module.exports = (function () {
  // inspired by ooflorent at https://github.com/ooflorent/js13k-boilerplate
  var Util = require ('./util');

  // Holds last iteration timestamp.
  var _time;
  var _ctx;
  var _options;

  /**
   * Calls `fn` on next frame.
   *
   * @method _callNextFrame
   * @param  {Function} fn The function
   * @return {int} The request ID
   *
   * @private
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

  /**
  * Checks weather obj has a specific handler.
  *
  * @method _hasHandler
  * @param {Object} obj The object to check.
  * @param {string} handlerName The name of the function to check for.
  * @return {Boolean} True if obj has handler set.
  *
  * @private
  */
  function _hasHandler (obj, handlerName) {
    return 'function' === typeof obj[handlerName];
  }

  function _registerMouseWheelHandler (element, handler) {
    var handleEventFix = function (e) {
      // fix event not present
      e = e || window.event;

      // normalize the value between vendors
      if (e.wheelDelta) {
        e.wheelValue = -1 * e.wheelDelta / 40;
      }
      else {
        e.wheelValue = e.detail;
      }

      handler (e);
    }

    // from post http://www.sitepoint.com/html5-javascript-mouse-wheel/
    if (element.addEventListener) {
      // IE9, Chrome, Safari, Opera
      element.addEventListener ("mousewheel", handleEventFix, false);
      // Firefox
      element.addEventListener ("DOMMouseScroll", handleEventFix, false);
    }
    // IE 6/7/8
    else {
      element.attachEvent ("onmousewheel", handleEventFix);
    }
  }

  function _register (element, game, handlerName) {
    if (Util.hasHandler (game, handlerName)) {
      Util.registerEventHandler (element, handlerName, game[handlerName]);
    }
  }

  function _registerLocalStorage (element, game) {
    if (Util.supportsLocalStorage ()) {
      if (Util.hasHandler (game, 'onstorage')) {
        var handler = game['onstorage'];
        Util.registerEventHandler (element, 'storage', function (e) {
          /*
            e.key string  the named key that was added, removed, or modified
            e.oldValue  any the previous value (now overwritten), or null if a new item was added
            e.newValue  any the new value, or null if an item was removed
            e.url*  string  the page which called a method that triggered this change
            * Note: the url property was originally called uri.
              Some browsers shipped with that property before the specification changed.
              For maximum compatibility, you should check whether the url property exists,
              and if not, check for the uri property instead.
          */
          e.url = e.url || u.uri;
          handler (e);
        });
      }
    }
    else {
      throw new Error ('You do not support local storage?! C\'mon!');
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

    if (_hasHandler (game, 'onmousewheel')) {
      // onmousewheel   Invoked when the mouse wheel is being rotated.
      _registerMouseWheelHandler (element, game['onmousewheel']);
    }
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
   * Creates a new AppLauncher
   *
   * @class AppLauncher
   * @constructor
   * @param {domElement} canvas The canvas element
   * @param {Object} [options] Options to apply befor running an app.
   */
  var AppLauncher = function (canvas, options) {
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
   * @method start
   * @param  {Function} fn The function
   * @return {int} The request ID
   */
  AppLauncher.prototype.start = function (game) {
    _registerMouseHandlers (_ctx.canvas, game);
    _registerKeyHandlers (document, game);
    /*_registerLocalStorage (window, game);*/

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
   * @method stop
   * @param {int} id The request ID
   */
  AppLauncher.prototype.stop = function (id) {
    window.cancelAnimationFrame (id);
  };

  return AppLauncher;
}) ();
