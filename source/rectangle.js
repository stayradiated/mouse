(function () {

  'use strict';

  var Rectangle;

  Rectangle = function () {
    this.top = 0;
    this.left = 0;
    this.width = 0;
    this.height = 0;
    this.bottom = 0;
    this.right = 0;
  };

  Rectangle.prototype.touching = function (rect) {
    return (
      this.left   < rect.right  &&
      this.right  > rect.left   &&
      this.top    < rect.bottom &&
      this.bottom > rect.top
    );
  };

  Rectangle.prototype.contains = function (x, y) {
    return (
      x >= this.left && x < this.right &&
      y >= this.top  && y < this.bottom
    );
  };

  // Only supports vertical distance at the moment
  Rectangle.prototype.distance = function (y) {
    var top, bottom;

    top = Math.abs(this.top - y);
    bottom = Math.abs(this.bottom - y);

    // Closer to top
    if (top < bottom) {
      return [top, true];

    // Closer to bottom
    } else {
      return [bottom, false];

    }

  };

  module.exports = Rectangle;

}());
