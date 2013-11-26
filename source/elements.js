(function () {
  'use strict';

  var Items;

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

  Items.prototype.isItem = function (target) {
    while (this.parent !== target) {
      if (Array.prototype.indexOf.call(this.elements, target) > -1) {
        return true;
      }
      target = target.parentElement;
    }
    return false;
  };


  Items.prototype.clearItem = function(item) {
    item.classList.remove('selected');
    item.selected = false;
  };


  Items.prototype.clear = function() {
    var i;
    for (i = 0; i < this.elements.length; i++) {
      this.clearItem(this.elements[i]);
    }
  };


  Items.prototype.reset = function (append) {
    var i, el, rect, pos;

    for (i = 0; i < this.elements.length; i++) {

      el = this.elements[i];

      if (! append) {
        this.clearItem(el);
      }

      rect = el.getBoundingClientRect();

      pos = {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
      };

      el.position = {
        top: pos.top,
        left: pos.left,
        bottom: pos.top + rect.height,
        right: pos.left + rect.width
      };
    }

    return this;
  };

  Items.prototype.check = function (box) {
    var i, el, pos, hit;

    for (i = 0; i < this.elements.length; i++) {

      el = this.elements[i];
      pos = el.position;

      hit = !(
        pos.left   > box.right  ||
        pos.right  < box.left   ||
        pos.top    > box.bottom ||
        pos.bottom < box.top
      );

      if ((hit && !el.selected) || (!hit && el.selected)) {
        el.classList.add('selected');
        el._selected = true;
      } else {
        el.classList.remove('selected');
        el._selected = false;
      }

    }

    return this;

  };

  Items.prototype.select = function () {
    var i, el;

    this.selected = [];

    for (i = 0; i < this.elements.length; i++) {
      el = this.elements[i];

      if (el._selected) {
        el._selected = false;
        el.selected = true;
        this.selected.push(el);
      } else {
        el.selected = false;
      }
    }

    return this;
  };

  module.exports = Items;

}());