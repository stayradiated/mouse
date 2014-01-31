(function () {

  'use strict';

  var Api, Signals, Items, Mouse, Select, Drag, Drop, Menu, Sort, oldMouse;

  oldMouse = window.Mouse;

  Signals = require('signals');
  Items = require('./items');
  Mouse = require('./mouse');
  Select = require('./select');
  Drag = require('./drag');
  Drop = require('./drop');
  Menu = require('./menu');
  Sort = require('./sort');

  Api = function (options) {
    this.vent = new Signals();
    this.menus = [];
    this.options = options;
    this.parent = options.parent;
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

    if (this.options.select) {
      this.select = new Select({
        parent: this.parent,
        vent: this.vent,
        items: this.items
      });
    }

    if (this.options.drag) {
      this.drag = new Drag(this.options.drag, this.vent);
    }

    if (this.options.sort) {
      this.sort = new Sort({
        vent: this.vent,
        items: this.items,
        container: this.parent
      });
    }

    if (this.menu) {
      this.menu.init(this.items);
    }

    this.mouse.init();
  };

  Api.prototype.addDrop = function (el) {
    var drop = new Drop({
      vent: this.vent,
      el: el
    });
    return drop;
  };

  Api.prototype.addMenu = function (items, options) {
    if (!options) { options = {}; }
    options.vent = this.vent;
    var menu = this.menu = new Menu(items, options);
    this.on('right-click', function (event) {
      menu.show(event);
    });
    return menu;
  };

  Api.prototype.on = function () {
    this.vent.on.apply(this.vent, arguments);
  };

  Api.prototype.once = function () {
    this.vent.once.apply(this.vent, arguments);
  };

  Api.prototype.selected = function () {
    return this.items.selected;
  };

  Api.prototype.clearSelection = function () {
    this.items.deselectAll();
  };

  Api.prototype.isMoving = function () {
    return this.mouse.moving;
  };

  Api.prototype.noConflict = function () {
    window.Mouse = oldMouse;
  };

  if (typeof window !== 'undefined') {
    window.Mouse = Api;
  }

  module.exports = Api;

}());
