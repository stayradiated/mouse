(function () {

  'use strict';

  var Box, Rectangle;

  Rectangle = require('./rectangle');

  Box = function () {

    // Create dom element
    this.el = document.createElement('div');
    this.el.className = Box.className;
    document.body.appendChild(this.el);

    this.offsetX = 0;
    this.offsetY = 0;

    // TODO: Do this via css?
    this.el.style.left   = '-10px';
    this.el.style.top    = '-10px';
    this.el.style.width  = 0;
    this.el.style.height = 0;

    this.rect = new Rectangle();

  };

  Box.className = 'select_js_box';

  Box.prototype.setStart = function (event) {
    this.rect.setStart(event.pageX, event.pageY);
    return this;
  };

  Box.prototype.setOffset = function (element, event) {
    this.offsetY = element.scrollTop;
    this.offsetX = element.scrollLeft;
    this.setEnd(event);
  };

  Box.prototype.setEnd = function (x, y) {
    this.rect.setEnd(
      x + this.offsetX,
      y + this.offsetY
    );
    return this;
  };

  Box.prototype.remove = function () {
    var el = this.el;
    el.className += ' hide';
    setTimeout(function () {
      document.body.removeChild(el);
    }, 200); // Fade out time
    return this;
  };

  Box.prototype.render = function () {
    this.el.style.top    = this.rect.top - this.offsetY + 'px';
    this.el.style.left   = this.rect.left - this.offsetX + 'px';
    this.el.style.width  = this.rect.width + 'px';
    this.el.style.height = this.rect.height + 'px';
    return this;
  };

  module.exports = Box;

}());
