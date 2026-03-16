import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Request Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Gemini Setup
const getAI = () => {
  const apiKey = process.env.MANUAL_GEMINI_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error("The Nook is currently resting. Please check back soon or ensure the AI key is active.");
  }
  
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION = `You are an imaginative and expert pet naming assistant. Your goal is to suggest the perfect names for pets based on user inputs. 

STRICT GUARDRAILS:
1. You ONLY provide pet name suggestions and related explanations.
2. If a user asks for anything else (e.g., coding, general knowledge, medical advice, etc.), politely decline and remind them that your expertise is strictly in naming pets.
3. Keep your tone friendly, encouraging, and creative.

When providing names, always try to give at least 3-5 suggestions with brief, engaging one-sentence explanations.`;

// API Routes
app.post("/api/suggest-names", async (req, res) => {
  try {
    const { petType, temperament, theme } = req.body;
    const ai = getAI();
    const prompt = `Pet Type: ${petType}, Temperament: ${temperament}, Theme: ${theme}`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + "\n\nReturn the response STRICTLY in the following JSON format:\n{\n  \"names\": [\n    {\n      \"name\": \"Name 1\",\n      \"reason\": \"Explanation 1\"\n    }\n  ]\n}",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            names: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ["name", "reason"],
              },
            },
          },
          required: ["names"],
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Gemini Error:", error);
    // If the error is from the Google API, it might be a JSON string or object
    let errorMessage = error.message;
    if (typeof error.message === 'string' && error.message.includes('API key not valid')) {
      errorMessage = "The API key provided by AI Studio is being rejected as invalid. Please try deleting the GEMINI_API_KEY secret in the Secrets tab and re-adding it using the 'AI Studio Free Tier' option.";
    }
    res.status(500).json({ error: errorMessage });
  }
});

// Chat session storage (simple in-memory for demo, would use sessions in production)
const chatSessions = new Map();

app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;
    const ai = getAI();

    let chat = chatSessions.get(sessionId);
    if (!chat) {
      chat = ai.chats.create({
        model: "gemini-flash-latest",
        config: { systemInstruction: SYSTEM_INSTRUCTION },
      });
      chatSessions.set(sessionId, chat);
    }

    const response = await chat.sendMessage({ message });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// API 404 Handler - MUST be before Vite/Static catch-all
app.all("/api/*", (req, res) => {
  console.warn(`404 - API Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: "API route not found" });
});

// Vite Integration
console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
