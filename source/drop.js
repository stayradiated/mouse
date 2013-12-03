(function () {

  'use strict';

  var Drop, Rectangle;

  Rectangle = require('./rectangle');

  Drop = function (options) {

    // Load options
    this.vent = options.vent;
    this.mouse = options.mouse;
    this.el = options.el;

    // Instance variables
    this.hover = false;
    this.active = false;
    this.rect = new Rectangle();

    this.prepare = this.prepare.bind(this);
    this.move = this.move.bind(this);
    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);

    // Events
    this.vent.on('prepare-drag', this.prepare);
    this.vent.on('start-drag', this.activate);
    this.vent.on('end-drag', this.deactivate);
    this.vent.on('move-drag', this.move);
  };

  Drop.prototype.prepare = function (items) {
    this.items = items;
  };

  Drop.prototype.activate = function () {
    this.active = true;
    this.rect.setRect(this.el.getBoundingClientRect());
  };

  Drop.prototype.deactivate = function () {
    this.active = false;
    if (this.hover) {
      this.vent.emit('drop', this.items, this.el);
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

  Drop.prototype.enter = function () {
    this.hover = true;
    this.el.classList.add('droppable');
  };

  Drop.prototype.leave = function () {
    this.hover = false;
    this.el.classList.remove('droppable');
  };

  Drop.prototype.remove = function () {
    this.vent.off('start-drag', this.activate);
    this.vent.off('end-drag', this.deactivate);
    this.vent.off('move-drag', this.move);
    this.vent.emit('remove-drop', this);
  };

  module.exports = Drop;

}());
