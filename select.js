(function () {

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

  // The current box element
  var box = null;

  // Create a new box
  var createNewBox = function () {
    if (box !== null) removeBox();
    box = document.createElement('div');
    box.className = 'select_js_box';
    document.body.appendChild(box);
  };

  // Remove the current box
  var removeBox = function () {
    var currentBox = box;
    box = null;
    currentBox.className = 'select_js_box hide'
    setTimeout(function () {
      document.body.removeChild(currentBox);
    }, 200);
  };

  // Draw the box to the screen
  var render = function () {

    var diff = {
      x: position.end.x - position.start.x,
      y: position.end.y - position.start.y
    };

    // down right
    if (diff.x >= 0 && diff.y >= 0) {
      box.style.left = position.start.x + 'px';
      box.style.top = position.start.y + 'px';
      box.style.width = diff.x + 'px';
      box.style.height = diff.y + 'px';
    }

    // down left
    else if (diff.x <= 0 && diff.y >= 0) {
      box.style.left = position.end.x + 'px';
      box.style.top = position.start.y + 'px';
      box.style.width = -diff.x + 'px';
      box.style.height = diff.y + 'px';
    }

    // up right
    else if (diff.x >= 0 && diff.y <= 0) {
      box.style.left = position.start.x + 'px';
      box.style.top = position.end.y + 'px';
      box.style.width = diff.x + 'px';
      box.style.height = -diff.y + 'px';
    }

    // up left
    else if (diff.x <= 0 && diff.y <= 0) {
      box.style.left = position.end.x + 'px';
      box.style.top = position.end.y + 'px';
      box.style.width = -diff.x + 'px';
      box.style.height = -diff.y + 'px';
    }

  };

  var active = false;

  document.addEventListener('mousedown',function (event) {
    active = true;
    position.end.x = position.start.x = event.x;
    position.end.y = position.start.y = event.y;
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