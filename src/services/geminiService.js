import "dotenv/config";
import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants";

export const callGemini = async (prompt, systemPrompt) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key not configured");
  }

  const fullPrompt = `${systemPrompt}\n\nUser Request: ${prompt}`;

  try {
    const response = await axios.post(
      `${API_ENDPOINTS.GEMINI}?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API Error:", error);

    if (error.response?.status === 400) {
      throw new Error(
        "Invalid request to Gemini API. Please check your input."
      );
    } else if (error.response?.status === 403) {
      throw new Error(
        "Invalid Gemini API key. Please check your configuration."
      );
    } else if (error.response?.status === 429) {
      throw new Error(
        "Rate limit exceeded. Please try again in a few minutes."
      );
    } else if (error.response?.data?.error?.message) {
      throw new Error(error.response.data.error.message);
    } else {
      throw new Error("Failed to get response from Gemini. Please try again.");
    }
  }
};
