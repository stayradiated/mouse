(function () {

  'use strict';

  var Drop;

  Drop = function (options) {

    // Load options
    this.mouse = options.mouse;
    this.el = options.el;

    // Instance variables
    this.hover = false;
    this.active = false;

    // Events
    this.mouse.on('start-drag', this.activate.bind(this));
    this.mouse.on('end-drag', this.deactivate.bind(this));

  };

  Drop.prototype.activate = function () {
    this.active = true;
  };

  Drop.prototype.deactivate = function () {
    this.active = false;
  };

  Drop.prototype.enter = function (event) {
    console.log('maybe')
    if (! this.active) { return; }
    console.log('enter');
  };

  Drop.prototype.leave = function (event) {
    if (! this.active) { return; }
    console.log('leave');
  };

  Drop.prototype.init = function () {
    this.el.addEventListener('mouseenter', this.enter.bind(this));
    this.el.addEventListener('mouseleave', this.leave.bind(this));
  };

  module.exports = Drop;

}());