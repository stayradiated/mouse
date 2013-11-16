(function () {

  'use strict';

  var Box, Elements, Select;

  // Classes
  Box = require('./box');
  Elements = require('./elements');

  Select = function (options) {
    this.parent = options.parent;
    this.elements = new Elements(options);
    this.min = 5;
    this.box = null;
    this.down = false;
    this.moving = false;
  };

  Select.prototype.create = function (event) {
    if (this.box) { this.box.remove(); }
    this.box = (new Box()).reset(event).update();
    this.elements.reset(event.ctrlKey || event.metaKey).check(this.box);
  };

  Select.prototype.update = function (event) {
    this.box.setEnd(event).update();
    this.elements.check(this.box);
  };

  Select.prototype._mousedown = function (event) {
    this.down = true;
    this.start = event;
    this.create(event);
  };

  Select.prototype._mousemove = function (event) {
    if (!this.down) { return; }

    if (this.moving) {
      this.update(event);
      this.box.render();

    } else if (
      Math.abs(event.x - this.start.x) > this.min ||
      Math.abs(event.y - this.start.y) > this.min
    ) {
      this.moving = true;
      this.update(event);
      this.box.render();
    }
  };

  Select.prototype._mouseup = function () {
    if (!this.down) { return; }
    this.down = false;
    this.moving = false;
    this.box.remove();
    this.box = null;
    this.elements.select();
  };

  Select.prototype.init = function () {
    this.parent.addEventListener('mousedown', this._mousedown.bind(this));
    document.addEventListener('mousemove', this._mousemove.bind(this));
    document.addEventListener('mouseup', this._mouseup.bind(this));
  };

  if (typeof window !== 'undefined') {
    window.Select = Select;
  }

  module.exports = Select;

}());
