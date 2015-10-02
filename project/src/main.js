var AppLauncher = require ('./applauncher');
var Game = require ('./game');
var Util = require ('./util');
var Font = require ('./font');

// Select canvas element and set the size of the render context
// as well as the aspect ration
var canvas = document.querySelector ('#game');
canvas.width = 1920;
canvas.height = 1080;
canvas.aspect = canvas.width / canvas.height

// Customize the font settings used by canvas' 2D context
var ctx = canvas.getContext ('2d');
ctx.font = new Font ('lucida', 256, 'bold').toString ();
ctx.textBaseline = 'top';

// Create a new launcher and start the game with it
var launcher = new AppLauncher (canvas);
var game = new Game (canvas);
launcher.start (game);
