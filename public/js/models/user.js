define(['underscore', 'backbone'], function(_, Backbone) {
  var UserModel = Backbone.Model.extend({

    // Default attributes for the todo.
    defaults: {
      registered: function () {
        return new Date();
      },
      status: "pending",
      meta : []
    },

    // Ensure that each todo created has `content`.
    initialize: function() {
    },

    clear: function() {
      this.destroy();
    }

  });
  return UserModel;
});
