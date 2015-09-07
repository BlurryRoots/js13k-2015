var AppLauncher = require ('./applauncher');
var Game = require ('./game');
var Util = require ('./util');

var canvas = document.querySelector ('#game');
var ctx = canvas.getContext ('2d');
canvas.width = 1920;
canvas.height = 1080;
ctx.font = '48px serif';
ctx.textBaseline = 'bottom';

var launcher = new AppLauncher (canvas);
var game = new Game ();
launcher.start (game);
