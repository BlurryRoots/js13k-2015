var fs = require ('fs');
var hbs = require ('handlebars');

var source = fs.readFileSync ('src/index.html').toString ();
var template = hbs.compile (source);

var data = {
	"app": fs.readFileSync ('build/app.compressed.js').toString (),
	"css": fs.readFileSync ('resources/game.css').toString ()
};
var result = template (data);
fs.writeFileSync ('build/index.html', result.toString ());
