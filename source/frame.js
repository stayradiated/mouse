'use strict';

var Rectangle, Frame, inherit;

Rectangle = require('./rectangle');
inherit = require('./extends');

Frame = function (rect) {
  Frame.__super__.constructor.apply(this, arguments);

  this.offsetX = 0;
  this.offsetY = 0;

  if (rect) {
    this.setRect(rect);
  }
};

inherit(Frame, Rectangle);

Frame.prototype.setRect = function (rect) {
  this.top = rect.top;
  this.left = rect.left;
  this.width = rect.width;
  this.height = rect.height;
  this.update();
  return this;
};

Frame.prototype.update = function () {
  this.right = this.left + this.width;
  this.bottom = this.top + this.height;
  return this;
};

Frame.prototype.move = function (x, y) {
  this.left   += x;
  this.right  += x;
  this.top    += y;
  this.bottom += y;
  return this;
};

Frame.prototype.setOffset = function (x, y) {
  if (! this.hasOwnProperty('_left')) {
    this._left = this.left;
    this._right = this.right;
    this._top = this.top;
    this._bottom = this.bottom;
  }
  this.left = this._left - x;
  this.right = this._right - x;
  this.bottom = this._bottom - y;
  this.top = this._top - y;
  return this;
};

module.exports = Frame;

