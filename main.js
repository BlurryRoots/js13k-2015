/*
Basis for AppLauncher and Randomizer by ooflorent at https://github.com/ooflorent/js13k-boilerplate
*/

function linearInterpolation (from, to, currentTime, intervalLength) {
  return ((to - from) * (currentTime / intervalLength)) + from;
}

var Debug = {
  log: function (msg) {
    //console.log (msg);
    var logger = document.querySelector ('#log');
    logger.textContent = msg;
  }
}

var AppLauncher = function (canvas) {
  // Holds last iteration timestamp.
  var time = 0;
  var ctx = canvas.getContext ('2d');

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
    start: function (game) {
      return callNextFrame (function tick (elapsed) {
        game.update (elapsed);
        game.render (ctx);
        // call again later
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

var Randomizer = (function () {
  var _seed = 0;

  function random () {
    var x = Math.sin (0.8765111159592828 + _seed++) * 1e4
    return x - Math.floor (x)
  }

  var RandomizerClass = function (seed) {
    _seed = seed;
  }

  /**
   * Return an integer within [0, max).
   *
   * @param  {int} [max]
   * @return {int}
   * @api public
   */
  RandomizerClass.prototype.int = function (max) {
    return random () * (max || 0xfffffff) | 0;
  };

  /**
   * Return a float within [0.0, 1.0).
   *
   * @return {float}
   * @api public
   */
  RandomizerClass.prototype.float = function () {
    return random ();
  };

  /**
   * Return a boolean.
   *
   * @return {Boolean}
   * @api public
   */
  RandomizerClass.prototype.bool = function () {
    return random () > 0.5;
  };

  /**
   * Return an integer within [min, max).
   *
   * @param  {int} min
   * @param  {int} max
   * @return {int}
   * @api public
   */
  RandomizerClass.prototype.range = function (min, max) {
    return this.int (max - min) + min;
  };

  /**
   * Pick an element from the source.
   *
   * @param  {mixed[]} source
   * @return {mixed}
   * @api public
   */
  RandomizerClass.prototype.pick = function (source) {
    return source[this.range (0, source.length)];
  };

  return RandomizerClass;
}) ();



var Superformular = (function () {
  var SuperformularClass = function (m, n1, n2, n3, a, b) {
    if (!a || a <= 0) a = 1;
    if (!b || b <= 0) b = 1;

    this.m = m;
    this.n1 = n1;
    this.n2 = n2;
    this.n3 = n3;
    this.a = a; // stretch in -x
    this.b = b; // stretch in +x
  }

  SuperformularClass.prototype.calculate_point = function (angle) {
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
  };

  return SuperformularClass;
}) ();

var Color = (function () {
  function componentToHexString (comp) {
    var str = comp.toString (16);

    return str.length == 1
      ? "0" + str
      : str
      ;
  }

  function checkComponent (x) {
    var c = x || 0;

    if (255 < c) return 255;
    if (0 > c) return 0;

    return c;
  }

  var Color = function (r, g, b) {
    this.r = checkComponent (r);
    this.g = checkComponent (g);
    this.b = checkComponent (b);
  }

  Color.prototype.toHex = function () {
    return "#"
      + componentToHexString (this.r)
      + componentToHexString (this.g)
      + componentToHexString (this.b)
      ;
  };

  Color.prototype.interpolate = function (other, currentTime, intervalLength) {
    return new Color (
      Math.floor (linearInterpolation (this.r, other.r, currentTime, intervalLength)),
      Math.floor (linearInterpolation (this.g, other.g, currentTime, intervalLength)),
      Math.floor (linearInterpolation (this.b, other.b, currentTime, intervalLength))
    );
  };

  return Color;

}) ();

var SuperformularCollection = function (transitionTime) {
  var collection = [];
  var currentFormularIndex = 0;
  var elapsedTime = 0;
  var vertices = [];
  var res = 360;
  var fillColor = new Color (0, 0, 0);
  var zoom = 150;

  return {
    add: function (formular, color) {
      collection.push ({
        formular: formular,
        color: color,
      });
    },
    each: function (callback) {
      collection.forEach (function (v) {
        callback (v.formular, v.color);
      });
    },
    update: function (dt) {
      elapsedTime += dt;

      if (elapsedTime > transitionTime) {
        elapsedTime = 0;

        var nextIndex = currentFormularIndex + 1;
        currentFormularIndex = nextIndex >= collection.length
          ? 0
          : nextIndex
          ;
      }

      var tansitionFormularIndex = currentFormularIndex + 1;
      if (tansitionFormularIndex >= collection.length) {
        tansitionFormularIndex = 0;
      }

      var sf1 = collection[currentFormularIndex].formular;
      var sf2 = collection[tansitionFormularIndex].formular;

      vertices = [];
      for (var i = 1; i <= res; ++i) {
        var radians = (i / res) * (2 * Math.PI);
        var point1 = sf1.calculate_point (radians, 1);
        var point2 = sf2.calculate_point (radians, 1);

        vertices.push ({
          x: linearInterpolation (point1.x, point2.x, elapsedTime, transitionTime),
          y: linearInterpolation (point1.y, point2.y, elapsedTime, transitionTime),
        });
      }

      var sf1color = collection[currentFormularIndex].color;
      var sf2color = collection[tansitionFormularIndex].color;
      fillColor = sf1color.interpolate (sf2color, elapsedTime, transitionTime);
    },
    draw: function (ctx) {
      ctx.save ();
      ctx.translate (canvas.width / 2, canvas.height / 2);
      ctx.scale (zoom, zoom);
      ctx.beginPath ();
      vertices.forEach (function (v) {
        ctx.lineTo (v.x, v.y);
      });
      ctx.closePath ();
      ctx.restore ();

      ctx.fillStyle = fillColor.toHex ();
      ctx.fill ();
    },
  }
}



var Game = function () {
  var rand = new Randomizer (1337);
  var sfc = SuperformularCollection (4.2);

  function pickColor () {
    return new Color (
      rand.range (0, 256),
      rand.range (0, 256),
      rand.range (0, 256)
    );
  }

  var shapeValues = [
    /*[[3, 2, 8, 3], new Color (128, 0, 0)],
    [[10, 10, 8, 7], new Color (0, 128, 0)],
    [[23, 10, 8, 7], new Color (0, 0, 128)],
    [[1, 1, 1, 1], pickColor ()],
    [[23, 23, 23, 23], pickColor ()], */
    [[3, 5, 18, 18], pickColor ()],
    [[6, 20, 7, 18], pickColor ()],
    [[4, 2, 4, 13], pickColor ()],
    [[7, 3, 4, 17], pickColor ()],
    [[7, 3, 6, 6], pickColor ()],
    [[3, 3, 14, 2], pickColor ()],
    [[19, 9, 14, 11], pickColor ()],
    [[12, 15, 20, 3], pickColor ()],
    [[8, 1, 1, 8], pickColor ()],
    [[8, 1, 5, 8], pickColor ()],
    [[8, 3, 4, 3], pickColor ()],
    [[8, 7, 8, 2], pickColor ()],
    [[5, 2, 6, 6], pickColor ()],
    [[6, 1, 1, 6], pickColor ()],
    [[6, 1, 7, 8], pickColor ()],
    [[7, 2, 8, 4], pickColor ()],
    [[3, 2, 8, 3], pickColor ()],
    [[3, 6, 6, 6], pickColor ()],
    [[4, 1, 7, 8], pickColor ()],
    [[4, 4, 7, 7], pickColor ()],
    [[2, 2, 2, 2], pickColor ()],
    [[2, 1, 1, 1], pickColor ()],
    [[2, 1, 4, 8], pickColor ()],
    [[3, 2, 5, 7], pickColor ()],
  ];

  shapeValues.forEach (function (entry) {
    var m = entry[0][0];
    var n1 = entry[0][1];
    var n2 = entry[0][2];
    var n3 = entry[0][3];
    var color = entry[1];

    sfc.add (new Superformular (m, n1, n2, n3), color);
  });

  return {
    update: function (dt) {
      sfc.update (dt);
    },
    render: function (ctx) {
      ctx.clearRect (0, 0, canvas.width, canvas.height);

      sfc.draw (ctx);
    },
  }
};

var canvas = document.querySelector ('#game');
var launcher = AppLauncher (canvas);

launcher.start (Game ());
