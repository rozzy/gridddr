;
(function($) {
  $.gridddr = function(options) {
    return $('body').gridddr(options, true);
  };

  $.fn.gridddr = function(options, global) {
    var default_settings = {
      debug: true,
      container: ".gridddr-container",
      item: ".gridddr-item",
      gridX: "auto",
      gridY: "auto",
      repeat: true,
      useGPU: true,
      useCSS: true
    };
    var settings = $.extend(default_settings, options),
      global = global || false;
    return $.fn.gridddr.methods;
  };

  $.fn.gridddr.methods = {
    getSettings: function(argument) {
      if (argument) alert(argument);
      return $.fn.gridddr();
    }
  };

}(jQuery));
