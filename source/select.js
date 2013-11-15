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
