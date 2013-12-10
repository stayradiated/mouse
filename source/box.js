(function () {

  'use strict';

  var Box, Points;

  Points = require('./points');

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

    this.rect = new Points();

  };

  Box.className = 'select_js_box';

  Box.prototype.setStart = function (event, element) {
    this.rect.setStart(event.pageX, event.pageY);

    this.startOffsetX = element.scrollLeft;
    this.startOffsetY = element.scrollTop;

    return this;
  };

  Box.prototype.setOffset = function (element) {
    this.rect.setOffset(
      element.scrollLeft - this.startOffsetX,
      element.scrollTop - this.startOffsetY
    );
    return this;
  };

  Box.prototype.setEnd = function (event) {
    this.rect.setEnd(event.pageX, event.pageY);
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
    this.el.style.top    = this.rect.offsetTop + 'px';
    this.el.style.left   = this.rect.offsetLeft + 'px';
    this.el.style.width  = this.rect.width + 'px';
    this.el.style.height = this.rect.height + 'px';
    return this;
  };

  module.exports = Box;

}());
