# fixto

Fix containers to viewport according to an ancestor. See the [demo page][demo] to see it in action.

[demo]: http://bbarakaci.github.com/fixto

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

## Known issues

- Doesn't work on elements having `margin:auto`. You will need an additional wrapper around the contents of the element. This bug is due to the fact that webkit differs from other browsers about reporting the computed margin values.
- It is not possible to have a full width fixed header with other sticky items in the same page as fixto fixes the elements according to the viewport. It is planned to add support for this case.
