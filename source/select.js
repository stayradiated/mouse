(function () {

  'use strict';

  var Box, Select;

  Box = require('./box');

  Select = function (options) {

    // Set instance variables
    this.mouse = options.mouse;
    this.items = options.items;
    this.box = null;

    // Bind events
    this.mouse.on('start-select', this.start);
    this.mouse.on('move-select', this.move);
    this.mouse.on('end-select', this.end);

  };

  Select.prototype.start = function (event) {
    var append = event.ctrlKey || event.metaKey;
    if (this.box) { this.box.remove(); }

    this.box = new Box();
    this.box.setStart(event);

    this.items.reset(append).check(this.box.rect);
  };

  Select.prototype.move = function (event) {
    this.box.setEnd(event);
    this.items.check(this.box.rect);
    this.box.render();
  };

  Select.prototype.end = function () {
    this.box.remove();
    this.box = null;
    this.items.select();
  };

  module.exports = Select;

}());
