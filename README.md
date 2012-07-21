# fixto

Fix containers to viewport according to an ancestor.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/bbarakaci/fixto/master/dist/fixto.min.js
[max]: https://raw.github.com/bbarakaci/fixto/master/dist/fixto.js

Add jQuery

    <script src="jquery.js"></script>
    
Add fixTo

    <script src="fixto.min.js"></script>

## Usage

Use it with jQuery

    $('#nav').fixTo('body');
    
You can fix multiple containers to multiple ancestors. Make sure your selectors match exactly.

    $('.sticky').fixTo('.sticky-holder');
    
Usage without jQuery
    
    var sticky = fixto.fixTo(domElementToFix, domElementToBeFixed);

## Styling

When the container is fixed, it will receive the class name `fixto-fixed` . You may use this class for styling or you may pass any other class name by passing as an option.
    
Example

    $('.left-banner').fixTo('.left-column', {
        className : 'my-class-name'
    });

Fixto doesnt take care of z-index. Please apply z-index to the container when necessary.

## Browser support

Modern browsers, >= ie8 are supported. Touch devices are not supported.
