define([
  'jquery', 
  'underscore', 
  'backbone',
  'views/posters/item',
  'text!templates/posters/list.html'
], function($, _, Backbone, PosterView, postersTemplate){
  
  var PostersView = Backbone.View.extend({

    template: _.template(postersTemplate),

    initialize: function () {
      this.collection.bind("reset", function (e) {
        this.addAll();
      }, this);
      this.collection.bind("add", function (poster) {
        this.addOne(poster);
      }, this);
      this.collection.bind("change", this.addAll, this);
      this.collection.bind("remove", this.checkEmpty, this);
    },

    render: function () {
      this.addAll();
      return this;
    },

    addAll: function () {
      this.is_empty = false;
      if (this.collection.length <= 0) {
        this.is_empty = true;
      }
      this.$el.html(this.template({
        is_empty: this.is_empty
      }));
      this.posters_list = this.$(".posters-list");
      this.posters_list.empty();
      if (this.collection.length <= 0) {

      } else {
        this.collection.forEach(this.addOne, this);
      }
    },

    addOne: function (poster) {
      var posterView = new PosterView({model: poster});
      this.posters_list.append(posterView.render().el);
    },

    checkEmpty: function () {
      if (this.collection.length <= 0) {
        this.addAll();
      }
    }
  });
  return PostersView;
});