(function () {

  'use strict';

  var Mouse, Select, Items;

  Select = require('./select');
  Items = require('./elements');


  Mouse = function (options) {

    this.parent = options.parent;

    this.items = new Items({
      parent: this.parent,
      query: options.query
    });

    this.select = new Select({
      items: this.items
    });

    // Minimum distance mouse must move before considered moving
    this.min = 5;

    // Mouse state
    this.down = false;
    this.moving = false;
  };


  /**
   * Mouse down event listener
   * - event (Event) : the mousedown event
   * > void
   */

  Mouse.prototype._down = function (event) {
    this.down = true;
    this.start = event;
    this.items.fetch();

    if (this.items.isItem(event.target)) {
      this.drag = true;
    }

  };


  /**
   * Mouse move event listener
   * - event (Event) : the mousemove event
   * > void
   */

  Mouse.prototype._move = function (event) {

    if (! this.down) {
      return;
    }

    if (this.moving) {
      if (this.drag) {
        console.log('dragging item');
      } else {
        this.select.move(event);
      }
    } else if (
      Math.abs(event.x - this.start.x) > this.min ||
      Math.abs(event.y - this.start.y) > this.min
    ) {
      this.moving = true;
      if (this.drag) {
        console.log('drag start');
      } else {
        this.select.start(event);
      }
    }
  };


  /**
   * Mouse up event listener
   * - event (Event) : the mouseup event
   * > void
   */

  Mouse.prototype._up = function () {

    if (! this.down) {
      return;
    }

    if (this.drag) {
      console.log('drag end');
    } else {
      this.select.end();
    }

    this.drag = false;
    this.down = false;
    this.moving = false;
  };


  /**
   * Bind the mouse events
   * > void
   */

  Mouse.prototype.init = function () {
    this.parent.addEventListener('mousedown', this._down.bind(this));
    document.addEventListener('mousemove', this._move.bind(this));
    document.addEventListener('mouseup', this._up.bind(this));
  };

  if (typeof window !== 'undefined') {
    window.Mouse = Mouse;
  }

  module.exports = Mouse;

}());
