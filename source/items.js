'use strict';

var Items, Frame;

Frame = require('./frame');

Items = function (options) {
  this.parent = options.parent;
  this.query = options.query;
  this.selected = [];
};


/**
 * Get the elements from the dom
 * > Nodelist : the elements
 */

Items.prototype.fetch = function () {
  this.elements = this.parent.querySelectorAll(this.query);
  return this.elements;
};


/**
 * Check if an element is part of an item
 * - target (Element) : The dom element to check
 * > Boolean  : if the element is part of an item or not
 */

Items.prototype.find = function (target) {
  while (this.parent !== target) {
    if (Array.prototype.indexOf.call(this.elements, target) > -1) {
      return target;
    }
    target = target.parentElement;
  }
  return false;
};


/**
 * Deselect a selected item
 * - item (Element) : a selected item
 */

Items.prototype.deselectItem = function (item) {
  var index = this.selected.indexOf(item);
  item.classList.remove('selected');
  item.selected = false;
  this.selected.splice(index, 1);
};


/**
 * Select an item
 * - item (Element) : an element to select
 */

Items.prototype.selectItem = function (item) {
  item.classList.add('selected');
  item.selected = true;
  this.selected.push(item);
};


/**
 * Deselect all selected items
 */

Items.prototype.deselectAll = function () {
  var i, item, len = this.selected.length;
  for (i = 0; i < len; i++) {
    item = this.selected[i];
    item.classList.remove('selected');
    item.selected = false;
  }
  this.selected = [];
};


/**
 * Cache the coordinates of each of the items
 */

Items.prototype.refreshPosition = function () {
  var i, el, len = this.elements.length;
  for (i = 0; i < len; i++) {
    el = this.elements[i];
    el.rect = new Frame(el.getBoundingClientRect());
    el.rect.move(window.pageXOffset, window.pageYOffset);
  }
};

/**
 * Quickly check each of the items to see if they touch the box
 * Important: You must run finishCheck() afterwards.
 * - box (Frame) : the box to check the items against
 */

Items.prototype.check = function (box) {
  var i, el, hit, len = this.elements.length;
  for (i = 0; i < len; i++) {
    el = this.elements[i];
    hit = box.touching(el.rect);

    // if hit and not selected or if not hit and selected
    if ((hit && !el.selected) || (!hit && el.selected)) {
      el.classList.add('selected');
      el._temp_selected = true;
    } else {
      el.classList.remove('selected');
      el._temp_selected = false;
    }
  }
};


/**
 * Select the temporary selected items
 */

Items.prototype.finishCheck = function () {
  var i, el, len = this.elements.length;
  this.selected = [];

  for (i = 0; i < len; i++) {
    el = this.elements[i];

    if (el._temp_selected) {
      el._temp_selected = false;
      el.selected = true;
      this.selected.push(el);
    } else {
      el.selected = false;
    }
  }
};

module.exports = Items;
