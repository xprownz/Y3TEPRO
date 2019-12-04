const Post = require('../models/post');

exports.createPost = (req, res, next) => {
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
}

exports.updatePost = (req, res, next) => {
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
    console.log(result);
    if (result.n > 0) {
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

exports.fetchPost = (req, res, next) => {
  //return all results
  Post.find()
    .then(documents => {
      console.log(documents);
      res.status(200).json({
        message:"Tattoo Posts fetched successfully!",
        posts: documents
        });
    });
}

exports.getPost = (req, res, next) => {
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
}

exports.deletePost = (req, res, next) => {
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
}
