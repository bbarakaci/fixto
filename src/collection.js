import {Destroyable} from './destroyable';

export class Collection extends Destroyable {

    constructor(selector, options, Constructor) {
        super();
        this._collection = [];
        const elements = document.querySelectorAll(selector);
        for (let i = 0, l = elements.length; i < l; i++) {
            let element = elements[i];
            this._collection.push(new Constructor(element, options));
        }
    }

    _delegate(method) {
        for (let i = 0, l = this._collection.length; i < l; i++) {
            let instance = this._collection[i];
            instance[method]();
        }
    }

    start() {
        this._delegate('start');
    }

    stop() {
        this._delegate('stop');
    }

    destroy() {
        this._delegate('destroy');
        super.destroy();
    }

    refresh() {
        this._delegate('refresh');
    }
}
