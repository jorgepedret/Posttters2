define([
  'jquery', 
  'underscore', 
  'backbone',
  'models/poster',
  'router',
  'text!templates/posters/new.html',
  'jqueryui',
  'ajaxupload',
  'autoresize',
  'textchange',
  'multidate'
], function($, _, Backbone, Poster, appRouter, newPosterTemplate){
  var NewPosterView = Backbone.View.extend({

    template: _.template(newPosterTemplate),

    events: {
      "submit form": "createPoster",
      "blur :input": "validateField"
    },

    initialize: function () {
      loadCss('/js/libs/jquery-ui/css/posttters/jquery-ui.css');
    },
    isValid: function () {

    },
    loadAjaxUpload: function () {
      var self = this;
      new AjaxUpload(this.$('#poster_image_btn'), {
        action: '/api/posters',
        name: 'image',
        responseType: 'json',
        onSubmit: function (file, extension) {
          self.$(".poster-image-placeholder").css('text-align', 'center').html("<img src='/img/spinning-wheel.gif' />");
        },
        onComplete: function (file, response) {
          if (!response.error) {
            self.$(".poster-image-placeholder").find('.input-error').remove();
            self.$(".poster-image-placeholder img").remove();
            
            self.$("#poster_image_path").val(response.image);
            self.$("#poster_image_s_path").val(response.image_s);
            self.$("#poster_image_m_path").val(response.image_m);
            self.$("#poster_image_l_path").val(response.image_l);
            
            self.$(".form-poster-img img").remove();
            self.$(".poster-image-placeholder").hide();

            self.$(".form-poster-img").prepend('<img src="' + response.image + '" class="poster-img poster-img-med" />');
          } else {
            console.log(response);
            self.$(".poster-image-placeholder").show();
            self.$(".poster-image-placeholder").html('<div class="input-error">' + response.error + '</div>');
          }
        }
      });
    },
    createPoster: function (e) {
      var poster = new Poster();
      e.preventDefault();
      poster.save({
          title: $("#poster_title").val(),
          content: $("#poster_content").val(),
          event_dates: $("#poster_event_dates").val(),
          address: $("#poster_address").val(),
          price: $("#poster_price").val(),
          image: $("#poster_image_path").val(),
          image_s: $("#poster_image_s_path").val(),
          image_m: $("#poster_image_m_path").val(),
          image_l: $("#poster_image_l_path").val(),
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
    validateField: function (e) {
      var field = $(e.target),
        field_name = field.attr('name'),
        value = field.val();
      this.model.validateField(field_name, value, function (err) {
        if (err) {
          field.removeClass('input-pass');
        } else {
          field.addClass('input-pass');
        }
      });
    },
    render: function () {
      var self = this;
      this.$el.html(this.template());

      this.$el.ready(function () {
        self.$('.input-desc').autoresize();
        self.loadAjaxUpload();
        self.$('#poster_event_dates').multidate();
        
        
        self.$(":input").bind("textchange", function () {
          var field = $(this);
          field.siblings(".input-error").remove();
        });
        $('.input-main').focus();
      });
      return this;
    }
  });
  return NewPosterView;
});
