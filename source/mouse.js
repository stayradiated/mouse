(function () {

  'use strict';

  var Mouse, DEFAULT, SELECT, DRAG;

  // Modes
  DEFAULT = 0;
  SELECT = 1;
  DRAG = 2;

  Mouse = function (options) {
    this.vent = options.vent;
    this.parent = options.parent;
    this.items = options.items;

    // Minimum distance mouse must move before considered moving
    this.min = 5;

    // Mouse state
    this.down = false;
    this.moving = false;
    this.mode = DEFAULT;

    this._up = this._up.bind(this);
    this._down = this._down.bind(this);
    this._move = this._move.bind(this);
    this._scroll = this._scroll.bind(this);
  };


  Mouse.prototype.selected = function () {
    return this.items.selected.length > 0 ? this.items.selected : [this.item];
  };

  Mouse.prototype.holdingAppend = function (event) {
    return event.ctrlKey || event.metaKey;
  };

  Mouse.prototype._scroll = function (event) {
    if (! this.down) { return; }
    this.vent.emit('scroll', event);
  };

  /**
   * Mouse down event listener
   * - event (Event) : the mousedown event
   * > void
   */

  Mouse.prototype._down = function (event) {

    // Ignore middle clicks
    if (event.which === 2) {
      return;
    }

    var rightClick = (event.which === 3);

    // Update items and check if it was an item that was clicked on
    this.items.fetch();
    this.item = this.items.find(event.target);

    // Handle right click
    if (this.item && rightClick) {
      if (! this.item.selected) {
        this.items.deselectAll();
        this.items.selectItem(this.item);
      }
      this.vent.emit('right-click', event, this.selected());
      return;
    }

    this.appending = false;
    this.down = true;
    this.start = event;

    // if the user clicked on an item
    if (this.item) {
      this.mode = DRAG;
      if (! this.item.selected) {
        if (this.holdingAppend(event)) {
          this.appending = true;
          this.items.selectItem(this.item);
        } else {
          this.items.deselectAll();
        }
      }
      this.vent.emit('prepare-drag', this.selected());
    } else {
      this.mode = SELECT;
      this.vent.emit('prepare-select', event);
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
        this.vent.emit('move-drag', event);
      } else {
        this.vent.emit('move-select', event);
      }
    } else if (
      Math.abs(event.x - this.start.x) > this.min ||
      Math.abs(event.y - this.start.y) > this.min
    ) {
      this.moving = true;
      if (this.mode === DRAG) {
        this.vent.emit('start-drag', this.start);
      } else {
        this.vent.emit('start-select', this.start);
      }
    }
  };


  /**
   * Mouse up event listener
   * - event (Event) : the mouseup event
   * > void
   */

  Mouse.prototype._up = function (event) {

    if (! this.down) { return; }

    var append = this.holdingAppend(event);
    this.down = false;

    if (! this.moving) {
      if (this.mode === SELECT && !append) {
        this.items.deselectAll();
      } else if (this.mode === DRAG && !this.appending && append) {
        this.items.deselectItem(this.item);
      }
      return;
    }
    this.moving = false;

    if (this.mode === DRAG) {
      this.vent.emit('end-drag');
    } else if (this.mode === SELECT) {
      this.vent.emit('end-select');
    }

    this.mode = DEFAULT;
  };


  /**
   * Bind the mouse events
   * > void
   */

  Mouse.prototype.init = function () {
    this.parent.addEventListener('mousedown', this._down);
    this.parent.addEventListener('scroll', this._scroll);
    document.addEventListener('mousemove', this._move);
    document.addEventListener('mouseup', this._up);
  };

  module.exports = Mouse;

}());
