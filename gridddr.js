;
(function($) {

  /**
   *  Create function alias for using like: $.gridddr()
   *  which will autoally create needed nodes
   *  @param {Object} options
   *  @return {Object}
   **/
  $.gridddr = function(options) {
    return $('body').gridddr(options, true);
  };

  /**
   *  Gridddr jQuery definition
   *  @param {Object} options
   *  @param {Boolean} auto
   *  @return {Object}
   **/
  $.fn.gridddr = function(options, auto) {
    var defaultSettings = {
      debug: false, // {Boolean}: true — enable console debug messages, false — disable
      relative: false, // {Boolean}: true — Gridddr will be applied for inline object, false — fit window
      container: null, // false / {String}: specify main Gridddr container selector
      itemClass: false, // false / {String}: specify items by ClassName. Concats with itemTag, if set
      itemTag: "img", // false / {String}: specify items by TagName. Concats with itemClass, if set
      defaultClasses: { // default Gridddr classes; you can restyle it via css or rename classes to avoid conflicts
        container: ".gridddr-container",
        item: ".gridddr-item",
        overlay: ".gridddr-overlay",
        invisible: ".gridddr-invisible",
        fitImage: ".fit-image",
        imgPlaceholder: ".loaded-image",
        flipper: {
          flipFront: ".gridddr-flipper-front",
          flipBack: ".gridddr-flipper-back",
          flipWrapper: ".gridddr-flipper",
          flipContainer: ".gridddr-flip-container",
          opened: "opened"
        },
      },
      fitImage: false, // {Boolean}: fit image into container
      saveNode: false, // {Boolean}: true — won't modify original node, false — will wrap into Gridddr container
      itemWidth: 150, // false / {Integer}: false will be used as auto
      itemHeight: 150, // false / {Integer}: false will be used as auto
      preloading: true, // {Boolean}: enable preloading, if itemTag == img
      useQueue: true, // {Boolean}: use Queue to show images after preloading?
      shuffleQueue: true, // {Boolean}: randmozie Queue
      queueDelay: 50, // {Number}: delay between queue appearance
      overlay: true, // {Boolean} / {String}: true/false — enable/disable, {String} — hex, rgb, color
      overlayOpacity: 0.6, // {Boolean} / {Float}: true — default, false — invisible, {Float} — your option
      gridX: false, // false / {Integer}: items in row; False will be used as auto
      gridY: false, // false / {Integer}: number of rows; False will be used as auto
      repeat: true, // {Boolean}: randomly repeat items to fit in window
      useGPU: true, // {Boolean}: use GPU accleration for CSS?
      animations: true, // {Boolean}: use animation?
      animationType: "flip", // {String}: [flip, fade, slide], if animations enabled
      animationsSpeed: 1000 // {Boolean}: speed of animations, if settings.animations is enabled
    };

    var settings = $.extend(defaultSettings, options), // Merging default settings with user settings (if defined)
      auto = auto || false, // Use auto node creation?
      private = { // Private Gridddr functions
        /**
         *  Search items in container, which match itemClass/itemTag
         *  @param {Object} $this
         *  @return {Object}
         **/
        findGridddrItems: function($this) {
          var selector = settings.itemTag && settings.itemClass ?
            settings.itemTag + settings.itemClass :
            false ||
            settings.itemTag ||
            settings.itemClass ||
            "*";

          private.debug("Looking for:", selector);
          return $this.find(">" + selector);
        },

        /**
         *  Generates wrapper for Gridddr item
         *  @param {Object} $this
         *  @return {Object}
         **/
        generateWrapper: function($this) {
          var result;
          switch (settings.animationType) {
            case 'flip':
              result = $this.wrap($("<div/>", {
                class: settings.defaultClasses.flipper.flipFront.slice(1)
              })).parent().wrap($("<div/>", {
                class: settings.defaultClasses.flipper.flipWrapper.slice(1)
              })).parent().append($("<div/>", {
                class: settings.defaultClasses.flipper.flipBack.slice(1)
              })).wrap($("<div/>", {
                class: settings.defaultClasses.flipper.flipContainer.slice(1)
              })).parent();
              break;
            default:
              result = $this.wrap($("<div/>", {
                class: settings.defaultClasses.item.slice(1)
              })).parent();
          };
          return result;
        },

        /**
         *  Convert children objects into Gridddr items
         *  @param {Object} $this
         *  @return {Object}
         **/
        wrapItems: function($this) {
          var $items = private.findGridddrItems($this);

          if ($items.size() > 0) {
            $items.each(function() {
              var $item = !!settings.saveNode ? $(this) : private.generateWrapper($(this));

              if (!!settings.preloading) {
                private.prepareForPreloading($item);
              };

              if (!!settings.fitImage) {
                $item.addClass(settings.defaultClasses.fitImage.slice(1));
              };

              if (!!settings.defaultClasses.item && !$item.hasClass(settings.defaultClasses.item.slice(1))) {
                $item.addClass(settings.defaultClasses.item.slice(1));
              };

              if (!!settings.itemWidth) {
                $item.width(Number(settings.itemWidth));
              };

              if (!!settings.itemHeight) {
                $item.height(Number(settings.itemHeight));
              };
            });
          };
          return private.createGrid($this, $items);
        },

        /**
         *  Make Gridddr to work in inline mode
         *  @param {Object} $this
         *  @param {Boolean} set
         *  @return {Boolean}
         **/
        setRelativeClass: function($this, set) {
          var set = set || settings.relative || false;

          if (!!set) {
            $this.addClass('relative');
          } else {
            $this.removeClass('relative');
          };

          return true;
        },

        /**
         *  Creates a grid
         *  @param {Object} $container
         *  @param {Object} $items
         *  @return {Boolean}
         **/
        createGrid: function($container, $items) {
          // private.debug($container, "width: ", $container.width());
          return true;
        },

        /**
         *  Creates overlay, if settings.overlay is true
         *  @param {Object} $this
         *  @return {Boolean}
         **/
        overlay: function($this) {
          if (settings.overlay != false) {
            var $el = $($this.find(settings.defaultClasses.overlay).get(0) || $this.prepend($('<div/>', {
              class: settings.defaultClasses.overlay.slice(1)
            })).find(settings.defaultClasses.overlay).get(0));

            if (settings.overlay.toString() != "true") {
              private.css($el, 'background-color', settings.overlay.toString());
            };

            if (typeof settings.overlayOpacity == "number") {
              private.css($el, 'opacity', Number(settings.overlayOpacity));
            } else if (typeof settings.overlayOpacity == "boolean") {
              private.css($el, 'opacity', Math.min(0.8, Number(settings.overlayOpacity)));
            };
          };

          return true;
        },

        /**
         *  Wrapper for $.css and $.animate to communicate with settings.animations
         *  @param {Object} el
         *  @param {Mixed} property {String} or {Object}
         *  @param {Mixed} value {String} or {Object}
         *  @param {Mixed} callback {Function} or {String} (name of global function; like window["alert"])
         *  @return {Object}
         **/
        css: function(el, property, value, callback) {
          if (settings.animations) {
            if (typeof property != "object") {
              var _property = property;
              property = {};
              property[_property] = value;
              delete _property;
              delete value;
            };
            el.animate(property, (settings.animationsSpeed || 0), (callback || false));
          } else {
            el.css(property, value || false);
            if (typeof callback == "function") {
              callback.call();
            } else if (typeof window[callback] == "function") {
              window[callback]();
            } else private.debug(callback, "function dows not exist.");
          };
          return true;
        },

        /**
         *  Prepares images for preloading
         *  @param {Object} $item
         *  @return {Boolean}
         **/
        prepareForPreloading: function($item) {
          if (settings.animationType == "fade") {
            $item.addClass(settings.defaultClasses.invisible.slice(1));
          };
          if (settings.animationType == "flip") {
            $item.addClass(settings.defaultClasses.flipper.opened);
          };
          return true;
        },

        /**
         *  Function to preload images, if settings.preloading is true
         *  @param {Object} $this
         *  @return {Boolean}
         **/
        preloadContent: function(el) {
          if (!!settings.preloading) {
            var $images = $(el).find(settings.defaultClasses.item),
              $queue = this.queue,
              goal = $images.size();

            if (!settings.saveNode) {
              $images = $images.find("[data-src]");
            };

            if (goal > 0) {
              try {
                $images.each(function() {
                  var $image = $(this);
                  var src = $image.data('src');

                  $('<img>').attr('src', src).one("load", function() {
                    $image.attr('src', src).addClass(settings.defaultClasses.imgPlaceholder.slice(1)).removeData('src');
                    if (!!settings.useQueue) {
                      $queue.push($image);

                      if ($queue.length == goal - 1) {
                        private.queuePromise.resolve();
                      };
                    } else {
                      private.loadedCallback.apply($image);
                    };
                  }).on("error", function(e) {
                    private.debug("Error while loading image: ", e, $(e.delegateTarget));
                  });
                });
              } catch (error) {
                private.queuePromise.reject(error);
              };
            };
          };
          return true;
        },

        /**
         *  Executes after image was loaded
         *  @return {Object}
         **/
        loadedCallback: function() {
          switch (settings.animationType) {
            case "flip":
              return $(this).removeClass(settings.defaultClasses.imgPlaceholder.slice(1)).parents().eq(2).removeClass(settings.defaultClasses.flipper.opened);
              break;
            default:
              var $this = $(this).removeClass(settings.defaultClasses.imgPlaceholder.slice(1));
              if (!settings.saveNode) {
                $this = $this.parent();
              };
              return $this.removeClass(settings.defaultClasses.invisible.slice(1));
          };
        },

        /**
         *  Creates queue of loaded images
         *  @return {Object}
         **/
        createQueue: function() {
          this.queue = [];
          this.queuePromise = $.Deferred();
          this.queuePromise.done(this.execQueue);
          this.queuePromise.fail(function(error) {
            private.debug("Preloading images failed: ", error);
            if (this.queue.length > 0) {
              this.execQueue(this.queue);
            };
            if ($images = $(settings.defaultClasses.container).find(settings.defaultClasses.item).find("[data-src]") && $images.size() > 0) {
              $images.each(private.loadedCallback);
            };
          });
          return this.queue;
        },

        /**
         *  Shuffles queue
         *  @param {Object} array
         *  @return {Object}
         **/
        shuffleQueue: function(array) {
          var size = array.length,
            backup, current_index;

          while (size) {
            current_index = Math.floor(Math.random() * size--);
            backup = array[size];
            array[size] = array[current_index];
            array[current_index] = backup;
          }

          return array;
        },

        /**
         *  Run over queue and show each item with delay
         *  @param {Object} $this
         *  @return {Object}
         **/
        execQueue: function($queue) {
          var $queue = $queue || private.queue;
          if (settings.shuffleQueue) {
            $queue = private.shuffleQueue($queue);
          };
          $.each($queue, function(i) {
            var $this = $(this);
            setTimeout(function() {
              private.loadedCallback.apply($this);
            }, i * Number(settings.queueDelay));
          });
        },

        /**
         *  Wrapper over console.log to communicate with debug mode (settings.debug)
         *  @multiple {Mixed} params
         *  @return {Boolean}
         **/
        debug: function() {
          if (settings.debug && console) {
            console.log.apply(console, arguments);
            return true;
          };
          return false;
        },

        /**
         *  Initialize Gridddr
         *  @param {Integer} index
         *  @param {Object} el
         *  @return {Boolean}
         **/
        inititalize: function(index, el) {
          var $this = $(el);

          if (!$this.hasClass(settings.defaultClasses.container.slice(1))) {
            $this.addClass(settings.defaultClasses.container.slice(1));
          };

          if (!!settings.relative) {
            private.setRelativeClass($this, true);
          };

          if (private.overlay($this) && private.wrapItems($this) && !$this.data('inititalized')) {
            if (!!settings.useQueue) {
              private.createQueue.apply(private);
            };

            private.preloadContent.apply(private, $this);

            $this.data('inititalized', true);
            private.debug(el, "inititalized as Gridddr.");
            return true;
          }

          private.debug("Something went wrong");
          return false;
        }
      },

      public = { // Public Gridddr methods. To user like var grid = $.gridddr(); grid.update();
        /**
         *  Returns used settings for the actual Gridddr instance
         *  @return {Object}
         **/
        getSettings: function() {
          return settings;
        },

        /**
         *  Changes overlay opacity
         *  @param {Number} opacity
         *  @return {Object}
         **/
        setOverlayOpacity: function(opacity) {
          var opacity = opacity || !!opacity;
          settings.overlayOpacity = opacity;
          private.overlay($(settings.container));
          return this;
        }
      };

    $.extend(this, public); // Merge settings
    $.each(this, private.inititalize); // Initializing objects
    return this;
  };

}(jQuery));
