(function () {

  'use strict';


  var Drag, PLACEHOLDER;

  PLACEHOLDER = document.createElement('div');
  PLACEHOLDER.className = 'placeholder';

  Drag = function (options) {

    // Load options
    this.mouse = options.mouse;

    // Set instance variables
    this.el = null;
    this.parent = null;
    this.offsetX = 0;
    this.offsetY = 0;

    // Bind events
    this.mouse.on('prepare-drag', this.prepare.bind(this));
    this.mouse.on('start-drag', this.start.bind(this));
    this.mouse.on('move-drag', this.move.bind(this));
    this.mouse.on('end-drag', this.end.bind(this));

  };

  Drag.prototype.prepare = function (item) {
    this.item = item;
  };

  Drag.prototype.start = function (event) {

    // Store variables
    this.offsetX = event.offsetX;
    this.offsetY = event.offsetY;

    // Set parent and add placeholder
    this.parent = this.item.parentElement;
    this.parent.insertBefore(PLACEHOLDER, this.item);

    // Clone item
    this.clone = this.item.cloneNode(true);

    // Hide current itemm
    this.item.classList.add('hidden');

    // Make draggable
    document.body.appendChild(this.clone);
    this.clone.classList.add('draggable');
    this.move(event);
  };

  Drag.prototype.move = function (event) {
    this.clone.style.top = window.pageYOffset + event.pageY - this.offsetY + 'px';
    this.clone.style.left = window.pageXOffset + event.pageX - this.offsetX + 'px';
  };

  Drag.prototype.end = function () {

    // Remove placeholder and helper
    this.parent.removeChild(PLACEHOLDER);
    document.body.removeChild(this.clone);

    // Revert element to it's original position
    this.item.classList.remove('hidden');
  };


  module.exports = Drag;

}());