define(['underscore', 'backbone'], function(_, Backbone) {
  var CommentModel = Backbone.Model.extend({

    // Default attributes for the todo.
    defaults: {
      author_name: "",
      author_email: "",
      author_IP: "",
      date: function () {
        return new Date();
      },
      content: "Empty comment",
      status: "pending",
      likes: 0
    },

    // Ensure that each todo created has `content`.
    initialize: function() {
    },

    clear: function() {
      this.destroy();
    }

  });
  return CommentModel;
});
