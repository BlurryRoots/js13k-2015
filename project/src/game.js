module.exports = (function () {

  var Util = require ('./util');
  var Vector2 = require ('./vector2');
  var Superformular = require ('./superformular');
  var Randomizer = require ('./randomizer');
  var Color = require ('./color');
  var Handlebars = require ('handlebars');
  var fs = require ('fs');

  var _text = 'what the shit?';
  var _clickPos;
  var _rand;
  var _sf;
  var _vertices;
  var _zoom = 1;
  var _fillColor = new Color (32, 64, 128);
  var _gui;

  function _drawsf (ctx, shape, color, zoom) {
    ctx.save ();
    ctx.translate (ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.scale (zoom, zoom);
    ctx.beginPath ();
    shape.forEach (function (v) {
      ctx.lineTo (v.x, v.y);
    });
    ctx.closePath ();
    ctx.restore ();

    var fillStyleBuffer = ctx.fillStyle;
    ctx.fillStyle = color.toHex ();
    ctx.fill ();
    ctx.fillStyle = fillStyleBuffer;
  }

  _storage = {};
  _storage.clear = function () {
    window.localStorage.clear ();
  };
  _storage.onstorage = function (e) {
    // dummy
  };
  _storage.put = function (key, value) {
    var oldValue = window.localStorage.getItem (key);
    window.localStorage.setItem (key, value);

    this.onstorage ({
      key: key,
      oldValue: oldValue,
      newValue: value,
      url: window.location
    });
  };

  function GameClass (canvas) {
    _canvas = canvas;
    _rand = new Randomizer ();
    _zoom = 100;

    var m = _rand.range (1, 100);
    var n1 = _rand.range (1, 100);
    var n2 = _rand.range (1, 100);
    var n3 = _rand.range (1, 100);
    /*var g = (1 + Math.sqrt (5)) / 2;
    var m  = 1;
    var x = 100;
    var n1 = x * g;
    var n2 = x * g;
    var n3 = x * g;*/
    _sf = new Superformular (m, n1, n2, n3);

    _storage.clear ();
    _storage.onstorage = this.onstorage;

    _gui = document.getElementById ("gui");
    _gui.paramsTemplate = (function () {
      var source = fs.readFileSync (__dirname + '/superformular.hbs', 'utf8');
      var template = Handlebars.compile (source);

      // create actual element from template
      var element = document.createElement ('div');
      element.setAttribute ('id', 'paramsTemplate');
      element.innerHTML = template ({
        'm': _sf.m,
        'n1': _sf.n1,
        'n2': _sf.n2,
        'n3': _sf.n3
      });
      _gui.appendChild (element);

      var paramFields = {
        m: document.getElementById ('m'),
        n1: document.getElementById ('n1'),
        n2: document.getElementById ('n2'),
        n3: document.getElementById ('n3'),
      };

      function onValueChanged (e) {
        var paramName = e.target.id;
        var value = paramFields[paramName].value;
        console.log ('paramName: ' + paramName);
        console.log ('value: ' + value);
        if (undefined !== value) {
          _sf[paramName] = Math.floor (value);
          _storage.put (paramName, _sf[paramName]);
        }
        else {
          console.log (e);
        }
      }

      Util.registerEventHandler (paramFields['m'], 'oninput', function (e) {
        onValueChanged (e);
      });
      Util.registerEventHandler (paramFields['n1'], 'oninput', function (e) {
        onValueChanged (e);
      });
      Util.registerEventHandler (paramFields['n2'], 'oninput', function (e) {
        onValueChanged (e);
      });
      Util.registerEventHandler (paramFields['n3'], 'oninput', function (e) {
        onValueChanged (e);
      });

      return function (data) {
        element.innerHTML = template (data);
      };
    }) ();
  }

  GameClass.prototype.onupdate = function (dt) {
    _vertices = _sf.calculate_vertices ();
  };

  GameClass.prototype.onrender = function (ctx) {
    ctx.clearRect (0, 0, ctx.canvas.width, ctx.canvas.height);

    if (_clickPos) {
      var p = Util.clientToCanvasPosition (_canvas, _clickPos);
      ctx.fillText (_text, p.x, p.y);
    }

    _drawsf (ctx, _vertices, _fillColor, _zoom);
  };

  GameClass.prototype.onmousedown = function (e) {
    console.log (e);

    _clickPos = new Vector2 (e.clientX, e.clientY);
  };

  GameClass.prototype.onmousewheel = function (e) {
    console.log (e);
    _zoom += 10 * e.wheelValue
  }

  GameClass.prototype.onstorage = function (e) {
    /*if ('m' == e.key
     || 'n1' == e.key
     || 'n2' == e.key
     || 'n3' == e.key) {
      _gui.paramsTemplate ({
        'm': _sf.m,
        'n1': _sf.n1,
        'n2': _sf.n2,
        'n3': _sf.n3
      });
    }*/
  };

  return GameClass;

}) ();
