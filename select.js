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
      
        // Classes
        var Box = require('./box');
        var Elements = require('./elements');
      
        // Instances
        var elements = new Elements('.selectables div');
        var box = null;
      
        var active = false;
      
        document.addEventListener('mousedown',function (event) {
          active = true;
          if (box) { box.remove(); }
          box = (new Box()).reset(event).update().render();
          elements.reset(event.ctrlKey || event.metaKey).check(box);
        });
      
        document.addEventListener('mousemove', function (event) {
          if (!active) { return; }
          box.setEnd(event).update().render();
          elements.check(box);
        });
      
        document.addEventListener('mouseup', function (event) {
          active = false;
          box.remove();
          box = null;
          elements.select();
        });
      
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
      
        Box = function (start, end) {
      
          // Create dom element
          this.el = document.createElement('div');
          this.el.className = Box.className;
          document.body.appendChild(this.el);
      
          this.mouse = {
            start: {},
            end: {}
          };
      
        };
      
        Box.className = 'select_js_box';
      
        Box.prototype.setStart = function(position) {
          this.mouse.start.x = position.x;
          this.mouse.start.y = position.y;
          return this;
        };
      
        Box.prototype.setEnd = function(position) {
          this.mouse.end.x = position.x;
          this.mouse.end.y = position.y;
          return this;
        };
      
        Box.prototype.reset = function(position) {
          this.setStart(position);
          this.setEnd(position);
          return this;
        };
      
        Box.prototype.remove = function() {
          var el = this.el;
          console.log('removing box');
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
