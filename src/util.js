module.exports = (function () {

  var Util = {}

  Util.linearInterpolation = function (from, to, currentTime, intervalLength) {
    return ((to - from) * (currentTime / intervalLength)) + from;
  };

  Util.degToRad = function (deg) {
    return (deg / 360) * (2 * Math.PI);
  };

  Util.radToDeg = function (rad) {
    return (rad / (2 * Math.PI)) * 360;
  };

  Util.roundToTwo = function (num) {
    // THIS IS SUCH A MESSY HACK!
    return +(Math.round (num + "e+2") + "e-2");
  };

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
  }

  return Util;

}) ();
