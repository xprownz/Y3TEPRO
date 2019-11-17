//import mongoose creating a schema
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  //Passing javascript object, title/content are required
  title: { type: String, required: true },
  content:{type: String, required: true },
  imagePath: {type: String, required: true }
});

//exporting the model for use outside of this file
module.exports = mongoose.model('Post', postSchema);
