define([
  'underscore',
  'backbone',
  'moment'
  ], function(_, Backbone) {
  
  var PosterModel = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: "/api/posters",
    defaults: {
      date: function () {
        return new Date();
      },
      address: "Vancouver, Canada",
      event_dates: "",
      content: "No description",
      title: "Untitled Poster",
      status: "published",
      image: "/img/sample-poster-m.jpg",
      modified: function () {
        return new Date();
      },
      tags: [],
      likes: 0,
      commenst: [],
      meta: [],
      price: "FREE",
      featured: false
    },
    initialize: function () {
      _.bindAll(this, 'serialize');
    },
    validateField: function (name, value, callback) {
      var error = "";
      switch (name) {
        case 'title':
          if (!value || value === "") {
            error = "Yo! What's you're poster's title?";
            callback(error);
            return false;
          }
          break;
        case 'content':
          if (!value || value === "") {
            error = "Yo! Tell us a bit more about your poster!";
            callback(error);
            return false;
          }
          break;
      }
      callback(false);
    },
    serialize: function () {
      var json = this.toJSON(),
        self = this;
      return _.extend(json, {
        excerpt: (function () {
          return self.get('content').substring(0, 140);
        })(),
        modified: (function () {
          console.log(self.get('date'));
          return moment(self.get('date')).from(moment());
        })()
      });
    },
    remove: function (callback) {
      this.destroy({
        wait: true,
        success: function () {
          console.log("Poster removed");
          callback();
        },
        error: function () {
          console.log("Something went wrong");
        }
      });
    },
    img_src: function () {
      return this.image;
    }
  });
  return PosterModel;
});
