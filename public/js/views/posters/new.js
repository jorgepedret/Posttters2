define([
  'jquery', 
  'underscore', 
  'backbone',
  'models/poster',
  'router',
  'text!templates/posters/new.html',
  'ajaxupload',
  'autoresize',
  'textchange'
], function($, _, Backbone, Poster, appRouter, newPosterTemplate){
  var NewPosterView = Backbone.View.extend({

    template: _.template(newPosterTemplate),

    events: {
      "submit form": "createPoster"
    },

    initialize: function () {

    },
    isValid: function () {

    },
    createPoster: function (e) {
      var poster = new Poster();
      e.preventDefault();
      console.log("Image path: ", $("#poster_image_path").val());
      poster.save({
          title: $("#poster_title").val(),
          content: $("#poster_content").val(),
          event_dates: $("#poster_event_dates").val(),
          address: $("#poster_address").val(),
          price: $("#poster_price").val(),
          image: $("#poster_image_path").val()
        }, {
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
      this.$el.html(this.template());

      this.$el.ready(function () {
        self.$('.input-desc').autoresize();
        new AjaxUpload(self.$('#poster_image_btn'), {
          action: '/api/posters',
          name: 'image',
          onSubmit: function (file, extension) {
            console.log("uploading file");
            $(".poster-image-placeholder").css('text-align', 'center').html("<img src='/img/spinning-wheel.gif' />");
          },
          onComplete: function (file, response) {
            $(".poster-image-placeholder img").remove();
            $("#poster_image_path").val(response);
            $(".form-poster-img img").remove();
            $(".poster-image-placeholder").hide();
            $(".form-poster-img").prepend('<img src="' + response + '" class="poster-img poster-img-med" />');
          }
        });
        self.$(":input").on('blur', function () {
          var field = $(this),
            field_name = field.attr('name');
          self.model.validateField(field_name, field.val(), function (err) {
            if (err) {
              field.removeClass('input-pass');
            } else {
              field.addClass('input-pass');
            }
          });
        });
        self.$(":input").bind("textchange", function () {
          var field = $(this);
          field.siblings(".input-error").remove();
        })
        $('.input-main').focus();
      });
      return this;
    }
  });
  return NewPosterView;
});
