(function () {
  window.Webcollage = window.Webcollage || {};

  var wcJS = 'https://scontent.webcollage.net/api/v2/product-content?loadlegacycontent=true';
  var syndiJsBaseUrl = 'https://syndi.webcollage.net/site/';
  var trackingUrl = 'https://event.webcollage.net/event'

  /**
   * @var _functionCalls array:  stores the list of window.Webcollage.xxx function invocations, so we can replay them once we get the notification that syndi doesn't have any content
   * @var _syndiLoaded: used to prevent double loading of the syndi library
   */
  var _functionCalls = [], _syndiLoaded = false, _siteCode, _callbacks = [];
  
  /**
   * tracking function that will be used to quantify the usage of different integrations
   */
  setTimeout(function track() {
    var f = [];
    for (var i = 0; i < _functionCalls.length; i++) {
      f.push(_functionCalls[i].f);
    }
    var url = trackingUrl + '/fc.gif?siteCode=' + encodeURIComponent(_siteCode) + '&calls=' + encodeURIComponent(f.join('|')) + '&r=' + Math.random();
    var image = new Image();
    var done = function () {};
    image.width = 1;
    image.border = 0;
    image.onload = done;
    image.onerror = done;
    image.src = url.substr(0, 4089);
  }, 20000);

  /**
   * this function replays all the stored invocations to window.Webcollage.xxx functions
   */
  function _loadLegacyContent() {
    _functionCalls.push({f: "_loadLegacyContent"});
    var f;
    for (var i = _functionCalls.length - 1; i >= 0; i--) {

      if (_functionCalls[i].f.indexOf("load") !== 0)
        continue; // skipping non load* functions
      f = window.Webcollage[_functionCalls[i].f];
      f.apply(null, _functionCalls[i].arguments)
    }
  }

  function processCallbacks(hasContent) {    
    for (var i = _callbacks.length - 1; i >= 0; i--) {
      if (_callbacks[i].type === "generic" || _callbacks[i].type === "hasPowerPageContentCallback")
        _callbacks[i].callback(hasContent);
    }
  }
  /**
   * this function loads the webcollage library `wcJS` and attaches the call to `_loadLegacyContent` on the onLoad event
   */
  function _loadLegacyWC(hasContent) {
    _functionCalls.push({f: "_loadLegacyWC"});

    // for now we only trigger content callback with content as the WC code should 
    // trigger the no content callback if WC doesn't have content
    if (hasContent) return processCallbacks(hasContent);
    // this is minified code but what it does is just loading a library and setting an onLoad callback
    (function (wcJS) { 
    	var scriptElement = document.createElement('script'); 
    	scriptElement.type = 'text/javascript';
        scriptElement.async = true; 
		scriptElement.src = wcJS;
        // di.onload = _loadLegacyContent;
        if (scriptElement.addEventListener) scriptElement.addEventListener('load', _loadLegacyContent);
        if (scriptElement.attachEvent) scriptElement.attachEvent('onload', _loadLegacyContent);
        var firstScriptElementInDocument = document.getElementsByTagName('script')[0]; 
        firstScriptElementInDocument.parentNode.insertBefore(scriptElement,firstScriptElementInDocument); }
      (wcJS));
  }

  /**
   * This function loads the syndi library for a given website. It also uses the cpi information when available.
   */
  function _loadSyndi(siteCode, cpi) {
    window.Webcollage.cpi = cpi;
    if (_syndiLoaded) return;
    _functionCalls.push({f: "_loadSyndi"});
    window.SYNDI = window.SYNDI || [];
    
    // configuring syndi for contentCallback registration
    window.SYNDI.push({"contentCallback": _loadLegacyWC});
  
    // load of the syndi library
    (function (y, n, di, go) { di = document.createElement(y); di.type = 'text/java'+y;
        di.async = true; di.src = n + Math.floor(Date.now() / 86400000);
		if (di.addEventListener) di.addEventListener('error', function() {_loadLegacyWC(false);});
        if (di.attachEvent) di.attachEvent('onerror', function() {_loadLegacyWC(false);});
        go = document.getElementsByTagName(y)[0]; go.parentNode.insertBefore(di,go); }
      ('script', syndiJsBaseUrl + siteCode + '/tag.js?cv='));

    _syndiLoaded = true;
    _siteCode = siteCode;
  };

  function RegisterCallbacks(callback, options) {
    if (options) {
      if (options.hasPowerPageContentCallback && typeof options.hasPowerPageContentCallback === 'function')
        _callbacks.push({type: "hasPowerPageContentCallback", callback: options.hasPowerPageContentCallback});
      if (options.noPowerPageContentCallback && typeof options.noPowerPageContentCallback === 'function')
        _callbacks.push({type: "noPowerPageContentCallback", callback: options.noPowerPageContentCallback});
    }
    if (callback && typeof callback === 'function')
      _callbacks.push({type: "generic", callback: callback});
  }

  /**
   * The following set of functions are there to expose the same api as the WC product-content javascript does
   * they all register that invokation in the `_functionCalls` array so they can be replayed once we get the feedback
   * from the Syndi library that there is no content
   */ 
  window.Webcollage.loadContent = function(siteCode, cpi, options, callback) {
    _functionCalls.push({f: "loadContent", arguments: [siteCode, cpi, options, callback]});
    RegisterCallbacks(callback, options);
    _loadSyndi(siteCode, cpi);
  }

  window.Webcollage.loadProductContent = function (siteCode, cpi, contentPackages) {
    _functionCalls.push({f: "loadProductContent", arguments: [siteCode, cpi, contentPackages]});
    if (contentPackages['mosaic-board'] && contentPackages['mosaic-board'].containerSelector) {
      Webcollage.mosaicTargetSelector = contentPackages['mosaic-board'].containerSelector;
    }
    if (contentPackages['power-page']) {
      if (contentPackages['power-page'].containerSelector)
        Webcollage.powerPageTargetSelector = contentPackages['power-page'].containerSelector;
      RegisterCallbacks(undefined, contentPackages['power-page']);
    }
    _loadSyndi(siteCode, cpi);
  }

  window.Webcollage.loadProductContentByWcpc = function (siteCode, wcpc, moduleCode, environment, contentPackages) {
    _functionCalls.push({f: "loadProductContentByWcpc", arguments: [siteCode, wcpc, moduleCode, environment, contentPackages]});
    _loadSyndi(siteCode);
  }

  window.Webcollage.loadProductContentForProductListing = function (siteCode, options) {
    _functionCalls.push({f: "loadProductContentForProductListing", arguments: [siteCode, options]});
    _loadSyndi(siteCode);
  }

  window.Webcollage.loadProductContentForProductListingByWcpc = function (siteCode, moduleCode, environment, options) {
    _functionCalls.push({f: "loadProductContentForProductListingByWcpc", arguments: [siteCode, moduleCode, environment, options]});
    _loadSyndi(siteCode);
  }

  window.Webcollage.loadSectionsContent = function (cpi, siteCode, type, callback) {
    _functionCalls.push({f: "loadSectionsContent", arguments: [cpi, siteCode, type, callback]});
    RegisterCallbacks(callback);
    _loadSyndi(siteCode, cpi);
  }

  window.Webcollage.loadSectionsContentByWcpc = function (wcpc, siteCode, moduleCode, environment, type, callback) {
    _functionCalls.push({f: "loadSectionsContentByWcpc", arguments: [wcpc, siteCode, moduleCode, environment, type, callback]});
    RegisterCallbacks(callback);
    _loadSyndi(siteCode);
  }

  /**
   * Pure copy / paste from the standard WebCollage product-content library, just in case they are used by third parties
   */
  window.Webcollage.minOrMax = function (fileName) {
    _functionCalls.push({f: "minOrMax"});
    var _extForMinMax = new RegExp("(?:\\.min)?\\.(js|css)$", "i");
    if(document.location.search.indexOf("webcollage-scripts=max") > 0)
      return fileName;
    else
      return fileName.replace(_extForMinMax, ".min.$1");
  }

  /**
   * Copy / paste from the standard WebCollage product-content library, just in case they are used by third parties
   * adding one line to enable tracking on all function calls
   */
  window.Webcollage.utils = {
      getElementsByClassName : getElementsByClassName = function (className, tag, elm) {
          _functionCalls.push({f: "getElementsByClassName"});

          if (document.getElementsByClassName) {
              getElementsByClassName = function (className, tag, elm) {
                  elm = elm || document;
                  var elements = elm.getElementsByClassName(className),
                      nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
                      returnElements = [],
                      current;
                  for(var i=0, il=elements.length; i<il; i+=1){
                      current = elements[i];
                      if(!nodeName || nodeName.test(current.nodeName)) {
                          returnElements.push(current);
                      }
                  }
                  return returnElements;
              };
          }
          else if (document.evaluate) {
              getElementsByClassName = function (className, tag, elm) {
                  tag = tag || "*";
                  elm = elm || document;
                  var classes = className.split(" "),
                      classesToCheck = "",
                      xhtmlNamespace = "http://www.w3.org/1999/xhtml",
                      namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
                      returnElements = [],
                      elements,
                      node;
                  for(var j=0, jl=classes.length; j<jl; j+=1){
                      classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
                  }
                  try {
                      elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
                  }
                  catch (e) {
                      elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
                  }
                  while ((node = elements.iterateNext())) {
                      returnElements.push(node);
                  }
                  return returnElements;
              };
          }
          else {
              getElementsByClassName = function (className, tag, elm) {
                  tag = tag || "*";
                  elm = elm || document;
                  var classes = className.split(" "),
                      classesToCheck = [],
                      elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
                      current,
                      returnElements = [],
                      match;
                  for(var k=0, kl=classes.length; k<kl; k+=1){
                      classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
                  }
                  for(var l=0, ll=elements.length; l<ll; l+=1){
                      current = elements[l];
                      match = false;
                      for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
                          match = classesToCheck[m].test(current.className);
                          if (!match) {
                              break;
                          }
                      }
                      if (match) {
                          returnElements.push(current);
                      }
                  }
                  return returnElements;
              };
          }
          return getElementsByClassName(className, tag, elm);
      },
      getAttr: function(e, attr) {
          _functionCalls.push({f: "getAttr"});
          var result = (e.getAttribute && e.getAttribute(attr)) || null;
          if( !result ) {
              var attrs = e.attributes;
              var length = attrs.length;
              for(var i = 0; i < length; i++)
                  if(attrs[i].nodeName === attr)
                      result = attrs[i].nodeValue;
          }
          return result;
      },
      getModularFeedPieces: function() {
          _functionCalls.push({f: "getModularFeedPieces"});
          return getElementsByClassName("wc-aplus-modular");
      },
      findSectionsOnPage: function() {
          _functionCalls.push({f: "findSectionsOnPage"});
          return getElementsByClassName("wc-fragment", "div");
      },
      camelize: function(str) {
          _functionCalls.push({f: "camelize"});
          return str.replace(/(?:^\w|[A-Z]|\b\w|\-)/g, function(match, index) {
            if (+match === 0) return "";
              return index == 0 ? match.toLowerCase() : match.toUpperCase();
          });
      }
  };
}());
