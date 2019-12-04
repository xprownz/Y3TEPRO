const express = require("express");

const PostController = require("../controllers/posts");

const authCheck = require("../middleware/auth-check");
const extractFile = require("../middleware/file");

////////// npm install --save multer ///////////////

const app = express.Router();

//eBIa0zCI1xLkdZlB
//post object managed by mongoose

app.post(
  "",
  authCheck,
  extractFile,
  PostController.createPost
);

// Update rersource with new values
app.put(
  "/:id",
  authCheck,
  extractFile,
  PostController.updatePost
);

app.get('', PostController.fetchPost);

app.get("/:id", PostController.getPost);

// added the route that allows the deletion of the post using the id param
// used the mongoDB documentation for API query to implement the deletOne functionality
// https://mongoosejs.com/docs/api/query.html#query_Query-deleteOne
app.delete("/:id", authCheck, PostController.deletePost);

module.exports = app;
