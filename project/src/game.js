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

    var m = _rand.range ()
    _sf = new Superformular (
      _rand.range (1, 100),
      _rand.rangef (0.1, 100),
      _rand.rangef (0.1, 100),
      _rand.rangef (0.1, 100)
    );

    _storage.clear ();
    _storage.onstorage = this.onstorage;

    _gui = document.getElementById ("gui");
    _gui.paramsTemplate = (function () {
      var source = fs.readFileSync (__dirname + '/superformular.hbs', 'utf8');
      var template = Handlebars.compile (source);

      var element = document.createElement ('div');
      element.setAttribute ('id', 'paramsTemplate');
      _gui.appendChild (element);

      Util.registerEventHandler (element, 'onmousedown', function (e) {
        var sfParamName = e.target.parentNode.children[0].textContent;
        console.log ('button: ' + e.button);
        var addition = 0;
        if (0 == e.button) {
          addition = 1;
        }
        else if (1 == e.button) {
          addition = -1;
        }

        _sf[sfParamName] += addition;
        _storage.put (sfParamName, _sf[sfParamName]);
      });

      return function (data) {
        element.innerHTML = template (data);
      };
    }) ();

    _gui.paramsTemplate ({
      'm': _sf.m,
      'n1': _sf.n1,
      'n2': _sf.n2,
      'n3': _sf.n3
    });
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
    if ('m' == e.key
     || 'n1' == e.key
     || 'n2' == e.key
     || 'n3' == e.key) {
      _gui.paramsTemplate ({
        'm': _sf.m,
        'n1': _sf.n1,
        'n2': _sf.n2,
        'n3': _sf.n3
      });
    }
  };

  return GameClass;

}) ();
