define([
  'underscore',
  'backbone'
  ], function(_, Backbone) {
  
  var MetaModel = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      key: "",
      value: ""
    },
    validate: function (atts) {
      if (!atts.key) {
        return "Invalid meta key";
      }
      if (!atts.value) {
        return "Invalid meta value";
      }
    }
  });
  return MetaModel;
});
