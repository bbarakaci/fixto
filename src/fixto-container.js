import {Fixto} from './base';
import '../libs/ftools/cssClass';
import MimicNode from './mimic-node';
import {addEventListener, removeEventListener} from './event-registration';
import 'computed-style';
import {createsPositioningContext} from './environment';
import positioningContext from './PositioningContext';

const classList = new ftools.CssClass();

// Class FixToContainer
export class FixToContainer extends Fixto {

    constructor(child, options) {
        super(child, options);
        this._replacer = new MimicNode(child);
        this._ghostNode = this._replacer.replacer;

        this._saveStyles();

        this._saveViewportHeight();

        // Create anonymous functions and keep references to register and unregister events.
        this._proxied_onscroll = this._bind(this._onscroll, this);
        this._proxied_onresize = this._bind(this._onresize, this);

        this.start();
    }

    // Returns an anonymous function that will call the given function in the given context
    _bind(fn, context) {
        return function () {
            return fn.call(context);
        };
    }

    _onscroll() {
        this._scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        this._parentBottom = (this._parent.offsetHeight + this._fullOffset('offsetTop', this._parent));

        if (this._options.mindBottomPadding !== false) {
            this._parentBottom -= computedStyle.getFloat(this._parent, 'paddingBottom');
        }

        if (this.fixed) {
            if (this._scrollTop > this._parentBottom || this._scrollTop < (this._fullOffset('offsetTop', this._ghostNode) - this._options.top - this._mindtop())) {
                this._unfix();
                return;
            }
            this._adjust();
        } else if (this._shouldFix()) {
            this._fix();
            this._adjust();
        }
    }

    _shouldFix() {
        if (this._scrollTop < this._parentBottom && this._scrollTop > (this._fullOffset('offsetTop', this._child) - this._options.top - this._mindtop())) {
            if (this._options.mindViewport && !this._isViewportAvailable()) {
                return false;
            }
            return true;
        }
    }

    _isViewportAvailable() {
        var childStyles = computedStyle.getAll(this._child);
        return this._viewportHeight > (this._child.offsetHeight + computedStyle.toFloat(childStyles.marginTop) + computedStyle.toFloat(childStyles.marginBottom));
    }

    _adjust() {
        var top = 0;
        var mindTop = this._mindtop();
        var diff = 0;
        var childStyles = computedStyle.getAll(this._child);
        var context = null;

        if(createsPositioningContext) {
            // Get positioning context.
            context = positioningContext.getContext(this._child);
            if(context) {
                // There is a positioning context. Top should be according to the context.
                top = Math.abs(context.getBoundingClientRect().top);
            }
        }

        diff = (this._parentBottom - this._scrollTop) - (this._child.offsetHeight + computedStyle.toFloat(childStyles.marginBottom) + mindTop + this._options.top);

        if(diff>0) {
            diff = 0;
        }

        this._child.style.top = (diff + mindTop + top + this._options.top) - computedStyle.toFloat(childStyles.marginTop) + 'px';
    }

    // Calculate cumulative offset of the element.
    // Optionally according to context
    _fullOffset(offsetName, elm, context) {
        var offset = elm[offsetName];
        var offsetParent = elm.offsetParent;

        // Add offset of the ascendent tree until we reach to the document root or to the given context
        while (offsetParent !== null && offsetParent !== context) {
            offset = offset + offsetParent[offsetName];
            offsetParent = offsetParent.offsetParent;
        }

        return offset;
    }

    _fix() {
        var child = this._child;
        var childStyle = child.style;
        var childStyles = computedStyle.getAll(child);
        var left = child.getBoundingClientRect().left;
        var width = childStyles.width;

        this._saveStyles();

        if(document.documentElement.currentStyle){
            // Function for ie<9. When hasLayout is not triggered in ie7, he will report currentStyle as auto, clientWidth as 0. Thus using offsetWidth.
            // Opera also falls here
            width = (child.offsetWidth) - (computedStyle.toFloat(childStyles.paddingLeft) + computedStyle.toFloat(childStyles.paddingRight) + computedStyle.toFloat(childStyles.borderLeftWidth) + computedStyle.toFloat(childStyles.borderRightWidth)) + 'px';
        }

        // Ie still fixes the container according to the viewport.
        if(createsPositioningContext) {
            var context = positioningContext.getContext(this._child);
            if(context) {
                // There is a positioning context. Left should be according to the context.
                left = child.getBoundingClientRect().left - context.getBoundingClientRect().left;
            }
        }

        this._replacer.replace();

        childStyle.left = (left - computedStyle.toFloat(childStyles.marginLeft)) + 'px';
        childStyle.width = width;

        childStyle.position = 'fixed';
        childStyle.top = this._mindtop() + this._options.top - computedStyle.toFloat(childStyles.marginTop) + 'px';
        classList.add(this._child, this._options.className);
        this.fixed = true;
    }

    _unfix() {
        var childStyle = this._child.style;
        this._replacer.hide();
        childStyle.position = this._childOriginalPosition;
        childStyle.top = this._childOriginalTop;
        childStyle.width = this._childOriginalWidth;
        childStyle.left = this._childOriginalLeft;
        classList.remove(this._child, this._options.className);
        this.fixed = false;
    }

    _saveStyles() {
        var childStyle = this._child.style;
        this._childOriginalPosition = childStyle.position;
        this._childOriginalTop = childStyle.top;
        this._childOriginalWidth = childStyle.width;
        this._childOriginalLeft = childStyle.left;
    }

    _onresize() {
        this.refresh();
    }

    _saveViewportHeight() {
        // ie8 doesn't support innerHeight
        this._viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    }

    _stop() {
        // Unfix the container immediately.
        this._unfix();
        // remove event listeners
        removeEventListener(window, 'scroll', this._proxied_onscroll);
        removeEventListener(window, 'resize', this._proxied_onresize);
    }

    _start() {
        // Trigger onscroll to have the effect immediately.
        this._onscroll();

        // Attach event listeners
        addEventListener(window, 'scroll', this._proxied_onscroll);
        addEventListener(window, 'resize', this._proxied_onresize);
    }

    _destroy() {
        // Destroy mimic node instance
        this._replacer.destroy();
    }

    refresh() {
        this._saveViewportHeight();
        this._unfix();
        this._onscroll();
    }

}