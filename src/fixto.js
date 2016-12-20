import {Fixto} from './base';
import {FixToContainer} from './fixto-container';
import {NativeSticky} from './native';
import {Collection} from './collection';
import {nativeStickyValue, fixedPositionValue, ieversion} from './environment';

window.fixto = (function ($, window, document) {

    // Will hold if browser creates a positioning context for fixed elements.
    let createsPositioningContext;

    function getConstructor(options) {
        if((nativeStickyValue && !options) || (nativeStickyValue && options && options.useNativeSticky !== false)) {
            // Position sticky supported and user did not disabled the usage of it.
            return NativeSticky;
        }
        else if(fixedPositionValue) {
            // Position fixed supported

            // No support for ie lt 9.
            if(ieversion<9){
                // Return base class that does nothing but has necesssary methods so no error will be raised.
                return Fixto;
            }

            return FixToContainer;
        }
        else {
            // Return base class that does nothing but has necesssary methods so no error will be raised.
            return Fixto;
        }
    }

    // Let it be a jQuery Plugin
    $.fn.fixTo = function (methodOrOptions, options) {

        const Constructor = getConstructor();

         return this.each(function () {

            const $this = $(this);
            // Check the data of the element.
            const instance = $this.data('fixto-instance');

            // If the element is not bound to an instance, create the instance and save it to elements data.
            if(!instance) {
                $this.data('fixto-instance', new Constructor(this, methodOrOptions));
            } else {
                // If we already have the instance here, expect that methodOrOptions parameter will be a string
                // equal to a public method name. Run the method on the instance without checking if
                // it exists or it is a public method or not. Cause nasty errors when necessary.
                if(methodOrOptions === 'destroy') {
                    // Remove jquery data from the element
                    $this.removeData('fixto-instance');
                }
                instance[methodOrOptions].call(instance, options);
            }
          });
    };

    return function(selector, options) {
        return new Collection(selector, options, getConstructor(options));
    }

}(window.jQuery, window, document));