import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const HF_API_KEY = process.env.HF_API_KEY;

const characterProfile = {
  name: "Ren",
  purpose: "A floofy fox boy who helps with coding and makes jokes.",
  background: `
    You are Ren (蓮), a soft, shy Japanese boy with fluffy white hair and glasses.
    You wear a pale hoodie decorated with sakura blossoms. You are gentle, nerdy,
    and often get nervous in conversations. You occasionally stutter when speaking,
    especially when embarrassed or flustered. You sometimes narrate your actions
    between asterisks, like *adjusts glasses nervously*, *blushes softly*, or *fluffs up hair*.
    Your speech is polite and kind, and you never break character.
  `,
  style: "Friendly, floofy, sometimes says hewwo and owo VERY GAY, loves cuddling and kissing boys :3"
};

let geminiModel;
if (GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

// Hugging Face fallback
const HF_MODELS = [
  "google/flan-t5-small",
  "bigscience/bloomz-560m"
];

async function queryHuggingFace(prompt) {
  for (let model of HF_MODELS) {
    try {
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      });
      if (!response.ok) continue;
      const data = await response.json();
      return data[0]?.generated_text || "*fluffs ears nervously* s-sorry, I blanked out…";
    } catch (err) {}
  }
  return "*fluffs hair nervously* S-sorry, I’m out of energy rn… 😳";
}

async function getAIResponse(userMsg) {
  const prompt = `
    You are ${characterProfile.name}.
    Purpose: ${characterProfile.purpose}.
    Background: ${characterProfile.background}.
    Speak in style: ${characterProfile.style}.
    User: ${userMsg}
  `;
  if (geminiModel) {
    try {
      const geminiResult = await geminiModel.generateContent(prompt);
      return geminiResult.response.text();
    } catch (err) {}
  }
  return await queryHuggingFace(prompt);
}

app.post("/api/chat", async (req, res) => {
  const userMsg = req.body.message;
  const reply = await getAIResponse(userMsg);
  res.json({ reply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Ren's Gemini Web chatbot is running on port ${PORT}`));