(function () {

  'use strict';

  var Mouse, Select, Drag, Items, DEFAULT, SELECT, DRAG;

  Select = require('./select');
  Items = require('./elements');
  Drag = require('./drag');

  // Modes
  DEFAULT = 0;
  SELECT = 1;
  DRAG = 2;

  Mouse = function (options) {

    this.parent = options.parent;

    this.drag = new Drag();

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
    this.mode = DEFAULT;
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
      this.mode = DRAG;
    } else {
      this.mode = SELECT;
    }

  };


  /**
   * Mouse move event listener
   * - event (Event) : the mousemove event
   * > void
   */

  Mouse.prototype._move = function (event) {

    if (! this.down) { return; }

    if (this.moving) {
      if (this.mode === DRAG) {
        console.log('dragging item');
      } else {
        this.select.move(event);
      }
    } else if (
      Math.abs(event.x - this.start.x) > this.min ||
      Math.abs(event.y - this.start.y) > this.min
    ) {
      this.moving = true;
      if (this.mode === DRAG) {
        console.log('drag start');
      } else {
        this.select.start(this.start);
      }
    }
  };


  /**
   * Mouse up event listener
   * - event (Event) : the mouseup event
   * > void
   */

  Mouse.prototype._up = function () {

    if (! this.down) { return; }
    this.down = false;

    if (! this.moving) {
      if (this.mode === SELECT) {
        this.items.clear();
      }
      return;
    }
    this.moving = false;

    if (this.mode === DRAG) {
      console.log('drag end');
    } else if (this.mode === SELECT) {
      this.select.end();
    }

    this.mode = DEFAULT;
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
