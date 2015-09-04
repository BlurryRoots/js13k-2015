#!/usr/bin/env node

function inlineScriptAndCss (app, css, outfile) {
  var fs = require ('fs');
  var hbs = require ('handlebars');

  var source = fs.readFileSync ('src/index.html').toString ();
  var template = hbs.compile (source);

  var data = {
    "app": fs.readFileSync (app).toString (),
    "css": fs.readFileSync (css).toString ()
  };

  var result = template (data);
  var str = result.toString ();

  fs.writeFileSync (outfile, str);
}

function main (isDebug) {
  console.log ('Building ' + (isDebug ? 'debug' : 'release'));
  var app = 'build/' +
    ((! isDebug) ? 'app.compressed.js' : 'app.js')
    ;
  var css = 'resources/game.css';
  var outfile = 'build/index.html';

  inlineScriptAndCss (app, css, outfile);

  return 0;
}

var program = require('commander');

program
  .option ('-d, --debug [true]', 'Debug mode (on by default)', true)
  .option ('-r, --release [false]', 'Release mode (overrides -d)', false)
  .parse (process.argv)
  ;

return main (program.debug && ! program.release);
