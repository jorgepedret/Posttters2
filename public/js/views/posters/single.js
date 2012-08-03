define([
  'jquery', 
  'underscore', 
  'backbone',
  'text!templates/posters/single.html',
  'autoresize'
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
      var self = this;
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.ready(function () {
        self.$('#comment').autoresize();
      });
      return this;
    }
  });
  return SinglePosterView;
});
