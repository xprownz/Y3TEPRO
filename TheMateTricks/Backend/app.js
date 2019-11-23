const path = require ('path');
const express = require ('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");
const authRoutes = require("./routes/authorization");

const app = express();

// Bodyparser only works for JSON and not files
////////// npm install --save multer ///////////////

// server side
// connection to mongoDB
mongoose.connect('mongodb+srv://Aaron:eBIa0zCI1xLkdZlB@cluster0-yiwjf.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to database')
  })
  .catch(() => {
    console.log('Connection failed')
  });

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
// Only apply to requests that contain "backend/images" will be allowed to continue. Forwarded to backend images
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/authorization", authRoutes);

module.exports = app;
