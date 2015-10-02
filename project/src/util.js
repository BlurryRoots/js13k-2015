/**
* @module Util
*/
module.exports = (function () {

  // Import vector module
  var Vector2 = require ('./vector2');

  /**
  * Does a linear interpolation.
  *
  * @class Util
  *
  */
  var Util = {}

  /**
  * Does a linear interpolation.
  *
  * @method linearInterpolation
  * @param {float} from Value to start interpolating from.
  * @param {float} to Value to interpolate towards.
  * @param {float} currentTime Current time.
  * @param {float} interval Interpolation interval.
  * @return {float} Interpolated value.
  *
  */
  Util.linearInterpolation = function (from, to, currentTime, intervalLength) {
    return ((to - from) * (currentTime / intervalLength)) + from;
  };

  /**
  * Converts degrees to radians.
  *
  * @method degToRad
  * @param {float} deg Angle in degrees.
  * @return {float} Angle in radians.
  *
  */
  Util.degToRad = function (deg) {
    return (deg / 360) * (2 * Math.PI);
  };

  /**
  * Converts radians to degrees.
  *
  * @method radToDeg
  * @param {float} rad Angle in radians.
  * @return {float} Angle in degrees.
  *
  */
  Util.radToDeg = function (rad) {
    return (rad / (2 * Math.PI)) * 360;
  };

  /**
  * Rounds number to a number of significant digits.
  *
  * @method roundSig
  * @param {float} num Value to round.
  * @param {float} sig Precision.
  * @return {float} Rounded value.
  *
  */
  Util.roundSig = function (num, sig) {
    sig = sig || 2;
    var posExp = "e+" + sig.toString ();
    var negExp = "e-" + sig.toString ();
    return +(Math.round (num + posExp) + negExp);
  }

  /**
  * Rounds number to two significant digits.
  *
  * @method roundToTwo
  * @param {float} num Value to round.
  * @return {float} Rounded value.
  *
  */
  Util.roundToTwo = function (num) {
    // THIS IS SUCH A MESSY HACK!
    //return +(Math.round (num + "e+2") + "e-2");
    Util.roundSig (num, 2);
  };

  /**
  * Tries to calculate the height of a character of the current font.
  * (only really works when font is given in pixels!)
  *
  * @method fontHeight
  * @param {Object} ctx Canvas object.
  * @return {int} Height in pixels.
  *
  */
  Util.fontHeight = function (ctx) {
    // good enough i guess (only really works when font is given in pixels!)
    return parseInt (ctx.font);
  };

  /**
  * Translates a client position (e.g. mouse over canvas) to the position
  * inside canvas space.
  *
  * @method clientToCanvasPosition
  * @param {Object} canvas Canvas object.
  * @param {Vector2} clientPosition Client position.
  * @return {Vector2} Position in canvas space.
  *
  */
  Util.clientToCanvasPosition = function (canvas, clientPosition) {
    var scale = new Vector2 (
      canvas.width / canvas.clientWidth,
      canvas.height / canvas.clientHeight
    );

    var x = (clientPosition.x + canvas.offsetLeft) * scale.x;
    var y = (clientPosition.y + canvas.offsetTop) * scale.y;

    return new Vector2 (x, y);
  };

  /**
  * Checks whether browser supports local storage.
  *
  * @method supportsLocalStorage
  * @return {bool} True if local storage is supported.
  *
  */
  Util.supportsLocalStorage = function () {
    // inspired by http://diveintohtml5.info/storage.html
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    }
    catch (e) {
      return false;
    }
  };

  /**
  * Checks if given object has handle with given name.
  *
  * @method hasHandler
  * @param {Object} obj Object to check.
  * @param {String} handlerName Handler name.
  * @return {bool} True if object has handler.
  *
  */
  Util.hasHandler = function (obj, handlerName) {
    return 'function' === typeof obj[handlerName];
  };

  /**
  * Registers function as handler on element.
  *
  * @method registerEventHandler
  * @param {Object} element Object to attach handler to.
  * @param {String} handlerName Handler name.
  * @param {Function} handler Handler function.
  *
  */
  Util.registerEventHandler = function (element, handlerName, handler) {
    console.log ('registering ' + handlerName);
    // fix element attached to window
    var fixedEvent = function (e) {
      e = e || window.event;
      var callback = handler;
      callback (e);
    };

    element[handlerName] = fixedEvent;

    // TODO: why is this not working?
    /*if (element.addEventListener) {
      element.addEventListener (handlerName, fixedEvent, false);
    } else {
      element.attachEvent (handlerName, fixedEvent);
    };*/
  };

  /**
  * Best effort to figure out the type of given object.
  * Returns undefined if object is not a 'class'.
  *
  * @method typeof
  * @param {Object} obj Value to check
  * @return {String} Type name.
  *
  */
  Util.typeof = function (obj) {
    // taken from php.js' get_class
    /*
    Copyright (c) 2013 Kevin van Zonneveld (http://kvz.io)
    and Contributors (http://phpjs.org/authors)

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
    of the Software, and to permit persons to whom the Software is furnished to do
    so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
    // http://kevin.vanzonneveld.net
    // +   original by: Ates Goral (http://magnetiq.com)
    // +   improved by: David James
    // +   improved by: David Neilsen
    // *     example 1: get_class(new (function MyClass() {}));
    // *     returns 1: "MyClass"
    // *     example 2: get_class({});
    // *     returns 2: "Object"
    // *     example 3: get_class([]);
    // *     returns 3: false
    // *     example 4: get_class(42);
    // *     returns 4: false
    // *     example 5: get_class(window);
    // *     returns 5: false
    // *     example 6: get_class(function MyFunction() {});
    // *     returns 6: false
    if (obj
    && typeof obj === 'object'
    && Object.prototype.toString.call(obj) !== '[object Array]'
    && obj.constructor && obj !== this.window) {
      var arr = obj.constructor.toString().match(/function\s*(\w+)/);

      if (arr && arr.length === 2) {
        return arr[1];
      }
    }

    return undefined;
  };

  return Util;

}) ();
