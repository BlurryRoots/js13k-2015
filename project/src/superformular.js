module.exports = (function () {

  var Color = require ('./color');
  var Vector2 = require ('./vector2');

  var SuperformularClass = function (m, n1, n2, n3, a, b) {
    if (!a || a <= 0) a = 1;
    if (!b || b <= 0) b = 1;

    this.m = m;
    this.n1 = n1;
    this.n2 = n2;
    this.n3 = n3;
    this.a = a; // stretch in -x
    this.b = b; // stretch in +x
  }

  SuperformularClass.prototype.calculate_point = function (angle) {
    var rpart = (this.m * angle) / 4;
    var apart = Math.abs (Math.cos (rpart) / this.a);
    var bpart = Math.abs (Math.sin (rpart) / this.b);

    var r = Math.pow (
      Math.pow (apart, this.n2) + Math.pow (bpart, this.n3),
      -1 / this.n1
    )

    var x = Math.cos (angle) * r;
    var y = Math.sin (angle) * r;

    return new Vector2 (x, y);
  };

  return SuperformularClass;

}) ();
