const router = require("express").Router();

const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

// Create new post===============
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savePost = await newPost.save();
    res.status(200).json(savePost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update post===============
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// delete post=================
router.delete("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.username === req.body.username) {
        try {
         await post.delete();
          res.status(200).json("Post deleted successfully");
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json("You can delete only your post");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
// get post========================
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get All post========================
router.get("/", async (req, res) => {
    const username = req.query.user;
    try {
     let posts;
     if(username){
        posts = await Post.find({ username});
     } else{
        posts = await Post.find()
     }
     res.status(200).json(posts);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
module.exports = router;
