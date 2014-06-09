(function($) {

  $.gridddr = function(options) {
    $('body').gridddr(options, true);
  };

  $.fn.gridddr = function(options, global) {
    var default_settings = {};
    var settings = $.extend(default_settings, options),
      global = global || false;
    console.log('hey', global, $(this));
    return this;
  };

}(jQuery));
