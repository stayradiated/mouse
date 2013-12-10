(function () {

  'use strict';

  var Box, Select;

  Box = require('./box');

  Select = function (options) {

    // Set instance variables
    this.vent = options.vent;
    this.parent = options.parent;
    this.items = options.items;
    this.box = null;

    // Bind events
    this.vent.on('prepare-select', this.prepare, this);
    this.vent.on('start-select', this.start, this);
    this.vent.on('move-select', this.move, this);
    this.vent.on('end-select', this.end, this);
    this.vent.on('scroll-select', this.scroll, this);

  };

  Select.prototype.holdingAppend = function (event) {
    return event.ctrlKey || event.metaKey;
  };

  Select.prototype.prepare = function (event) {
    if (! this.holdingAppend(event)) {
      this.items.deselectAll();
    }
  };

  Select.prototype.start = function (event) {
    var append = this.holdingAppend(event);
    if (this.box) { this.box.remove(); }

    this.box = new Box();
    this.box.setStart(event, this.parent);

    if (! append) {
      this.items.deselectAll();
    }

    this.items.refreshPosition();
    this.items.check(this.box.rect);
  };

  Select.prototype.move = function (event) {
    this.box.setEnd(event);
    this.lastEvent = event;
    this.update();
  };

  Select.prototype.scroll = function () {
    this.box.setOffset(this.parent);
    this.box.setEnd(this.lastEvent);
    this.update();
  };

  Select.prototype.update = function () {
    this.items.check(this.box.rect);
    this.box.render();
  };

  Select.prototype.end = function () {
    this.box.remove();
    this.box = null;
    this.items.finishCheck();
  };

  module.exports = Select;

}());
