import express from "express";
const router = express.Router();

import jwt from "jsonwebtoken"
import RepoPost from "../models/RepoPost.js";

router.get("/all-repo-posts", async (req, res) => {
  try {
    const repoPosts = await RepoPost.find({});
    res.status(201).json({ repoPosts });
  } catch (err) {
    console.error(err);
    res.status(501).json({
      message:
        "something went wrong please refresh the page or try again later!",
    });
  }
});

router.post("/create-repo-post", async (req, res) => {
  const {user,title, description, tags, image, githubUrl, liveUrl } = req.body;
//   const token  = req.cookies.token
//   const decoded =  jwt.verify(token,process.env.JWT_SECRET)
//   const user =  decoded.userId
  if (!title || !githubUrl)
    return res.status(401).json({
      message: "Bro you at least need title and the GitHub repo link :)",
    });
  try {
   const newRepoPost =   await RepoPost.create({
      user,  
      title,
      description,
      tags,
      image,
      githubUrl,
      liveUrl,
    });
    res.statusCode(201)
  } catch (err) {
    console.error(err);
    res.status(502).json({ message: "Try again later :)" });
  }
});

export default router;
