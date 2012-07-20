define([
  'jquery', 
  'underscore', 
  'backbone',
  'text!templates/posters/remove.html'
], function($, _, Backbone, PosterView, removePostersTemplate){
  
  var RemovePostersView = Backbone.View.extend({

    template: _.template(removePostersTemplate),

    initialize: function () {
      
    },
    events: {
      "click .delete": "delete"
    },
    delete: function () {
      this.model.remove();
    }
  });
  return RemovePostersView;
});