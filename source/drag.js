'use strict';

var Drag;

Drag = function (options, vent) {

  // Load options
  this.vent = vent;
  this.createHelper = options.helper;

  // Set instance variables
  this.items = [];
  this.offsetY = options.offsetY || 0;
  this.offsetX = options.offsetX || 0;

  // Create placeholder
  this.helper = document.createElement('div');
  this.helper.className = 'drag-helper ' + (options.className || '');

  // Bind events
  this.vent.on('prepare-drag', this.setItems, this);
  this.vent.on('start-drag', this.start, this);
  this.vent.on('move-drag', this.move, this);
  this.vent.on('end-drag', this.end, this);

};


/**
 * Set the items that will be dragged
 * - items (Array) : an array of dom elements (with the same parent)
 */

Drag.prototype.setItems = function (items) {
  this.items = items;
};


/**
 * Start dragging the items
 * - event (Event) : the mouse event of when the user first started dragging
 */

Drag.prototype.start = function (event) {
  // Hide all the items
  var i, len = this.items.length;
  for (i = 0; i < len; i++) {
    this.items[i].classList.add('hidden');
  }

  // Append the drag helper
  this.helper.innerHTML = this.createHelper(this.items);
  document.body.appendChild(this.helper);

  // Move the helper into position
  this.move(event);
};


/**
 * Move the helper to the mouse position
 * - event (Event) : the mouse event of the user moving the mouse
 */

Drag.prototype.move = function (event) {

  this.helper.style.top  =
    this.offsetY + window.pageYOffset + event.pageY + 'px';

  this.helper.style.left =
    this.offsetX + window.pageXOffset + event.pageX + 'px';
};


/**
 * End the drag
 * - event (Event) : the mouse event of the user ending the drag
 */

Drag.prototype.end = function () {
  // Remove the helper
  document.body.removeChild(this.helper);

  // Remove the 'hidden' class from each of the items
  var i, len = this.items.length;
  for (i = 0; i < len; i++) {
    this.items[i].classList.remove('hidden');
  }
};


module.exports = Drag;
