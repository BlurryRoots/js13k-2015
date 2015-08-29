/*
Basis for AppLauncher and Randomizer by ooflorent at https://github.com/ooflorent/js13k-boilerplate
*/

var Debug = {
  log: function (msg) {
    console.log (msg);
  }
}

var AppLauncher = function () {
  // Holds last iteration timestamp.
  var time = 0;

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
      var elapsed = now - time;

      if (elapsed > 999) {
        elapsed = 1 / 60;
      }
      else {
        elapsed /= 1000;
      }

      time = now;
      fn (elapsed);
    };

    return window.requestAnimationFrame (onAnimationFrame);
  }

  return {
    /**
     * Calls `fn` on every frame with `elapsed` set to the elapsed
     * time in milliseconds.
     *
     * @param  {Function} fn The function
     * @return {int} The request ID
     * @api public
     */
    start: function (fn) {
      return callNextFrame (function tick (elapsed) {
        fn (elapsed);
        callNextFrame (tick);
      });
    },

    /**
     * Cancels the specified animation frame request.
     *
     * @param {int} id The request ID
     * @api public
     */
    stop: function (id) {
      window.cancelAnimationFrame (id);
    }
  };
}

var Randomizer = function (seed) {

  function random () {
    var x = Math.sin (0.8765111159592828 + seed++) * 1e4
    return x - Math.floor (x)
  }

  var rng = {
    /**
     * Return an integer within [0, max).
     *
     * @param  {int} [max]
     * @return {int}
     * @api public
     */
    int: function (max) {
      return random () * (max || 0xfffffff) | 0;
    },

    /**
     * Return a float within [0.0, 1.0).
     *
     * @return {float}
     * @api public
     */
    float: function () {
      return random ();
    },

    /**
     * Return a boolean.
     *
     * @return {Boolean}
     * @api public
     */
    bool: function () {
      return random () > 0.5;
    },

    /**
     * Return an integer within [min, max).
     *
     * @param  {int} min
     * @param  {int} max
     * @return {int}
     * @api public
     */
    range: function (min, max) {
      return rng.int (max - min) + min;
    },

    /**
     * Pick an element from the source.
     *
     * @param  {mixed[]} source
     * @return {mixed}
     * @api public
     */
    pick: function (source) {
      return source[rng.range (0, source.length)];
    }
  };

  return rng;
};

var Superformular = function (m, a, b, n1, n2, n3) {
  return {
    m: m,
    a: a,
    b: b,
    n1: n1,
    n2: n2,
    n3: n3,
    calculate_point: function (angle) {
      var rpart = (this.m * angle) / 4;
      var apart = Math.abs (Math.cos (rpart) / this.a);
      var bpart = Math.abs (Math.sin (rpart) / this.b);

      var r = Math.pow (
        Math.pow (apart, this.n2) + Math.pow (bpart, this.n3),
        -1 / this.n1
      )

      return {
        x: Math.cos (angle) * r,
        y: Math.sin (angle) * r
      };
    },
  }
}

var canvas = document.querySelector ('#game');
var ctx = canvas.getContext ('2d');
var rand = Randomizer (1337);

function renderSuperFormular (elapsed) {
  var sf = Superformular (3, 1, 1, 2, 8, 3);

  var vertices = [];
  var res = 360;
  for (var i = 1; i <= res; ++i) {
    var radians = (i / res) * (2 * Math.PI);
    var point = sf.calculate_point (radians, 1);

    vertices.push (point);
  }

  var zoom = 100;
  var offset = {
    x: 400,
    y: 300,
  };

  ctx.beginPath ();
  var isFirst = true;
  vertices.forEach (function (v) {
    var x = v.x * zoom + offset.x;
    var y = v.y * zoom + offset.y;

    if (isFirst) {
      isFirst = false;
      ctx.moveTo (x, y);
    }
    else {
      ctx.lineTo (x, y);
    }
  });
  ctx.closePath ();
  ctx.fillStyle = "#FFDC00";
  ctx.fill ();
}

var app = AppLauncher ();
app.start (renderSuperFormular);
