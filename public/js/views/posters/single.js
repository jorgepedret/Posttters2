define([
  'jquery', 
  'underscore', 
  'backbone',
  'text!templates/posters/single.html'
], function($, _, Backbone, singlePosterTemplate){
  var SinglePosterView = Backbone.View.extend({
    tagName:  "article",
    className: "poster-single",
    template: _.template(singlePosterTemplate),
    events: {
      
    },
    initialize: function() {
      this.model.on("change", this.render, this);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });
  return SinglePosterView;
});
