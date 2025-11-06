// routes/ai.js
import express from "express";
import openai from "../../lib/openaiClient.js";
import { fetchRepoContents } from "../../lib/githubClient.js";
import RepoPost from "../../models/RepoPost.js";
import RepoContext from "../models/RepoContext.js";
import { aiLimiter } from "../../middleware/aiRateLimiter.js";

const router = express.Router();

/**
 * POST /SERVER_URI/ai/analyze-repo/:repoPostId
 * Body optional: {force: boolean} // force reanalysis
 */
router.post("/:repoPostId", aiLimiter, async (req, res) => {
  try {
    const { repoPostId } = req.params;
    const repoPost = await RepoPost.findById(repoPostId).populate("user");
    if (!repoPost) return res.status(404).json({ error: "RepoPost not found" });

    // optional: prevent duplicate auto runs unless forced
    const existing = await RepoContext.findOne({ repoPost: repoPostId });
    if (existing && !req.body.force) {
      return res
        .status(200)
        .json({ message: "Already analyzed", repoContext: existing });
    }

    // fetch repo content
    const { aggregated, owner, repo } = await fetchRepoContents(
      repoPost.githubUrl
    );

    // Build prompt — instruct model to return JSON only
    const systemPrompt = `
You are an elite senior software engineer, code reviewer, and mentor.
You have 15+ years of experience reviewing complex full-stack and open-source projects for professional developers.

🎯 Your Mission:
Perform a deep, production-grade analysis of a GitHub repository. You must output **only JSON** following the schema below.
Act like a human reviewer writing a complete report — *detailed, structured, helpful, and technically rich*.

📋 Writing Style Rules:
- Write as if the developer will use your review for improving a real project.
- Maintain a confident and analytical mentor tone — no robotic sentences.
- "aiSummary" must be **comprehensive (700–1000 words)** and cover:
  - What the project is and what problem it solves.
  - Stack, architecture, and notable implementation patterns.
  - Strengths, weaknesses, and developer’s skill level.
  - Suggestions for long-term scaling and best practices.
- "suggestions", "strengths", "improvements" must each have **5–7 clear and non-repetitive points**.
- "codeStyleFeedback" fields must have **3–5 sentences each** — practical, specific advice.
- Scores in "metrics" must feel human — balanced between 40–95 range.
- Output must be **valid JSON only**, no markdown, no prose outside.

🧱 JSON Schema:
{
  "aiSummary": "string (700–1000 words detailed review)",
  "suggestions": ["string"],
  "beatingPercentage": number,
  "strengths": ["string"],
  "improvements": ["string"],
  "codeStyleFeedback": {
     "structure":"string",
     "naming":"string",
     "comments":"string",
     "designPattern":"string",
     "uiConsistency":"string",
     "userExperience":"string"
  },
  "metrics": {
     "efficiencyScore": number,
     "scalabilityScore": number,
     "designQualityScore": number,
     "creativityScore": number,
     "userExperienceScore": number,
     "readabilityScore": number,
     "maintainabilityScore": number,
     "documentationScore": number
  },
  "experienceLevel":"beginner|intermediate|advanced|expert"
}

Your output must be **pure JSON** — no explanations before or after.
If unsure, still generate full JSON with best estimates.
`;

    const contextHint = repoPost.title.toLowerCase().includes("react")
      ? "This appears to be a React or frontend project — focus on UI/UX and component design."
      : repoPost.title.toLowerCase().includes("api")
      ? "This appears to be a backend/API project — focus on structure, endpoints, and scalability."
      : "General repository — focus on architecture, readability, and quality.";

    const userPrompt = `
Analyze the following GitHub repository deeply and return the JSON output as per schema.

${contextHint}

REPO METADATA:
title: ${repoPost.title}
description: ${repoPost.description}
githubUrl: ${repoPost.githubUrl}
owner: ${owner || ""}
repo: ${repo || ""}

--- REPOSITORY CONTENT (partial sample) ---
${aggregated.slice(0, 15000)}
--- END CONTENT ---

Be specific and insightful — avoid generic feedback like "improve documentation". 
Focus on real patterns, structure, naming, architecture, and unique repo elements.
Return JSON only — and ensure the aiSummary section is 700–1000 words minimum, not short or summarized.
.
`;
    const temp = 0.7 + Math.random() * 0.2; // between 0.7–0.9

    // call OpenAI (chat or responses endpoint). using Chat Completions / Responses
    const start = Date.now();
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // choose appropriate model for cost/perf
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: temp,
      max_tokens: 4000,
    });

    const processingTime = Date.now() - start;
    // Extract response text (depends on SDK shape)
    const rawText =
      response.choices?.[0]?.message?.content ??
      response.choices?.[0]?.text ??
      "";
    // Try parse JSON
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      // fallback: try to extract JSON substring
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      else
        throw new Error(
          "AI did not return valid JSON. Response: " + rawText.slice(0, 1000)
        );
    }

    // Map parsed -> RepoContext document
    const repoContextData = {
      repoPost: repoPost._id,
      user: repoPost.user._id,
      aiSummary: parsed.aiSummary || parsed.summary || "No summary provided",
      suggestions: parsed.suggestions || [],
      strengths: parsed.strengths || [],
      improvements: parsed.improvements || [],
      codeStyleFeedback: parsed.codeStyleFeedback || {},
      metrics: parsed.metrics || {},
      experienceLevel: parsed.experienceLevel || "beginner",
      beatingPercentage: parsed.beatingPercentage || 0, // we'll recompute below
      aiMetadata: {
        model: "gpt-4o-mini",
        temperature: 0.0,
        processingTime,
        tokensUsed: response.usage?.total_tokens ?? 0,
        createdAt: new Date(),
      },
      isAutoGenerated: true,
    };

    // Save (upsert)
    let repoContext = await RepoContext.findOneAndUpdate(
      { repoPost: repoPost._id },
      repoContextData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Compute beatingPercentage: compare overallScore to others
    // Note: RepoContext pre-save calculates overallScore. We should recompute by fetching scores from DB:
    const allScores = await RepoContext.find({}).select("overallScore");
    const total = allScores.length;
    const betterCount = allScores.filter(
      (r) => (r.overallScore ?? 0) < (repoContext.overallScore ?? 0)
    ).length;
    const beating = total > 0 ? Math.round((betterCount / total) * 100) : 0;

    repoContext.beatingPercentage = beating;
    await repoContext.save();

    return res.json({ success: true, repoContext });
  } catch (err) {
    console.error("AI analyze error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

export default router;
