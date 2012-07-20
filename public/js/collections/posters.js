define([
  'underscore',
  'backbone',
  'models/poster'
], function(_, Backbone, Poster){
  var PostersCollection = Backbone.Collection.extend({

    model: Poster,

    url: "/api/posters",

    initialize: function () {
      console.log("Initializing Posters collection");
    }
  });
  return new PostersCollection;
});
