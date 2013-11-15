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

}());