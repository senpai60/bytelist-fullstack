import express from "express";
const router = express.Router();

import usersRouter from "./users.js";
import repoPostsRoute from "./repoPosts.js"
import postInteractionRoute from './repoPost_Interactions.js'

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/users", usersRouter);
router.use("/repo-posts",repoPostsRoute)
router.use('/post-interaction',postInteractionRoute)

export default router;
//===AFK===