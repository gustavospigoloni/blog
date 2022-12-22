const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
require("dotenv").config();

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://" + dbUsername + ":" + dbPassword + "@cluster0.jgj6xnh.mongodb.net/blogDB");
mongoose.set('strictQuery', false);

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

const Post = mongoose.model("Post", postSchema);

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/", (req, res) => {
  Post.find({}, (err, foundPosts) => {
    if(err) console.log(err);
    else {
      res.render("home", { posts: foundPosts });
    }
  });
});

app.get("/posts/:post", (req, res) => {
  const postTitle = _.capitalize(req.params.post);
  
  Post.findOne({title: postTitle}, (err, foundPost) => {
    if (!err) {
      if(!foundPost) {
        console.log("Post not found");
      } else {
        res.render("post", { title: foundPost.title, body: foundPost.body })
      }
    }
  });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const newPost = new Post ({
    title: _.capitalize(req.body.composeTitle),
    body: req.body.composeBody,
  });
  newPost.save();
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});