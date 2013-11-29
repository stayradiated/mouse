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


  Items.prototype.selectItem = function (item) {
    item.classList.add('selected');
    item.selected = true;
    this.selected.push(item);
  };

  Items.prototype.clear = function () {
    var i, len = this.selected.length;
    for (i = 0; i < len; i++) {
      this.clearItem(this.selected[i]);
    }
    this.selected = [];
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

  };

  Items.prototype.check = function (box) {
    var i, el, hit;
    for (i = 0; i < this.elements.length; i++) {

      el = this.elements[i];
      hit = box.touching(el.rect);

      if ((hit && !el.selected) || (!hit && el.selected)) {
        el.classList.add('selected');
        el._temp_selected = true;
      } else {
        el.classList.remove('selected');
        el._temp_selected = false;
      }
    }
  };

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

}());