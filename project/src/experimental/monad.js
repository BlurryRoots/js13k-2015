module.exports = (function () {
  var Monad = Object.create (null);

  function unit (value) {
    var monad = Object.create (Monad);
    //var monad = new Monad ();

    monad.bind = function (callback) {
      // the list of arguments starts with the value given to the monad
      var argv = [value];
      // add the rest of the bind call to the argument array
      argv.concat (Array.prototype.slice.apply (arguments || []));

      // invoke the callback without any defined scope/context
      return callback.apply (undefined, argv);
    };

    return monad;
  };

  unit.lift = function (name, callback) {
    Monad[name] = function () {
      var argv = Array.prototype.slice.apply (arguments || []);

      return unit (this.bind (callback, argv));
    }

    return unit;
  };

  return unit;

}) ();
