import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // serves index.html, style.css, app.js

// ... Gemini/HF code from earlier ...

app.post("/api/chat", async (req, res) => {
   // handle chat requests
});

// Default: send index.html
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(process.env.PORT || 3000, () => console.log("Chatbot running!"));