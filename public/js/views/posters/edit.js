define([
  'jquery', 
  'underscore', 
  'backbone',
  'models/poster',
  'router',
  'text!templates/posters/edit.html',
  'ajaxupload',
  'autoresize'
], function($, _, Backbone, Poster, appRouter, editPosterTemplate){
  var EditPosterView = Backbone.View.extend({

    template: _.template(editPosterTemplate),
    tagName: 'article',
    className: 'poster-edit',

    events: {
      "submit form": "updatePoster"
    },

    initialize: function () {
      this.model.on("change", this.render, this);
    },

    updatePoster: function (e) {
      var poster = this.model;
      e.preventDefault();
      
      poster.set('title', $("#poster_title").val());
      poster.set('content', $("#poster_content").val());
      poster.set('event_dates', $("#poster_event_dates").val());
      poster.set('address', $("#poster_address").val());
      poster.set('price', $("#poster_price").val());
      poster.set('image', $("#poster_image_path").val());

      poster.save({
          error: function () {
            console.log("Something went wrong");
          },
          success: function () {
            appRouter.navigate('', {trigger: true});
          }
        }
      );
    },

    render: function () {
      var self = this;
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.ready(function () {
        self.$('.input-desc').autoresize();
        new AjaxUpload(self.$('#poster_image_btn'), {
          action: '/api/posters',
          name: 'image',
          onSubmit: function (file, extension) {
            
          },
          onComplete: function (file, response) {
            $("#poster_image_path").val(response);
            $(".form-poster-img img").remove();
            $(".form-poster-img").prepend('<img src="' + response + '" class="poster-img poster-img-med" />');
          }
        });
      });
      return this;
    }
  });
  return EditPosterView;
});
