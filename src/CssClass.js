function ClassList() {}

ClassList.prototype = {
    add: function(container, name) {
        container.classList.add(name);
    },

    remove: function(container, name) {
        container.classList.remove(name);
    }
};

function CustomClassName() {}

CustomClassName.prototype = {

    _getArray: function(container) {
        var ar = container.className.split(' ');
        var i = ar.length;
        while(i--) {
            if(!ar[i]) {
                ar.splice(i, 1);
            }
        }
        return ar;
    },

    _has: function(ar, name) {
        var i = ar.length;
        while(i--) {
            if(ar[i] === name) {
                return true;
            }
        }
        return false;
    },

    _set: function(ar, container) {
        var str = ar.join(' ');
        container.className = str;
    },


    add: function(container, name) {
        var ar = this._getArray(container);
        if(!this._has(ar, name)) {
            ar.push(name);
            this._set(ar, container);
        }
    },

    remove: function(container, name) {
        var ar = this._getArray(container);
        var i = ar.length;

        while(i--) {
            if(ar[i] === name) {
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
function CssClass() {
    var dummy = document.createElement('div');
    if(dummy.classList) {
        this._system = new ClassList();
    }
    else {
        this._system = new CustomClassName();
    }
}

CssClass.prototype = {

    /**
    * Adds a class name
    * @param {HTMLElement} container Dom element to add the class name
    * @param {string} name Class name to add
    */
    add: function(container, name) {
        this._system.add(container, name);
    },

    /**
    * Removes a class name
    * @param {HTMLElement} container Dom element to remove the class name
    * @param {string} name Class name to remove
    */
    remove: function(container, name) {
        this._system.remove(container, name);
    }
};

export default CssClass
