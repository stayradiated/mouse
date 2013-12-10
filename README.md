# Mouse.js

> jQuery UI alternative for draggable, droppable, sortable and selectable


## Select.js

Select stuff on the screen with a box.



![Example](example.jpg)

## Usage

    // package.json
    "dependencies": {
      "mouse": "git://github.com/stayradiated/mouse.git#master"
    }

    // app
    var Mouse = require('mouse');
    var mouse = new Mouse({
      parent: document.body,
      query: '.mouse'
    });
    mouse.init();

## Todo

- Add CSS vendor prefixes
- Allow users to set the fadeout time

## Bugs

- Scrolling causes errors
- Dragging all the items causes erorrs
