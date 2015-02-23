# JavaScript-DOM-Injector
Form based automated HTML builder.

## Dependencies
A browser that supports JavaScript (no JQuery or something else required)

## Put this at the bottom of your ```<body>```
```html
<script src="js/injector.js"></script>
```

# Usage
To use the Builder object, you need to come with a DOM form object which must contain some particular attributes.
## HTML Attributes
There can be data-* attributes on inputs, textAreas and form for achieving a builder form.

* ```data-type``` defines the tagname that needs to be created
* -optional ```data-path``` defines tagnames seperated by a space, alone or with id/class (not both id and class)
* -optional ```data-delimiter``` define with "default" to generate multiple elements on enter
* -optional ```data-content``` defines whether the text needs to be inserted on an attribute e.g. src for ```<img>```
* -only on form ```data-targetid``` defines the target which will be injected (don't use #)

## HTML Form Example

```html
<!-- this is the target where the form will inject data -->
<div id="target"></div>

<form id="formInjector"
  data-type="div.jumbotron"
  data-targetid="target"
  >
  <input type="text"
    name="title"
    data-type="h1"
    data-path="header"
    />
  <textarea name="text"
    data-type="p"
    data-path="div.content"
    data-delimiter="default"
    ></textarea>
  <input type="hidden"
    name="time"
    data-type="li"
    data-path="footer ul"
    />
</form>
```
In the example you can see ```data-path="footer ul"``` which not exists. The footer and ul will be generated if not present. If you want a seperate footer for an input, you can give it a class or id, as it will then be inserted in a new element.

## JavaScript Hook Example
The previous mentioned HTML form will be hooked in this example.
```javascript
//  retrieve the DOM form
var form = document.getElementById("formInjector");
//  create a Builder object with the given form
var builder = new Builder(form);
//  initiate the building when focused on the form
form.addEventListener('focus', function () {
  builder.start();
}, true);

```
