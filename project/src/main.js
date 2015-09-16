var AppLauncher = require ('./applauncher');
var Game = require ('./game');
//var Game = require ('./transitionapp');
var Util = require ('./util');
var Font = require ('./font');

var canvas = document.querySelector ('#game');
canvas.width = 1920;
canvas.height = 1080;
canvas.aspect = canvas.width / canvas.height
var ctx = canvas.getContext ('2d');
ctx.font = new Font ('lucida', 64, 'bold').toString ();
ctx.textBaseline = 'top';

var launcher = new AppLauncher (canvas);
var game = new Game (canvas);
launcher.start (game);
