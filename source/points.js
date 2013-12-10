'use strict';

var Rectangle, Points, inherit;

Rectangle = require('./rectangle');
inherit = require('./extends');

Points = function () {
  Points.__super__.constructor.apply(this, arguments);

  this.startX = 0;
  this.startY = 0;
  this.endX = 0;
  this.endY = 0;
  this.offsetX = 0;
  this.offsetY = 0;
};

inherit(Points, Rectangle);

Points.prototype.setStart = function (x, y) {
  this.startX = x;
  this.startY = y;
  this.setEnd(x, y);
  return this;
};

Points.prototype.setEnd = function (x, y) {
  this.endX = x;
  this.endY = y;
  this.update();
  return this;
};


Points.prototype.setOffset = function (x, y) {
  this.offsetX = x;
  this.offsetY = y;
  this.update();
  return this;
};

Points.prototype.update = function () {
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

module.exports = Points;

