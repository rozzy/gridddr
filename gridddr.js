;
(function($) {
  $.gridddr = function(options) {
    return $('body').gridddr(options, true);
  };

  $.fn.gridddr = function(options, global) {
    var default_settings = {
      debug: true,
      container: ".gridddr-container",
      itemClass: ".gridddr-item",
      itemTag: false,
      itemWidth: 150,
      itemHeight: 150,
      overlay: "black",
      gridX: "auto",
      gridY: "auto",
      repeat: true,
      useGPU: true,
      useCSS: true,
    };

    var
      settings = $.extend(default_settings, options),
      global = global || false,
      _ = {
        inititalize: function(index, el) {
          console.log(el);
        }
      },
      public = {
        getSettings: function() {
          return settings;
        }
      };

    $.extend(this, public);
    $.each(this, _.inititalize);

    return this;
  };

}(jQuery));
