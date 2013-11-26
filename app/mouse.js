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
          /Volumes/Home/Projects/Select/source/mouse.js
        */

        './select': 1,
        './elements': 3
      }, function(require, module, exports) {
        (function () {
      
        'use strict';
      
        var Mouse, Select, Items;
      
        Select = require('./select');
        Items = require('./elements');
      
      
        Mouse = function (options) {
      
          this.parent = options.parent;
      
          this.items = new Items({
            parent: this.parent,
            query: options.query
          });
      
          this.select = new Select({
            items: this.items
          });
      
          // Minimum distance mouse must move before considered moving
          this.min = 5;
      
          // Mouse state
          this.down = false;
          this.moving = false;
        };
      
      
        /**
         * Mouse down event listener
         * - event (Event) : the mousedown event
         * > void
         */
      
        Mouse.prototype._down = function (event) {
          this.down = true;
          this.start = event;
          this.items.fetch();
      
          if (this.items.isItem(event.target)) {
            this.drag = true;
          }
      
        };
      
      
        /**
         * Mouse move event listener
         * - event (Event) : the mousemove event
         * > void
         */
      
        Mouse.prototype._move = function (event) {
      
          if (! this.down) {
            return;
          }
      
          if (this.moving) {
            if (this.drag) {
              console.log('dragging item');
            } else {
              this.select.move(event);
            }
          } else if (
            Math.abs(event.x - this.start.x) > this.min ||
            Math.abs(event.y - this.start.y) > this.min
          ) {
            this.moving = true;
            if (this.drag) {
              console.log('drag start');
            } else {
              this.select.start(event);
            }
          }
        };
      
      
        /**
         * Mouse up event listener
         * - event (Event) : the mouseup event
         * > void
         */
      
        Mouse.prototype._up = function () {
      
          if (! this.down) {
            return;
          }
      
          if (this.drag) {
            console.log('drag end');
          } else {
            this.select.end();
          }
      
          this.drag = false;
          this.down = false;
          this.moving = false;
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
      
        if (typeof window !== 'undefined') {
          window.Mouse = Mouse;
        }
      
        module.exports = Mouse;
      
      }());
      ;
      }
    ], [
      {
        /*
          /Volumes/Home/Projects/Select/source/select.js
        */

        './box': 2
      }, function(require, module, exports) {
        (function () {
      
        'use strict';
      
        var Box, Select;
      
        Box = require('./box');
      
        Select = function (options) {
          this.items = options.items;
          this.box = null;
        };
      
        Select.prototype.start = function (event) {
      
          var append = event.ctrlKey || event.metaKey;
      
          if (this.box) {
            this.box.remove();
          }
      
          this.box = new Box();
          this.box.reset(event).update();
      
          this.items.reset(append).check(this.box);
        };
      
        Select.prototype.move = function (event) {
          this.box.setEnd(event).update();
          this.items.check(this.box);
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
          /Volumes/Home/Projects/Select/source/box.js
        */

      }, function(require, module, exports) {
        (function () {
      
        'use strict';
      
        var Box;
      
        Box = function () {
      
          // Create dom element
          this.el = document.createElement('div');
          this.el.className = Box.className;
          document.body.appendChild(this.el);
      
          this.el.style.left   = '-10px';
          this.el.style.top    = '-10px';
          this.el.style.width  = 0;
          this.el.style.height = 0;
      
          this.mouse = {
            start: {},
            end: {}
          };
      
        };
      
        Box.className = 'select_js_box';
      
        Box.prototype.setStart = function (position) {
          this.mouse.start.x = position.pageX;
          this.mouse.start.y = position.pageY;
          return this;
        };
      
        Box.prototype.setEnd = function (position) {
          this.mouse.end.x = position.pageX;
          this.mouse.end.y = position.pageY;
          return this;
        };
      
        Box.prototype.reset = function (position) {
          this.setStart(position);
          this.setEnd(position);
          return this;
        };
      
        Box.prototype.remove = function () {
          var el = this.el;
          el.className += ' hide';
          setTimeout(function () {
            document.body.removeChild(el);
          }, 200);
          return this;
        };
      
        Box.prototype.render = function () {
          this.el.style.top    = this.top + 'px';
          this.el.style.left   = this.left + 'px';
          this.el.style.width  = this.right - this.left + 'px';
          this.el.style.height = this.bottom - this.top + 'px';
          return this;
        };
      
        Box.prototype.update = function () {
          var start, end;
      
          end          = this.mouse.end;
          start        = this.mouse.start;
      
          if (end.x > start.x) {
            this.left  = start.x;
            this.right = end.x;
          } else {
            this.left  = end.x;
            this.right = start.x;
          }
      
          if (end.y > start.y) {
            this.top    = start.y;
            this.bottom = end.y;
          } else {
            this.top    = end.y;
            this.bottom = start.y;
          }
      
          return this;
      
        };
      
        module.exports = Box;
      
      }());;
      }
    ], [
      {
        /*
          /Volumes/Home/Projects/Select/source/elements.js
        */

      }, function(require, module, exports) {
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
      
      
        Items.prototype.reset = function (append) {
          var i, el, rect, pos;
      
          for (i = 0; i < this.elements.length; i++) {
      
            el = this.elements[i];
      
            if (! append) {
              el.classList.remove('selected');
              el.selected = false;
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
      
      }());;
      }
    ]
  ]);

}).call(this);
