import "dotenv/config";
import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants";

export const callClaude = async (prompt, systemPrompt) => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("Anthropic API key not configured");
  }

  try {
    const response = await axios.post(
      API_ENDPOINTS.ANTHROPIC,
      {
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
      }
    );

    return response.data.content[0].text;
  } catch (error) {
    console.error("Claude API Error:", error);

    if (error.response?.status === 401) {
      throw new Error(
        "Invalid Anthropic API key. Please check your configuration."
      );
    } else if (error.response?.status === 429) {
      throw new Error(
        "Rate limit exceeded. Please try again in a few minutes."
      );
    } else if (error.response?.data?.error?.message) {
      throw new Error(error.response.data.error.message);
    } else {
      throw new Error("Failed to get response from Claude. Please try again.");
    }
  }
};
