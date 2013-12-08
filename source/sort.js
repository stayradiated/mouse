
'use strict';

var Sort;

Sort = function (options) {

  this.vent = options.vent;
  this.items = options.items;

  this.parent = null;
  this.closestItem = null;
  this.selected = null;
  this.above = null;

  this.placeholder = document.createElement('div');
  this.placeholder.className = 'placeholder';

  this.prepare = this.prepare.bind(this);
  this.move = this.move.bind(this);
  this.start = this.start.bind(this);
  this.end = this.end.bind(this);

  this.vent.on('prepare-drag', this.prepare);
  this.vent.on('start-drag', this.start);
  this.vent.on('move-drag', this.move);
  this.vent.on('end-drag', this.end);

};

Sort.prototype.prepare = function (selected) {
  this.parent = this.items.elements[0].parentElement;
  this.selected = selected;
};

Sort.prototype.start = function () {
  var i, len;

  len = this.selected.length;

  for (i = 0; i < len; i++) {
    this.selected[i].classList.add('hidden');
    // this.parent.removeChild(this.selected[i]);
  }

  this.items.refreshPosition();

};

Sort.prototype.move = function (event) {

  // Loop through each item
  // Calculate distance from cursor to item
  // Find closest item
  // Insert helper before or after item

  var i, len, el, item, closest, distance, above;

  closest = Infinity;

  len = this.items.elements.length;

  for (i = 0; i < len; i++) {
    el = this.items.elements[i];

    if (this.selected.indexOf(el) > -1) {
      continue;
    }

    distance = el.rect.distance(event.pageY);

    if (distance[0] < closest) {
      closest = distance[0];
      item = el;
      above = distance[1];
    }

  }

  if (this.closestItem !== item || this.above !== above) {

    if (above) {
      this.parent.insertBefore(this.placeholder, item);
    } else {
      this.parent.insertBefore(this.placeholder, item.nextSibling);
    }

    this.closestItem = item;
    this.above = above;
  }


};

Sort.prototype.end = function () {
  var i, len;

  len = this.selected.length;

  for (i = 0; i < len; i++) {
    this.parent.insertBefore(this.selected[i], this.placeholder);
  }

  this.parent.removeChild(this.placeholder);
};

module.exports = Sort;
