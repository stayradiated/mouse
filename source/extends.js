'use strict';

module.exports = function (child, parent) {

  for (var key in parent) {
    if (parent.hasOwnProperty(key)) {
      child[key] = parent[key];
    }
  }

  function Klass() {
    this.constructor = child;
  }

  Klass.prototype = parent.prototype;
  child.prototype = new Klass();
  child.__super__ = parent.prototype;

  return child;

};
