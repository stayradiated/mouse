(function () {

  'use strict';

  var Rectangle;

  Rectangle = function (rect) {

    this.top = 0;
    this.left = 0;
    this.width = 0;
    this.height = 0;
    this.bottom = 0;
    this.right = 0;
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;

    if (rect) {
      this.setRect(rect);
    }

  };

  Rectangle.prototype.setRect = function (rect) {

    this.top = rect.top;
    this.left = rect.left;
    this.width = rect.width;
    this.height = rect.height;
    this.updateFromRect();

    return this;
  };

  Rectangle.prototype.setStart = function (x, y) {

    this.startX = x;
    this.startY = y;
    this.setEnd(x, y);

    return this;
  };

  Rectangle.prototype.setEnd = function (x, y) {

    this.endX = x;
    this.endY = y;
    this.updateFromPoints();

    return this;
  };

  Rectangle.prototype.updateFromPoints = function () {

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

  Rectangle.prototype.updateFromRect = function () {
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;

    return this;
  };


  Rectangle.prototype.move = function (x, y) {
    this.left += x;
    this.right += x;
    this.top += y;
    this.bottom += y;

    return this;
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

  module.exports = Rectangle;

}());
