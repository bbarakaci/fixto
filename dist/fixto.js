(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! Computed Style - v0.1.1 - 2016-06-18
* https://github.com/bbarakaci/computed-style
* Copyright (c) 2012 Burak Barakaci; Licensed MIT */
window.computedStyle=function(){var e={getAll:function(e){return document.defaultView.getComputedStyle(e)},get:function(e,t){return this.getAll(e)[t]},toFloat:function(e){return parseFloat(e,10)||0},getFloat:function(e,t){return this.toFloat(this.get(e,t))},_getAllCurrentStyle:function(e){return e.currentStyle}};return document.documentElement.currentStyle&&(e.getAll=e._getAllCurrentStyle),e}();
},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _prefix = require('./prefix');

require('computed-style');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var computedStyle = window.computedStyle;

// We will need this frequently. Lets have it as a global until we encapsulate properly.
var transformJsProperty = _prefix.prefix.getJsProperty('transform');

var PositioningContext = function () {
    function PositioningContext() {
        _classCallCheck(this, PositioningContext);
    }

    // Checks if browser creates a positioning context for fixed elements.
    // Transform rule will create a positioning context on browsers who follow the spec.
    // Ie for example will fix it according to documentElement
    // TODO: Other css rules also effects. perspective creates at chrome but not in firefox. transform-style preserve3d effects.


    _createClass(PositioningContext, [{
        key: 'createsContext',
        value: function createsContext() {
            var support = false;
            var parent = document.createElement('div');
            var child = document.createElement('div');

            parent.appendChild(child);
            parent.style[transformJsProperty] = 'translate(0)';
            // Make sure there is space on top of parent
            parent.style.marginTop = '10px';
            parent.style.visibility = 'hidden';
            child.style.position = 'fixed';
            child.style.top = 0;
            document.body.appendChild(parent);
            var rect = child.getBoundingClientRect();
            // If offset top is greater than 0 means transformed element created a positioning context.
            if (rect.top > 0) {
                support = true;
            }
            // Remove dummy content
            document.body.removeChild(parent);
            return support;
        }

        // Get positioning context of an element.
        // We know that the closest parent that a transform rule applied will create a positioning context.

    }, {
        key: 'getContext',
        value: function getContext(element) {
            var parent = void 0;
            var context = null;
            var styles = void 0;

            // Climb up the treee until reaching the context
            while (!context) {
                parent = element.parentNode;
                if (parent === document.documentElement) {
                    return null;
                }

                styles = computedStyle.getAll(parent);
                // Element has a transform rule
                if (styles[transformJsProperty] !== 'none') {
                    context = parent;
                    break;
                }
                element = parent;
            }
            return context;
        }
    }]);

    return PositioningContext;
}();

