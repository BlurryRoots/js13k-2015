/*
Basis for AppLauncher and Randomizer by ooflorent at https://github.com/ooflorent/js13k-boilerplate
*/
var Util = require ('./util');
var Randomizer = require ('./randomizer');
var Superformular = require ('./superformular');
var Color = require ('./color');

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
          x: Util.linearInterpolation (point1.x, point2.x, elapsedTime, transitionTime),
          y: Util.linearInterpolation (point1.y, point2.y, elapsedTime, transitionTime),
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
canvas.width = 1920;
canvas.height = 1080;

var launcher = AppLauncher (canvas);
launcher.start (Game ());
