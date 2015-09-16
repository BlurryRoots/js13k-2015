var Monad = require ('./../src/monad');

var adder = Monad (1337);

var x = adder.lift ('add42', function (x) {
	return x + 42;
});

console.log (adder.add42 ());
