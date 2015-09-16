module.exports = (function () {

  function Vector2 (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  Vector2.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;
  };

  Vector2.prototype.translate = function (x, y) {
    var offX = x || 0;
    var offY = y || 0;

    this.setPosition (this.x + offX, this.y + offY);
  };

  Vector2.prototype.add = function (b) {
    return new Vector2 (
      this.x + b.x,
      this.y + b.y
    );
  };

  Vector2.prototype.subtract = function (b) {
    return new Vector2 (
      this.x - b.x,
      this.y - b.y
    );
  };

  Vector2.prototype.magnitude = function () {
    return Math.sqrt (this.magnitude2 ());
  }

  Vector2.prototype.magnitude2 = function(a) {
    return this.x * this.x + this.y * this.y;
  }

  Vector2.prototype.dot = function (b) {
    return this.x * b.x + this.y * b.x;
  };

  Vector2.prototype.angle = function (b) {
    var magprod = this.magnitude () * b.magnitude ();
    return Math.acos (this.dot (b) / magprod);
  }

  Vector2.prototype.toString = function () {
    return "{x: " + this.x + ", y: " + this.y + "}";
  }

  return Vector2;

}) ();
