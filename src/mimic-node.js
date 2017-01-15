import {Destroyable} from './destroyable';
import 'computed-style';
var computedStyle = window.computedStyle;

export default class MimicNode extends Destroyable {

    constructor(element) {
        super();
        this._element = element;
        this._replacer = document.createElement('div');
        this._replacer.style.visibility = 'hidden';
        this.hide();
        element.parentNode.insertBefore(this._replacer, element);
    }

    replace() {
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
    }

    hide() {
        this._replacer.style.display = 'none';
    }

    _width() {
        return this._element.getBoundingClientRect().width + 'px';
    }

    _widthOffset() {
        return this._element.offsetWidth + 'px';
    }

    _height() {
        return this._element.getBoundingClientRect().height + 'px';
    }

    _heightOffset() {
        return this._element.offsetHeight + 'px';
    }

    get replacer() {
        return this._replacer;
    }

    destroy() {
        this._replacer.parentNode.removeChild(this._replacer);
        super.destroy()
    }
}

var bcr = document.documentElement.getBoundingClientRect();
if(!bcr.width){
    MimicNode.prototype._width = MimicNode.prototype._widthOffset;
    MimicNode.prototype._height = MimicNode.prototype._heightOffset;
}
