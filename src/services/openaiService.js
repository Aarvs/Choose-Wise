import "dotenv/config";
import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants";

export const callGPT = async (prompt, systemPrompt) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }

  try {
    const response = await axios.post(
      API_ENDPOINTS.OPENAI,
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error);

    if (error.response?.status === 401) {
      throw new Error(
        "Invalid OpenAI API key. Please check your configuration."
      );
    } else if (error.response?.status === 429) {
      throw new Error(
        "Rate limit exceeded. Please try again in a few minutes."
      );
    } else if (error.response?.data?.error?.message) {
      throw new Error(error.response.data.error.message);
    } else {
      throw new Error("Failed to get response from GPT-4. Please try again.");
    }
  }
};
