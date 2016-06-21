import {prefix} from './prefix';
import 'computed-style';
const computedStyle = window.computedStyle;

// We will need this frequently. Lets have it as a global until we encapsulate properly.
const transformJsProperty = prefix.getJsProperty('transform');

class PositioningContext {

    constructor() {

    }

    // Checks if browser creates a positioning context for fixed elements.
    // Transform rule will create a positioning context on browsers who follow the spec.
    // Ie for example will fix it according to documentElement
    // TODO: Other css rules also effects. perspective creates at chrome but not in firefox. transform-style preserve3d effects.
    createsContext() {
        let support = false;
        const parent = document.createElement('div');
        const child = document.createElement('div');

        parent.appendChild(child);
        parent.style[transformJsProperty] = 'translate(0)';
        // Make sure there is space on top of parent
        parent.style.marginTop = '10px';
        parent.style.visibility = 'hidden';
        child.style.position = 'fixed';
        child.style.top = 0;
        document.body.appendChild(parent);
        var rect = child.getBoundingClientRect();
        // If offset top is greater than 0 means transformed element created a positioning context.
        if(rect.top > 0) {
            support = true;
        }
        // Remove dummy content
        document.body.removeChild(parent);
        return support;
    }

    // Get positioning context of an element.
    // We know that the closest parent that a transform rule applied will create a positioning context.
    getContext(element) {
        let parent;
        let context = null;
        let styles;

        // Climb up the treee until reaching the context
        while(!context) {
            parent = element.parentNode;
            if(parent === document.documentElement) {
                return null;
            }

            styles = computedStyle.getAll(parent);
            // Element has a transform rule
            if(styles[transformJsProperty] !== 'none') {
                context = parent;
                break;
            }
            element = parent;
        }
        return context;
    }
}

export default new PositioningContext();