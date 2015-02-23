# JavaScript-DOM-Injector
Form based automated HTML builder.

## Dependencies
A browser that supports JavaScript (no JQuery or something else required)

## Put this at the bottom of your ```<body>```
```html
<script src="js/injector.js"></script>
```

# Usage
## HTML Attributes
*```data-type``` defines the tagname that needs to be created
*-only on form ```data-targetid``` defines the target which will be injected (don't use #)
*-optional ```data-path``` defines tagnames seperated by a space, alone or with id/class (not both id and class)
*-optional ```data-delimiter``` define with "default" to generate multiple elements on enter
*-optional ```data-content``` defines whether the text needs to be inserted on an attribute e.g. src for ```<img>```
