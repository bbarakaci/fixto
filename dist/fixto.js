(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/** @namespace */
window.ftools = window.ftools || {};

ftools.ClassList = function () {};

ftools.ClassList.prototype = {

	add: function add(container, name) {
		container.classList.add(name);
	},

	remove: function remove(container, name) {
		container.classList.remove(name);
	}
};

ftools.CustomClassName = function () {};

ftools.CustomClassName.prototype = {
	_getArray: function _getArray(container) {
		var ar = container.className.split(' ');
		var i = ar.length;
		while (i--) {
			if (!ar[i]) {
				ar.splice(i, 1);
			}
		}
		return ar;
	},

	_has: function _has(ar, name) {
		var i = ar.length;
		while (i--) {
			if (ar[i] === name) {
				return true;
			}
		}
		return false;
	},

	_set: function _set(ar, container) {
		var str = ar.join(' ');
		container.className = str;
	},

	add: function add(container, name) {
		var ar = this._getArray(container);
		if (!this._has(ar, name)) {
			ar.push(name);
			this._set(ar, container);
		}
	},

	remove: function remove(container, name) {
		var ar = this._getArray(container);
		var i = ar.length;

		while (i--) {
			if (ar[i] === name) {
				ar.splice(i, 1);
				this._set(ar, container);
				break;
			}
		}
	}
};

/**
 * Adds / removes css class name to dom elements
 * @constructor
 */
ftools.CssClass = function () {
	var dummy = document.createElement('div');
	if (dummy.classList) {
		this._system = new ftools.ClassList();
	} else {
		this._system = new ftools.CustomClassName();
	}
};

ftools.CssClass.prototype = {

	/**
  * Adds a class name
  * @param {HTMLElement} container Dom element to add the class name
  * @param {string} name Class name to add
  */
	add: function add(container, name) {
		this._system.add(container, name);
	},

	/**
  * Removes a class name
  * @param {HTMLElement} container Dom element to remove the class name
  * @param {string} name Class name to remove
  */
	remove: function remove(container, name) {
		this._system.remove(container, name);
	}
};

},{}],2:[function(require,module,exports){
/*! Computed Style - v0.1.1 - 2016-06-18
* https://github.com/bbarakaci/computed-style
* Copyright (c) 2012 Burak Barakaci; Licensed MIT */
window.computedStyle=function(){var e={getAll:function(e){return document.defaultView.getComputedStyle(e)},get:function(e,t){return this.getAll(e)[t]},toFloat:function(e){return parseFloat(e,10)||0},getFloat:function(e,t){return this.toFloat(this.get(e,t))},_getAllCurrentStyle:function(e){return e.currentStyle}};return document.documentElement.currentStyle&&(e.getAll=e._getAllCurrentStyle),e}();
},{}],3:[function(require,module,exports){
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

        this._createsContext = false;
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

},{"./prefix":13,"computed-style":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Fixto = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _destroyable = require('./destroyable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Fixto = exports.Fixto = function (_Destroyable) {
    _inherits(Fixto, _Destroyable);

    function Fixto(child, options) {
        _classCallCheck(this, Fixto);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Fixto).call(this));

        _this._child = child;
        _this._parent = child.parentNode;
        _this._options = {
            className: 'fixto-fixed',
            top: 0,
            mindViewport: false
        };
        _this._setOptions(options);
        return _this;
    }

    // Returns the total outerHeight of the elements passed to mind option. Will return 0 if none.


    _createClass(Fixto, [{
        key: '_mindtop',
        value: function _mindtop() {
            var top = 0;
            if (this._minds) {
                var el;
                var rect;
                for (var i = 0, l = this._minds.length; i < l; i++) {
                    el = this._minds[i];
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
        }

        // Public method to stop the behaviour of this instance.

    }, {
        key: 'stop',
        value: function stop() {
            this._stop();
            this._running = false;
        }

        // Public method starts the behaviour of this instance.

    }, {
        key: 'start',
        value: function start() {

            // Start only if it is not running not to attach event listeners multiple times.
            if (!this._running) {
                this._start();
                this._running = true;
            }
        }

        //Public method to destroy fixto behaviour

    }, {
        key: 'destroy',
        value: function destroy() {
            this.stop();

            this._destroy();

            _get(Object.getPrototypeOf(Fixto.prototype), 'destroy', this).call(this);
        }
    }, {
        key: '_setOptions',
        value: function _setOptions(options) {
            Object.assign(this._options, options);
            if (this._options.mind) {
                this._minds = document.querySelectorAll(this._options.mind);
            }
            if (this._options.zIndex) {
                this._child.style.zIndex = this._options.zIndex;
            }
        }
    }, {
        key: 'setOptions',
        value: function setOptions(options) {
            this._setOptions(options);
            this.refresh();
        }

        // Methods could be implemented by subclasses

    }, {
        key: '_stop',
        value: function _stop() {}
    }, {
        key: '_start',
        value: function _start() {}
    }, {
        key: '_destroy',
        value: function _destroy() {}
    }, {
        key: 'refresh',
        value: function refresh() {}
    }]);

    return Fixto;
}(_destroyable.Destroyable);

},{"./destroyable":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Collection = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _destroyable = require('./destroyable');

var _environment = require('./environment');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Collection = exports.Collection = function (_Destroyable) {
    _inherits(Collection, _Destroyable);

    function Collection(selector, options, Constructor) {
        _classCallCheck(this, Collection);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Collection).call(this));

        _this._collection = [];
        var elements = document.querySelectorAll(selector);
        for (var i = 0, l = elements.length; i < l; i++) {
            var element = elements[i];
            _this._collection.push(new Constructor(element, options));
        }
        return _this;
    }

    _createClass(Collection, [{
        key: '_delegate',
        value: function _delegate(method) {
            for (var i = 0, l = this._collection.length; i < l; i++) {
                var instance = this._collection[i];
                instance[method]();
            }
        }
    }, {
        key: 'start',
        value: function start() {
            this._delegate('start');
        }
    }, {
        key: 'stop',
        value: function stop() {
            this._delegate('stop');
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this._delegate('destroy');
            _get(Object.getPrototypeOf(Collection.prototype), 'destroy', this).call(this);
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this._delegate('refresh');
        }
    }]);

    return Collection;
}(_destroyable.Destroyable);

},{"./destroyable":6,"./environment":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Destroyable = exports.Destroyable = function () {
    function Destroyable() {
        _classCallCheck(this, Destroyable);
    }

    _createClass(Destroyable, [{
        key: "destroy",
        value: function destroy() {
            // set properties to null to break references
            for (var prop in this) {
                if (this.hasOwnProperty(prop)) {
                    delete this[prop];
                }
            }
        }
    }]);

    return Destroyable;
}();

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createsPositioningContext = exports.ieversion = exports.fixedPositionValue = exports.nativeStickyValue = undefined;

var _prefix = require('./prefix');

var _PositioningContext = require('./PositioningContext');

var _PositioningContext2 = _interopRequireDefault(_PositioningContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// It will return null if position sticky is not supported
var nativeStickyValue = exports.nativeStickyValue = _prefix.prefix.getCssValue('position', 'sticky');

// It will return null if position fixed is not supported
var fixedPositionValue = exports.fixedPositionValue = _prefix.prefix.getCssValue('position', 'fixed');

// Dirty business
var ie = navigator.appName === 'Microsoft Internet Explorer';
var ieversion = exports.ieversion = void 0;

if (ie) {
    exports.ieversion = ieversion = parseFloat(navigator.appVersion.split("MSIE")[1]);
}

var createsPositioningContext = exports.createsPositioningContext = _PositioningContext2.default.createsContext();

},{"./PositioningContext":3,"./prefix":13}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addEventListener = addEventListener;
exports.removeEventListener = removeEventListener;
function addEventListener(element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + type, handler);
    }
}

