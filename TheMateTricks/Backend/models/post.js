//import mongoose creating a schema
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  //Passing javascript object, title/content are required
  title: { type: String, required: true },
  artistName: { type: String, required: true },
  location: { type: String, required: true },
  phoneNo: { type: String, required: true },
  content:{type: String, required: true },
  imagePath: {type: String, required: true },
  // this type instructs mongoose that we will be storing an id, the ref chooses the schema to referenced for the id
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Authorization', required: true }
});

//exporting the model for use outside of this file
module.exports = mongoose.model('Post', postSchema);
