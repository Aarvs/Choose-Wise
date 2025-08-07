export const formatOptionsForAI = (options) => {
  let prompt = "I need help deciding between these options:\n\n";

  options.forEach((option, index) => {
    prompt += `Option ${index + 1}: ${option.text}\n`;
    if (option.reason) {
      prompt += `My thoughts: ${option.reason}\n`;
    }
    prompt += "\n";
  });

  prompt +=
    "Please analyze these options and recommend the single best choice for me, explaining your reasoning based on my thoughts and additional relevant factors.";

  return prompt;
};

export const validateApiKeys = () => {
  const errors = [];

  if (
    !import.meta.env.VITE_ANTHROPIC_API_KEY &&
    !import.meta.env.VITE_OPENAI_API_KEY &&
    !import.meta.env.VITE_GEMINI_API_KEY
  ) {
    errors.push(
      "No API keys configured. Please add at least one API key to your .env file."
    );
  }

  return errors;
};

export const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};
