// In server/routes/index.js

import express from "express";
const router = express.Router();
import axios from "axios"; // 👈 Make sure to import axios

import usersRouter from "./users.js";
import repoPostsRoute from "./repoPosts.js";
import postInteractionRoute from "./repoPost_Interactions.js";





/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// =======================================================
// ⬇️ ADD THIS NEW ROUTE HANDLER ⬇️
// =======================================================
router.get("/github-repo/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;
  
  // Use the GITHUB_TOKEN from your Render environment variables
  const token = process.env.GITHUB_TOKEN;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    // 1. Fetch Repo, Languages, and Contributors in parallel
    const [repoRes, langRes, contribStatsRes] = await Promise.all([
      axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
      axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers,
      }),
      axios.get(
        `https://api.github.com/repos/${owner}/${repo}/stats/contributors`,
        { headers }
      ),
    ]);

    // 2. Fetch README with fallback
    let readmeData = "";
    try {
      const resMain = await axios.get(
        `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`
      );
      readmeData = resMain.data;
    } catch {
      try {
        const resMaster = await axios.get(
          `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`
        );
        readmeData = resMaster.data;
      } catch {
        readmeData = "No README file found in this repository.";
      }
    }

    // 3. Send all data back to the client
    res.status(200).json({
      repoData: repoRes.data,
      languages: langRes.data,
      contributors: contribStatsRes.data,
      readme: readmeData,
    });
    
  } catch (error) {
    console.error("GitHub API error:", error.message);
    res.status(500).json({ message: "Failed to fetch repo data from GitHub" });
  }
});
// =======================================================
// ⬆️ END OF NEW ROUTE ⬆️
// =======================================================


router.use("/users", usersRouter);
router.use("/repo-posts", repoPostsRoute);
router.use("/post-interaction", postInteractionRoute);

export default router;
//===AFK===