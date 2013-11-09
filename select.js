(function () {

  // Classnames
  var classname = {
    box: 'select_js_box',
    hide: 'hide',
    selected: 'selected'
  };

  var position = {
    start: {
      x: 0,
      y: 0
    },
    end: {
      x: 0,
      y: 0
    }
  };

  var selector = '.selectables div';
  var elements = null;

  // The current box element
  var box = null;

  // Select the elements
  var getElements = function () {
    var rect, pos;
    elements = document.querySelectorAll(selector);
    for (var i = 0; i < elements.length; i++) {
      rect = elements[i].getBoundingClientRect();
      pos = {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
      };
      elements[i].position = {
        top: pos.top,
        left: pos.left,
        bottom: pos.top + rect.height,
        right: pos.left + rect.width
      };
    }
  };

  var checkElements = function () {
    var i, el, pos;
    for (i = 0; i < elements.length; i++) {
      el = elements[i];
      pos = el.position;
      // if () {}
    }
  };


  // Create a new box
  var createNewBox = function () {
    if (box !== null) removeBox();
    box = document.createElement('div');
    box.className = classname.box;
    document.body.appendChild(box);
  };

  // Remove the current box
  var removeBox = function () {
    var currentBox = box;
    currentBox.className = classname.box + ' ' + classname.hide;
    setTimeout(function () {
      document.body.removeChild(currentBox);
    }, 200);
    box = null;
  };

  // Draw the box to the screen
  var render = function () {

    var x1, x2, y1, y2;

    if (position.end.x > position.start.x) {
      x1 = position.start.x;
      x2 = position.end.x;
    } else {
      x1 = position.end.x;
      x2 = position.start.x;
    }
    if (position.end.y > position.start.y) {
      y1 = position.start.y;
      y2 = position.end.y;
    } else {
      y1 = position.end.y;
      y2 = position.start.y;
    }

    box.style.left = x1 + 'px';
    box.style.top = y1 + 'px';
    box.style.width = x2 - x1 + 'px';
    box.style.height = y2 - y1 + 'px';

    console.log({
      left: x1,
      top: y1,
      width: x2 - x1,
      height: y2 - y1
    })

  };

  var active = false;

  document.addEventListener('mousedown',function (event) {
    active = true;
    position.end.x = position.start.x = event.x;
    position.end.y = position.start.y = event.y;
    getElements();
    createNewBox()
    render();
  });

  document.addEventListener('mousemove', function (event) {
    if (!active) return;
    position.end.x = event.x;
    position.end.y = event.y;
    render();
  });

  document.addEventListener('mouseup', function (event) {
    active = false;
    removeBox();
  });

}());