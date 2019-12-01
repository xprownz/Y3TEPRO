const express = require("express");
const Post = require('../models/post');
const authCheck = require("../middleware/auth-check");

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

app.post("", authCheck, multer({storage: storage}).single('image'), (req, res, next) => {
  //Getting URL
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    artistName: req.body.artistName,
    location: req.body.location,
    phoneNo: req.body.phoneNo,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
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
  })
  .catch(error => {
    res.status(500).json({
      message: "Failed to create post"
    });
  });
});

// Update rersource with new values
app.put(
  "/:id",
  authCheck,
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
      artistName: req.body.artistName,
      location: req.body.location,
      phoneNo: req.body.phoneNo,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
      if (result.nModified > 0) {
        res.status(200).json({ message: "Update successful!" });
      }
      else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Failed to update post"
      });
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
  }).catch(error => {
    res.status(500).json({
      message: "Fetching post failed"
    });
  });
});

// added the route that allows the deletion of the post using the id param
// used the mongoDB documentation for API query to implement the deletOne functionality
// https://mongoosejs.com/docs/api/query.html#query_Query-deleteOne
app.delete("/:id", authCheck, (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId }).then(result => {
    console.log(result);
    if (result.n > 0) {
      res.status(200).json({ message: "Deletion successful!" });
    }
    else {
      res.status(401).json({ message: "Not authorized!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching post failed"
    });
  });
});

module.exports = app;
