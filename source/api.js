(function () {

  'use strict';

  var Api, Items, Mouse, Select, Drag, Drop;

  Items = require('./items');
  Mouse = require('./mouse');
  Select = require('./select');
  Drag = require('./drag');
  Drop = require('./drop');

  Api = function (options) {

    this.drops = [];
    this.parent = options.parent;

    this.items = new Items({
      parent: this.parent,
      query: options.query
    });

    this.mouse = new Mouse({
      parent: this.parent,
      items: this.items
    });

    this.select = new Select({
      mouse: this.mouse,
      items: this.items
    });

    this.drag = new Drag({
      mouse: this.mouse
    });

  };

  Api.prototype.init = function () {
    this.mouse.init();
  };

  Api.prototype.drop = function (el) {
    var drop = new Drop({
      mouse: this.mouse,
      el: el
    });
    this.drops.push(drop);
  };

  if (typeof window !== 'undefined') {
    window.Mouse = Api;
  }

  module.exports = Api;

}());