(function () {

  'use strict';


  var Drag, PLACEHOLDER;

  PLACEHOLDER = document.createElement('div');
  PLACEHOLDER.className = 'placeholder';

  Drag = function () {
    this.el = null;
    this.parent = null;
    this.offsetX = 0;
    this.offsetY = 0;
    this.oldTop = 0;
    this.oldLeft = 0;
  };

  Drag.prototype.use = function(item) {
    this.item = item;
  };

  Drag.prototype.start = function (event) {

    // Store variables
    this.offsetX = event.offsetX;
    this.offsetY = event.offsetY;

    // Save original position
    this.oldTop = this.item.style.top;
    this.oldLeft = this.item.style.left;

    // Set parent and add placeholder
    this.parent = this.item.parentElement;
    this.parent.insertBefore(PLACEHOLDER, this.item);

    // Make draggable
    this.item.classList.add('draggable');
    this.move(event);
  };

  Drag.prototype.move = function (event) {
    this.item.style.top = event.pageY - this.offsetY + 'px';
    this.item.style.left = event.pageX - this.offsetX + 'px';
  };

  Drag.prototype.end = function (event) {

    // Remove placeholder
    this.parent.removeChild(PLACEHOLDER);

    // Revert element to it's original position
    this.item.classList.remove('draggable');
    this.item.style.top = this.oldTop;
    this.item.style.left = this.oldLeft;
  };


  module.exports = Drag;

}());