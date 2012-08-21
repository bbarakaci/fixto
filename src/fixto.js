
var fixto = (function ($, window, document) {

	// Start Computed Style. Please do not modify this module here. Modify it from its own repo. See address below.
	
    /*! Computed Style - v0.1.0 - 2012-07-19
    * https://github.com/bbarakaci/computed-style
    * Copyright (c) 2012 Burak Barakaci; Licensed MIT */
    var computedStyle = (function() {
        var computedStyle = {
            getAll : function(element){
                return document.defaultView.getComputedStyle(element);
            },
            get : function(element, name){
                return this.getAll(element)[name];
            },
            toFloat : function(value){
                return parseFloat(value, 10) || 0;
            },
            getFloat : function(element,name){
                return this.toFloat(this.get(element, name));
            },
            _getAllCurrentStyle : function(element) {
                return element.currentStyle;
            }
        };

        if (document.documentElement.currentStyle) {
            computedStyle.getAll = computedStyle._getAllCurrentStyle;
        }

        return computedStyle;

    }());

	// End Computed Style. Modify whatever you want to.

    var mimicNode = (function(){
        /*
        Class Mimic Node
        Dependency : Computed Style
        Tries to mimick a dom node taking his styles, dimensions. May go to his repo if gets mature.
        */

        function MimicNode(element) {
            this.element = element;
            this.replacer = document.createElement('div');
            this.replacer.style.visibility = 'hidden';
            this.hide();
            element.parentNode.insertBefore(this.replacer, element);
        }

        MimicNode.prototype = {
            replace : function(){
                var rst = this.replacer.style;
                var styles = computedStyle.getAll(this.element);

                 // rst.width = computedStyle.width(this.element) + 'px';
                 // rst.height = this.element.offsetHeight + 'px';

                 // Setting offsetWidth
                 rst.width = this._width();
                 rst.height = this._height();

                 // Adobt margins
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
                 // rst.borderStyle = styles.borderStyle;

                 rst.display = styles.display;

            },
            hide: function () {
                this.replacer.style.display = 'none';
            },
            _width : function(){
                return this.element.getBoundingClientRect().width + 'px';
            },
            _widthOffset : function(){
                return this.element.offsetWidth + 'px';
            },
            _height : function(){
                return this.element.getBoundingClientRect().height + 'px';
            },
            _heightOffset : function(){
                return this.element.offsetHeight + 'px';
            }
        };

        var bcr = document.documentElement.getBoundingClientRect();
        if(!bcr.width){
            MimicNode.prototype._width = MimicNode.prototype._widthOffset;
            MimicNode.prototype._height = MimicNode.prototype._heightOffset;
        }

        return {
            MimicNode:MimicNode,
            computedStyle:computedStyle
        };
    }());


    // Class FixToContainer

    function FixToContainer(child, parent, options) {

        this.child = child;
        this._$child = $(child);
        this.parent = parent;
        this._replacer = new mimicNode.MimicNode(child);
        this._ghostNode = this._replacer.replacer;
        this.options = $.extend(this.options, options);
        $(window).scroll($.proxy(this._onscroll, this));
        $(this._toresize).bind('resize', $.proxy(this._onresize, this));
        this._saveStyles();
    }

    FixToContainer.prototype = {
        options: {
            className: 'fixto-fixed'
        },
        // at ie8 maybe only in vm window resize event fires everytime an element is resized.
        _toresize : $.browser.msie && $.browser.version === '8.0' ? document.documentElement : window,
        _onscroll: function _onscroll() {
            this._scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            this._parentBottom = (this.parent.offsetHeight + this._fullOffset('offsetTop', this.parent)) - computedStyle.getFloat(this.parent, 'paddingBottom');
            if (!this.fixed) {
                if (this._scrollTop > (this._fullOffset('offsetTop', this.child) - computedStyle.getFloat(this.child, 'marginTop')) && this._scrollTop < this._parentBottom) {
                    this._fix();
                }
            } else {
                if (this._scrollTop > this._parentBottom || this._scrollTop < this._fullOffset('offsetTop', this._ghostNode) - computedStyle.getFloat(this._ghostNode, 'marginTop')) {
                    this._unfix();
                    return;
                }
                this._adjust();
            }
        },
        _adjust: function _adjust() {
            var diff = (this._parentBottom - this._scrollTop) - (this.child.offsetHeight + computedStyle.getFloat(this.child, 'marginTop') + computedStyle.getFloat(this.child, 'marginBottom'));
            if (diff < 0) {
                this.child.style.top = diff + 'px';
            }
        },

        /*
        I need some performance on calculating offset as it is called a lot of times.
        This function calculates cumulative offsetTop way faster than jQuery $.offset
        todo: check vs getBoundingClientRect
        */

        _fullOffset: function _fullOffset(offsetName, elm) {
            var offset = elm[offsetName];
            while (elm.offsetParent !== null) {
                elm = elm.offsetParent;
                offset = offset + elm[offsetName];
            }
            return offset;
        },
        _fix: function _fix() {
            var child = this.child,
                childStyle = child.style;
            this._saveStyles();

            if(document.documentElement.currentStyle){
                var styles = computedStyle.getAll(child);
                // Function for ie<9. when hasLayout is not triggered in ie7, he will report currentStyle as auto, clientWidth as 0. Thus using offsetWidth.
                childStyle.left = (this._fullOffset('offsetLeft', child) - computedStyle.getFloat(child, 'marginLeft')) + 'px';
                childStyle.width = (child.offsetWidth) - (computedStyle.toFloat(styles.paddingLeft) + computedStyle.toFloat(styles.paddingRight) + computedStyle.toFloat(styles.borderLeftWidth) + computedStyle.toFloat(styles.borderRightWidth)) + 'px';
            }
            else {
                childStyle.width = computedStyle.get(child, 'width');
                childStyle.left = (child.getBoundingClientRect().left - computedStyle.getFloat(child, 'marginLeft')) + 'px';
            }

            this._replacer.replace();
            childStyle.position = 'fixed';
            childStyle.top = '0px';

            this._$child.addClass(this.options.className);
            this.fixed = true;
            this._adjust(this._parentBottom, this._scrollTop);
        },
        _unfix: function _unfix() {
            var childStyle = this.child.style;
            this._replacer.hide();
            childStyle.position = this._childOriginalPosition;
            childStyle.top = this._childOriginalTop;
            childStyle.width = this._childOriginalWidth;
            childStyle.left = this._childOriginalLeft;
            this._$child.removeClass(this.options.className);
            this.fixed = false;
        },
        _saveStyles: function(){
            var childStyle = this.child.style;
            this._childOriginalPosition = childStyle.position;
            this._childOriginalTop = childStyle.top;
            this._childOriginalWidth = childStyle.width;
            this._childOriginalLeft = childStyle.left;
        },
        _onresize: function () {
            this._unfix();
            this._onscroll();
        }
    };

    var fixTo = function fixTo(childElement, parentElement, options) {
        return new FixToContainer(childElement, parentElement, options);
    };





    /*
    No support for touch devices and ie lt 8
    */
    var touch = !!('ontouchstart' in window);
    var ielt8 = $.browser.msie && $.browser.version < 8;

    if(touch || ielt8){
        fixTo = function(){
            return 'not supported';
        };
    }

    // Let it be a jQuery Plugin
    $.fn.fixTo = function (targetSelector, options) {
        var childs = this,
            targets = $(targetSelector);
        for (var i = 0, l = childs.length; i < l; i++) {
            fixTo(childs[i], targets[i], options);
        }
    };

    /*
        Expose
    */

    return {
        FixToContainer: FixToContainer,
        fixTo: fixTo,
        computedStyle:computedStyle,
        mimicNode:mimicNode
    };


}(window.jQuery, window, document));