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

  Select.prototype.init = function() {

    var self = this;

    this.parent.addEventListener('mousedown',function (event) {
      self.active = true;
      if (self.box) { self.box.remove(); }
      self.box = (new Box()).reset(event).update().render();
      self.elements.reset(event.ctrlKey || event.metaKey).check(self.box);
    });

    document.addEventListener('mousemove', function (event) {
      if (!self.active) { return; }
      self.box.setEnd(event).update().render();
      self.elements.check(self.box);
    });

    document.addEventListener('mouseup', function (event) {
      self.active = false;
      self.box.remove();
      self.box = null;
      self.elements.select();
    });

  };

  if (typeof window !== 'undefined') {
    window.Select = Select;
  }

  module.exports = Select;

}());
