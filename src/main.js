/*
Basis for AppLauncher and Randomizer by ooflorent at https://github.com/ooflorent/js13k-boilerplate
*/
var Util = require ('./util');
var Randomizer = require ('./randomizer');
var Superformular = require ('./superformular');
var Color = require ('./color');
var AppLauncher = require ('./applauncher');
var SuperformularCollection = require ('./superformularcollection');

var Debug = {
  log: function (msg) {
    //console.log (msg);
    var logger = document.querySelector ('#log');
    logger.textContent = msg;
  }
}

var Game = function () {
  var rand = new Randomizer (1337);
  var sfc = new SuperformularCollection (4.2);

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

var launcher = new AppLauncher (canvas);
launcher.start (Game ());