// Filename: main.js

// Require.js allows us to configure mappings to paths
// as demonstrated below:
require.config({
  paths: {
    jquery: 'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-optamd3-min',
    text: 'libs/require/text',
    router: 'router'
  }

});

require([
  'jquery', 
  'underscore', 
  'backbone',
  'router'
], function($, _, Backbone, AppRouter){

  AppRouter.start();

  $(document).on("click", "a:not([data-bypass])", function(evt) {
    var href = $(this).attr("href");
    if (href && href.indexOf("#") === 0) {
      evt.preventDefault();
      AppRouter.navigate(href, true);
    }
  });
});
