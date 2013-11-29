(function () {

  'use strict';


  var Drag, PLACEHOLDER;

  PLACEHOLDER = document.createElement('div');
  PLACEHOLDER.className = 'placeholder';

  Drag = function (options) {

    // Load options
    this.mouse = options.mouse;

    // Set instance variables
    this.parent = null;
    this.items = [];
    this.clones = [];
    this.placeholders = [];
    this.offsets = [];

    // Bind events
    this.mouse.on('prepare-drag', this.setItems.bind(this));
    this.mouse.on('start-drag', this.start.bind(this));
    this.mouse.on('move-drag', this.move.bind(this));
    this.mouse.on('end-drag', this.end.bind(this));

  };


  /**
   * Set the items that will be dragged
   * - items (Array) : an array of dom elements (with the same parent)
   */

  Drag.prototype.setItems = function (items) {
    this.items = items;
    this.parent = items[0].parentElement;
  };

  Drag.prototype.start = function (event) {

    var i, item, clone, placeholder, len = this.items.length;

    for (i = 0; i < len; i++) {

      item = this.items[i];

      // Save offset
      this.offsets.push({
        top: item.offsetTop - event.pageY,
        left: item.offsetLeft - event.pageX
      });

      // Add placeholder
      placeholder = PLACEHOLDER.cloneNode();
      this.placeholders.push(placeholder);
      this.parent.insertBefore(placeholder, item);

      // Clone item
      clone = item.cloneNode(true);
      this.clones.push(clone);

      // Hide current itemm
      item.classList.add('hidden')

      // Make draggable
      document.body.appendChild(clone);
      clone.classList.add('draggable');
    }

    this.move(event);
  };

  Drag.prototype.move = function (event) {
    var i, item, offset, len = this.clones.length;
    for (i = 0; i < len; i++) {
      item = this.clones[i];
      offset = this.offsets[i];
      item.style.top  = offset.top  + window.pageYOffset + event.pageY + 'px';
      item.style.left = offset.left + window.pageXOffset + event.pageX + 'px';
    }
  };

  Drag.prototype.end = function () {

    var i, len = this.items.length;

    for (i = 0; i < len; i++) {

      // Remove placeholder
      this.parent.removeChild(this.placeholders[i]);

      // Remove clone
      document.body.removeChild(this.clones[i]);

      // Show original item
      this.items[i].classList.remove('hidden');
    }

    this.clones = [];
    this.placeholders = [];
    this.offsets = [];

  };


  module.exports = Drag;

}());
