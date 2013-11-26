(function () {

  'use strict';

  var Box, Select;

  Box = require('./box');

  Select = function (options) {
    this.items = options.items;
    this.box = null;
  };

  Select.prototype.start = function (event) {

    var append = event.ctrlKey || event.metaKey;

    if (this.box) {
      this.box.remove();
    }

    this.box = new Box();
    this.box.reset(event).update();

    this.items.reset(append).check(this.box);
  };

  Select.prototype.move = function (event) {
    this.box.setEnd(event).update();
    this.items.check(this.box);
    this.box.render();
  };

  Select.prototype.end = function () {
    this.box.remove();
    this.box = null;
    this.items.select();
  };

  module.exports = Select;

}());
