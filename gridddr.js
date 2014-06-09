(function($) {

  $.fn.gridddr = function(options) {
    var default_settings = {};
    var settings = $.extend(default_settings, options);

    return this.each(function() {
      console.log('hello, ', this);
    });

  }

}(jQuery));
