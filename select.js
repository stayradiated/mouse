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
    },
    top_left: {
      x: 0,
      y: 0
    },
    bottom_right: {
      x: 0,
      y: 0
    }
  };

  var selected = [];
  var selector = '.selectables div';
  var elements = null;

  // The current box element
  var box = null;

  // Select the elements
  var resetElements = function (append) {
    var i, rect, pos;
    elements = document.querySelectorAll(selector);
    for (i = 0; i < elements.length; i++) {

      if (! append) {
        elements[i].className = '';
        elements[i].selected = false;
      }

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

  var checkElements = function (append) {
    var i, el, pos, top_left, bottom_right;

    top_left     = position.top_left;
    bottom_right = position.bottom_right;

    for (i = 0; i < elements.length; i++) {
      el = elements[i];
      pos = el.position;

      hit = !(
        pos.left   > bottom_right.x ||
        pos.right  < top_left.x     ||
        pos.top    > bottom_right.y ||
        pos.bottom < top_left.y
      );

      if ((hit && !el.selected) || (!hit && el.selected)) {
        el.className = classname.selected;
        el._selected = true;
      } else {
        el.className = '';
        el._selected = false;
      }

    }
  };

  var getSelected = function () {
    var i;
    selected = [];
    for (i = 0; i < elements.length; i++) {
      if (elements[i]._selected) {
        elements[i]._selected = false;
        elements[i].selected = true;
        selected.push(elements[i]);
      } else {
        elements[i].selected = false;
      }
    }
    console.log(selected.length);
    return selected;
  };

  var setCorners = function () {
    var start, end, top_left, bottom_right;

    end          = position.end;
    start        = position.start;
    top_left     = position.top_left;
    bottom_right = position.bottom_right;

    if (end.x > start.x) {
      top_left.x     = start.x;
      bottom_right.x = end.x;
    } else {
      top_left.x     = end.x;
      bottom_right.x = start.x;
    }

    if (end.y > start.y) {
      top_left.y     = start.y;
      bottom_right.y = end.y;
    } else {
      top_left.y     = end.y;
      bottom_right.y = start.y;
    }

  };


  // Create a new box
  var createNewBox = function () {
    if (box !== null) { removeBox(); }
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
    box.style.top    = position.top_left.y + 'px';
    box.style.left   = position.top_left.x + 'px';
    box.style.width  = position.bottom_right.x - position.top_left.x + 'px';
    box.style.height = position.bottom_right.y  - position.top_left.y + 'px';
  };

  var active = false;

  document.addEventListener('mousedown',function (event) {
    active = true;
    position.end.x = position.start.x = event.x;
    position.end.y = position.start.y = event.y;
    setCorners();
    resetElements(event.ctrlKey || event.metaKey);
    createNewBox();
    render();
    checkElements();
  });

  document.addEventListener('mousemove', function (event) {
    if (!active) { return; }
    position.end.x = event.x;
    position.end.y = event.y;
    setCorners();
    render();
    checkElements();
  });

  document.addEventListener('mouseup', function (event) {
    active = false;
    removeBox();
    getSelected();
  });

}());
