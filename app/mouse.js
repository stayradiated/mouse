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

        './items': 1,
        './mouse': 3,
        './select': 5,
        './drag': 7,
        './drop': 8
      }, function(require, module, exports) {
        (function () {
      
        'use strict';
      
        var Api, Items, Mouse, Select, Drag, Drop;
      
        Items = require('./items');
        Mouse = require('./mouse');
        Select = require('./select');
        Drag = require('./drag');
        Drop = require('./drop');
      
        Api = function (options) {
      
          this.drops = [];
          this.parent = options.parent;
      
          this.items = new Items({
            parent: this.parent,
            query: options.query
          });
      
          this.mouse = new Mouse({
            parent: this.parent,
            items: this.items
          });
      
          this.select = new Select({
            mouse: this.mouse,
            items: this.items
          });
      
          this.drag = new Drag({
            mouse: this.mouse
          });
      
        };
      
        Api.prototype.init = function () {
          this.mouse.init();
        };
      
        Api.prototype.drop = function (el) {
          var drop = new Drop({
            mouse: this.mouse,
            el: el
          });
          this.drops.push(drop);
        };
      
        if (typeof window !== 'undefined') {
          window.Mouse = Api;
        }
      
        module.exports = Api;
      
      }());;
      }
    ], [
      {
        /*
          /Volumes/Home/Projects/Mouse/source/items.js
        */

        './rectangle': 2
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

        'signals': 4
      }, function(require, module, exports) {
        (function () {
      
        'use strict';
      
        var smoke, Mouse, DEFAULT, SELECT, DRAG;
      
        smoke = require('signals');
      
        // Modes
        DEFAULT = 0;
        SELECT = 1;
        DRAG = 2;
      
        Mouse = function (options) {
      
          smoke.convert(this);
      
          this.parent = options.parent;
          this.items = options.items;
      
          // Minimum distance mouse must move before considered moving
          this.min = 5;
      
          // Mouse state
          this.down = false;
          this.moving = false;
          this.mode = DEFAULT;
        };
      
      
        /**
         * Mouse down event listener
         * - event (Event) : the mousedown event
         * > void
         */
      
        Mouse.prototype._down = function (event) {
      
          if (event.which !== 1) {
            return;
          }
      
          this.down = true;
          this.start = event;
          this.items.fetch();
          this.item = this.items.find(event.target);
      
          if (this.item) {
            this.mode = DRAG;
            this.emit('prepare-drag', this.item);
          } else {
            this.mode = SELECT;
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
              this.emit('move-drag', event);
            } else {
              this.emit('move-select', event);
            }
          } else if (
            Math.abs(event.x - this.start.x) > this.min ||
            Math.abs(event.y - this.start.y) > this.min
          ) {
            this.moving = true;
            if (this.mode === DRAG) {
              this.emit('start-drag', this.start);
            } else {
              this.emit('start-select', this.start);
            }
          }
        };
      
      
        /**
         * Mouse up event listener
         * - event (Event) : the mouseup event
         * > void
         */
      
        Mouse.prototype._up = function () {
      
          if (! this.down) { return; }
          this.down = false;
      
          if (! this.moving) {
            if (this.mode === SELECT) { this.items.clear(); }
            return;
          }
          this.moving = false;
      
          if (this.mode === DRAG) {
            this.emit('end-drag');
          } else if (this.mode === SELECT) {
            this.emit('end-select');
          }
      
          this.mode = DEFAULT;
        };
      
      
        /**
         * Bind the mouse events
         * > void
         */
      
        Mouse.prototype.init = function () {
          this.parent.addEventListener('mousedown', this._down.bind(this));
          document.addEventListener('mousemove', this._move.bind(this));
          document.addEventListener('mouseup', this._up.bind(this));
        };
      
        module.exports = Mouse;
      
      }());
      ;
      }
    ], [
      {
        /*
          /Volumes/Home/Projects/Mouse/node_modules/signals/index.js
        */

      }, function(require, module, exports) {
        // in a few cases we've chosen optimizing script length over efficiency of code.
      // I think that is the right choice for this library.  If you're adding and
      // triggering A LOT of events, you might want to use a different library.
      var smokesignals = {
          convert: function(obj, handlers) {
              // we store the list of handlers as a local variable inside the scope
              // so that we don't have to add random properties to the object we are
              // converting. (prefixing variables in the object with an underscore or
              // two is an ugly solution)
              //      we declare the variable in the function definition to use two less
              //      characters (as opposed to using 'var ').  I consider this an inelegant
              //      solution since smokesignals.convert.length now returns 2 when it is
              //      really 1, but doing this doesn't otherwise change the functionallity of
              //      this module, so we'll go with it for now
              handlers = {};
      
              // add a listener
              obj.on = function(eventName, handler) {
                  // either use the existing array or create a new one for this event
                  //      this isn't the most efficient way to do this, but is the shorter
                  //      than other more efficient ways, so we'll go with it for now.
                  (handlers[eventName] = handlers[eventName] || [])
                      // add the handler to the array
                      .push(handler);
      
                  return obj;
              };
      
              // add a listener that will only be called once
              obj.once = function(eventName, handler) {
                  // create a wrapper listener, that will remove itself after it is called
                  function wrappedHandler() {
                      // remove ourself, and then call the real handler with the args
                      // passed to this wrapper
                      handler.apply(obj.off(eventName, wrappedHandler), arguments);
                  }
                  // in order to allow that these wrapped handlers can be removed by
                  // removing the original function, we save a reference to the original
                  // function
                  wrappedHandler.h = handler;
      
                  // call the regular add listener function with our new wrapper
                  return obj.on(eventName, wrappedHandler);
              };
      
              // remove a listener
              obj.off = function(eventName, handler) {
                  // loop through all handlers for this eventName, assuming a handler
                  // was passed in, to see if the handler passed in was any of them so
                  // we can remove it
                  //      it would be more efficient to stash the length and compare i
                  //      to that, but that is longer so we'll go with this.
                  for (var list = handlers[eventName], i = 0; handler && list && list[i]; i++) {
                      // either this item is the handler passed in, or this item is a
                      // wrapper for the handler passed in.  See the 'once' function
                      list[i] != handler && list[i].h != handler ||
                          // remove it!
                          list.splice(i--,1);
                  }
                  // if i is 0 (i.e. falsy), then there are no items in the array for this
                  // event name (or the array doesn't exist)
                  if (!i) {
                      // remove the array for this eventname (if it doesn't exist then
                      // this isn't really hurting anything)
                      delete handlers[eventName];
                  }
                  return obj;
              };
      
              obj.emit = function(eventName) {
                  // loop through all handlers for this event name and call them all
                  //      it would be more efficient to stash the length and compare i
                  //      to that, but that is longer so we'll go with this.
                  for(var list = handlers[eventName], i = 0; list && list[i];) {
                      list[i++].apply(obj, list.slice.call(arguments, 1));
                  }
                  return obj;
              };
      
              return obj;
          }
      };
      
      module.exports = smokesignals;
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
          this.mouse = options.mouse;
          this.items = options.items;
          this.box = null;
      
          // Bind events
          this.mouse.on('start-select', this.start);
          this.mouse.on('move-select', this.move);
          this.mouse.on('end-select', this.end);
      
        };
      
        Select.prototype.start = function (event) {
          var append = event.ctrlKey || event.metaKey;
          if (this.box) { this.box.remove(); }
      
          this.box = new Box();
          this.box.setStart(event);
      
          this.items.reset(append).check(this.box.rect);
        };
      
        Select.prototype.move = function (event) {
          this.box.setEnd(event);
          this.items.check(this.box.rect);
          this.box.render();
        };
      
        Select.prototype.end = function () {
          this.box.remove();
          this.box = null;
          this.items.select();
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

        './rectangle': 2
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
          this.oldTop = 0;
          this.oldLeft = 0;
      
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
      
        Drag.prototype.end = function () {
      
          // Remove placeholder
          this.parent.removeChild(PLACEHOLDER);
      
          // Revert element to it's original position
          this.item.classList.remove('draggable');
          this.item.style.top = this.oldTop;
          this.item.style.left = this.oldLeft;
        };
      
      
        module.exports = Drag;
      
      }());;
      }
    ], [
      {
        /*
          /Volumes/Home/Projects/Mouse/source/drop.js
        */

        './rectangle': 2
      }, function(require, module, exports) {
        (function () {
      
        'use strict';
      
        var Drop, Rectangle;
      
        Rectangle = require('./rectangle');
      
        Drop = function (options) {
      
          // Load options
          this.mouse = options.mouse;
          this.el = options.el;
      
          // Instance variables
          this.hover = false;
          this.active = false;
          this.rect = new Rectangle()
      
          // Events
          this.mouse.on('start-drag', this.activate.bind(this));
          this.mouse.on('end-drag', this.deactivate.bind(this));
          this.mouse.on('move-drag', this.move.bind(this));
        };
      
        Drop.prototype.activate = function () {
          this.active = true;
          this.rect.setRect(this.el.getBoundingClientRect());
        };
      
        Drop.prototype.deactivate = function () {
          this.active = false;
        };
      
        Drop.prototype.move = function (event) {
          var hit = this.rect.contains(event.pageX, event.pageY);
          if (! this.hover && hit) {
            this.enter();
          } else if (this.hover && ! hit) {
            this.leave();
          }
        };
      
        Drop.prototype.enter = function (event) {
          this.hover = true;
          this.el.classList.add('droppable');
        };
      
        Drop.prototype.leave = function (event) {
          this.hover = false;
          this.el.classList.remove('droppable');
        };
      
        module.exports = Drop;
      
      }());;
      }
    ]
  ]);

}).call(this);
