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
          this.elements = new Elements(options.query);
          this.box = null;
          this.active = false;
        };
      
        Select.prototype.init = function() {
      
          var self = this;
      
          this.parent.addEventListener('mousedown',function (event) {
            self.active = true;
            if (self.box) { self.box.remove(); }
            self.box = (new Box(self.parent)).reset(event).update().render();
            self.elements.reset(event.ctrlKey || event.metaKey).check(self.box);
          });
      
          this.parent.addEventListener('mousemove', function (event) {
            if (!self.active) { return; }
            self.box.setEnd(event).update().render();
            self.elements.check(self.box);
          });
      
          this.parent.addEventListener('mouseup', function (event) {
            self.active = false;
            self.box.remove();
            self.box = null;
            self.elements.select();
          });
      
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
        (function() {
      
        var Box;
      
        Box = function (parent) {
      
          // Create dom element
          this.el = document.createElement('div');
          this.el.className = Box.className;
          parent.appendChild(this.el);
      
          this.mouse = {
            start: {},
            end: {}
          };
      
        };
      
        Box.className = 'select_js_box';
      
        Box.prototype.setStart = function(position) {
          this.mouse.start.x = position.pageX;
          this.mouse.start.y = position.pageY;
          return this;
        };
      
        Box.prototype.setEnd = function(position) {
          this.mouse.end.x = position.pageX;
          this.mouse.end.y = position.pageY;
          return this;
        };
      
        Box.prototype.reset = function(position) {
          this.setStart(position);
          this.setEnd(position);
          return this;
        };
      
        Box.prototype.remove = function() {
          var el = this.el;
          el.className += ' hide';
          setTimeout(function () {
            document.body.removeChild(el);
          }, 200);
          return this;
        };
      
        Box.prototype.render = function() {
          this.el.style.top    = this.top + 'px';
          this.el.style.left   = this.left + 'px';
          this.el.style.width  = this.right - this.left + 'px';
          this.el.style.height = this.bottom - this.top + 'px';
          return this;
        };
      
        Box.prototype.update = function() {
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
      
        Elements = function (query) {
          this.query = query;
          this.selected = [];
        };
      
        Elements.prototype.reset = function(append) {
          var i, el, rect, pos;
      
          this.el = document.querySelectorAll(this.query);
      
          for (i = 0; i < this.el.length; i++) {
      
            el = this.el[i];
      
            if (! append) {
              el.className = '';
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
      
        Elements.prototype.check = function(box) {
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
              el.className = 'selected';
              el._selected = true;
            } else {
              el.className = '';
              el._selected = false;
            }
      
          }
      
          return this;
      
        };
      
        Elements.prototype.select = function() {
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
