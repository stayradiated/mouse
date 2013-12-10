
'use strict';

var Sort, Frame;

Frame = require('./frame');

Sort = function (options) {

  this.vent = options.vent;
  this.items = options.items;
  this.container = options.container;

  this.parent = null;
  this.closestItem = null;
  this.selected = null;
  this.above = null;

  this.scrollLeft = 0;
  this.scrollTop = 0;

  this.sorting = false;
  this.startPoint = null;

  this.placeholder = document.createElement('div');
  this.placeholder.className = 'placeholder';

  this.vent.on('prepare-drag', this.prepare, this);
  this.vent.on('start-drag', this.start, this);
  this.vent.on('move-drag', this.move, this);
  this.vent.on('end-drag', this.end, this);
  this.vent.on('scroll-drag', this.scroll, this);

};

Sort.prototype.getIndex = function (item) {
  return Array.prototype.indexOf.call(this.parent.children, item);
};

Sort.prototype.prepare = function (selected) {
  this.parent = this.items.elements[0].parentElement;
  this.selected = selected;
  if (this.selected.length === this.items.elements.length) {
    this.dontSort = true;
    return;
  }
  this.rect = new Frame(this.container.getBoundingClientRect());
  this.rect.move(window.pageXOffset, window.pageYOffset);
};

Sort.prototype.start = function () {
  var length, endPoint;

  if (this.dontSort) {
    return;
  }

  this.items.refreshPosition();

  this.scrollLeft = this.container.scrollLeft;
  this.scrollTop = this.container.scrollTop;

  // Figure out some stuff about the selected items
  length = this.selected.length;
  endPoint = this.getIndex(this.selected[length - 1]) + 1;
  this.startPoint = this.getIndex(this.selected[0]);
  this.sequential = this.startPoint + length === endPoint;
};

Sort.prototype.update = function () {

  // Loop through each item
  // Calculate distance from cursor to item
  // Find closest item
  // Insert placeholder before or after item

  var i, len, index, el, item, closest, distance, above;

  // Don't do anything if the users cursor isn't inside the parent container
  if (! this.rect.contains(this.mouseX, this.mouseY)) {
    return;
  }

  closest = Infinity;
  len = this.items.elements.length;

  // Find the closest item to the cursor
  for (i = 0; i < len; i++) {
    el = this.items.elements[i];

    // Skip items that are selected
    if (this.selected.indexOf(el) > -1) {
      continue;
    }

    distance = el.rect.distance(this.mouseY);

    if (distance[0] < closest) {
      closest = distance[0];
      item = el;
      above = distance[1];
      index = i;
    }

  }

  // Only update the dom if the item or position from the mouse is changed
  if (this.closestItem !== item || this.above !== above) {

    this.sorting = true;

    // Insert the placeholder above or below the item
    if (above) {
      this.parent.insertBefore(this.placeholder, item);
    } else {
      this.parent.insertBefore(this.placeholder, item.nextSibling);
    }

    this.closestItem = item;
    this.above = above;
    this.index = index;
    this.items.refreshPosition();
    this.scrollLeft = this.container.scrollLeft;
    this.scrollTop = this.container.scrollTop;
  }


};


/**
 * Update the placeholder when the user moves the mouse
 * - event (Event) : the mousemove event
 */

Sort.prototype.move = function (event) {
  if (this.dontSort) {
    return;
  }
  this.mouseX = event.pageX;
  this.mouseY = event.pageY;
  this.update();
};

/**
 * Update the placeholder when the user scrolls
 */

Sort.prototype.scroll = function () {
  if (this.dontSort) {
    return;
  }
  var i, rect, len = this.items.elements.length;
  for (i = 0; i < len; i++) {
    rect = this.items.elements[i].rect;
    rect.setOffset(
      this.container.scrollLeft - this.scrollLeft,
      this.container.scrollTop - this.scrollTop
    );
  }
  // this.items.refreshPosition();
  this.update();
};


Sort.prototype.end = function () {
  var i, len, position;


  if (this.dontSort) {
    this.dontSort = false;
    return;
  }

  if (! this.sorting) {
    return;
  }

  this.sorting = false;
  this.index = undefined;
  len = this.selected.length;
  position = this.getIndex(this.placeholder);

  // If the items haven't actually moved, then don't move them
  if (position > this.startPoint ?
      position - len === this.startPoint :
      this.sequential ? this.startPoint === position : false
  ) {
    this.parent.removeChild(this.placeholder);
    return;
  }

  // Move each of the selected items to where the placeholder was
  for (i = 0; i < len; i++) {
    this.parent.insertBefore(this.selected[i], this.placeholder);
  }

  // Remove the placeholder
  this.parent.removeChild(this.placeholder);

  // Alert the user
  this.vent.emit('sort', this.selected, position);
};

module.exports = Sort;
