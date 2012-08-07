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
      
    },

    initialize: function() {
      this.model.on("all", this.render, this);
      this.model.on("remove", this.remove, this);
    },

    render: function() {
      console.log(this.model.serialize());
      this.$el.html(this.template(this.model.serialize()));
      return this;
    },
    remove: function () {
      this.remove();
    }
  });
  return PosterView;
});
