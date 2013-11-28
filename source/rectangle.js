(function () {

  'use strict';

  var Rectangle;

  Rectangle = function () {

    this.top = 0;
    this.left = 0;
    this.bottom = 0;
    this.right = 0;

    this.width = 0;
    this.height = 0;

    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;

  };

  Rectangle.prototype.setStart = function (x, y) {

    this.startX = x;
    this.startY = y;
    this.update();

    return this;
  };

  Rectangle.prototype.setEnd = function (x, y) {

    this.endX = x;
    this.endY = y;
    this.update();

    return this;
  };

  Rectangle.prototype.update = function () {

    if (this.endX > this.startX) {
      this.left = this.startX;
      this.right = this.endX;
    } else {
      this.left = this.endX;
      this.right = this.startX;
    }

    if (this.endY > this.startY) {
      this.top = this.startY;
      this.bottom = this.endY;
    } else {
      this.top = this.endY;
      this.bottom = this.startY;
    }

    this.height = this.bottom - this.top;
    this.width = this.right - this.left;

    return this;
  };

  module.exports = Rectangle;

}());