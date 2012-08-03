define([
  'jquery', 
  'underscore', 
  'backbone', 
  'views/app'
], function($, _, Backbone, AppView){
  var Router = Backbone.Router.extend({
    routes: {
      "": "home",
      "posters/new": "poster_new",
      "posters/:id": "poster_view",
      "posters/:id/edit": "poster_edit",
      "posters/:id/remove": "poster_remove",
      "login": "login",
      "logout": "logout",
      "register": "register"
    },
    start: function () {
      Backbone.history.start();
    },
    initialize: function () {
      this.appview = new AppView();
    },
    home: function () {
      this.appview.home();
    },
    poster_view: function (id) {
      this.appview.poster_view(id);
    },
    poster_new: function () {
      this.appview.poster_new();
    },
    poster_edit: function (id) {
      this.appview.poster_edit(id);
    },
    poster_remove: function (id) {
      this.appview.poster_remove(id);
    },
    login: function () {
      this.appview.login();
    }, 
    logout: function () {
      console.log("Logout");
    },
    register: function () {
      console.log("Register");
    }
  });
  return new Router;
});