module.exports = (function () {

  var webfonts = [
    //# serif
    'Georgia, serif',
    '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    '"Times New Roman", Times, serif',

    //# sans
    'Arial, Helvetica, sans-serif',
    '"Arial Black", Gadget, sans-serif',
    '"Comic Sans MS", cursive, sans-serif',
    'Impact, Charcoal, sans-serif',
    '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
    'Tahoma, Geneva, sans-serif',
    '"Trebuchet MS", Helvetica, sans-serif',
    'Verdana, Geneva, sans-serif',

    //# monospace
    '"Courier New", Courier, monospace',
    '"Lucida Console", Monaco, monospace',
  ];

  var fonttypes = ['normal', 'italic', 'bold'];

  var _fontindex = 0;
  var _fonttypeindex = 0;
  var _name = webfonts[0];
  var _size = 14;
  var _type = fonttypes[0];

  function Font (name, size, type) {
    this.name (name || _name);
    this.size (size || _size);
    this.type (type || _type);
  }

  Font.prototype.name = function (value) {
    value = value || undefined;

    if (undefined === value) {
      return _name
    }

    if ('string' === typeof value) {
      _name = value;

      for (var i = 0; i < webfonts.length; ++i) {
        var r = webfonts[i].toLowerCase ().match (new RegExp (_name));
        if (r && 0 < r[0].length) {
          _fontindex = i;
          break;
        }
      }
    }
    else {
      throw 'Invalid type for name!';
    }
  };

  Font.prototype.size = function (value) {
    value = value || undefined;

    if (undefined === value) {
      return _size;
    }

    if ('number' === typeof value) {
      _size = value;
    }
    else {
      throw 'Invalid type for size!';
    }
  };

  Font.prototype.type = function (value) {
    value = value || undefined;

    if (undefined === value) {
      return _type;
    }

    if ('string' === typeof value) {
      _type = value;

      for (var i = 0; i < fonttypes.length; ++i) {
        if (fonttypes[i] === _type) {
          _fonttypeindex = i;
          break;
        }
      }
    }
    else {
      return _type;
    }
  };

  Font.prototype.toString = function () {
    return fonttypes[_fonttypeindex]
      + ' ' + _size + 'pt'
      + ' ' + webfonts[_fontindex]
      ;
  }

  return Font;

}) ();
