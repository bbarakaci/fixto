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

  module('mimicnode', {
    setup: function() {
        this.target = $('#target')[0];
        this.md = new window.fixto.mimicNode.MimicNode(this.target);
    }
  });

  test('replace', 6, function() {     
      var rect = this.target.getBoundingClientRect();
      this.md.replace();
      this.target.style.display = 'none';
      var mdrect = this.md.replacer.getBoundingClientRect();
      equal(mdrect.top, rect.top, 'top');
      equal(mdrect.left, rect.left, 'left');
      equal(mdrect.right, rect.right, 'right');
      equal(mdrect.bottom, rect.bottom, 'bottom');
      equal(mdrect.height, rect.height, 'height');
      equal(mdrect.width, rect.width, 'width');
  });
  test('hide', 1, function() {
      this.md.replace();
      this.md.hide();
      equal(this.md.replacer.style.display,'none', 'hide');
  });
  test('destroy', function() {
      var replacer = this.md.replacer;
      this.md.destroy();
      equal(replacer.parentNode, null);
      equal(this.md.replacer, null);
  });


}(window.jQuery));
