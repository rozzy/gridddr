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
          nowrap: ".gridddr-nowrap-container",
          invisible: ".gridddr-invisible",
          separator: ".gridddr-separator",
          fitImage: ".fit-image",
          gpu: ".gridddr-gpu-acceleration",
          scrollable: ".gridddr-non-scrollable",
          imgPlaceholder: ".loaded-image",
          slideUp: ".gridddr-slideup",
          flipper: {
            flipFront: ".gridddr-flipper-front",
            flipBack: ".gridddr-flipper-back",
            flipWrapper: ".gridddr-flipper",
            flipContainer: ".gridddr-flip-container",
            opened: "opened"
          },
        },
        scrollableContainer: false, // {Boolean}: true — show scrolls, false — hide
        fitContainer: false, // {Boolean}: fit items into Gridddr container
        fitImage: false, // {Boolean}: fit image into item container
        saveNode: false, // {Boolean}: true — won't modify original node, false — will wrap into Gridddr container
        itemWidth: 150, // false / {Integer}: false will be used as auto
        itemHeight: 150, // false / {Integer}: false will be used as auto
        preloading: true, // {Boolean}: enable preloading, if itemTag == img
        useQueue: true, // {Boolean}: use Queue to show images after preloading?
        shuffleQueue: true, // {Boolean}: randmozie Queue
        queueDelay: 50, // {Number}: delay between queue appearance
        overlay: true, // {Boolean} / {String}: true/false — enable/disable, {String} — hex, rgb, color
        overlayOpacity: 0.6, // {Boolean} / {Float}: true — default, false — invisible, {Float} — your option
        gridX: false, // {Boolean} / {Integer}: items in row; {Boolean} will be used as auto
        gridY: false, // {Boolean} / {Integer}: number of rows; {Boolean} will be used as auto
        repeat: true, // {Boolean}: repeat items to fit in window
        shuffleRepeat: true, // {Boolean}: randomly repeat items
        useGPU: true, // {Boolean}: use GPU accleration for CSS?
        animations: true, // {Boolean}: use animation?
        animationType: "fade", // {String}: [flip, fade, slide], if animations enabled
        animationsSpeed: 1000, // {Boolean}: speed of animations, if settings.animations is enabled
        events: {},
      },
      events = {
        window: {
          resize: function() {
            $(settings.defaultClasses.container).each(function(i, el) {
              private.updateGrid($(el), private.findGridddrItems(!!settings.saveNode ? $(el) : $(el).find(settings.defaultClasses.item)));
            });
          },
        },
        "container": {
          inititalized: function(e) {
            startTime = new Date().getTime();
          },
          finished: function(e, time) {
            private.debug("Gridddr finished loading in " + time / 1000);
          }
        },
        "item": {
          mouseover: function(e) {},
          mouseout: function(e) {},
          click: function(e) {}
        }
      };

    var settings = $.extend(true, defaultSettings, options), // Merging default settings with user settings (if defined)
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
          switch (settings.animationType.toLowerCase()) {
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

              if (!!settings.useGPU) {
                $item.addClass(settings.defaultClasses.gpu.slice(1));
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
         *  Greps nth-item from array
         *  @param {Object} $items
         *  @param {Number} eq
         *  @return {Object}
         **/
        grepItemsByEq: function($items, eq) {
          return $.grep($items, function(element, index) {
            return (index + 1) % Number(eq) == 0;
          });
        },

        /**
         *  Creates a grid
         *  @param {Object} $container
         *  @param {Object} $items
         *  @return {Boolean}
         **/
        createGrid: function($container, $items) {
          $container.addClass(settings.defaultClasses.nowrap.slice(1));
          if (!settings.scrollableContainer) {
            $container.addClass(settings.defaultClasses.scrollable.slice(1));
          };
          $container.each(function() {
            private.updateGrid($(this), $items);
          });
          return true;
        },

        /**
         *  Redraws grid (on bindings)
         *  @param {Object} $container
         *  @param {Object} $items
         *  @return {Boolean}
         **/
        updateGrid: function($container, $items) {
          private.removeSeparators();
          if (!!settings.gridX && typeof settings.gridX === "number" && Number(settings.gridX) > 0) {
            var $items = private.grepItemsByEq($items, settings.gridX);
            $.each($items, private.insertSeparator);
          } else {
            if (typeof settings.itemWidth === "number") {
              var itemsInRow = $container.width() / settings.itemWidth || 10;
              itemsInRow = !!settings.fitContainer ? Math.floor(itemsInRow) : Math.ceil(itemsInRow);
              $.each(private.grepItemsByEq($items, itemsInRow), private.insertSeparator);
            } else {

            };
          };
          return true;
        },

        /**
         *  Clear container from separators
         *  @return {Boolean}
         **/
        removeSeparators: function() {
          return $(settings.defaultClasses.separator).remove();
        },

        /**
         *  Insert separator by settings.gridX
         *  @param {Number} i
         *  @param {Object} el
         *  @return {Boolean}
         **/
        insertSeparator: function(i, el) {
          var $this = $(el);

          if (!settings.saveNode) {
            switch (settings.animationType) {
              case "flip":
                $this = $this.parents().eq(2);
                break;
              default:
                $this = $this.parent();
            }
          };

          $("<div/>", {
            class: settings.defaultClasses.separator.slice(1)
          }).insertAfter($this);

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

            if (typeof settings.overlayOpacity === "number") {
              private.css($el, 'opacity', Number(settings.overlayOpacity));
            } else if (typeof settings.overlayOpacity === "boolean") {
              private.css($el, 'opacity', Math.min(0.8, Number(settings.overlayOpacity)));
            };
          };

          return true;
        },

        /**
         *  Prepares images for preloading
         *  @param {Object} $item
         *  @return {Boolean}
         **/
        prepareForPreloading: function($item) {
          if (!!settings.saveNode && settings.animationType.toLowerCase() == "flip") {
            settings.animationType = "fade";
          };
          switch (settings.animationType.toLowerCase()) {
            case "flip":
              $item.addClass(settings.defaultClasses.flipper.opened);
              break;
            default:
              $item.addClass(settings.defaultClasses.invisible.slice(1));
              if (settings.animationType.toLowerCase() === "slide") {
                $item.addClass(settings.defaultClasses.slideUp.slice(1));
              };
          };
          return true;
        },

        /**
         *  Load image
         *  @param {Object} $image
         *  @param {Number} goal
         *  @param {String} src
         *  @param {Object} $queue
         *  @return {Boolean}
         **/
        loadImage: function($image, goal, src, $queue) {
          $image.attr('src', src).removeData('src');
          if (!!settings.preloading) {
            $image.addClass(settings.defaultClasses.imgPlaceholder.slice(1));
          };
          if (!!settings.useQueue) {
            $queue.push($image);
            if ($queue.length == goal) {
              private.queuePromise.resolve();
            };
          } else {
            private.loadedCallback.apply($image);
          };
        },

        /**
         *  Function to preload images, if settings.preloading is true
         *  @param {Object} $this
         *  @return {Boolean}
         **/
        preloadContent: function(el) {
          var $images = $(el).find(settings.defaultClasses.item),
            $queue = this.queue,
            goal = $images.size();

          if (!settings.saveNode) {
            $images = $images.find("[data-src]");
          };

          if (!!settings.preloading && goal > 0) {
            try {
              $images.each(function() {
                var $image = $(this);
                var src = $image.data('src');

                $('<img>').attr('src', src).one("load", function() {
                  private.loadImage($image, goal, src, $queue);
                }).on("error", function(e) {
                  private.debug("Error while loading image: ", e, $(e.delegateTarget));
                });
              });
            } catch (error) {
              private.queuePromise.reject(error);
            };
          } else {
            $images.each(function() {
              private.loadImage($(this), goal, $(this).data('src'), $queue);
            });
          };
          return true;
        },

        /**
         *  Executes after image was loaded
         *  @return {Object}
         **/
        loadedCallback: function() {
          if (!settings.preloading) {
            return;
          };
          switch (settings.animationType.toLowerCase()) {
            case "flip":
              return $(this).removeClass(settings.defaultClasses.imgPlaceholder.slice(1)).parents().eq(2).removeClass(settings.defaultClasses.flipper.opened);
              break;
            default:
              var $this = $(this).removeClass(settings.defaultClasses.imgPlaceholder.slice(1));
              if (!settings.saveNode) {
                $this = $this.parent();
              };
              if (settings.animationType.toLowerCase() === "slide") {
                $this.removeClass(settings.defaultClasses.slideUp.slice(1));
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
              if (i == $queue.length - 1) {
                private.eventTrigger("finished", "container", (new Date().getTime() - startTime));
              };
            }, i * Number(settings.queueDelay));
          });
        },

        /**
         *  Triggers event for certain context
         *  @param {String} event
         *  @param {String} context
         *  @return {Boolean}
         **/
        eventTrigger: function(event, context) {
          var event = event.toLowerCase(),
            context = context.toLowerCase(),
            $el = private.defineEventContext(context);
          private.debug("Event triggered: ", event, "in", context, "context.");
          if (!!events[context][event]) {
            return $el.trigger.apply($el, [event, Array.prototype.slice.call(arguments, 2)]);
          };
          return false;
        },

        /**
         *  Defines event context
         *  @param {String} selector
         *  @param {Object} $container
         *  @return {Object}
         **/
        defineEventContext: function(selector, $container) {
          var $container = $container || $(settings.defaultClasses.container),
            $context;
          switch (selector.toString().toLowerCase()) {
            case "window":
              $context = $(window);
              break;
            case "item":
              $context = $container.find(settings.defaultClasses.item);
              break;
            default:
              $context = $container;
          };
          return $context;
        },

        /**
         *  Binds events defined in events (default) and settings.events (user)
         *  @param {Object} $container
         *  @return {Object}
         **/
        bindEvents: function($container) {
          var $this;
          if (!!settings.events && typeof settings.events === "object") {
            events = $.extend(true, events, settings.events);
          };
          return $.each(events, function(selector, scope) {
            $this = private.defineEventContext(selector, $container);
            $.each(scope, function(event, callback) {
              var eventOn = callback.toString().match(/\{([\s\S]*)\}/m)[1].replace(/^\s*\/\/.*$/mg, '').trim() === "" ? "empty function on " + event : "on " + event;
              private.debug("Binding", eventOn, "to", {
                elements: $this
              });
              if (typeof callback === "function" && callback !== null) {
                $this.bind(event, callback);
              };
            });
          });
        },

        /**
         *  Initialize Gridddr
         *  @param {Integer} index
         *  @param {Object} el
         *  @return {Boolean}
         **/
        inititalize: function(index, el) {
          var $this = $(el);
          $this.css('opacity', 0);
          if (!!settings.events && !!settings.events.beforeInit && typeof settings.events.beforeInit === "function") {
            settings.events.beforeInit.call();
          };

          if (!$this.hasClass(settings.defaultClasses.container.slice(1))) {
            $this.addClass(settings.defaultClasses.container.slice(1));
          };

          if (!!settings.relative) {
            private.setRelativeClass($this, true);
          };

          if (private.overlay($this) && private.wrapItems($this) && !$this.data('inititalized')) {
            private.bindEvents($this);
            if (!!settings.useQueue) {
              private.createQueue.apply(private);
            };

            private.preloadContent.apply(private, $this);

            $this.data('inititalized', true).css('opacity', 1);
            private.eventTrigger("inititalized", "container");
            private.debug(el, "inititalized as Gridddr.");
            return true;
          };

          private.debug("Something went wrong");
          return false;
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
            if (typeof callback === "function") {
              callback.call();
            } else if (typeof window[callback] === "function") {
              window[callback]();
            } else private.debug(callback, "function dows not exist.");
          };
          return true;
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
         *  Updates settings for Gridddr
         *  @param {Object} settings
         *  @return {Object}
         **/
        updateSettings: function(newSettings) {
          settings = newSettings;
          public.refresh();
        },


        refresh: function(full) {
          var full = !!full;

        },

        /**
         *  Returns all events binded to Gridddr
         *  @param {Object} el
         *  @return {Object}
         **/
        getBindedEvents: function(el) {
          var result = {};
          $.each(events, function(scope, el) {
            var $this = $(private.defineEventContext(scope, false)),
              eventsList = $._data($this.get(0), "events");

            if (!eventsList) {
              private.debug("There are no events or they are not loaded yet.");
              result = false;
              return false;
            };

            result[scope] = $.map(eventsList, function(name, body) {
              var event = {
                name: name,
                body: body
              };
              return event;
            });
          });

          return result;
        },

        /**
         *  Gets all Gridddr items
         *  @return {Object}
         **/
        getItems: function() {
          return $(this).find(settings.defaultClasses.item);
        }
      };

    $.extend(true, this, public); // Merge settings
    return $.each(this, private.inititalize); // Initializing objects
  };

}(jQuery));
