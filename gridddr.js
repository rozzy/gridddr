;
(function($) {
  $.gridddr = function(options) {
    return $('body').gridddr(options, true);
  };

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
      settings = $.extend(defaultSettings, options),
      global = global || false,
      private = {
        wrapChildren: function($this) {
          var children = $this.find(settings.itemClass);
          if (children.size() > 0) {

          };
          return true;
        },
        inititalize: function(index, el) {
          var $this = $(el);

          if (!$this.hasClass(settings.container)) {
            $this.addClass(settings.container);
          };

          private.wrapChildren($this);
          if (!$this.data('inititalized')) {
            $this.data('inititalized', true);
          };
          if (settings.debug) {
            console.log(el, "inititalized as Gridddr.");
          };

          return true;
        }
      },

      public = {
        getSettings: function() {
          return settings;
        }
      };

    $.extend(this, public);
    $.each(this, private.inititalize);
    return this;
  };

}(jQuery));
