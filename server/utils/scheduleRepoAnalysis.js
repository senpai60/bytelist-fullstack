import axios from "axios";

const SERVER_URI = process.env.SERVER_URI || "http://localhost:3000";

// 🔁 Retry wrapper for AI analysis
export async function triggerAIAnalysis(repoPostId, attempt = 1) {
  try {
    console.log(`Attempt ${attempt} → Analyzing repo ${repoPostId}`);
    await axios.post(`${SERVER_URI}/ai/analyze-repo/${repoPostId}`, {}, { timeout: 2 * 60 * 1000 });
    console.log(`✅ AI analysis success for repo ${repoPostId}`);
  } catch (err) {
    const status = err.response?.status;
    const msg = err.response?.data?.error || err.message;
    console.warn(`⚠️ AI analysis failed (${status}): ${msg}`);

    if (attempt < 5) {
      const wait = 30 * 1000 * attempt; // wait 30s, then 60s, etc.
      console.log(`Retrying in ${wait / 1000}s...`);
      setTimeout(() => triggerAIAnalysis(repoPostId, attempt + 1), wait);
    } else {
      console.error(`❌ Giving up after ${attempt} attempts for ${repoPostId}`);
    }
  }
}

// Schedule AI after 5 minutes
export function scheduleRepoAnalysis(repoPostId) {
  console.log(`⏳ Scheduled AI analysis for repo ${repoPostId} in 5 min`);
  setTimeout(() => triggerAIAnalysis(repoPostId), 1 * 60 * 1000);
}
