define([
  'underscore',
  'backbone',
  'models/meta'
], function(_, Backbone, Meta){
  var MetaCollection = Backbone.Collection.extend({
    model: Meta,
  });
  return MetaCollection;
});
