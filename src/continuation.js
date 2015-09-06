module.exports = (function () {
  var _callback;
  var _argc;
  var _argv;
  var _isFinished = false;

  // TODO: Take care of function return limitation ?!

  function Continuation (callback) {
    _callback = callback || function () { };

    _argc = arguments.length;
    if (1 < _argc) {
      _argv = Array.prototype.slice.call (arguments);
    }
    else {
      _argv = [];
    }
  }

  Continuation.prototype.invoke = function () {
    if (_isFinished) {
      return _callback;
    }

    if (typeof _callback != 'function') {
      console.error ('not a proper function!');
      return undefined;
    }

    var argv = _argv;
    var curargc = arguments.length;
    if (0 < curargc) {
      argv = Array.prototype.slice.call (arguments);
    }

    while (typeof _callback == 'function') {
        _callback = _callback.apply (_callback, argv);
    }

    return _callback;
  };

  Continuation.build = function (callback) {
    var c = new Continuation (callback);

    var argv = [];
    if (0 < arguments.length) {
      argv = Array.prototype.slice.call (arguments);
      argv = argv.slice (1, argv.length);
    }

    return function () {
      return c.invoke.apply (c.invoke, argv);
    };
  };

  return Continuation;

}) ();
