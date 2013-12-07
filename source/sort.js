
'use strict';

var Sort;

Sort = function (options) {

  this.vent = options.vent;
  this.items = options.items;

  this.parent = null;
  this.closestItem = null;
  this.selected = null;

  this.prepare = this.prepare.bind(this);
  this.move = this.move.bind(this);

  this.vent.on('prepare-drag', this.prepare);
  this.vent.on('move-start', this.start);
  this.vent.on('move-drag', this.move);

};

Sort.prototype.prepare = function (selected) {
  this.parent = this.items.elements[0].parentElement;
  this.selected = selected;
};

Sort.prototype.start = function () {
  var i;

  for (i = 0; i < this.selected.length; i++) {
    this.parent.removeChild(this.selected[i]);
  }

  this.items.refreshPosition();
};

Sort.prototype.move = function (event) {

  var i, item, closest, distance;

  closest = Infinity;

  this.items.each(function (el) {
    distance = el.rect.distance(event.pageX, event.pageY);
    if (distance < closest) {
      closest = distance;
      item = el;
    }
  });
  
  if (this.closestItem !== item) {
    // this.closestItem && this.closestItem.classList.remove('closest');
    for (i = 0; i < this.selected.length; i++) {
      this.parent.insertBefore(this.selected[i], item);
    }
    this.closestItem = item;
    // this.closestItem.classList.add('closest');
  }
  // Loop through each item
  // Calculate distance from cursor to item
  // Find closest item
  // Insert helper before item

};

module.exports = Sort;
