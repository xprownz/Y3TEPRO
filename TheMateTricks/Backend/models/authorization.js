//import mongoose creating a schema
const mongoose = require('mongoose');
// adding the necessary import for the mongoose validator for the email attribute in the schema
const uniqueValidator = require("mongoose-unique-validator");

const authSchema = mongoose.Schema({
  //Passing javascript object, title/content are required
  // note: unique keyword is not for validation, it is used by Mongoose for internal optimization
  email: { type: String, required: true, unique: true },
  password:{type: String, required: true }
})

// this unique validator provides validation before any data is submitted
authSchema.plugin(uniqueValidator);

//exporting the model for use outside of this file
module.exports = mongoose.model('Authorization', authSchema);