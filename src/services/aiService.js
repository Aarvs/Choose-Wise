import { callClaude } from "./anthropicService";
import { callGPT } from "./openaiService";
import { callGemini } from "./geminiService";
import { SYSTEM_PROMPT } from "../utils/constants";

export const getAIAdvice = async (options, selectedModel) => {
  if (!options || options.length < 2) {
    throw new Error("Please provide at least 2 options to compare.");
  }

  // Format the user's options for the AI
  let prompt = "I need help deciding between these options:\n\n";

  options.forEach((option, index) => {
    prompt += `**Option ${index + 1}: ${option.text}**\n`;
    if (option.reason && option.reason.trim()) {
      prompt += `My thoughts: ${option.reason.trim()}\n`;
    }
    prompt += "\n";
  });

  prompt +=
    "Please analyze these options thoroughly and recommend the single best choice for me. Base your analysis on my thoughts and add relevant real-world considerations. I need honest, practical advice that feels like it's coming from a wise mentor.";

  // Call the appropriate AI service
  switch (selectedModel) {
    case "claude":
      return await callClaude(prompt, SYSTEM_PROMPT);
    case "gpt":
      return await callGPT(prompt, SYSTEM_PROMPT);
    case "gemini":
      return await callGemini(prompt, SYSTEM_PROMPT);
    default:
      throw new Error("Invalid AI model selected");
  }
};

export const getRandomChoice = (options) => {
  if (!options || options.length < 2) {
    throw new Error("Please provide at least 2 options for a random choice.");
  }

  const validOptions = options.filter((opt) => opt.text && opt.text.trim());
  if (validOptions.length < 2) {
    throw new Error(
      "Please provide at least 2 valid options for a random choice."
    );
  }

  const randomIndex = Math.floor(Math.random() * validOptions.length);
  const randomChoice = validOptions[randomIndex];

  return `🎲 **Random Gut Check Result:** ${randomChoice.text}

Sometimes our gut reaction to a random choice can tell us a lot! How do you feel about this result? Excited? Disappointed? That feeling might be your intuition trying to guide you toward what you really want.

Use this as a data point, not the final answer. If you're happy with this random pick, maybe that option resonates with you more than you realized. If you're hoping for a different result, that's valuable information too!

**Next steps:** Consider how this random result makes you feel, then use that insight to inform your actual decision-making process.`;
};
