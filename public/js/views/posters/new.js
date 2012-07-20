define([
  'jquery', 
  'underscore', 
  'backbone',
  'models/poster',
  'router',
  'text!templates/posters/new.html'
], function($, _, Backbone, Poster, AppRouter, newPosterTemplate){
  var NewPosterView = Backbone.View.extend({

    template: _.template(newPosterTemplate),

    events: {
      "submit form": "createPoster"
    },

    createPoster: function (e) {
      e.preventDefault();
      var poster = new Poster();
      poster.save({
          title: $("#poster_title").val(),
          content: $("#poster_content").val()
        }, {
          error: function () {
            console.log("Something went wrong");
          },
          success: function () {
            AppRouter.navigate('', {trigger: true});
          }
        }
      );
    },

    render: function () {
      $(this.el).html(this.template());
      return this;
    }
  });
  return NewPosterView;
});
