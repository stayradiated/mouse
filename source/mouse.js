(function () {

  'use strict';

  var smoke, Mouse, DEFAULT, SELECT, DRAG;

  smoke = require('signals');

  // Modes
  DEFAULT = 0;
  SELECT = 1;
  DRAG = 2;

  Mouse = function (options) {

    smoke.convert(this);

    this.parent = options.parent;
    this.items = options.items;

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

    if (event.which !== 1) {
      return;
    }

    this.down = true;
    this.start = event;
    this.items.fetch();
    this.item = this.items.find(event.target);

    if (this.item) {
      this.mode = DRAG;
      this.emit('prepare-drag', this.item);
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
        this.emit('move-drag', event);
      } else {
        this.emit('move-select', event);
      }
    } else if (
      Math.abs(event.x - this.start.x) > this.min ||
      Math.abs(event.y - this.start.y) > this.min
    ) {
      this.moving = true;
      if (this.mode === DRAG) {
        this.emit('start-drag', this.start);
      } else {
        this.emit('start-select', this.start);
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
      if (this.mode === SELECT) { this.items.clear(); }
      return;
    }
    this.moving = false;

    if (this.mode === DRAG) {
      this.emit('end-drag');
    } else if (this.mode === SELECT) {
      this.emit('end-select');
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

  module.exports = Mouse;

}());
