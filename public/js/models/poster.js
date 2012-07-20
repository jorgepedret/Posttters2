define(['underscore', 'backbone'], function(_, Backbone) {
  
  var PosterModel = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: "/api/posters",
    // Default attributes for the todo.
    defaults: {
      date: function () {
        return new Date();
      },
      content: "No description",
      title: "Untitled Poster",
      status: "published",
      modified: function () {
        return new Date();
      },
      tags: [],
      likes: 0,
      commenst: [],
      meta: [],
      featured: false
    },
    eliminar: function () {
      this.destroy({
        wait: true,
        success: function () {
          console.log("Poster removed");
        },
        error: function () {
          console.log("Something went wrong");
        }
      });
    }
  });
  return PosterModel;
});
