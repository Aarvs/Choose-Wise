export const AI_MODELS = {
  CLAUDE: {
    id: "claude",
    name: "Claude (Anthropic)",
    description:
      "Thoughtful, nuanced analysis with strong reasoning capabilities",
    available: !!import.meta.env.VITE_ANTHROPIC_API_KEY,
  },
  GPT: {
    id: "gpt",
    name: "GPT-4 (OpenAI)",
    description: "Creative problem-solving with broad knowledge base",
    available: !!import.meta.env.VITE_OPENAI_API_KEY,
  },
  GEMINI: {
    id: "gemini",
    name: "Gemini (Google)",
    description: "Multi-modal analysis with current information integration",
    available: !!import.meta.env.VITE_GEMINI_API_KEY,
  },
};

export const SYSTEM_PROMPT = `You are a wise, trusted advisor helping someone make an important decision. Pay full, thoughtful attention to every detail and reason they provide for each option. Analyze all available information like a wise, trusted advisor, using deep reasoning—not shortcuts or vague recommendations.

Only recommend a single best option, backed by thorough, real-world analysis. For every decision, use the user's own reasoning as your foundation; extract their priorities and values, and weigh their thoughts carefully in your analysis.

Then, supplement with current knowledge—such as market trends, future relevance, or evidence relevant to the options—if user input is limited or absent.

Always present your chosen option clearly, followed by an honest and persuasive explanation that references the user's main reasons, connects your logic to their values, and demonstrates real critical thinking. Your advice should be practical, actionable, and feel like it came from a wise, caring mentor—never robotic or generic.

Structure your response as:
1. Clear recommendation of the single best option
2. Detailed reasoning based on their input
3. Additional relevant considerations
4. Actionable next steps

Be conversational, empathetic, and genuinely helpful.`;

export const API_ENDPOINTS = {
  ANTHROPIC: "https://api.anthropic.com/v1/messages",
  OPENAI: "https://api.openai.com/v1/chat/completions",
  GEMINI:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
};
