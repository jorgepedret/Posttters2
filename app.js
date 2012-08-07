var application_root = __dirname,
  express = require("express"),
  path = require("path"),
  mongoose = require("mongoose"),
  fs = require("fs"),
  _ = require("underscore"),
  slug = require("slugs"),
  util = require("util"),
  http = require("http"),
  formidable = require("formidable"),
  format = util.format,
  moment = require("moment"),
  im = require("imagemagick");

var app = express.createServer();

var getTemplate = function (template) {
  return fs.readFileSync(path.join(application_root, "views") + "/" + template + '.html', 'utf8');
};

var getExtension = function (filename) {
    var ext = path.extname(filename||'').split('.');
    return ext[ext.length - 1];
}

var processPosterImage = function (filename, filepath, callback) {
  var minimum_width = 590,
    s_w = 270,
    s_h = 405,
    m_w = 430,
    l_w = 590,
    valid_formats = ["jpg", "jpeg", "png"],
    extension = path.extname(filename),
    new_file_name = path.basename(filepath),
    image_path = application_root + '/public/img/posters/',
    full_file_name = image_path + new_file_name + extension,
    small_file_name = image_path + new_file_name + '-s' + extension,
    medium_file_name = image_path + new_file_name + '-m' + extension,
    large_file_name = image_path + new_file_name + '-l' + extension;
  
  im.identify(filepath, function (err, features) {
    if (err) {
      callback('Invalid image file: ' + err);
      return;
    }
    var format = features.format.toLowerCase();
    if (_.indexOf(valid_formats, format) !== -1) {
      if (features.width >= minimum_width) {
        // Renaming and moving the original file
        fs.rename(filepath, full_file_name, function (err) {
          if (err) {
            callback('Something went wrong when trying to move your image: ' + err);
            return;
          }
          // Creating the small size image
          im.resize({
              srcPath: full_file_name,
              dstPath: small_file_name,
              quality: 1,
              format: format,
              width: s_w,
              height: s_h,
            }, function (err) {
              if (err) {
                callback('Something went wrong when trying to resize your image (small): ' + err);
                return;
              }
            }
          );
          // Creating the medium size image
          im.resize({
              srcPath: full_file_name,
              dstPath: medium_file_name,
              quality: 1,
              format: format,
              width: m_w,
              height: 999999
            }, function (err) {
              if (err) {
                callback('Something went wrong when trying to resize your image (medium): ' + err);
                return;
              }
            }
          );
          // Creating the medium size image
          im.resize({
              srcPath: full_file_name,
              dstPath: large_file_name,
              quality: 1,
              format: format,
              width: l_w,
              height: 999999
            }, function (err) {
              if (err) {
                callback('Something went wrong when trying to resize your image (large): ' + err);
                return;
              }
            }
          );

          var file_paths = {
            image: full_file_name.replace(application_root + '/public', ""),
            image_s: small_file_name.replace(application_root + '/public', ""),
            image_m: medium_file_name.replace(application_root + '/public', ""),
            image_l: large_file_name.replace(application_root + '/public', ""),
          }

          callback(false, file_paths);
        });
      } else {
        callback('Image is too small. It should at least have ' + minimum_width +'px of width');
        return;
      }
    } else {
      callback('Invalid image extension');
      return;
    }
  })
}

// model
mongoose.connect('mongodb://localhost/posttters3');

var Meta = new mongoose.Schema({
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
  meta : [Meta]
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
  event_dates: String,
  title: String,
  content: String,
  address: String,
  price: String,
  images: {
    original: String,
    large: String,
    medium: String,
    small: String
  },
  status: String,
  slug: String,
  modified: Date,
  tags: [Tags],
  likes: Number,
  commenst: [Comments],
  featured: Boolean,
  meta: [Meta]
}));

app.configure(function(){
  app.use(express.bodyParser({uploadDir:application_root+'/upload'}));
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
  return Poster.findOne({_id:req.params.id}, function(err, poster) {
    
    poster.title = req.body.title;
    poster.author = req.body.author_id;
    poster.date = new Date();
    poster.content = req.body.content;
    poster.status = "published";
    poster.slug = slug(req.body.title);
    poster.modified = new Date();
    poster.image = req.body.image;
    poster.address = req.body.address;
    poster.event_dates = req.body.event_dates;

    return poster.save(function(err) {
      if (!err) {
        console.log("Poster updated");
      }
      return res.send(poster);
    });
  });
});

app.post('/api/posters', function(req, res, next){
  var poster,
    image;
  if (req.files) {
    console.log("Uploading poster image");
    image = req.files.image || null;
    if (image !== null) {
      processPosterImage(image.name, image.path, function (err, file_paths) {
        if (err) {
          res.send(415, {
            error: err
          });
        } else {
          res.send(file_paths);
        }
      });
    } else {
      res.send(415, {
        error: "Invalid image upload"
      });
    }
  } else {
    console.log("Creating poster");
    poster = new Poster({
      title: req.body.title,
      author: req.body.author_id,
      date: new Date(),
      event_dates: req.body.event_dates,
      content: req.body.content,
      status: "published",
      slug: slug(req.body.title),
      modified: new Date(),
      images: {
        original: req.body.image,
        large: req.body.image_l,
        medium: req.body.image_m,
        small: req.body.image_s
      },
      address: req.body.address
    });
    poster.save(function(err) {
      if (!err) {
        return console.log("created");
      }
    });
    return res.send(poster);
  }
});

app.delete('/api/posters/:id', function(req, res){
  console.log("Deleting poster");
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