exports.default = new PositioningContext();

},{"./prefix":5,"computed-style":1}],3:[function(require,module,exports){
'use strict';

var _mimicNode = require('./mimic-node');

var _mimicNode2 = _interopRequireDefault(_mimicNode);

var _prefix = require('./prefix');

var _PositioningContext = require('./PositioningContext');

var _PositioningContext2 = _interopRequireDefault(_PositioningContext);

require('computed-style');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var computedStyle = window.computedStyle;

window.fixto = function ($, window, document) {

    // Will hold if browser creates a positioning context for fixed elements.
    var fixedPositioningContext = void 0;

    // It will return null if position sticky is not supported
    var nativeStickyValue = _prefix.prefix.getCssValue('position', 'sticky');

    // It will return null if position fixed is not supported
    var fixedPositionValue = _prefix.prefix.getCssValue('position', 'fixed');

    // Dirty business
    var ie = navigator.appName === 'Microsoft Internet Explorer';
    var ieversion;

    if (ie) {
        ieversion = parseFloat(navigator.appVersion.split("MSIE")[1]);
    }

    function FixTo(child, parent, options) {
        this._child = child;
        this._$child = $(child);
        this._parent = parent;
        this._options = {
            className: 'fixto-fixed',
            top: 0,
            mindViewport: false
        };
        this._setOptions(options);
    }

    FixTo.prototype = {
        // Returns the total outerHeight of the elements passed to mind option. Will return 0 if none.
        _mindtop: function _mindtop() {
            var top = 0;
            if (this._$mind) {
                var el;
                var rect;
                for (var i = 0, l = this._$mind.length; i < l; i++) {
                    el = this._$mind[i];
                    rect = el.getBoundingClientRect();
                    if (rect.height) {
                        top += rect.height;
                    } else {
                        var styles = computedStyle.getAll(el);
                        top += el.offsetHeight + computedStyle.toFloat(styles.marginTop) + computedStyle.toFloat(styles.marginBottom);
                    }
                }
            }
            return top;
        },

        // Public method to stop the behaviour of this instance.
        stop: function stop() {
            this._stop();
            this._running = false;
        },

        // Public method starts the behaviour of this instance.
        start: function start() {

            // Start only if it is not running not to attach event listeners multiple times.
            if (!this._running) {
                this._start();
                this._running = true;
            }
        },

        //Public method to destroy fixto behaviour
        destroy: function destroy() {
            this.stop();

            this._destroy();

            // Remove jquery data from the element
            this._$child.removeData('fixto-instance');

            // set properties to null to break references
            for (var prop in this) {
                if (this.hasOwnProperty(prop)) {
                    this[prop] = null;
                }
            }
        },

        _setOptions: function _setOptions(options) {
            $.extend(this._options, options);
            if (this._options.mind) {
                this._$mind = $(this._options.mind);
            }
            if (this._options.zIndex) {
                this._child.style.zIndex = this._options.zIndex;
            }
        },

        setOptions: function setOptions(options) {
            this._setOptions(options);
            this.refresh();
        },

        // Methods could be implemented by subclasses

        _stop: function _stop() {},

        _start: function _start() {},

        _destroy: function _destroy() {},

        refresh: function refresh() {}
    };

    // Class FixToContainer
    function FixToContainer(child, parent, options) {
        FixTo.call(this, child, parent, options);
        this._replacer = new _mimicNode2.default(child);
        this._ghostNode = this._replacer.replacer;

        this._saveStyles();

        this._saveViewportHeight();

        // Create anonymous functions and keep references to register and unregister events.
        this._proxied_onscroll = this._bind(this._onscroll, this);
        this._proxied_onresize = this._bind(this._onresize, this);

        this.start();
    }

    FixToContainer.prototype = new FixTo();

    $.extend(FixToContainer.prototype, {

        // Returns an anonymous function that will call the given function in the given context
        _bind: function _bind(fn, context) {
            return function () {
                return fn.call(context);
            };
        },

        // at ie8 maybe only in vm window resize event fires everytime an element is resized.
        _toresize: ieversion === 8 ? document.documentElement : window,

        _onscroll: function _onscroll() {
            this._scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            this._parentBottom = this._parent.offsetHeight + this._fullOffset('offsetTop', this._parent);

            if (this._options.mindBottomPadding !== false) {
                this._parentBottom -= computedStyle.getFloat(this._parent, 'paddingBottom');
            }

            if (this.fixed) {
                if (this._scrollTop > this._parentBottom || this._scrollTop < this._fullOffset('offsetTop', this._ghostNode) - this._options.top - this._mindtop()) {
                    this._unfix();
                    return;
                }
                this._adjust();
            } else if (this._shouldFix()) {
                this._fix();
                this._adjust();
            }
        },

        _shouldFix: function _shouldFix() {
            if (this._scrollTop < this._parentBottom && this._scrollTop > this._fullOffset('offsetTop', this._child) - this._options.top - this._mindtop()) {
                if (this._options.mindViewport && !this._isViewportAvailable()) {
                    return false;
                }
                return true;
            }
        },

        _isViewportAvailable: function _isViewportAvailable() {
            var childStyles = computedStyle.getAll(this._child);
            return this._viewportHeight > this._child.offsetHeight + computedStyle.toFloat(childStyles.marginTop) + computedStyle.toFloat(childStyles.marginBottom);
        },

        _adjust: function _adjust() {
            var top = 0;
            var mindTop = this._mindtop();
            var diff = 0;
            var childStyles = computedStyle.getAll(this._child);
            var context = null;

            if (fixedPositioningContext) {
                // Get positioning context.
                context = _PositioningContext2.default.getContext(this._child);
                if (context) {
                    // There is a positioning context. Top should be according to the context.
                    top = Math.abs(context.getBoundingClientRect().top);
                }
            }

            diff = this._parentBottom - this._scrollTop - (this._child.offsetHeight + computedStyle.toFloat(childStyles.marginBottom) + mindTop + this._options.top);

            if (diff > 0) {
                diff = 0;
            }

            this._child.style.top = diff + mindTop + top + this._options.top - computedStyle.toFloat(childStyles.marginTop) + 'px';
        },

        // Calculate cumulative offset of the element.
        // Optionally according to context
        _fullOffset: function _fullOffset(offsetName, elm, context) {
            var offset = elm[offsetName];
            var offsetParent = elm.offsetParent;

            // Add offset of the ascendent tree until we reach to the document root or to the given context
            while (offsetParent !== null && offsetParent !== context) {
                offset = offset + offsetParent[offsetName];
                offsetParent = offsetParent.offsetParent;
            }

            return offset;
        },

        _fix: function _fix() {
            var child = this._child;
            var childStyle = child.style;
            var childStyles = computedStyle.getAll(child);
            var left = child.getBoundingClientRect().left;
            var width = childStyles.width;

            this._saveStyles();

            if (document.documentElement.currentStyle) {
                // Function for ie<9. When hasLayout is not triggered in ie7, he will report currentStyle as auto, clientWidth as 0. Thus using offsetWidth.
                // Opera also falls here
                width = child.offsetWidth - (computedStyle.toFloat(childStyles.paddingLeft) + computedStyle.toFloat(childStyles.paddingRight) + computedStyle.toFloat(childStyles.borderLeftWidth) + computedStyle.toFloat(childStyles.borderRightWidth)) + 'px';
            }

            // Ie still fixes the container according to the viewport.
            if (fixedPositioningContext) {
                var context = _PositioningContext2.default.getContext(this._child);
                if (context) {
                    // There is a positioning context. Left should be according to the context.
                    left = child.getBoundingClientRect().left - context.getBoundingClientRect().left;
                }
            }

            this._replacer.replace();

            childStyle.left = left - computedStyle.toFloat(childStyles.marginLeft) + 'px';
            childStyle.width = width;

            childStyle.position = 'fixed';
            childStyle.top = this._mindtop() + this._options.top - computedStyle.toFloat(childStyles.marginTop) + 'px';
            this._$child.addClass(this._options.className);
            this.fixed = true;
        },

        _unfix: function _unfix() {
            var childStyle = this._child.style;
            this._replacer.hide();
            childStyle.position = this._childOriginalPosition;
            childStyle.top = this._childOriginalTop;
            childStyle.width = this._childOriginalWidth;
            childStyle.left = this._childOriginalLeft;
            this._$child.removeClass(this._options.className);
            this.fixed = false;
        },

        _saveStyles: function _saveStyles() {
            var childStyle = this._child.style;
            this._childOriginalPosition = childStyle.position;
            this._childOriginalTop = childStyle.top;
            this._childOriginalWidth = childStyle.width;
            this._childOriginalLeft = childStyle.left;
        },

        _onresize: function _onresize() {
            this.refresh();
        },

        _saveViewportHeight: function _saveViewportHeight() {
            // ie8 doesn't support innerHeight
            this._viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        },

        _stop: function _stop() {
            // Unfix the container immediately.
            this._unfix();
            // remove event listeners
            $(window).unbind('scroll', this._proxied_onscroll);
            $(this._toresize).unbind('resize', this._proxied_onresize);
        },

        _start: function _start() {
            // Trigger onscroll to have the effect immediately.
            this._onscroll();

            // Attach event listeners
            $(window).bind('scroll', this._proxied_onscroll);
            $(this._toresize).bind('resize', this._proxied_onresize);
        },

        _destroy: function _destroy() {
            // Destroy mimic node instance
            this._replacer.destroy();
        },

        refresh: function refresh() {
            this._saveViewportHeight();
            this._unfix();
            this._onscroll();
        }
    });

    function NativeSticky(child, parent, options) {
        FixTo.call(this, child, parent, options);
        this.start();
    }

    NativeSticky.prototype = new FixTo();

    $.extend(NativeSticky.prototype, {
        _start: function _start() {

            var childStyles = computedStyle.getAll(this._child);

            this._childOriginalPosition = childStyles.position;
            this._childOriginalTop = childStyles.top;

            this._child.style.position = nativeStickyValue;
            this.refresh();
        },

        _stop: function _stop() {
            this._child.style.position = this._childOriginalPosition;
            this._child.style.top = this._childOriginalTop;
        },

        refresh: function refresh() {
            this._child.style.top = this._mindtop() + this._options.top + 'px';
        }
    });

    var fixTo = function fixTo(childElement, parentElement, options) {
        if (nativeStickyValue && !options || nativeStickyValue && options && options.useNativeSticky !== false) {
            // Position sticky supported and user did not disabled the usage of it.
            return new NativeSticky(childElement, parentElement, options);
        } else if (fixedPositionValue) {
            // Position fixed supported

            if (fixedPositioningContext === undefined) {
                // We don't know yet if browser creates fixed positioning contexts. Check it.
                fixedPositioningContext = _PositioningContext2.default.createsContext();
            }

            return new FixToContainer(childElement, parentElement, options);
        } else {
            return 'Neither fixed nor sticky positioning supported';
        }
    };

    /*
    No support for ie lt 8
    */

    if (ieversion < 8) {
        fixTo = function fixTo() {
            return 'not supported';
        };
    }

    // Let it be a jQuery Plugin
    $.fn.fixTo = function (targetSelector, options) {

        var $targets = $(targetSelector);

        var i = 0;
        return this.each(function () {

            // Check the data of the element.
            var instance = $(this).data('fixto-instance');

            // If the element is not bound to an instance, create the instance and save it to elements data.
            if (!instance) {
                $(this).data('fixto-instance', fixTo(this, $targets[i], options));
            } else {
                // If we already have the instance here, expect that targetSelector parameter will be a string
                // equal to a public methods name. Run the method on the instance without checking if
                // it exists or it is a public method or not. Cause nasty errors when necessary.
                var method = targetSelector;
                instance[method].call(instance, options);
            }
            i++;
        });
    };

    /*
        Expose
    */

    return {
        FixToContainer: FixToContainer,
        fixTo: fixTo,
        computedStyle: computedStyle,
        MimicNode: _mimicNode2.default
    };
}(window.jQuery, window, document);

},{"./PositioningContext":2,"./mimic-node":4,"./prefix":5,"computed-style":1}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = MimicNode;

require('computed-style');

var computedStyle = window.computedStyle;

function MimicNode(element) {
    this._element = element;
    this._replacer = document.createElement('div');
    this._replacer.style.visibility = 'hidden';
    this.hide();
    element.parentNode.insertBefore(this._replacer, element);
}

MimicNode.prototype = {

    replace: function replace() {
        var rst = this._replacer.style;
        var styles = computedStyle.getAll(this._element);

        rst.width = this._width();
        rst.height = this._height();

        // Adopt margins
        rst.marginTop = styles.marginTop;
        rst.marginBottom = styles.marginBottom;
        rst.marginLeft = styles.marginLeft;
        rst.marginRight = styles.marginRight;

        // Adopt positioning
        rst.cssFloat = styles.cssFloat;
        rst.styleFloat = styles.styleFloat; //ie8;
        rst.position = styles.position;
        rst.top = styles.top;
        rst.right = styles.right;
        rst.bottom = styles.bottom;
        rst.left = styles.left;

        rst.display = styles.display;
    },

    hide: function hide() {
        this._replacer.style.display = 'none';
    },

    _width: function _width() {
        return this._element.getBoundingClientRect().width + 'px';
    },

    _widthOffset: function _widthOffset() {
        return this._element.offsetWidth + 'px';
    },

    _height: function _height() {
        return this._element.getBoundingClientRect().height + 'px';
    },

    _heightOffset: function _heightOffset() {
        return this._element.offsetHeight + 'px';
    },

    destroy: function destroy() {
        this._replacer.parentNode.removeChild(this._replacer);

        // set properties to null to break references
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                this[prop] = null;
            }
        }
    },

    get replacer() {
        return this._replacer;
    }
};

