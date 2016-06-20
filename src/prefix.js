/*global require, module */

// Class handles vendor prefixes
function Prefix() {
    // Cached vendor will be stored when it is detected
    this._vendor = null;

    //this._dummy = document.createElement('div');
}

Prefix.prototype = {

    _vendors: {
      webkit: { cssPrefix: '-webkit-', jsPrefix: 'Webkit'},
      moz: { cssPrefix: '-moz-', jsPrefix: 'Moz'},
      ms: { cssPrefix: '-ms-', jsPrefix: 'ms'},
      opera: { cssPrefix: '-o-', jsPrefix: 'O'}
    },

    _prefixJsProperty: function(vendor, prop) {
        return vendor.jsPrefix + prop[0].toUpperCase() + prop.substr(1);
    },

    _prefixValue: function(vendor, value) {
        return vendor.cssPrefix + value;
    },

    _valueSupported: function(prop, value, dummy) {
        // IE8 will throw Illegal Argument when you attempt to set a not supported value.
        try {
            dummy.style[prop] = value;
            return dummy.style[prop] === value;
        }
        catch(er) {
            return false;
        }
    },

    /**
     * Returns true if the property is supported
     * @param {string} prop Property name
     * @returns {boolean}
     */
    propertySupported: function(prop) {
        // Supported property will return either inine style value or an empty string.
        // Undefined means property is not supported.
        return document.documentElement.style[prop] !== undefined;
    },

    /**
     * Returns prefixed property name for js usage
     * @param {string} prop Property name
     * @returns {string|null}
     */
    getJsProperty: function(prop) {
        // Try native property name first.
        if(this.propertySupported(prop)) {
            return prop;
        }

        // Prefix it if we know the vendor already
        if(this._vendor) {
            return this._prefixJsProperty(this._vendor, prop);
        }

        // We don't know the vendor, try all the possibilities
        var prefixed;
        for(var vendor in this._vendors) {
            prefixed = this._prefixJsProperty(this._vendors[vendor], prop);
            if(this.propertySupported(prefixed)) {
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
    getCssValue: function(prop, value) {
        // Create dummy element to test value
        var dummy = document.createElement('div');

        // Get supported property name
        var jsProperty = this.getJsProperty(prop);

        // Try unprefixed value
        if(this._valueSupported(jsProperty, value, dummy)) {
            return value;
        }

        var prefixedValue;

        // If we know the vendor already try prefixed value
        if(this._vendor) {
            prefixedValue = this._prefixValue(this._vendor, value);
            if(this._valueSupported(jsProperty, prefixedValue, dummy)) {
                return prefixedValue;
            }
        }

        // Try all vendors
        for(var vendor in this._vendors) {
            prefixedValue = this._prefixValue(this._vendors[vendor], value);
            if(this._valueSupported(jsProperty, prefixedValue, dummy)) {
                // Vendor detected. Cache it.
                this._vendor = this._vendors[vendor];
                return prefixedValue;
            }
        }
        // No support for value
        return null;
    }
};

module.exports = Prefix;