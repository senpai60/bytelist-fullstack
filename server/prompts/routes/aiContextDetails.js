import express from "express";
const router = express.Router();

// mw

// DB
import RepoContext from "../models/RepoContext.js";

router.get("/:repoPostId", async (req, res) => {
  const { repoPostId } = req.params;

  try {
    const repoPostContext = await RepoContext.findOne({ repoPost: repoPostId })
    .populate("repoPost", "title description tags githubUrl liveUrl image")
    .populate("user", "_id username avatar")
    .lean()

    if (!repoPostContext)
      return res.status(401).json({
        message: `couldn't found any context please give use few hours to generate your query :)`,
      });

    res.status(200).json({ repoPostContext: repoPostContext });
  } catch (err) {
    console.error(err);
    res.status(502).json({
      message: "server receiving too many requests please try again later :(",
    });
  }
});

export default router;
