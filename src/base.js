import {Destroyable} from './destroyable';

export class Fixto extends Destroyable {

    constructor(child, options) {
        super();
        this._child = child;
        this._parent = child.parentNode;
        this._options = {
            className: 'fixto-fixed',
            top: 0,
            mindViewport: false
        };
        this._setOptions(options);
    }

    // Returns the total outerHeight of the elements passed to mind option. Will return 0 if none.
    _mindtop() {
        var top = 0;
        if(this._minds) {
            var el;
            var rect;
            for(var i=0, l=this._minds.length; i<l; i++) {
                el = this._minds[i];
                rect = el.getBoundingClientRect();
                if(rect.height) {
                    top += rect.height;
                }
                else {
                    var styles = computedStyle.getAll(el);
                    top += el.offsetHeight + computedStyle.toFloat(styles.marginTop) + computedStyle.toFloat(styles.marginBottom);
                }
            }
        }
        return top;
    }

    // Public method to stop the behaviour of this instance.
    stop() {
        this._stop();
        this._running = false;
    }

    // Public method starts the behaviour of this instance.
    start() {

        // Start only if it is not running not to attach event listeners multiple times.
        if(!this._running) {
            this._start();
            this._running = true;
        }
    }

    //Public method to destroy fixto behaviour
    destroy() {
        this.stop();

        this._destroy();

        super.destroy();
    }

    _setOptions(options) {
        Object.assign(this._options, options);
        if(this._options.mind) {
            this._minds = document.querySelectorAll(this._options.mind);
        }
        if(this._options.zIndex) {
            this._child.style.zIndex = this._options.zIndex;
        }
    }

    setOptions(options) {
        this._setOptions(options);
        this.refresh();
    }

    // Methods could be implemented by subclasses

    _stop() {

    }

    _start() {

    }

    _destroy() {

    }

    refresh() {

    }

}