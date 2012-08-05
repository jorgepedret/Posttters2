define([
  'jquery',
  'underscore', 
  'backbone'
], function($, _, Backbone){
  
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#postttersapp"),

    // Our template for the line of statistics at the bottom of the app.
    //statsTemplate: _.template(statsTemplate),

    events: {
      
    },

    initialize: function() {
      console.log("initializing app view");
    },
    render: function() {
      
    },
    login: function () {
      
    },
    home: function () {
      var that = this;
      require([
        "models/poster",
        "collections/posters",
        "views/posters/list"
      ], function (Poster, posters, PostersView) {
        var postersView = new PostersView({
          collection: posters
        });
        //Show loading
        posters.fetch({
          success: function (posters) {
            var html = postersView.render().el;
            $(html).find("img").load(function () {
              that.$el.html(html);
            });
          }
        });
      });
    },
    poster_new: function () {
      var that = this;
      require([
        "models/poster",
        "views/posters/new"
      ], function (Poster, NewPosterView) {
        var poster = new Poster();
        var newPosterView = new NewPosterView({model:poster});
        var html = newPosterView.render().el
        that.$el.html(html);
      });
    },
    poster_edit: function (id) {
      var that = this;
      require([
        "models/poster",
        "views/posters/edit"
      ], function (Poster, EditPosterView) {
        var poster = new Poster({_id:id});
        var editPosterView = new EditPosterView({
          model:poster
        });
        var html = editPosterView.render().el
        that.$el.html(html);
        poster.fetch();
      });
    },
    poster_view: function (id) {
      var that = this;
      require([
        "models/poster",
        "views/posters/single"
      ], function (Poster, SinglePosterView) {
        var poster = new Poster({_id: id});
        var singlePosterView = new SinglePosterView({
          model : poster
        });
        var html = singlePosterView.render().el
        that.$el.html(html);
        poster.fetch();
      });
    },
    poster_remove: function (id) {
      var that = this;
      require([
        "models/poster",
        "views/posters/remove"
      ], function (Poster, PosterRemoveView) {
        var poster = new Poster({_id: id});
        var posterRemoveView = new PosterRemoveView({
          model : poster
        });
        var html = posterRemoveView.render().el
        that.$el.html(html);
        poster.fetch();
      });
    }
  });
  return AppView;
});
