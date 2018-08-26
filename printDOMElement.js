(function() {

    var printDOMElementObjects = [];

    /**
    *   @class printDOMElement
    *   @param {Object}
    *
    *   @return {printDOMElement|Object}
    */
	this.printDOMElement = function( $options = {} )
	{
        /**
        *   Define Class properties
        *
        *   @property {HTMLElement}  : element
        *   @property {Int}          : instanceId
        *   @property {HTMLElement}  : iFrame
        *   @property {Window}       : iFrameWIN
        *   @property {Document}     : iFrameDOC
        *   @property {Mixed|Object} : options
        **/

        /** define element to print **/
        this.element    = HTMLElement;
        /** generate random number based on the today date **/
        this.instanceId = Math.floor( ( Math.random() * new Date().getTime() ) + 1 );
        /** assign iFrame @property'es **/
        this.iFrame     = HTMLElement;
        this.iFrameWIN  = Window;
        this.iFrameDOC  = Document;

        /** Assign defaults @property'es **/
        this.options    =
        {
            selector     : "#element-to-print",
            metadata     : [],
            autoPrint    : true,
            delay        : 0,
            printOptions : {},
            beforePrint  : function(){},
            /**  onPrint      : function(){}, **/
            afterPrint   : function(){},
            onError      : function( $error ){}
        };

        /** Re-write defaults whit @argument $options **/
        if ($options && typeof $options === "object")
		  	this.options = extendDefaults(this.options, $options);

        init( this );

    }

    /**
    *   @static @method triggerPrintEvents
    *   @param {Int}
    *   @param {String}
    *
    *   @return {function}
    **/
    printDOMElement.triggerPrintEvents = function ($instanceId, $eventType)
    {
        var pde = printDOMElementObjects[$instanceId];
        if( pde )
        {
            if( $eventType == "before" )
                pde.options.beforePrint.call(pde);
            else if( $eventType == "after" )
                pde.options.afterPrint.call(pde);
        }
    }

    /**
    *	@private @method init
    *   @param {printDOMElement|Object}
    *
    *	@return {Bool || Void}
    */
    function init( $printDOMElement )
    {
        try
        {
            /** Assign @class @property "element" **/
            $printDOMElement.element = document.querySelector($printDOMElement.options.selector);
        }
        catch (e)
        {
            $printDOMElement.options.onError.call($printDOMElement, e);
            return false;
        }

        /** Init @class @property "delay" **/
        $printDOMElement.options.delay   = $printDOMElement.options.delay * 1000;

        /** Push to @private @property "printDOMElementObjects" **/
        printDOMElementObjects[$printDOMElement.instanceId] = $printDOMElement;

        /**
        *   Call @private @method initMetaDataObject
        *   Init @class @property "$printDOMElement.options.metadata"
        **/
        var meta = initMetaDataObject( $printDOMElement );

        /**
        *   Create <iframe> and trigger callBack function "iframeDidLoad"
        **/
        createIframe($printDOMElement, function iframeDidLoad() {

            /** assign iFrame document && window objects **/
            $printDOMElement.iFrameDOC = $printDOMElement.iFrame.contentDocument;
            $printDOMElement.iFrameWIN = $printDOMElement.iFrame.contentWindow;

            try
            {
                /** assign metadata && content to document **/
                $printDOMElement.iFrameDOC.open();
                $printDOMElement.iFrameDOC.write(meta);
                $printDOMElement.iFrameDOC.write($printDOMElement.element.innerHTML);
                $printDOMElement.iFrameDOC.close();
            }
            catch (e)
            {
                $printDOMElement.iFrame.remove();

                $printDOMElement.options.onError.call($printDOMElement, e);
                return false;
            }

            /** trigger printing **/
            if( $printDOMElement.options.autoPrint )
            {
                setTimeout(function () {
                    $printDOMElement.iFrameWIN.print();
                }, $printDOMElement.options.delay + 100);
            }

        });

    }

    /**
    *	@private @method initMetaDataObject
    *   @param {printDOMElement|Object}
    *
    *	@return {String}
    */
    function initMetaDataObject( $printDOMElement )
    {
        var metaData      = $printDOMElement.options.metadata;
        var metaToString  = '';

        for (var key in metaData)
            metaToString += metaData[key] + '\n';

        metaToString += `<script>

            var instanceId = `+$printDOMElement.instanceId+`;

            var beforePrint = function() {
                parent.printDOMElement.triggerPrintEvents(instanceId, "before");
            };

            var afterPrint = function() {
                parent.printDOMElement.triggerPrintEvents(instanceId, "after");
            };

            if (window.matchMedia)
            {
                var mediaQueryList = window.matchMedia('print');
                mediaQueryList.addListener(function(mediaQueryListEvent) {
                    if (mediaQueryListEvent.matches)
                        beforePrint();
                    else
                        afterPrint();
                });
            }

            /** If is Firefox need some fix **/
            var sUsrAg = navigator.userAgent;
            if (sUsrAg.indexOf("Firefox") > -1)
            {
                window.onbeforeprint = function () {
                    beforePrint(instanceId, "before");
                };
                window.onafterprint  = function () {
                    afterPrint(instanceId, "after");
                }
            }

        <\/script>`;

        /*
            metaToString += `
                <style>

                </style>
            `;
        */

        /**
        *   Check if @argument "metadata" has valid nodeTypes
        **/
        var divCleanHeadTags       = document.createElement('div');
        var allowedTags            = ["title", "meta", "script", "link", "style"];

        divCleanHeadTags.innerHTML = metaToString;

        for (var i = 0; i < divCleanHeadTags.childNodes.length; i++)
        {
            var childNode = divCleanHeadTags.childNodes[i];
            /** check if tagName is in white list **/
            if( childNode.tagName && allowedTags.indexOf(childNode.tagName.toLowerCase()) == -1 )
                childNode.remove();
        }

        /** re-write metaToString **/
        metaToString = divCleanHeadTags.innerHTML;
        /** delete divCleanHeadTags **/
        delete divCleanHeadTags;

        return metaToString;
    }

    /**
    *	@private @method createIframe
    *   @param {$printDOMElement|Object}
    *   @param {Function}
    *
    *	@return {function}
    */
    function createIframe( $printDOMElement, $callBack = null )
    {
        /** create <iframe> HTMLElement **/
        $printDOMElement.iFrame = document.createElement('iframe');
        /** append to body **/

        document.body.appendChild($printDOMElement.iFrame);
        /**
        *   Set Attributes
        *   onload return "$callBack" function-parameter
        **/
        $printDOMElement.iFrame.setAttribute("class", "printing_iframe");
        $printDOMElement.iFrame.setAttribute("data-instance", $printDOMElement.instanceId );
        $printDOMElement.iFrame.setAttribute("onload", $callBack( ) );

        /** Set Styles **/
        $printDOMElement.iFrame.style.position = "absolute";
        $printDOMElement.iFrame.style.top      = "-1000px";
        $printDOMElement.iFrame.style.left     = "-1000px";

        $printDOMElement.iFrame.style.border   = "none";
        $printDOMElement.iFrame.style.width    = $printDOMElement.element.offsetWidth + "px";
        $printDOMElement.iFrame.style.height   = $printDOMElement.element.offsetHeight + "px";
    }

    /**
    *   @private @method extendDefaults
    *   @param {Object}
    *   @param {Object}
    *
    *   @return {Object}
    */
    function extendDefaults(source, properties)
    {
        var property;
        for (property in properties)
            if (properties.hasOwnProperty(property))
                source[property] = properties[property];
        return source;
    }

})();
