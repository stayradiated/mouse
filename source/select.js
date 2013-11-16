(function () {

  'use strict';

  var Box, Elements, Select;

  // Classes
  Box = require('./box');
  Elements = require('./elements');

  Select = function (options) {
    this.parent = options.parent;
    this.elements = new Elements(options);
    this.box = null;
    this.active = false;
  };

  Select.prototype._mousedown = function(event) {
    this.active = true;
    if (this.box) { this.box.remove(); }
    this.box = (new Box()).reset(event).update().render();
    this.elements.reset(event.ctrlKey || event.metaKey).check(this.box);
  };

  Select.prototype._mousemove = function(event) {
    if (!this.active) { return; }
    this.box.setEnd(event).update().render();
    this.elements.check(this.box);
  };

  Select.prototype._mouseup = function(event) {
    if (!this.active) { return; }
    this.active = false;
    this.box.remove();
    this.box = null;
    this.elements.select();
  };

  Select.prototype.init = function() {
    this.parent.addEventListener('mousedown', this._mousedown.bind(this));
    document.addEventListener('mousemove', this._mousemove.bind(this));
    document.addEventListener('mouseup', this._mouseup.bind(this));
  };

  if (typeof window !== 'undefined') {
    window.Select = Select;
  }

  module.exports = Select;

}());
