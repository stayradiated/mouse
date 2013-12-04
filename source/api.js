(function () {

  'use strict';

  var Api, Signals, Items, Mouse, Select, Drag, Drop, Menu;

  Signals = require('signals');
  Items = require('./items');
  Mouse = require('./mouse');
  Select = require('./select');
  Drag = require('./drag');
  Drop = require('./drop');
  Menu = require('./menu');

  Api = function (options) {
    this.vent = new Signals();
    this.drops = [];
    this.options = options;
    this.parent = options.parent;
    this.removeDrop = this.removeDrop.bind(this);
  };

  Api.prototype.init = function () {

    if (typeof this.parent === 'string') {
      this.parent = document.querySelector(this.parent);
    }

    this.items = new Items({
      parent: this.parent,
      query: this.options.query
    });

    this.mouse = new Mouse({
      parent: this.parent,
      items: this.items,
      vent: this.vent
    });

    this.select = new Select({
      vent: this.vent,
      items: this.items
    });

    this.drag = new Drag({
      vent: this.vent,
      helper: this.options.helper,
      offsetY: this.options.offsetY,
      offsetX: this.options.offsetX
    });

    this.vent.on('remove-drop', this.removeDrop);
    this.mouse.init();
  };

  Api.prototype.addDrop = function (el) {
    var drop = new Drop({
      vent: this.vent,
      el: el
    });
    this.drops.push(drop);
    return drop;
  };

  Api.prototype.removeDrop = function (drop) {
    var index = this.drops.indexOf(drop);
    this.drops.splice(index, 1);
  };

  Api.prototype.addMenu = function (items, options) {
    if (!options) {
      options = {};
    }
    options.vent = this.vent;

    var menu = new Menu(items, options);

    this.on('right-click', function (event) {
      menu.show(event);
    });

    menu.init();
    return menu;
  };

  Api.prototype.on = function () {
    this.vent.on.apply(this.vent, arguments);
  };

  Api.prototype.once = function () {
    this.vent.once.apply(this.vent, arguments);
  };

  Api.prototype.clearSelection = function () {
    this.items.deselectAll();
  };

  if (typeof window !== 'undefined') {
    window.Mouse = Api;
  }

  module.exports = Api;

}());
