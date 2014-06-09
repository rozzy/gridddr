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

    this.getSettings = function(test) {
      alert("inseide:" + test);
      return this;
    };

    var settings = $.extend(default_settings, options),
      global = global || false;
    console.log("global: ", global);
    return this;
  };

}(jQuery));
