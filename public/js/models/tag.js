define(['underscore', 'backbone'], function(_, Backbone) {
  var TagModel = Backbone.Model.extend({

    // Default attributes for the todo.
    defaults: {
      name: "",
      featured: false
    },

    // Ensure that each todo created has `content`.
    initialize: function() {
    },

    clear: function() {
      this.destroy();
    }

  });
  return TagModel;
});
