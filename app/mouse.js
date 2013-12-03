(function() {
  (function(files) {
    var cache, module, req;
    cache = {};
    req = function(id) {
      var file;
      if (cache[id] == null) {
        if (files[id] == null) {
          if ((typeof require !== "undefined" && require !== null)) {
            return require(id);
          }
          console.error("Cannot find module '" + id + "'");
          return null;
        }
        file = cache[id] = {
          exports: {}
        };
        files[id][1].call(file.exports, (function(name) {
          var realId;
          realId = files[id][0][name];
          return req(realId != null ? realId : name);
        }), file, file.exports);
      }
      return cache[id].exports;
    };
    if (typeof module === 'undefined') {
      module = {};
    }
    return module.exports = req(0);
  })([
    [
      {
        /*
          /Volumes/Home/Projects/Mouse/source/api.js
        */

        'signals': 1,
        './items': 2,
        './mouse': 4,
        './select': 5,
        './drag': 7,
        './drop': 8
      }, function(require, module, exports) {
        (function () {
      
        'use strict';
      
        var Api, Signals, Items, Mouse, Select, Drag, Drop;
      
        Signals = require('signals');
        Items = require('./items');
        Mouse = require('./mouse');
        Select = require('./select');
        Drag = require('./drag');
        Drop = require('./drop');
      
        Api = function (options) {
          this.vent = new Signals();
          this.drops = [];
          this.options = options;
          this.parent = options.parent;
          this.removeDrop = this.removeDrop.bind(this);
        };
      
        Api.prototype.init = function () {
      
          if (typeof this.parent === 'string') {
            this.parent = document.querySelector(this.parent);
          }
      
          this.items = new Items({
            parent: this.parent,
            query: this.options.query
          });
      
          this.mouse = new Mouse({
            parent: this.parent,
            items: this.items,
            vent: this.vent
          });
      
          this.select = new Select({
            vent: this.vent,
            items: this.items
          });
      
          this.drag = new Drag({
            vent: this.vent,
            helper: this.options.helper,
            offsetY: this.options.offsetY,
            offsetX: this.options.offsetX
          });
      
          this.vent.on('remove-drop', this.removeDrop);
          this.mouse.init();
        };
      
        Api.prototype.addDrop = function (el) {
          var drop = new Drop({
            vent: this.vent,
            el: el
          });
          this.drops.push(drop);
          return drop;
        };
      
        Api.prototype.removeDrop = function (drop) {
          var index = this.drops.indexOf(drop);
          this.drops.splice(index, 1);
        };
      
        Api.prototype.on = function () {
          this.vent.on.apply(this.vent, arguments);
        };
      
        Api.prototype.once = function () {
          this.vent.once.apply(this.vent, arguments);
        };
      
        Api.prototype.clearSelection = function () {
          this.items.deselectAll();
        };
      
        if (typeof window !== 'undefined') {
          window.Mouse = Api;
        }
      
        module.exports = Api;
      
      }());
      ;
      }
    ], [
      {
        /*
          /Volumes/Home/Projects/Mouse/node_modules/signals/index.js
        */

      }, function(require, module, exports) {
        (function () {
      
        'use strict';
      
        var Signals = function () {
          this.handlers = {};
        };
      
        // Convert an existing object into an event emitter
        Signals.convert = function (obj) {
          var signals = new Signals();
          obj.on   = function () {
            signals.on.apply(signals, arguments);
            return obj;
          };
          obj.once = function () {
            signals.once.apply(signals, arguments);
            return obj;
          };
          obj.off  = function () {
            signals.off.apply(signals, arguments);
            return obj;
          };
          obj.emit = function () {
            signals.emit.apply(signals, arguments);
            return obj;
          };
          return obj;
        };
      
        // add a listener
        Signals.prototype.on = function(eventName, handler) {
          if (! this.handlers.hasOwnProperty(eventName)) {
            this.handlers[eventName] = [];
          }
          this.handlers[eventName].push(handler);
          return this;
        };
      
        // add a listener that will only be called once
        Signals.prototype.once = function(eventName, handler) {
          var wrappedHandler = function () {
            handler.apply(this.off(eventName, wrappedHandler), arguments);
          };
      
          // in order to allow that these wrapped handlers can be removed by
          // removing the original function, we save a reference to the original
          // function
          wrappedHandler.h = handler;
      
          return this.on(eventName, wrappedHandler);
        };
      
        // remove a listener
        Signals.prototype.off = function(eventName, handler) {
          var i, list, len;
          list = this.handlers[eventName];
      
          for(i = list.length - 1; i >= 0; i--) {
            if (list[i] === handler || list[i].h === handler) {
              list.splice(i, 1);
            }
          }
      
          if (list.length === 0 || ! handler) {
            delete this.handlers[eventName];
          }
      
          return this;
        };
      
        Signals.prototype.emit = function(eventName) {
          var i, list, len;
          list = this.handlers[eventName];
          if (typeof list === 'undefined') {
            return this;
          }
          len = list.length;
          for(i = 0; i < len; i++) {
              list[i].apply(this, list.slice.call(arguments, 1));
          }
          return this;
        };
      
        module.exports = Signals;
      
      }());
      ;
      }
    ], [
      {
        /*
          /Volumes/Home/Projects/Mouse/source/items.js
        */

        './rectangle': 3
      }, function(require, module, exports) {
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
            el.rect = new Rectangle(el.getBoundingClientRect());
            el.rect.move(window.pageXOffset, window.pageYOffset);
          }
        };
      
      
        /**
         * Quickly check each of the items to see if they touch the box
         * Important: You must run finishCheck() afterwards.
         * - box (Rectangle) : the box to check the items against
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
      
      }());;
      }
    ], [
      {
        /*
          /Volumes/Home/Projects/Mouse/source/rectangle.js
        */

      }, function(require, module, exports) {
        (function () {
      
        'use strict';
      
        var Rectangle;
      
        Rectangle = function (rect) {
      
          this.top = 0;
          this.left = 0;
          this.width = 0;
          this.height = 0;
          this.bottom = 0;
          this.right = 0;
          this.startX = 0;
          this.startY = 0;
          this.endX = 0;
          this.endY = 0;
      
          if (rect) {
            this.setRect(rect);
          }
      
        };
      
        Rectangle.prototype.setRect = function (rect) {
      
          this.top = rect.top;
          this.left = rect.left;
          this.width = rect.width;
          this.height = rect.height;
          this.updateFromRect();
      
          return this;
        };
      
        Rectangle.prototype.setStart = function (x, y) {
      
          this.startX = x;
          this.startY = y;
          this.setEnd(x, y);
      
          return this;
        };
      
        Rectangle.prototype.setEnd = function (x, y) {
      
          this.endX = x;
          this.endY = y;
          this.updateFromPoints();
      
          return this;
        };
      
        Rectangle.prototype.updateFromPoints = function () {
      
          if (this.endX > this.startX) {
            this.left = this.startX;
            this.right = this.endX;
          } else {
            this.left = this.endX;
            this.right = this.startX;
          }
      
          if (this.endY > this.startY) {
            this.top = this.startY;
            this.bottom = this.endY;
          } else {
            this.top = this.endY;
            this.bottom = this.startY;
          }
      
          this.height = this.bottom - this.top;
          this.width = this.right - this.left;
      
          return this;
        };
      
        Rectangle.prototype.updateFromRect = function () {
          this.right = this.left + this.width;
          this.bottom = this.top + this.height;
      
          return this;
        };
      
      
        Rectangle.prototype.move = function (x, y) {
          this.left += x;
          this.right += x;
          this.top += y;
          this.bottom += y;
      
          return this;
        };
      
        Rectangle.prototype.touching = function (rect) {
          return (
            this.left   < rect.right  &&
            this.right  > rect.left   &&
            this.top    < rect.bottom &&
            this.bottom > rect.top
          );
        };
      
        Rectangle.prototype.contains = function (x, y) {
          return (
            x >= this.left && x < this.right &&
            y >= this.top  && y < this.bottom
          );
        };
      
        module.exports = Rectangle;
      
      }());;
      }
    ], [
      {
        /*
          /Volumes/Home/Projects/Mouse/source/mouse.js
        */

      }, function(require, module, exports) {
        (function () {
      
        'use strict';
      
        var Mouse, DEFAULT, SELECT, DRAG;
      
        // Modes
        DEFAULT = 0;
        SELECT = 1;
        DRAG = 2;
      
        Mouse = function (options) {
          this.vent = options.vent;
          this.parent = options.parent;
          this.items = options.items;
      
          // Minimum distance mouse must move before considered moving
          this.min = 5;
      
          // Mouse state
          this.down = false;
          this.moving = false;
          this.mode = DEFAULT;
      
          this._up = this._up.bind(this);
          this._down = this._down.bind(this);
          this._move = this._move.bind(this);
        };
      
      
        Mouse.prototype.selected = function () {
          return this.items.selected.length > 0 ? this.items.selected : [this.item];
        };
      
        Mouse.prototype.holdingAppend = function (event) {
          return event.ctrlKey || event.metaKey;
        };
      
        /**
         * Mouse down event listener
         * - event (Event) : the mousedown event
         * > void
         */
      
        Mouse.prototype._down = function (event) {
      
          // Ignore middle clicks
          if (event.which === 2) {
            return;
          }
      
          var rightClick = (event.which === 3);
          
          // Update items and check if it was an item that was clicked on
          this.items.fetch();
          this.item = this.items.find(event.target);
      
          // Handle right click
          if (this.item && rightClick) {
            if (! this.item.selected) {
              this.items.deselectAll();
              this.items.selectItem(this.item);
            }
            this.vent.emit('right-click', event, this.selected());
            return;
          }
      
          this.appending = false;
          this.down = true;
          this.start = event;
      
          // if the user clicked on an item
          if (this.item) {
            this.mode = DRAG;
            if (! this.item.selected) {
              if (this.holdingAppend(event)) {
                this.appending = true;
                this.items.selectItem(this.item);
              } else {
                this.items.deselectAll();
              }
            }
            this.vent.emit('prepare-drag', this.selected());
          } else {
            this.mode = SELECT;
            this.vent.emit('prepare-select', event);
          }
      
        };
      
      
        /**
         * Mouse move event listener
         * - event (Event) : the mousemove event
         * > void
         */
      
        Mouse.prototype._move = function (event) {
      
          if (! this.down) { return; }
      
          if (this.moving) {
            if (this.mode === DRAG) {
              this.vent.emit('move-drag', event);
            } else {
              this.vent.emit('move-select', event);
            }
          } else if (
            Math.abs(event.x - this.start.x) > this.min ||
            Math.abs(event.y - this.start.y) > this.min
          ) {
            this.moving = true;
            if (this.mode === DRAG) {
              this.vent.emit('start-drag', this.start);
            } else {
              this.vent.emit('start-select', this.start);
            }
          }
        };
      
      
        /**
         * Mouse up event listener
         * - event (Event) : the mouseup event
         * > void
         */
      
        Mouse.prototype._up = function (event) {
      
          if (! this.down) { return; }
      
          var append = this.holdingAppend(event);
          this.down = false;
      
          if (! this.moving) {
            if (this.mode === SELECT && !append) {
              this.items.deselectAll();
            } else if (this.mode === DRAG && !this.appending && append) {
              this.items.deselectItem(this.item);
            }
            return;
          }
          this.moving = false;
      
          if (this.mode === DRAG) {
            this.vent.emit('end-drag');
          } else if (this.mode === SELECT) {
            this.vent.emit('end-select');
          }
      
          this.mode = DEFAULT;
        };
      
      
        /**
         * Bind the mouse events
         * > void
         */
      
        Mouse.prototype.init = function () {
          this.parent.addEventListener('mousedown', this._down);
          document.addEventListener('mousemove', this._move);
          document.addEventListener('mouseup', this._up);
        };
      
        module.exports = Mouse;
      
      }());
      ;
      }
    ], [
      {
        /*
          /Volumes/Home/Projects/Mouse/source/select.js
        */

        './box': 6
      }, function(require, module, exports) {
        (function () {
      
        'use strict';
      
        var Box, Select;
      
        Box = require('./box');
      
        Select = function (options) {
      
          // Set instance variables
          this.vent = options.vent;
          this.items = options.items;
          this.box = null;
      
          this.prepare = this.prepare.bind(this);
          this.start = this.start.bind(this);
          this.move = this.move.bind(this);
          this.end = this.end.bind(this);
      
          // Bind events
          this.vent.on('prepare-select', this.prepare);
          this.vent.on('start-select', this.start);
          this.vent.on('move-select', this.move);
          this.vent.on('end-select', this.end);
      
        };
      
        Select.prototype.holdingAppend = function (event) {
          return event.ctrlKey || event.metaKey;
        };
      
        Select.prototype.prepare = function (event) {
          if (! this.holdingAppend(event)) {
            this.items.deselectAll();
          }
        };
      
        Select.prototype.start = function (event) {
          var append = this.holdingAppend(event);
          if (this.box) { this.box.remove(); }
      
          this.box = new Box();
          this.box.setStart(event);
      
          if (! append) {
            this.items.deselectAll();
          }
      
          this.items.refreshPosition();
          this.items.check(this.box.rect);
        };
      
        Select.prototype.move = function (event) {
          this.box.setEnd(event);
          this.items.check(this.box.rect);
          this.box.render();
        };
      
        Select.prototype.end = function () {
          this.box.remove();
          this.box = null;
          this.items.finishCheck();
        };
      
        module.exports = Select;
      
      }());
      ;
      }
    ], [
      {
        /*
          /Volumes/Home/Projects/Mouse/source/box.js
        */

        './rectangle': 3
      }, function(require, module, exports) {
        (function () {
      
        'use strict';
      
        var Box, Rectangle;
      
        Rectangle = require('./rectangle');
      
        Box = function () {
      
          // Create dom element
          this.el = document.createElement('div');
          this.el.className = Box.className;
          document.body.appendChild(this.el);
      
          // TODO: Do this via css?
          this.el.style.left   = '-10px';
          this.el.style.top    = '-10px';
          this.el.style.width  = 0;
          this.el.style.height = 0;
      
          this.rect = new Rectangle();
      
        };
      
        Box.className = 'select_js_box';
      
        Box.prototype.setStart = function (event) {
          this.rect.setStart(event.pageX, event.pageY);
          return this;
        };
      
        Box.prototype.setEnd = function (event) {
          this.rect.setEnd(event.pageX, event.pageY);
          return this;
        };
      
        Box.prototype.remove = function () {
          var el = this.el;
          el.className += ' hide';
          setTimeout(function () {
            document.body.removeChild(el);
          }, 200); // Fade out time
          return this;
        };
      
        Box.prototype.render = function () {
          this.el.style.top    = this.rect.top + 'px';
          this.el.style.left   = this.rect.left + 'px';
          this.el.style.width  = this.rect.width + 'px';
          this.el.style.height = this.rect.height + 'px';
          return this;
        };
      
        module.exports = Box;
      
      }());;
      }
    ], [
      {
        /*
          /Volumes/Home/Projects/Mouse/source/drag.js
        */

      }, function(require, module, exports) {
        (function () {
      
        'use strict';
      
      
        var Drag;
      
      
        Drag = function (options) {
      
          // Load options
          this.vent = options.vent;
          this.createHelper = options.helper;
      
          // Set instance variables
          this.items = [];
          this.offsetY = options.offsetY || 0;
          this.offsetX = options.offsetX || 0;
      
          // Create placeholder
          this.helper = document.createElement('div');
          this.helper.className = 'drag-helper';
      
          // Bind events
          this.vent.on('prepare-drag', this.setItems.bind(this));
          this.vent.on('start-drag', this.start.bind(this));
          this.vent.on('move-drag', this.move.bind(this));
          this.vent.on('end-drag', this.end.bind(this));
      
        };
      
      
        /**
         * Set the items that will be dragged
         * - items (Array) : an array of dom elements (with the same parent)
         */
      
        Drag.prototype.setItems = function (items) {
          this.items = items;
        };
      
      
        /**
         * Start dragging the items
         * - event (Event) : the mouse event of when the user first started dragging
         */
      
        Drag.prototype.start = function (event) {
          // Hide all the items
          var i, len = this.items.length;
          for (i = 0; i < len; i++) {
            this.items[i].classList.add('hidden');
          }
      
          // Append the drag helper
          this.helper.innerHTML = this.createHelper(this.items);
          document.body.appendChild(this.helper);
      
          // Move the helper into position
          this.move(event);
        };
      
      
        /**
         * Move the helper to the mouse position
         * - event (Event) : the mouse event of the user moving the mouse
         */
      
        Drag.prototype.move = function (event) {
      
          this.helper.style.top  =
            this.offsetY + window.pageYOffset + event.pageY + 'px';
      
          this.helper.style.left =
            this.offsetX + window.pageXOffset + event.pageX + 'px';
        };
      
      
        /**
         * End the drag
         * - event (Event) : the mouse event of the user ending the drag
         */
      
        Drag.prototype.end = function () {
          // Remove the helper
          document.body.removeChild(this.helper);
      
          // Remove the 'hidden' class from each of the items
          var i, len = this.items.length;
          for (i = 0; i < len; i++) {
            this.items[i].classList.remove('hidden');
          }
        };
      
      
        module.exports = Drag;
      
      }());
      ;
      }
    ], [
      {
        /*
          /Volumes/Home/Projects/Mouse/source/drop.js
        */

        './rectangle': 3
      }, function(require, module, exports) {
        (function () {
      
        'use strict';
      
        var Drop, Rectangle;
      
        Rectangle = require('./rectangle');
      
        Drop = function (options) {
      
          // Load options
          this.vent = options.vent;
          this.mouse = options.mouse;
          this.el = options.el;
      
          // Instance variables
          this.hover = false;
          this.active = false;
          this.rect = new Rectangle();
      
          this.prepare = this.prepare.bind(this);
          this.move = this.move.bind(this);
          this.activate = this.activate.bind(this);
          this.deactivate = this.deactivate.bind(this);
      
          // Events
          this.vent.on('prepare-drag', this.prepare);
          this.vent.on('start-drag', this.activate);
          this.vent.on('end-drag', this.deactivate);
          this.vent.on('move-drag', this.move);
        };
      
        Drop.prototype.prepare = function (items) {
          this.items = items;
        };
      
        Drop.prototype.activate = function () {
          this.active = true;
          this.rect.setRect(this.el.getBoundingClientRect());
        };
      
        Drop.prototype.deactivate = function () {
          this.active = false;
          if (this.hover) {
            this.vent.emit('drop', this.items, this.el);
            this.leave();
          }
        };
      
        Drop.prototype.move = function (event) {
          var hit = this.rect.contains(event.pageX, event.pageY);
          if (! this.hover && hit) {
            this.enter();
          } else if (this.hover && ! hit) {
            this.leave();
          }
        };
      
        Drop.prototype.enter = function () {
          this.hover = true;
          this.el.classList.add('droppable');
        };
      
        Drop.prototype.leave = function () {
          this.hover = false;
          this.el.classList.remove('droppable');
        };
      
        Drop.prototype.remove = function () {
          this.vent.off('start-drag', this.activate);
          this.vent.off('end-drag', this.deactivate);
          this.vent.off('move-drag', this.move);
          this.vent.emit('remove-drop', this);
        };
      
        module.exports = Drop;
      
      }());
      ;
      }
    ]
  ]);

}).call(this);
