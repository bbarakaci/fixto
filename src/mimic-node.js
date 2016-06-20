/*global require, module */
/*global $ */
require('computed-style');
var computedStyle = window.computedStyle;

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
    },

    destroy: function () {
        $(this.replacer).remove();

        // set properties to null to break references
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
              this[prop] = null;
            }
        }
    }
};

var bcr = document.documentElement.getBoundingClientRect();
if(!bcr.width){
    MimicNode.prototype._width = MimicNode.prototype._widthOffset;
    MimicNode.prototype._height = MimicNode.prototype._heightOffset;
}

module.exports = MimicNode;