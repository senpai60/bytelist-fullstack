import express from "express";
const router = express.Router();

import usersRouter from "./users.js";
import repoPostsRoute from "./repoPosts.js"

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/users", usersRouter);
router.use("/repo-posts",repoPostsRoute)

export default router;