var bcr = document.documentElement.getBoundingClientRect();
if (!bcr.width) {
    MimicNode.prototype._width = MimicNode.prototype._widthOffset;
    MimicNode.prototype._height = MimicNode.prototype._heightOffset;
}

},{"computed-style":1}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Class handles vendor prefixes
function Prefix() {
    // Cached vendor will be stored when it is detected
    this._vendor = null;

    //this._dummy = document.createElement('div');
}

Prefix.prototype = {

    _vendors: {
        webkit: { cssPrefix: '-webkit-', jsPrefix: 'Webkit' },
        moz: { cssPrefix: '-moz-', jsPrefix: 'Moz' },
        ms: { cssPrefix: '-ms-', jsPrefix: 'ms' },
        opera: { cssPrefix: '-o-', jsPrefix: 'O' }
    },

    _prefixJsProperty: function _prefixJsProperty(vendor, prop) {
        return vendor.jsPrefix + prop[0].toUpperCase() + prop.substr(1);
    },

    _prefixValue: function _prefixValue(vendor, value) {
        return vendor.cssPrefix + value;
    },

    _valueSupported: function _valueSupported(prop, value, dummy) {
        // IE8 will throw Illegal Argument when you attempt to set a not supported value.
        try {
            dummy.style[prop] = value;
            return dummy.style[prop] === value;
        } catch (er) {
            return false;
        }
    },

    /**
     * Returns true if the property is supported
     * @param {string} prop Property name
     * @returns {boolean}
     */
    propertySupported: function propertySupported(prop) {
        // Supported property will return either inine style value or an empty string.
        // Undefined means property is not supported.
        return document.documentElement.style[prop] !== undefined;
    },

    /**
     * Returns prefixed property name for js usage
     * @param {string} prop Property name
     * @returns {string|null}
     */
    getJsProperty: function getJsProperty(prop) {
        // Try native property name first.
        if (this.propertySupported(prop)) {
            return prop;
        }

        // Prefix it if we know the vendor already
        if (this._vendor) {
            return this._prefixJsProperty(this._vendor, prop);
        }

        // We don't know the vendor, try all the possibilities
        var prefixed;
        for (var vendor in this._vendors) {
            prefixed = this._prefixJsProperty(this._vendors[vendor], prop);
            if (this.propertySupported(prefixed)) {
                // Vendor detected. Cache it.
                this._vendor = this._vendors[vendor];
                return prefixed;
            }
        }

        // Nothing worked
        return null;
    },

    /**
     * Returns supported css value for css property. Could be used to check support or get prefixed value string.
     * @param {string} prop Property
     * @param {string} value Value name
     * @returns {string|null}
     */
    getCssValue: function getCssValue(prop, value) {
        // Create dummy element to test value
        var dummy = document.createElement('div');

        // Get supported property name
        var jsProperty = this.getJsProperty(prop);

        // Try unprefixed value
        if (this._valueSupported(jsProperty, value, dummy)) {
            return value;
        }

        var prefixedValue;

        // If we know the vendor already try prefixed value
        if (this._vendor) {
            prefixedValue = this._prefixValue(this._vendor, value);
            if (this._valueSupported(jsProperty, prefixedValue, dummy)) {
                return prefixedValue;
            }
        }

        // Try all vendors
        for (var vendor in this._vendors) {
            prefixedValue = this._prefixValue(this._vendors[vendor], value);
            if (this._valueSupported(jsProperty, prefixedValue, dummy)) {
                // Vendor detected. Cache it.
                this._vendor = this._vendors[vendor];
                return prefixedValue;
            }
        }
        // No support for value
        return null;
    }
};

var prefix = exports.prefix = new Prefix();

},{}]},{},[3]);
