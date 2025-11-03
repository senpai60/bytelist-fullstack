// In server/routes/index.js

import express from "express";
const router = express.Router();
import axios from "axios"; // 👈 Make sure to import axios

import usersRouter from "./users.js";
import repoPostsRoute from "./repoPosts.js";
import postInteractionRoute from "./repoPost_Interactions.js";
import updateAchievementsRoute from "./achievementsUpdate.js"
import commentsRoute from './comments.js'
import challengeRoute from './challenges.js'
import taskRoute from './tasks.js'





/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// =======================================================
// ⬇️ ADD THIS NEW ROUTE HANDLER ⬇️
// =======================================================
router.get("/github-repo/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;
  
  const token = process.env.GITHUB_TOKEN;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    // 1. Fetch the MAIN repo data first. This is the only one that *must* succeed.
    const repoRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );
    
    // 2. Fetch languages, contributors, and README in parallel.
    // We use Promise.allSettled so that if one fails, the others don't.
    const [langRes, contribStatsRes, readmeRes] = await Promise.allSettled([
      // Request 1: Languages
      axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers,
      }),
      
      // Request 2: Contributor Stats
      axios.get(
        `https://api.github.com/repos/${owner}/${repo}/stats/contributors`,
        { headers }
      ),
      
      // Request 3: README (with fallback)
      axios.get(
        `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`
      ).catch(() => {
        // Fallback to "master" branch if "main" fails
        return axios.get(
          `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`
        );
      }),
    ]);

    // 3. Check the results and build the response
    const languages =
      langRes.status === "fulfilled" ? langRes.value.data : {};
      
    const contributors =
      contribStatsRes.status === "fulfilled" ? contribStatsRes.value.data : [];
      
    const readme =
      readmeRes.status === "fulfilled"
        ? readmeRes.value.data
        : "No README file found in this repository.";

    // 4. Send all data back to the client
    res.status(200).json({
      repoData: repoRes.data,
      languages: languages,
      contributors: contributors,
      readme: readme,
    });
    
  } catch (error) {
    // This will now only catch if the MAIN repo data request fails
    console.error("GitHub API error (main repo):", error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ message: "Repository not found" });
    }
    res.status(500).json({ message: "Failed to fetch main repo data from GitHub" });
  }
});
// =======================================================
// ⬆️ END OF NEW ROUTE ⬆️
// =======================================================


router.use("/users", usersRouter);
router.use("/repo-posts", repoPostsRoute);
router.use("/post-interaction", postInteractionRoute);
router.use("/update-achievements",updateAchievementsRoute)
router.use('/comments',commentsRoute)
router.use('/challenges',challengeRoute)
router.use('/tasks',taskRoute)

export default router;
//===AFK===