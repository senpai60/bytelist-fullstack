// lib/githubClient.js
import { Octokit } from "octokit";
import dotenv from "dotenv";
import path from 'path';

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// ... (parseGithubUrl function stays the same) ...
function parseGithubUrl(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const owner = parts[0];
    const repo = parts[1];
    return { owner, repo };
  } catch (err) {
    return null;
  }
}


export async function fetchRepoContents(githubUrl, maxFiles = 15, maxBytes = 100_000) {
  console.log(`\n[DEBUG] ---------------------------------`);
  console.log(`[DEBUG] Starting fetch for URL: ${githubUrl}`);
  // Check if token is loaded
  console.log(`[DEBUG] GITHUB_TOKEN loaded: ${!!process.env.GITHUB_TOKEN}`); // <-- IMPORTANT

  const parsed = parseGithubUrl(githubUrl);
  if (!parsed) {
    console.error("[DEBUG] CRITICAL: Failed to parse GitHub URL.");
    throw new Error("Invalid GitHub URL");
  }

  const { owner, repo } = parsed;

  // Get default branch
  const { data: repoMeta } = await octokit.rest.repos.get({ owner, repo });
  const ref = repoMeta.default_branch;

  console.log(`[DEBUG] Fetching: owner=${owner}, repo=${repo}, ref=${ref}`);

  const files = [];
  // ... (Skipping README/package.json logs for brevity, they seem to work)
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: "package.json", ref });
    if (data && data.content) {
      const content = Buffer.from(data.content, data.encoding).toString();
      files.push({ path: "package.json", content });
    }
  } catch (e) {}

  // --- START: RECURSIVE FETCH LOGIC ---
  const codeExtensions = new Set([
    '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.go', '.rs', '.css', '.scss', 
    '.html', '.vue', '.svelte', '.c', '.h', '.cpp', '.json', '.md'
  ]);
  const ignorePatterns = [
    /node_modules\//, /dist\//, /build\//, /\.git\//, /package-lock\.json/, 
    /yarn\.lock/, /\.png$/, /\.jpg$/, /\.jpeg$/, /\.gif$/, /\.svg$/, /\.ico$/
  ];

  let filesToFetchPaths = [];
  try {
    console.log("[DEBUG] Calling octokit.rest.git.getTree (recursive)...");
    const { data: treeData } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: ref,
      recursive: true,
    });
    console.log(`[DEBUG] Git tree fetched. Total items: ${treeData.tree.length}`);

    filesToFetchPaths = treeData.tree
      .filter(item => {
        const ext = path.extname(item.path);
        return item.type === 'blob' &&
               item.size < maxBytes &&
               codeExtensions.has(ext) &&
               !ignorePatterns.some(pattern => pattern.test(item.path)) &&
               item.path !== 'README.md' &&
               item.path !== 'package.json';
      })
      .map(item => item.path);
  
    console.log(`[DEBUG] Filtered tree. Files to fetch: ${filesToFetchPaths.length}`);
    if (filesToFetchPaths.length > 0) {
      console.log(`[DEBUG] First 5 files to fetch:`, filesToFetchPaths.slice(0, 5));
    }

  } catch (e) {
    console.error("--- [DEBUG] CRITICAL ERROR fetching git tree ---", e.message);
  }

  // 4. Fetch content for the filtered files
  for (const filePath of filesToFetchPaths) {
    if (files.length >= maxFiles) break;
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref,
      });
      if (data && data.content) {
        const content = Buffer.from(data.content, data.encoding).toString();
        files.push({ path: filePath, content });
      }
    } catch (e) {
      console.warn(`[DEBUG] Could not fetch file content: ${filePath}`);
    }
  }
  
  console.log(`[DEBUG] Total files with content: ${files.length}`);

  const aggregated = files.map(f => `// FILE: ${f.path}\n${f.content.slice(0, 10000)}`).join("\n\n");
  
  console.log(`[DEBUG] Final aggregated content length: ${aggregated.length}`);
  console.log(`[DEBUG] ---------------------------------`);
  
  return { files, aggregated, owner, repo, ref };
}