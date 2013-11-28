(function () {
  'use strict';

  var Items, Rectangle;

  Rectangle = require('./rectangle');


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


  Items.prototype.clearItem = function (item) {
    item.classList.remove('selected');
    item.selected = false;
  };


  Items.prototype.clear = function () {
    var i;
    for (i = 0; i < this.elements.length; i++) {
      this.clearItem(this.elements[i]);
    }
  };


  Items.prototype.reset = function (append) {
    var i, el;

    for (i = 0; i < this.elements.length; i++) {

      el = this.elements[i];

      if (! append) {
        this.clearItem(el);
      }

      el.rect = new Rectangle(el.getBoundingClientRect());
      el.rect.move(window.pageXOffset, window.pageYOffset);

    }

    return this;
  };

  Items.prototype.check = function (box) {
    var i, el, hit;
    for (i = 0; i < this.elements.length; i++) {

      el = this.elements[i];
      hit = box.touching(el.rect);

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