/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

  module('initialize', {
    setup: function() {
        this.child = $('#child')[0];
        this.parent = $('#parent')[0];
        this.instance = new window.fixto.FixToContainer(this.child, this.parent);
    }
  });

  test('initialize', function() {
    var instance = this.instance;
    equal(instance.child, this.child, 'correct child');
    equal(instance.parent, this.parent, 'correct parent');
    ok(instance._replacer instanceof window.fixto.mimicNode.MimicNode, 'replacer instance of mimic node');
    equal(instance.options.className, 'fixto-fixed', 'default class name');
    equal(instance._ghostNode, instance._replacer.replacer);
    equal(instance._toresize, window || document.documentElement, 'element to resize set');
    equal(instance._childOriginalPosition, '', 'saved style');
  });
  
  module('options', {
    setup: function() {
        this.child = $('#child')[0];
        this.parent = $('#parent')[0];
        this.instance = new window.fixto.FixToContainer(this.child, this.parent, {className:'coolclass', zIndex:5, mind:"#mindy"});
    }
  });
  
  test('options', function() {
    var instance = this.instance;
    equal(instance.options.className, 'coolclass', 'classname option passed');
    equal(instance.options.zIndex, 5, 'zIndex option passed');
    equal(instance.child.style.zIndex, "5", 'child has correct zIndex');
    equal(instance.options.mind, '#mindy', 'mind option passed');
    ok(instance._$mind.jquery, '_$mind is a jquery object');
  });
  
  module('functions', {
    setup: function() {
        this.child = $('#child')[0];
        this.parent = $('#parent')[0];
        this.instance = new window.fixto.FixToContainer(this.child, this.parent);
    }
  });
  
  test('onscroll', function() {
    var instance = this.instance;
    instance._onscroll();
    equal(instance._scrollTop, 0, 'scrolltop set');
    equal(instance._parentBottom, -9975,'paddingBotom set');
    
  });
  
  test('adjust', function() {
    var instance = this.instance;
    instance._onscroll();
    instance._adjust();
    equal(instance.child.style.top, '-9975px');
  });

  test('fulloffset', function() {
    var instance = this.instance;
    equal(instance._fullOffset('offsetTop', this.child), -9975);
  });
  
  test('fix unfix', function() {
    var instance = this.instance;
    instance._fix();
    equal(instance.child.style.position, 'fixed', 'fixed');
    instance._unfix();
    equal(instance.child.style.position, instance._childOriginalPosition, 'unfixed');
  });
  
  test('_saveStyles _onresize', 0, function() {
    var instance = this.instance;
    instance._saveStyles();
    instance._onresize();
  });
  
  module('mindtop', {
    setup: function() {
        this.child = $('#child')[0];
        this.parent = $('#parent')[0];
        this.instance = new window.fixto.FixToContainer(this.child, this.parent, {mind:'#mindy, #mindy2'});
    }
  });
  
  test('_mindtop', function() {
    var instance = this.instance;
    var top = instance._mindtop();
    equal(top, 25, 'calculating mindtop properly');
  });
  
  module('expose', {
    setup: function() {

    }
  });
  
  test('expose, plugin', function() {
    var module = window.fixto;
    ok(module.FixToContainer);
    ok(module.fixTo);
    ok(module.computedStyle);
    ok(module.mimicNode);
    ok($.fn.fixTo, 'jQuery plugin defined');
  });

}(window.jQuery));
