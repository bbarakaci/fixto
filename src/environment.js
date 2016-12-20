import {prefix} from './prefix';
import positioningContext from './PositioningContext';

// It will return null if position sticky is not supported
export const nativeStickyValue = prefix.getCssValue('position', 'sticky');

// It will return null if position fixed is not supported
export const fixedPositionValue = prefix.getCssValue('position', 'fixed');

// Dirty business
var ie = navigator.appName === 'Microsoft Internet Explorer';
export let ieversion;

if(ie){
    ieversion = parseFloat(navigator.appVersion.split("MSIE")[1]);
}

export const createsPositioningContext = positioningContext.createsContext();