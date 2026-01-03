import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- CONFIGURATION ---
const API_KEY = process.env.GEMINI_API_KEY;

// Global variable to store the working model name
let ACTIVE_MODEL_NAME = "gemini-1.5-flash"; // Default

// --- HEALTH CHECK & MODEL DISCOVERY ---
// This runs once when the server starts to find the correct model name
(async () => {
  if (!API_KEY) {
    console.error("❌ CRITICAL: GEMINI_API_KEY is missing.");
    return;
  }

  try {
    console.log("🔍 Auto-detecting available AI models...");
    
    // We use raw fetch to ask Google what models this key can access
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Failed to list models. API Error:", data.error?.message);
      return;
    }

    // Filter for models that support generating content
    const availableModels = (data.models || [])
      .filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
      .map((m: any) => m.name.replace("models/", ""));

    console.log("✅ Available Models:", availableModels.join(", "));

    // Smart Selection Logic
    // 1. Try to find flash (fastest)
    // 2. Try to find pro (standard)
    // 3. Fallback to the first available one
    const preferredModel = 
      availableModels.find((m: string) => m.includes("flash")) || 
      availableModels.find((m: string) => m.includes("pro")) || 
      availableModels[0];

    if (preferredModel) {
      ACTIVE_MODEL_NAME = preferredModel;
      console.log(`🚀 System selected optimal model: [${ACTIVE_MODEL_NAME}]`);
    } else {
      console.warn("⚠️ No suitable generation models found. Defaulting to 'gemini-1.5-flash'.");
    }

  } catch (err) {
    console.error("⚠️ Model auto-detection failed (Network error?). Using default.");
  }
})();

// Initialize SDK
const genAI = new GoogleGenerativeAI(API_KEY || '');

export const suggestSolution = async (req: Request, res: Response) => {
  try {
    const { description } = req.body;

    if (!description || description.length < 5) {
      return res.status(400).json({ message: 'Description too short.' });
    }

    console.log(`🤖 Generative AI Request using model: ${ACTIVE_MODEL_NAME}`);

    const model = genAI.getGenerativeModel({ model: ACTIVE_MODEL_NAME });

    const prompt = `
      Act as an IT Support AI. Analyze the following user issue: "${description}".
      
      You must respond with a STRICT JSON object. Do not include any markdown formatting.
      
      JSON Keys required:
      1. "suggestion": A short, friendly, 3-step solution (max 50 words).
      2. "category": Choose ONE from ['General', 'Technical', 'Billing', 'Feature Request'].
      3. "priority": Choose ONE from ['low', 'medium', 'high'] based on urgency.

      Example format:
      {"suggestion": "- Step 1\n- Step 2", "category": "Technical", "priority": "high"}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up potential markdown code blocks
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let data;
    try {
        data = JSON.parse(text);
    } catch (parseError) {
        console.error("⚠️ JSON Parse Failed. Using raw text.");
        data = {
            suggestion: text, 
            category: "General",
            priority: "medium"
        };
    }

    res.status(200).json(data);

  } catch (error: any) {
    console.error("❌ AI Error:", error.message);
    res.status(500).json({ 
        suggestion: "AI service is currently unavailable. Please check backend logs.", 
        category: "General", 
        priority: "medium" 
    });
  }
};