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
          /Volumes/Home/Projects/Select/source/select.js
        */

        './box': 1,
        './elements': 2
      }, function(require, module, exports) {
        (function () {
      
        'use strict';
      
        var Box, Elements, Select;
      
        // Classes
        Box = require('./box');
        Elements = require('./elements');
      
        Select = function (options) {
          this.parent = options.parent;
          this.elements = new Elements(options);
          this.min = 5;
          this.box = null;
          this.down = false;
          this.moving = false;
        };
      
        Select.prototype.create = function (event) {
          if (this.box) { this.box.remove(); }
          this.box = (new Box()).reset(event).update();
          this.elements.reset(event.ctrlKey || event.metaKey).check(this.box);
        };
      
        Select.prototype.update = function (event) {
          this.box.setEnd(event).update();
          this.elements.check(this.box);
        };
      
        Select.prototype._mousedown = function (event) {
          this.down = true;
          this.start = event;
          this.create(event);
        };
      
        Select.prototype._mousemove = function (event) {
          if (!this.down) { return; }
      
          if (this.moving) {
            this.update(event);
            this.box.render();
      
          } else if (
            Math.abs(event.x - this.start.x) > this.min ||
            Math.abs(event.y - this.start.y) > this.min
          ) {
            this.moving = true;
            this.update(event);
            this.box.render();
          }
        };
      
        Select.prototype._mouseup = function () {
          if (!this.down) { return; }
          this.down = false;
          this.moving = false;
          this.box.remove();
          this.box = null;
          this.elements.select();
        };
      
        Select.prototype.init = function () {
          this.parent.addEventListener('mousedown', this._mousedown.bind(this));
          document.addEventListener('mousemove', this._mousemove.bind(this));
          document.addEventListener('mouseup', this._mouseup.bind(this));
        };
      
        if (typeof window !== 'undefined') {
          window.Select = Select;
        }
      
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
      
        var Elements;
      
        Elements = function (options) {
          this.parent = options.parent;
          this.query = options.query;
          this.selected = [];
        };
      
        Elements.prototype.reset = function (append) {
          var i, el, rect, pos;
      
          this.el = this.parent.querySelectorAll(this.query);
      
          for (i = 0; i < this.el.length; i++) {
      
            el = this.el[i];
      
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
      
        Elements.prototype.check = function (box) {
          var i, el, pos, hit;
      
          for (i = 0; i < this.el.length; i++) {
      
            el = this.el[i];
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
      
        Elements.prototype.select = function () {
          var i, el;
      
          this.selected = [];
      
          for (i = 0; i < this.el.length; i++) {
            el = this.el[i];
      
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
      
        module.exports = Elements;
      
      }());;
      }
    ]
  ]);

}).call(this);
