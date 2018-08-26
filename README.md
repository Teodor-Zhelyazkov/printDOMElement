# printDOMElement
Print contents of a div, htmlelement.PrintDOMElement is pure javascript plugin which prints the contents of html elements. Basically what it does is build an <iframe> write the contents of html element and trigger the print .

### Installing

Clone repo, or download printDOMElement.js

```
git clone https://github.com/Teodor-Zhelyazkov/printDOMElement.git
```



## Getting Started

Add "printDOMElement.js" to your page

```
<!DOCTYPE html>
<html lang="en">
    <head>
        <script src="printDOMElement.js"></script>
    ..
..
```

## Examples

Basic usage

```
new printDOMElement({
    selector  : '#element_to_print'
});
```

Delay printing with two seconds

```
new printDOMElement({
    selector  : '#element_to_print',
    delay     : 2 
});
```

Add metdata to iframe before printing
```
new printDOMElement({
    selector  : '#element_to_print',
    metadata  : [
        "<title>Print Dom Element</title>",
        '<script onload="" src="https://code.jquery.com/jquery-1.12.4.js"><\/script>',
        '<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />',
        '<meta charset="utf-8">',
        `<style>.. <\/style>`,
        `<script>.. <\/script>`
    ]
});
```

Trigger print manually
```
new printDOMElement({
    selector  : '#element_to_print',
    autoPrint : false, // Default : true
    metadata  : [
        <!-- Add jQuery -->
        '<script onload="" src="https://code.jquery.com/jquery-1.12.4.js"><\/script>',
        `<script>
            $(document).ready(function () {
                /** After your work did finish trigger print manually **/
                setTimeout(function () {
                    window.print();
                },2000)
            })
        <\/script>`
    ]
});
```

Full config object with Defaults
```
new printDOMElement({
    selector  : '#element_to_print',
    autoPrint : true,
    delay     : 0,  
    metadata  : [],
    beforePrint : function ()
    {

    },
    afterPrint : function ()
    {

    },
    onError : function (e)
    {
        console.log(e);
    }
});
```
