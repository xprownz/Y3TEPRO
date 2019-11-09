const express = require("express");
const Post = require('../models/post');


const app = express.Router();

//eBIa0zCI1xLkdZlB
//post object managed by mongoose

app.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  //saving to the database
  post.save().then(createdPost => {
    // added a then block that returns the post object
    // added an id to the response to allow the immediate deletion of a post once created
    res.status(201).json({
    message:"Post added successfully",
    postId: createdPost._id
    });
  });
});

// Update rersource with new values
app.put("/:id", (req, res, next) => {
  const post = new Post ({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message: "Update successful"});
  });
});

app.get('', (req, res, next) => {
  //return all results
  Post.find()
    .then(documents => {
      console.log(documents);
      res.status(200).json({
        message:"Tatto Posts fetched successfully!",
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
