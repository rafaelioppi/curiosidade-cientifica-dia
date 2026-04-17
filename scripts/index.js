import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Carrega variáveis do .env
dotenv.config();

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Explain how AI works in a few words",
  });

  console.log(response.text);
}

main().catch(err => {
  console.error("Erro:", err.message);
});
