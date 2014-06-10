;
(function($) {

  /**
   *  Create function alias for using like: $.gridddr()
   *  which will automatically create needed nodes
   *  @param {Object} options
   *  @return {Object}
   **/
  $.gridddr = function(options) {
    return $('body').gridddr(options, true);
  };

  /**
   *  Gridddr jQuery definition
   *  @param {Object} options
   *  @param {Boolean} global
   *  @return {Object}
   **/
  $.fn.gridddr = function(options, global) {
    var defaultSettings = {
      debug: false,
      container: ".gridddr-container",
      itemClass: ".gridddr-item",
      itemWidth: 150,
      itemHeight: 150,
      overlay: "black",
      gridX: "auto",
      gridY: "auto",
      repeat: true,
      useGPU: true,
      useCSS: true,
      animations: true,
      animationsSpeed: 500
    };

    var
      settings = $.extend(defaultSettings, options), // Merging default settings with user settings (if defined)
      global = global || false, // Use automatic node creation?
      private = { // Private Gridddr functions
        /**
         *  Convert children objects into Gridddr items
         *  @param {Object} $this
         *  @return {Boolean}
         **/
        wrapItems: function($this) {
          var items = $this.find(settings.itemClass);
          if (items.size() > 0) {
            items.each(function() {
              if (!$(this).hasClass(settings.itemClass.slice(1))) {
                $(this).addClass(settings.itemClass.slice(1));
              };
            });
          };
          return true;
        },
        /**
         *  Initialize Gridddr
         *  @param {Integer} index
         *  @param {Object} el
         *  @return {Boolean}
         **/
        inititalize: function(index, el) {
          var $this = $(el);

          if (!$this.hasClass(settings.container.slice(1))) {
            $this.addClass(settings.container.slice(1));
          };

          private.wrapItems($this);
          if (!$this.data('inititalized')) {
            $this.data('inititalized', true);
          };
          if (settings.debug) {
            console.log(el, "inititalized as Gridddr.");
          };

          return true;
        }
      },

      public = { // Public Gridddr methods. To user like var grid = $.gridddr(); grid.update();
        /**
         *  Returns used settings for the actual Gridddr instance
         *  @return {Object}
         **/
        getSettings: function() {
          return settings;
        }
      };

    $.extend(this, public); // Merge settings
    $.each(this, private.inititalize);
    return this;
  };

}(jQuery));
