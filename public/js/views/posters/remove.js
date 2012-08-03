define([
  'jquery', 
  'underscore', 
  'backbone',
  'router',
  'text!templates/posters/remove.html'
], function($, _, Backbone, appRouter, removePostersTemplate){
  
  var RemovePostersView = Backbone.View.extend({

    template: _.template(removePostersTemplate),

    initialize: function () {
      
    },
    events: {
      "click .btn-delete": "delete"
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    delete: function () {
      this.model.remove(function () {
        appRouter.navigate("", true);
      });
    }
  });
  return RemovePostersView;
});