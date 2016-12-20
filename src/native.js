import {Fixto} from './base';
import {nativeStickyValue} from './environment';

export class NativeSticky extends Fixto {

	constructor(child, options) {
		super(child, options);
		this.start();
	}

    _start() {

        var childStyles = computedStyle.getAll(this._child);

        this._childOriginalPosition = childStyles.position;
        this._childOriginalTop = childStyles.top;

        this._child.style.position = nativeStickyValue;
        this.refresh();
    }

    _stop() {
        this._child.style.position = this._childOriginalPosition;
        this._child.style.top = this._childOriginalTop;
    }

    refresh() {
        this._child.style.top = this._mindtop() + this._options.top + 'px';
    }
}