
// lib/githubClient.js
import { Octokit } from "octokit";
import dotenv from "dotenv";
dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/**
 * parse github url like https://github.com/owner/repo or https://github.com/owner/repo/tree/branch/path
 * returns {owner, repo, ref, path}
 */
function parseGithubUrl(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const owner = parts[0];
    const repo = parts[1];
    // default branch null (we'll use repo default branch)
    return { owner, repo };
  } catch (err) {
    return null;
  }
}

/**
 * Fetch a handful of important files to analyze.
 * Safeguards: limit file size and number of files.
 */
export async function fetchRepoContents(githubUrl, maxFiles = 10, maxBytes = 200_000) {
  const parsed = parseGithubUrl(githubUrl);
  if (!parsed) throw new Error("Invalid GitHub URL");

  const { owner, repo } = parsed;

  // Get default branch
  const { data: repoMeta } = await octokit.rest.repos.get({ owner, repo });
  const ref = repoMeta.default_branch;

  const files = [];
  // fetch README (if exists)
  try {
    const readme = await octokit.rest.repos.getReadme({ owner, repo, ref });
    const readmeContent = Buffer.from(readme.data.content, readme.data.encoding).toString();
    files.push({ path: "README.md", content: readmeContent });
  } catch (e) {
    // ignore missing README
  }

  // try fetch package.json
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: "package.json", ref });
    if (data && data.content) {
      const content = Buffer.from(data.content, data.encoding).toString();
      files.push({ path: "package.json", content });
    }
  } catch (e) {}

  // fetch top-level src or lib files (non-recursive first)
  try {
    const { data: rootList } = await octokit.rest.repos.getContent({ owner, repo, path: "src", ref });
    let count = 0;
    for (const item of rootList) {
      if (count >= maxFiles) break;
      if (item.type === "file" && item.size < maxBytes) {
        const { data } = await octokit.rest.repos.getContent({ owner, repo, path: item.path, ref });
        const content = data.content ? Buffer.from(data.content, data.encoding).toString() : "";
        files.push({ path: item.path, content });
        count++;
      }
    }
  } catch (e) {
    // ignore
  }

  // return a summary + joined content
  const aggregated = files.map(f => `// FILE: ${f.path}\n${f.content.slice(0, 10000)}`).join("\n\n");
  return { files, aggregated, owner, repo, ref };
}
