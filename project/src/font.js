/**
* @module Font
*/
module.exports = (function () {

  // Array of strings representing web save fonts, garantied to work in every
  // modern browser.
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

  // Array of possible font types
  var fonttypes = ['normal', 'italic', 'bold'];

  // Private variables
  var _fontindex = 0;
  var _fonttypeindex = 0;
  var _name = webfonts[0];
  var _size = 14;
  var _type = fonttypes[0];

  /**
   * Creates a new Font.
   *
   * @class Font
   * @constructor
   * @param {string} [name] Font name. Can be full name or just a part.
   * @param {int} [size] Font size in pixels.
   * @param {string} [type] Font style.
   */
  function Font (name, size, type) {
    this.name (name || _name);
    this.size (size || _size);
    this.type (type || _type);
  }

  /**
   * Gets (if value is omitted) or sets the name of the font.
   *
   * @method name
   * @param {string} [value] New value to set.
   * @return {string} Font name
   */
  Font.prototype.name = function (value) {
    value = value || undefined;

    if (undefined === value) {
      return _name
    }

    if ('string' === typeof value) {
      _name = value;

      // Update font index by searching set value in webfonts array.
      var foundIndex = false;
      for (var i = 0; i < webfonts.length; ++i) {
        var r = webfonts[i].toLowerCase ().match (new RegExp (_name));
        if (r && 0 < r[0].length) {
          _fontindex = i;
          foundIndex = true;
          break;
        }
      }

      if (! foundIndex) {
        throw 'Could not find any font name containig ' + _name;
      }

      return _name;
    }
    else {
      throw 'Invalid type for name!';
    }
  };

  /**
   * Gets (if value is omitted) or sets font size in pixels.
   *
   * @method size
   * @param {int} [value] New value to set.
   * @return {string} Font size
   *
   */
  Font.prototype.size = function (value) {
    value = value || undefined;

    if (undefined === value) {
      return _size;
    }

    if ('number' === typeof value) {
      _size = value;

      return _size;
    }
    else {
      throw 'Invalid type for size!';
    }
  };

  /**
   * Gets (if value is omitted) or sets font type.
   *
   * @method type
   * @param {string} [value] New value to set.
   * @return {string} Font type
   *
   */
  Font.prototype.type = function (value) {
    value = value || undefined;

    if (undefined === value) {
      return _type;
    }

    if ('string' === typeof value) {
      _type = value;

      // Updates index of font type.
      var foundIndex = false;
      for (var i = 0; i < fonttypes.length; ++i) {
        if (fonttypes[i] === _type) {
          _fonttypeindex = i;
          foundIndex = true;
          break;
        }
      }

      if (! foundIndex) {
        throw 'Invalid font type: ' + _type;
      }

      return _type;
    }
    else {
      return _type;
    }
  };

  /**
   * Converts font to css string.
   *
   * @method toString
   * @return {string} Font string.
   *
   */
  Font.prototype.toString = function () {
    return fonttypes[_fonttypeindex]
      + ' ' + _size + 'px'
      + ' ' + webfonts[_fontindex]
      ;
  }

  return Font;

}) ();
