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
    this.offsetX = 0;
    this.offsetY = 0;

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


  Rectangle.prototype.setOffset = function (x, y) {

    this.offsetX = x;
    this.offsetY = y;
    this.updateFromPoints();

    return this;
  };

  Rectangle.prototype.updateFromPoints = function () {

    var endXOffset, endYOffset;

    endXOffset = this.endX + this.offsetX;
    endYOffset = this.endY + this.offsetY;

    // Moving right
    if (endXOffset > this.startX) {
      this.left = this.startX;
      this.right = endXOffset;

    // Moving left
    } else {
      this.left = endXOffset;
      this.right = this.startX;
    }

    // Moving down
    if (endYOffset > this.startY) {
      this.top = this.startY;
      this.bottom = endYOffset;

    // Moving up
    } else {
      this.top = endYOffset;
      this.bottom = this.startY;
    }

    // Calculate size of box
    this.width = this.right - this.left;
    this.height = this.bottom - this.top;

    // Calculate fake position of box
    this.offsetTop = this.top - this.offsetY;
    this.offsetLeft = this.left - this.offsetX;

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
