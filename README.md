# Select

> Draw select boxes with your mouse (in a browser).

The default style is based on Mac OSX. It fades out as well.

Currently it just draws a pretty box to the screen (it's like drawing rectangles on the desktop).

![Example](example.jpg)

## Usage
    
    // package.json
    "dependencies": {
      "select": "git://github.com/stayradiated/select.git#master"
    }

    // app
    var Select = require('select');
    var select = new Select({
      parent: document.body,
      query: '.selectables'
    });
    select.init();

## Todo

- Add CSS vendor prefixes
- Allow users to set the fadeout time
