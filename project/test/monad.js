var Monad = require ('./../src/experimental/monad');

var adder = Monad (1337);

console.log (adder);

var x = adder.lift ('add42', function (x) {
	return x + 42;
});

console.log (adder.add42 ());
