(function () {

  'use strict';

  var Box, Rectangle;

  Rectangle = require('./rectangle');

  Box = function () {

    // Create dom element
    this.el = document.createElement('div');
    this.el.className = Box.className;
    document.body.appendChild(this.el);

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
    this.el.style.top    = this.rect.top + 'px';
    this.el.style.left   = this.rect.left + 'px';
    this.el.style.width  = this.rect.width + 'px';
    this.el.style.height = this.rect.height + 'px';
    return this;
  };

  module.exports = Box;

}());