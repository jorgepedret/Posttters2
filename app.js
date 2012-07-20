var application_root = __dirname,
  express = require("express"),
  path = require("path"),
  mongoose = require("mongoose"),
  fs = require("fs"),
  _ = require("underscore"),
  slug = require("slugs");

var app = express.createServer();

var getTemplate = function (template) {
  return fs.readFileSync(path.join(application_root, "views") + "/" + template + '.html', 'utf8');
};

// model
mongoose.connect('mongodb://localhost/posttters3');

var meta = new mongoose.Schema({
  key: String,
  value: String
});

var User = mongoose.model('User', new mongoose.Schema({
  login: String,
  pass: String,
  display_name: String,
  email: String,
  url: String,
  registered: Date,
  activation_key: String,
  status: String,
  meta : [meta]
}));

var Tags = mongoose.model('Tags', new mongoose.Schema({
  name: String,
  slug: String,
  featured: Boolean
}));

var Comments = mongoose.model('Comments', new mongoose.Schema({
  poster_id: mongoose.Schema.ObjectId,
  author: mongoose.Schema.ObjectId,
  author_name: String,
  author_email: String,
  author_IP: String,
  date: Date,
  content: String,
  status: String,
  likes: Number
}));

var Poster = mongoose.model('Poster', new mongoose.Schema({
  author: mongoose.Schema.ObjectId,
  date: Date,
  content: String,
  title: String,
  status: String,
  slug: String,
  modified: Date,
  tags: [Tags],
  likes: Number,
  commenst: [Comments],
  featured: Boolean,
  meta: [meta]
}));

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/', function(req, res){
  var html = _.template(getTemplate('layout'));
  res.send(html());
});

/* API calls */

/* Posters */
/*
Future filters available (can be parsed with req.query.{filter})
- filter: [featured|latest|popular]
- limit: {n}
- skip: {n}
- followed_by: {user_id}
- created_by: {user_id}
- tagged_with: {tag_id}
- location: lat/lang | city
- date: {date}
*/
app.get('/api/posters', function(req, res){
  console.log("Getting posters");
  return Poster.find().sort('date', -1).execFind(function(err, posters) {
    return res.send(posters);
  });
});

app.get('/api/posters/:id', function(req, res){
  console.log("Getting poster");
  return Poster.findById(req.params.id, function(err, poster) {
    if (!err) {
      return res.send(poster);
    } else {
      return res.send("Poster not found", 404);
    }
  });
});

app.put('/api/posters/:id', function(req, res){
  console.log("Updating poster");
  return Poster.findById(req.params.id, function(err, poster) {
    poster = {
      title : req.body.title,
      author : req.body.author_id,
      date : new Date(),
      content : req.body.content,
      status : "published",
      slug : slug(req.body.title),
      modified : new Date()
    };

    return poster.save(function(err) {
      if (!err) {
        console.log("Poster updated");
      }
      return res.send(poster);
    });
  });
});

app.post('/api/posters', function(req, res){
  var poster;
  console.log("Creating poster");
  poster = new Poster({
    title: req.body.title,
    author: req.body.author_id,
    date: new Date(),
    content: req.body.content,
    status: "published",
    slug: slug(req.body.title),
    modified: new Date()
  });
  poster.save(function(err) {
    if (!err) {
      return console.log("created");
    }
  });
  return res.send(poster);
});

app.delete('/api/posters/:id', function(req, res){
  console.log("Deleting poster");
  console.log(req.params);
  return Poster.findById(req.params.id, function(err, poster) {
    console.log("Poster: ", poster);
    if (poster !== null) {
      return poster.remove(function(err) {
        if (!err) {
          console.log("removed");
          return res.send('');
        }
      });
    } else {
      return res.send('', 404);
    }
  });
});

app.listen(3000);