function removeEventListener(element, type, handler) {
    if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
        element.detachEvent('on' + type, handler);
    }
}

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FixToContainer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('./base');

require('../libs/ftools/cssClass');

var _mimicNode = require('./mimic-node');

var _mimicNode2 = _interopRequireDefault(_mimicNode);

var _eventRegistration = require('./event-registration');

require('computed-style');

var _environment = require('./environment');

var _PositioningContext = require('./PositioningContext');

var _PositioningContext2 = _interopRequireDefault(_PositioningContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var classList = new ftools.CssClass();

// Class FixToContainer

var FixToContainer = exports.FixToContainer = function (_Fixto) {
    _inherits(FixToContainer, _Fixto);

    function FixToContainer(child, options) {
        _classCallCheck(this, FixToContainer);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FixToContainer).call(this, child, options));

        _this._replacer = new _mimicNode2.default(child);
        _this._ghostNode = _this._replacer.replacer;

        _this._saveStyles();

        _this._saveViewportHeight();

        // Create anonymous functions and keep references to register and unregister events.
        _this._proxied_onscroll = _this._bind(_this._onscroll, _this);
        _this._proxied_onresize = _this._bind(_this._onresize, _this);

        _this.start();
        return _this;
    }

    // Returns an anonymous function that will call the given function in the given context


    _createClass(FixToContainer, [{
        key: '_bind',
        value: function _bind(fn, context) {
            return function () {
                return fn.call(context);
            };
        }
    }, {
        key: '_onscroll',
        value: function _onscroll() {
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
        }
    }, {
        key: '_shouldFix',
        value: function _shouldFix() {
            if (this._scrollTop < this._parentBottom && this._scrollTop > this._fullOffset('offsetTop', this._child) - this._options.top - this._mindtop()) {
                if (this._options.mindViewport && !this._isViewportAvailable()) {
                    return false;
                }
                return true;
            }
        }
    }, {
        key: '_isViewportAvailable',
        value: function _isViewportAvailable() {
            var childStyles = computedStyle.getAll(this._child);
            return this._viewportHeight > this._child.offsetHeight + computedStyle.toFloat(childStyles.marginTop) + computedStyle.toFloat(childStyles.marginBottom);
        }
    }, {
        key: '_adjust',
        value: function _adjust() {
            var top = 0;
            var mindTop = this._mindtop();
            var diff = 0;
            var childStyles = computedStyle.getAll(this._child);
            var context = null;

            if (_environment.createsPositioningContext) {
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
        }

        // Calculate cumulative offset of the element.
        // Optionally according to context

    }, {
        key: '_fullOffset',
        value: function _fullOffset(offsetName, elm, context) {
            var offset = elm[offsetName];
            var offsetParent = elm.offsetParent;

            // Add offset of the ascendent tree until we reach to the document root or to the given context
            while (offsetParent !== null && offsetParent !== context) {
                offset = offset + offsetParent[offsetName];
                offsetParent = offsetParent.offsetParent;
            }

            return offset;
        }
    }, {
        key: '_fix',
        value: function _fix() {
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
            if (_environment.createsPositioningContext) {
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
            classList.add(this._child, this._options.className);
            this.fixed = true;
        }
    }, {
        key: '_unfix',
        value: function _unfix() {
            var childStyle = this._child.style;
            this._replacer.hide();
            childStyle.position = this._childOriginalPosition;
            childStyle.top = this._childOriginalTop;
            childStyle.width = this._childOriginalWidth;
            childStyle.left = this._childOriginalLeft;
            classList.remove(this._child, this._options.className);
            this.fixed = false;
        }
    }, {
        key: '_saveStyles',
        value: function _saveStyles() {
            var childStyle = this._child.style;
            this._childOriginalPosition = childStyle.position;
            this._childOriginalTop = childStyle.top;
            this._childOriginalWidth = childStyle.width;
            this._childOriginalLeft = childStyle.left;
        }
    }, {
        key: '_onresize',
        value: function _onresize() {
            this.refresh();
        }
    }, {
        key: '_saveViewportHeight',
        value: function _saveViewportHeight() {
            // ie8 doesn't support innerHeight
            this._viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        }
    }, {
        key: '_stop',
        value: function _stop() {
            // Unfix the container immediately.
            this._unfix();
            // remove event listeners
            (0, _eventRegistration.removeEventListener)(window, 'scroll', this._proxied_onscroll);
            (0, _eventRegistration.removeEventListener)(window, 'resize', this._proxied_onresize);
        }
    }, {
        key: '_start',
        value: function _start() {
            // Trigger onscroll to have the effect immediately.
            this._onscroll();

            // Attach event listeners
            (0, _eventRegistration.addEventListener)(window, 'scroll', this._proxied_onscroll);
            (0, _eventRegistration.addEventListener)(window, 'resize', this._proxied_onresize);
        }
    }, {
        key: '_destroy',
        value: function _destroy() {
            // Destroy mimic node instance
            this._replacer.destroy();
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this._saveViewportHeight();
            this._unfix();
            this._onscroll();
        }
    }]);

    return FixToContainer;
}(_base.Fixto);

},{"../libs/ftools/cssClass":1,"./PositioningContext":3,"./base":4,"./environment":7,"./event-registration":8,"./mimic-node":11,"computed-style":2}],10:[function(require,module,exports){
'use strict';

var _base = require('./base');

var _fixtoContainer = require('./fixto-container');

var _native = require('./native');

var _collection = require('./collection');

var _environment = require('./environment');

window.fixto = function ($, window, document) {

    // Will hold if browser creates a positioning context for fixed elements.
    var createsPositioningContext = void 0;

    function getConstructor(options) {
        if (_environment.nativeStickyValue && !options || _environment.nativeStickyValue && options && options.useNativeSticky !== false) {
            // Position sticky supported and user did not disabled the usage of it.
            return _native.NativeSticky;
        } else if (_environment.fixedPositionValue) {
            // Position fixed supported

            // No support for ie lt 9.
            if (_environment.ieversion < 9) {
                // Return base class that does nothing but has necesssary methods so no error will be raised.
                return _base.Fixto;
            }

            return _fixtoContainer.FixToContainer;
        } else {
            // Return base class that does nothing but has necesssary methods so no error will be raised.
            return _base.Fixto;
        }
    }

    // Let it be a jQuery Plugin
    $.fn.fixTo = function (methodOrOptions, options) {

        var Constructor = getConstructor();

        return this.each(function () {

            var $this = $(this);
            // Check the data of the element.
            var instance = $this.data('fixto-instance');

            // If the element is not bound to an instance, create the instance and save it to elements data.
            if (!instance) {
                $this.data('fixto-instance', new Constructor(this, methodOrOptions));
            } else {
                // If we already have the instance here, expect that methodOrOptions parameter will be a string
                // equal to a public method name. Run the method on the instance without checking if
                // it exists or it is a public method or not. Cause nasty errors when necessary.
                if (methodOrOptions === 'destroy') {
                    // Remove jquery data from the element
                    $this.removeData('fixto-instance');
                }
                instance[methodOrOptions].call(instance, options);
            }
        });
    };

    return function (selector, options) {
        return new _collection.Collection(selector, options, getConstructor(options));
    };
}(window.jQuery, window, document);

},{"./base":4,"./collection":5,"./environment":7,"./fixto-container":9,"./native":12}],11:[function(require,module,exports){
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

},{"computed-style":2}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NativeSticky = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('./base');

var _environment = require('./environment');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NativeSticky = exports.NativeSticky = function (_Fixto) {
    _inherits(NativeSticky, _Fixto);

    function NativeSticky(child, options) {
        _classCallCheck(this, NativeSticky);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NativeSticky).call(this, child, options));

        _this.start();
        return _this;
    }

    _createClass(NativeSticky, [{
        key: '_start',
        value: function _start() {

            var childStyles = computedStyle.getAll(this._child);

            this._childOriginalPosition = childStyles.position;
            this._childOriginalTop = childStyles.top;

            this._child.style.position = _environment.nativeStickyValue;
            this.refresh();
        }
    }, {
        key: '_stop',
        value: function _stop() {
            this._child.style.position = this._childOriginalPosition;
            this._child.style.top = this._childOriginalTop;
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            this._child.style.top = this._mindtop() + this._options.top + 'px';
        }
    }]);

    return NativeSticky;
}(_base.Fixto);

},{"./base":4,"./environment":7}],13:[function(require,module,exports){
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

},{}]},{},[10]);
