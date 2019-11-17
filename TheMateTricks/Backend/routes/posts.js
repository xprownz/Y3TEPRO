const express = require("express");
const Post = require('../models/post');
////////// npm install --save multer ///////////////
const multer = require('multer');

const app = express.Router();

const MIME_TYPE_MAP = {
  // Supports below files
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage= multer.diskStorage({
  // Function will be executed when multer tries to save
  destination: (req, file, cb) => {
    // Detect an error?
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(null, "backend/images"); // Writes to images folder
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' +ext);
  }
});

//eBIa0zCI1xLkdZlB
//post object managed by mongoose

app.post("", multer({storage: storage}).single('image'), (req, res, next) => {
  //Getting URL
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  //saving to the database
  post.save().then(createdPost => {
    // added a then block that returns the post object
    // added an id to the response to allow the immediate deletion of a post once created
    res.status(201).json({
    message:"Post added successfully",
    // Create new object and use spread operator
    // Creates all properties of createdPost
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  });
});

// Update rersource with new values
app.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id }, post).then(result => {
      res.status(200).json({ message: "Update successful!" });
    });
  }
);

app.get('', (req, res, next) => {
  //return all results
  Post.find()
    .then(documents => {
      console.log(documents);
      res.status(200).json({
        message:"Tattoo Posts fetched successfully!",
        posts: documents
        });
    });
});

app.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: "Post could not be found"});
    }
  });
});

// added the route that allows the deletion of the post using the id param
// used the mongoDB documentation for API query to implement the deletOne functionality
// https://mongoosejs.com/docs/api/query.html#query_Query-deleteOne
app.delete("/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({ message: "Tattoo Post deleted!"})
  })
});

module.exports = app;
