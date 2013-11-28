(function () {

  'use strict';

  var Drop, Rectangle;

  Rectangle = require('./rectangle');

  Drop = function (options) {

    // Load options
    this.mouse = options.mouse;
    this.el = options.el;

    // Instance variables
    this.hover = false;
    this.active = false;
    this.rect = new Rectangle()

    // Events
    this.mouse.on('start-drag', this.activate.bind(this));
    this.mouse.on('end-drag', this.deactivate.bind(this));
    this.mouse.on('move-drag', this.move.bind(this));
  };

  Drop.prototype.activate = function () {
    this.active = true;
    this.rect.setRect(this.el.getBoundingClientRect());
  };

  Drop.prototype.deactivate = function () {
    this.active = false;
    if (this.hover) {
      this.mouse.emit('drop', this.mouse.item, this.el);
      this.leave();
    }
  };

  Drop.prototype.move = function (event) {
    var hit = this.rect.contains(event.pageX, event.pageY);
    if (! this.hover && hit) {
      this.enter();
    } else if (this.hover && ! hit) {
      this.leave();
    }
  };

  Drop.prototype.enter = function (event) {
    this.hover = true;
    this.el.classList.add('droppable');
  };

  Drop.prototype.leave = function (event) {
    this.hover = false;
    this.el.classList.remove('droppable');
  };

  module.exports = Drop;

}());