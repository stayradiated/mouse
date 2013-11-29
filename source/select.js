(function () {

  'use strict';

  var Box, Select;

  Box = require('./box');

  Select = function (options) {

    // Set instance variables
    this.mouse = options.mouse;
    this.items = options.items;
    this.box = null;

    this.prepare = this.prepare.bind(this);
    this.start = this.start.bind(this);
    this.move = this.move.bind(this);
    this.end = this.end.bind(this);

    // Bind events
    this.mouse.on('prepare-select', this.prepare);
    this.mouse.on('start-select', this.start);
    this.mouse.on('move-select', this.move);
    this.mouse.on('end-select', this.end);

  };

  Select.prototype.holdingAppend = function (event) {
    return event.ctrlKey || event.metaKey;
  };

  Select.prototype.prepare = function (event) {
    if (! this.holdingAppend(event)) {
      this.items.clear();
    }
  };

  Select.prototype.start = function (event) {
    var append = this.holdingAppend(event);
    if (this.box) { this.box.remove(); }

    this.box = new Box();
    this.box.setStart(event);

    this.items.reset(append);
    this.items.check(this.box.rect);
  };

  Select.prototype.move = function (event) {
    this.box.setEnd(event);
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
