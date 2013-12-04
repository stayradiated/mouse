(function () {

  'use strict';

  var Menu, index, createId;

  index = 0;

  createId = function () {
    return 'right-click-menu-' + index++;
  };


  /**
   * - items (Array) : An array of objects
   */

  Menu = function (items, options) {

    var id, message, section, i, len;

    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this.select = this.select.bind(this);
    this.render = this.render.bind(this);
    this.init = this.init.bind(this);

    // Options
    this.duration = options.fadeOut || 0;

    this.vent = options.vent;
    this.id = createId();
    this.contents = [];
    this.active = false;

    for (i = 0, len = items.length; i < len; i++) {
      section = items[i];

      if (this.contents.length > 0) {
        this.contents.push(null);
      }

      for (id in section) {
        if (section.hasOwnProperty(id)) {
          message = section[id];
          this.contents.push([id, message]);
        }
      }

    }

  };

  Menu.prototype.init = function (items) {
    var self = this;

    this.render();

    this.items = items;

    this.el.addEventListener('mousedown', function (event) {
      event.stopPropagation();
      self.select(event);
    });

    document.addEventListener('contextmenu', function (event) {
      event.preventDefault();
    });

    document.addEventListener('mousedown', function (event) {
      if (!(self.active && event.which === 1)) {
        return;
      }
      self.hide();
    });



  };

  Menu.prototype.render = function () {
    var html, id, item, message, i, len;

    this.el = document.createElement('div');
    this.el.className = 'right-click-menu hidden';
    this.el.id = this.id;

    html = '';
    len = this.contents.length;

    for (i = 0; i < len; i++) {
      item = this.contents[i];

      if (item === null) {
        html += '<hr>';

      } else {
        id = item[0];
        message = item[1];
        html += '<div class="item ' + id +
                '" data-id="' + id +
                '">' + message + '</div>';
      }
    }

    this.el.innerHTML = html;
    return document.body.appendChild(this.el);
  };

  Menu.prototype.select = function (event) {
    var id, target;

    event.stopPropagation();

    target = event.target;
    id = target.dataset.id;

    if (id !== null) {
      this.vent.emit('menu:' + id, this.items.selected);
    }

    return this.hide();
  };

  Menu.prototype.show = function (event) {
    event.preventDefault();
    this.active = true;
    this.el.style.top = event.pageY + 'px';
    this.el.style.left = event.pageX + 'px';
    this.el.style.display = 'block';
    return this.el.classList.remove('hidden');
  };

  Menu.prototype.hide = function () {
    var self = this;
    this.active = false;
    this.el.classList.add('hidden');

    return setTimeout(function () {
      self.el.style.display = 'none';
    }, this.duration);

  };

  module.exports = Menu;

}());

