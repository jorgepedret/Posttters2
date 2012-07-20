define([
  'jquery', 
  'underscore', 
  'backbone',
  'text!templates/posters/item.html'
], function($, _, Backbone, posterTemplate){
  var PosterView = Backbone.View.extend({

    tagName:  "li",
    className: "poster-excerpt",

    template: _.template(posterTemplate),

    events: {
      "click .delete": "eliminar"
    },

    initialize: function() {
      this.model.on("all", this.render, this);
      this.model.on("remove", this.remove, this);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    eliminar: function () {
      console.log("PosterView.eliminar()");
      console.log("View: ", this.model.attributes);
      this.model.eliminar();
    },

    remove: function () {
      this.$el.remove();
    }
  });
  return PosterView;
});
