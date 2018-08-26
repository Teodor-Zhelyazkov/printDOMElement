# printDOMElement
Print contents of a div, htmlelement

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

## Example 
```
new printDOMElement({
    selector  : '#element_to_print',
    metadata  : [
        "<title>Print Dom Element</title>",
        '<script onload="" src="https://code.jquery.com/jquery-1.12.4.js"><\/script>',
        '<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />',
        '<meta charset="utf-8">',
        `<style>.. </style>`,
        `<script>.. </script>`
    ],
    beforePrint : function () {
        
    },
    afterPrint : function () {
        
    },
    onError : function (e) {
        console.log(e);
    }
});
```
