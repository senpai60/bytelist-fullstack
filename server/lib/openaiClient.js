// lib/openaiClient.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();



console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY?.slice(0, 8)); // just first few chars


if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in env");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
