var AppLauncher = require ('./applauncher');
var TransitionApp = require ('./transitionapp');

var canvas = document.querySelector ('#game');
canvas.width = 1920;
canvas.height = 1080;
canvas.getContext ('2d').font = "48px serif";

var launcher = new AppLauncher (canvas);
launcher.start (new TransitionApp ());
