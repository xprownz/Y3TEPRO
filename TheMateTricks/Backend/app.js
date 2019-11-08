const express = require ('express');
const bodyParser = require("body-parser");
const Post = require('./models/post');
const mongoose = require('mongoose');
const app = express();

//connection to mongoDB
mongoose.connect('mongodb+srv://Aaron:eBIa0zCI1xLkdZlB@cluster0-yiwjf.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to database')
  })
  .catch(() => {
    console.log('Connection failed')
  });

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
})
//eBIa0zCI1xLkdZlB
//post object managed by mongoose
app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  //saving to the database
  post.save();
  res.status(201).json({
    message:'Post added successfully'
  });
});

app.get('/api/posts', (req, res, next) => {
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

// added the route that allows the deletion of the post using the id param 
// used the mongoDB documentation for API query to implement the deletOne functionality
// https://mongoosejs.com/docs/api/query.html#query_Query-deleteOne
app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({ message: "Tattoo Post deleted!"})
  })
});

module.exports = app;
