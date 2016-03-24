// .slate.js

// utility
var util = {
  key: function(k, mod) {
    return k + ':ctrl,cmd' + (mod ? ',' + mod : '');
  },
  focusWindow: function(f) {
    var hit = false;
    slate.eachApp(function(app) {
      if (hit) return;
      app.eachWindow(function(win) {
        if (hit) return;
        if (f(win)) {
          win.focus();
          hit = true;
        }
      });
    });
  },
  nextScreen: function(screen) {
    return slate.screenForRef(String( (screen.id()+1)%slate.screenCount() ));
  },
  resizeBasic: function(d) {
    return slate.operation('corner', {
      direction: d,
      width: 'screenSizeX/1.05',
      height: 'screenSizeY/1.01'
    });
  }
};

// slate.bind(util.key('return'), function(win) {
//   slate.shell('/usr/bin/open -n -a iTerm');
// });

// relaunch slate 
slate.bind(util.key('r'), function(win) {
  slate.operation('relaunch').run();
});

// focus
slate.bind(util.key('o', 'shift'), function(win) {
  var next = util.nextScreen(slate.screen());
  util.focusWindow(function(win) {
    return win.screen().id() == next.id();
  });
});
slate.bind(util.key('i', 'shift'), slate.operation('focus', { direction: 'behind' }));

// Move window
slate.bind(util.key('left'), function(win) {
  if (!win) return;
  var rect = win.rect();
  var bounds = win.screen().visibleRect();
  rect.x -= bounds.width * 0.05;
  win.doOperation('move', rect);
});
slate.bind(util.key('down'), function(win) {
  if (!win) return;
  var rect = win.rect();
  var bounds = win.screen().visibleRect();
  rect.y += bounds.height * 0.05;
  win.doOperation('move', rect);
});
slate.bind(util.key('up'), function(win) {
  if (!win) return;
  var rect = win.rect();
  var bounds = win.screen().visibleRect();
  rect.y -= bounds.height * 0.05;
  win.doOperation('move', rect);
});
slate.bind(util.key('right'), function(win) {
  if (!win) return;
  var rect = win.rect();
  var bounds = win.screen().visibleRect();
  rect.x += bounds.width * 0.05;
  win.doOperation('move', rect);
});

// move to other screen with resizing
slate.bind(util.key('o'), function(win) {
  if (!win) return;
  var next = util.nextScreen(win.screen());
  win.move(next.visibleRect());

  slate.operation('chain', {
    operations: _.map(['top-left'], function(d) {
      return util.resizeBasic(d);
    })
  }).run();
});

// Resize basic window
slate.bind(util.key('0'), slate.operation('chain', {
  operations: _.map(['top-left', 'bottom-left'], function(d) {
    return util.resizeBasic(d);
  })
}));

// Maxmize window
slate.bind(util.key('1'), function(win) {
  if (!win) return;
  var bounds = win.screen().visibleRect();
  win.doOperation('move', bounds);
});

// window top, bottom
slate.bind(util.key('2'), slate.operation('chain', {
  operations: _.map(['top', 'bottom'], function(d) {
    return slate.operation('push', {
      direction: d,
      style: 'bar-resize:screenSizeY/2'
    });
  })
}));

// window left, right
slate.bind(util.key('3'), slate.operation('chain', {
  operations: _.map(['left', 'right'], function(d) {
    return slate.operation('push', {
      direction: d,
      style: 'bar-resize:screenSizeX/2'
    });
  })
}));

// window corner
var corners = slate.bind(util.key('4'), slate.operation('chain', {
  operations: _.map(['top-right', 'bottom-right', 'bottom-left', 'top-left'], function(d) {
    return slate.operation('corner', {
      direction: d,
      width: 'screenSizeX/2',
      height: 'screenSizeY/2'
    });
  })
}));

// Resize windows
slate.bind(util.key('left', 'shift'), function(win){
  if (!win) return;
  var rect = win.rect();
  var bounds = win.screen().visibleRect();
  rect.width -= bounds.width * 0.05;
  win.doOperation('move', rect);
});
slate.bind(util.key('up', 'shift'), function(win){
  if (!win) return;
  var rect = win.rect();
  var bounds = win.screen().visibleRect();
  rect.height -= bounds.height * 0.05;
  win.doOperation('move', rect);
});
slate.bind(util.key('down', 'shift'), function(win){
  if (!win) return;
  var rect = win.rect();
  var bounds = win.screen().visibleRect();
  rect.height += bounds.height * 0.05;
  win.doOperation('move', rect);
});
slate.bind(util.key('right', 'shift'), function(win){
  if (!win) return;
  var rect = win.rect();
  var bounds = win.screen().visibleRect();
  rect.width += bounds.width * 0.05;
  win.doOperation('move', rect);
});

