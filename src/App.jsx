// import React, { useState, useEffect } from "react";
// import {
//   Plus,
//   Sparkles,
//   Dice6,
//   Shield,
//   Trash2,
//   ThumbsUp,
//   ThumbsDown,
//   AlertCircle,
//   CheckCircle,
//   Clock,
// } from "lucide-react";
// import axios from "axios";

// // Constants
// const SYSTEM_PROMPT = `You are a wise, trusted advisor helping someone make an important decision. Pay full, thoughtful attention to every detail and reason they provide for each option. Analyze all available information like a wise, trusted advisor, using deep reasoning—not shortcuts or vague recommendations.

// Only recommend a single best option, backed by thorough, real-world analysis. For every decision, use the user's own reasoning as your foundation; extract their priorities and values, and weigh their thoughts carefully in your analysis.

// Then, supplement with current knowledge—such as market trends, future relevance, or evidence relevant to the options—if user input is limited or absent.

// Always present your chosen option clearly, followed by an honest and persuasive explanation that references the user's main reasons, connects your logic to their values, and demonstrates real critical thinking. Your advice should be practical, actionable, and feel like it came from a wise, caring mentor—never robotic or generic.

// Structure your response as:
// 1. Clear recommendation of the single best option
// 2. Detailed reasoning based on their input
// 3. Additional relevant considerations
// 4. Actionable next steps

// Be conversational, empathetic, and genuinely helpful.`;

// // Server configuration
// const PROXY_URL = "http://localhost:3001";

// // Enhanced AI service call - Seamless user experience
// const getAIAdvice = async (options, onProgressUpdate) => {
//   if (!options || options.length < 2) {
//     throw new Error("Please provide at least 2 options to compare.");
//   }

//   // Format the user's options for analysis
//   let prompt = "I need help deciding between these options:\n\n";

//   options.forEach((option, index) => {
//     prompt += `**Option ${index + 1}: ${option.text}**\n`;
//     if (option.reason && option.reason.trim()) {
//       prompt += `My thoughts: ${option.reason.trim()}\n`;
//     }
//     prompt += "\n";
//   });

//   prompt +=
//     "Please analyze these options thoroughly and recommend the single best choice for me. Base your analysis on my thoughts and add relevant real-world considerations. I need honest, practical advice that feels like it's coming from a wise mentor.";

//   try {
//     // Show progress to user
//     onProgressUpdate && onProgressUpdate("Analyzing your options...");

//     const response = await axios.post(
//       `${PROXY_URL}/api/claude`,
//       {
//         prompt,
//         systemPrompt: SYSTEM_PROMPT,
//       },
//       {
//         timeout: 50000, // 50 second timeout for complex analysis
//       }
//     );

//     // Show final progress step
//     onProgressUpdate && onProgressUpdate("Finalizing recommendation...");

//     // Small delay to show completion
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     return {
//       response: response.data.response,
//       timestamp: response.data.timestamp,
//     };
//   } catch (error) {
//     console.error("AI Service Error:", error);

//     // Provide user-friendly error messages without technical details
//     if (error.response?.status === 401) {
//       throw new Error("Service configuration issue. Please contact support.");
//     } else if (error.response?.status === 429) {
//       throw new Error("High demand detected. Please try again in a moment.");
//     } else if (error.code === "ERR_NETWORK") {
//       throw new Error(
//         "Cannot connect to advice service. Please check your connection."
//       );
//     } else if (error.code === "ECONNABORTED") {
//       throw new Error(
//         "Analysis is taking longer than expected. Please try with shorter option descriptions."
//       );
//     } else if (error.response?.data?.error) {
//       throw new Error(error.response.data.error);
//     } else {
//       throw new Error(
//         "Unable to analyze your options right now. Please try again."
//       );
//     }
//   }
// };

// // Random choice generator
// const getRandomChoice = (options) => {
//   if (!options || options.length < 2) {
//     throw new Error("Please provide at least 2 options for a random choice.");
//   }

//   const validOptions = options.filter((opt) => opt.text && opt.text.trim());
//   if (validOptions.length < 2) {
//     throw new Error(
//       "Please provide at least 2 valid options for a random choice."
//     );
//   }

//   const randomIndex = Math.floor(Math.random() * validOptions.length);
//   const randomChoice = validOptions[randomIndex];

//   return {
//     response: `🎲 **Random Gut Check Result:** ${randomChoice.text}

// Sometimes our gut reaction to a random choice can tell us a lot! How do you feel about this result? Excited? Disappointed? That feeling might be your intuition trying to guide you toward what you really want.

// Use this as a data point, not the final answer. If you're happy with this random pick, maybe that option resonates with you more than you realized. If you're hoping for a different result, that's valuable information too!

// **Next steps:** Consider how this random result makes you feel, then use that insight to inform your actual decision-making process.`,
//     timestamp: new Date().toISOString(),
//   };
// };

// // Components
// const Header = () => {
//   return (
//     <div className="header">
//       <h1 className="logo">Choose-Wise</h1>
//       <p className="tagline">Get unbiased, wise advice on any decision</p>
//       <p className="description">
//         Making tough choices? Get thoughtful analysis from our AI advisor to
//         help you think through your options objectively. Simply enter your
//         choices and any thoughts you have about them.
//       </p>
//     </div>
//   );
// };

// const PrivacyNotice = () => {
//   return (
//     <div className="privacy-notice">
//       <Shield
//         className="privacy-icon"
//         size={16}
//         style={{ display: "inline", marginRight: "0.5rem" }}
//       />
//       <strong>Your privacy matters:</strong> Nothing you enter is saved, stored,
//       or shared. Your decision details stay completely private and are processed
//       only to give you advice.
//     </div>
//   );
// };

// const ServerStatus = ({ status }) => {
//   if (status === "checking") {
//     return (
//       <div className="status-checking">
//         <Clock size={16} />
//         <span>Connecting to advice service...</span>
//       </div>
//     );
//   }

//   if (status === "connected") {
//     return (
//       <div className="status-connected">
//         <CheckCircle size={16} />
//         <span>AI advisor ready</span>
//       </div>
//     );
//   }

//   return null; // Don't show disconnected status to avoid alarming users
// };

// const OptionInput = ({ option, index, onChange, onRemove, canRemove }) => {
//   const handleOptionChange = (field, value) => {
//     onChange(index, { ...option, [field]: value });
//   };

//   return (
//     <div className="option-container">
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           marginBottom: "0.5rem",
//         }}
//       >
//         <label className="label" style={{ margin: 0, flex: 1 }}>
//           Option {index + 1}:
//         </label>
//         {canRemove && (
//           <button
//             className="btn btn-remove"
//             onClick={() => onRemove(index)}
//             style={{ padding: "0.25rem 0.5rem" }}
//             title="Remove this option"
//           >
//             <Trash2 size={14} />
//           </button>
//         )}
//       </div>

//       <input
//         type="text"
//         className="input-field"
//         placeholder={`e.g., ${
//           index === 0 ? "Take the new job offer" : "Stay in current position"
//         }`}
//         value={option.text}
//         onChange={(e) => handleOptionChange("text", e.target.value)}
//       />

//       <label className="label">Your thoughts (optional):</label>
//       <textarea
//         className="textarea-field"
//         placeholder={`e.g., ${
//           index === 0
//             ? "Better salary but longer commute..."
//             : "Comfortable but limited growth..."
//         }`}
//         value={option.reason}
//         onChange={(e) => handleOptionChange("reason", e.target.value)}
//       />
//     </div>
//   );
// };

// const LoadingSpinner = ({ text = "Analyzing..." }) => {
//   return (
//     <div className="loading-spinner">
//       <div className="spinner"></div>
//       <span>{text}</span>
//     </div>
//   );
// };

// const ResultSection = ({ result, isVisible }) => {
//   const [feedback, setFeedback] = useState(null);
//   const [showThanks, setShowThanks] = useState(false);

//   const handleFeedback = (type) => {
//     setFeedback(type);
//     setShowThanks(true);

//     // Hide thanks message after 3 seconds
//     setTimeout(() => {
//       setShowThanks(false);
//     }, 3000);
//   };

//   if (!isVisible || !result) return null;

//   // Format the AI response with proper line breaks and styling
//   const formatResult = (text) => {
//     return text
//       .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
//       .replace(/\n\n/g, "</p><p>")
//       .replace(/\n/g, "<br>");
//   };

//   return (
//     <div className="result-section">
//       <h3 className="result-title">AI Recommendation:</h3>

//       <div
//         className="result-content"
//         dangerouslySetInnerHTML={{
//           __html: "<p>" + formatResult(result.response) + "</p>",
//         }}
//       />

//       <div className="feedback-section">
//         <p>Was this advice helpful?</p>
//         <div className="feedback-buttons">
//           <button
//             className={`feedback-btn ${feedback === "yes" ? "selected" : ""}`}
//             onClick={() => handleFeedback("yes")}
//           >
//             <ThumbsUp size={16} />
//             Yes
//           </button>
//           <button
//             className={`feedback-btn ${feedback === "no" ? "selected" : ""}`}
//             onClick={() => handleFeedback("no")}
//           >
//             <ThumbsDown size={16} />
//             No
//           </button>
//         </div>
//         {showThanks && (
//           <div className="thanks-message">Thank you for your feedback!</div>
//         )}
//       </div>

//       {result.timestamp && (
//         <div className="timestamp">
//           Generated at {new Date(result.timestamp).toLocaleString()}
//         </div>
//       )}
//     </div>
//   );
// };

// // Main App Component
// const App = () => {
//   const [options, setOptions] = useState([
//     { text: "", reason: "" },
//     { text: "", reason: "" },
//   ]);

//   const [isLoading, setIsLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");
//   const [showResult, setShowResult] = useState(false);
//   const [serverStatus, setServerStatus] = useState("checking");
//   const [loadingMessage, setLoadingMessage] = useState("Analyzing...");

//   useEffect(() => {
//     // Check server connection on startup
//     const checkServerConnection = async () => {
//       try {
//         const response = await axios.get(`${PROXY_URL}/health`, {
//           timeout: 5000,
//         });
//         if (response.status === 200) {
//           setServerStatus("connected");
//           setError("");
//         }
//       } catch (error) {
//         setServerStatus("disconnected");
//         // Only show error if user tries to get advice
//       }
//     };

//     checkServerConnection();

//     // Periodically check connection (but don't show errors to user)
//     const statusInterval = setInterval(() => {
//       checkServerConnection();
//     }, 30000);

//     return () => clearInterval(statusInterval);
//   }, []);

//   const handleOptionChange = (index, newOption) => {
//     const newOptions = [...options];
//     newOptions[index] = newOption;
//     setOptions(newOptions);
//   };

//   const addOption = () => {
//     if (options.length < 5) {
//       setOptions([...options, { text: "", reason: "" }]);
//     }
//   };

//   const removeOption = (index) => {
//     if (options.length > 2) {
//       const newOptions = options.filter((_, i) => i !== index);
//       setOptions(newOptions);
//     }
//   };

//   const scrollToResult = () => {
//     setTimeout(() => {
//       const element = document.getElementById("result-section");
//       if (element) {
//         element.scrollIntoView({ behavior: "smooth" });
//       }
//     }, 100);
//   };

//   const updateLoadingMessage = (message) => {
//     setLoadingMessage(message);
//   };

//   const handleGetAdvice = async () => {
//     setError("");
//     setIsLoading(true);
//     setShowResult(false);
//     updateLoadingMessage("Preparing your request...");

//     try {
//       // Validate inputs
//       const validOptions = options.filter((opt) => opt.text && opt.text.trim());
//       if (validOptions.length < 2) {
//         throw new Error("Please enter at least 2 options to compare.");
//       }

//       // Check server connection if we know it's down
//       if (serverStatus === "disconnected") {
//         try {
//           await axios.get(`${PROXY_URL}/health`, { timeout: 3000 });
//           setServerStatus("connected");
//         } catch (connectionError) {
//           throw new Error(
//             "Cannot connect to advice service. Please check your internet connection and try again."
//           );
//         }
//       }

//       updateLoadingMessage("Analyzing your options...");
//       await new Promise((resolve) => setTimeout(resolve, 300)); // Small delay for UX

//       // Get AI advice with progress updates
//       const advice = await getAIAdvice(validOptions, updateLoadingMessage);

//       setResult(advice);
//       setShowResult(true);
//       scrollToResult();
//     } catch (err) {
//       console.error("Error getting advice:", err);
//       setError(
//         err.message || "Unable to get advice right now. Please try again."
//       );

//       // Update server status if it's a connection error
//       if (err.message.includes("Cannot connect")) {
//         setServerStatus("disconnected");
//       }
//     } finally {
//       setIsLoading(false);
//       updateLoadingMessage("Analyzing...");
//     }
//   };

//   const handleRandomChoice = () => {
//     setError("");

//     try {
//       const validOptions = options.filter((opt) => opt.text && opt.text.trim());
//       const randomAdvice = getRandomChoice(validOptions);
//       setResult(randomAdvice);
//       setShowResult(true);
//       scrollToResult();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const resetForm = () => {
//     setOptions([
//       { text: "", reason: "" },
//       { text: "", reason: "" },
//     ]);
//     setResult(null);
//     setShowResult(false);
//     setError("");
//   };

//   const retryConnection = async () => {
//     setServerStatus("checking");
//     setError("");

//     try {
//       await axios.get(`${PROXY_URL}/health`, { timeout: 5000 });
//       setServerStatus("connected");
//     } catch (error) {
//       setServerStatus("disconnected");
//       setError(
//         "Still unable to connect. Please ensure the server is running and try again."
//       );
//     }
//   };

//   return (
//     <div className="container">
//       <div className="card">
//         <Header />

//         <ServerStatus status={serverStatus} />

//         {serverStatus === "disconnected" && error && (
//           <div className="error-message">
//             <div className="error-header">
//               <AlertCircle size={20} />
//               <strong>Connection Issue</strong>
//             </div>
//             <p>{error}</p>
//             <button
//               className="btn btn-secondary retry-btn"
//               onClick={retryConnection}
//               disabled={serverStatus === "checking"}
//             >
//               {serverStatus === "checking" ? "Reconnecting..." : "Try Again"}
//             </button>
//           </div>
//         )}

//         <PrivacyNotice />

//         <div className="input-section">
//           <h2 className="section-title">What are your options?</h2>

//           {error && !error.includes("Connection") && (
//             <div className="error-message">
//               <div className="error-header">
//                 <AlertCircle size={16} />
//                 {error}
//               </div>
//             </div>
//           )}

//           {options.map((option, index) => (
//             <OptionInput
//               key={index}
//               option={option}
//               index={index}
//               onChange={handleOptionChange}
//               onRemove={removeOption}
//               canRemove={options.length > 2}
//             />
//           ))}

//           {options.length < 5 && (
//             <div className="add-option-section">
//               <button className="btn btn-add" onClick={addOption}>
//                 <Plus size={16} />
//                 Add Another Option
//               </button>
//             </div>
//           )}

//           <div className="buttons">
//             <button
//               className="btn btn-primary"
//               onClick={handleGetAdvice}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <LoadingSpinner text={loadingMessage} />
//               ) : (
//                 <>
//                   <Sparkles size={16} />
//                   Get AI Advice
//                 </>
//               )}
//             </button>

//             <button
//               className="btn btn-secondary"
//               onClick={handleRandomChoice}
//               disabled={isLoading}
//             >
//               <Dice6 size={16} />
//               Random Gut Check
//             </button>

//             {showResult && (
//               <button
//                 className="btn btn-secondary"
//                 onClick={resetForm}
//                 disabled={isLoading}
//               >
//                 Start Over
//               </button>
//             )}
//           </div>
//         </div>

//         <div id="result-section">
//           <ResultSection result={result} isVisible={showResult} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;

import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  Suspense,
  lazy,
} from "react";
import {
  Plus,
  Sparkles,
  Dice6,
  Shield,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Brain,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import axios from "axios";

// Lazy load components for better performance
const FAQSection = lazy(() => import("./components/FAQSection"));

// Enhanced system prompt for better results
const SYSTEM_PROMPT = `You are Choose-Wise, an elite decision advisor with expertise in behavioral psychology, decision science, and strategic thinking. You help people make life-changing decisions with confidence.

Your approach:
1. DEEP ANALYSIS: Thoroughly examine each option using multiple decision-making frameworks
2. PERSONALIZATION: Base recommendations on the user's values, context, and priorities
3. PRACTICAL WISDOM: Provide actionable advice that works in the real world
4. CONFIDENT GUIDANCE: Give clear, decisive recommendations backed by solid reasoning

Response Structure:
🎯 **My Recommendation: [Clear Choice]**
💡 **Why This Is Your Best Option:**
📊 **Key Analysis Points:**
🚀 **Action Steps:**

Be direct, insightful, and genuinely helpful. Transform uncertainty into clarity.`;

// Server configuration with error resilience
const PROXY_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3001";

// Optimized API service with advanced error handling
const getAIAdvice = async (options, onProgressUpdate) => {
  if (!options || options.length < 2) {
    throw new Error(
      "Please provide at least 2 options to compare for optimal analysis."
    );
  }

  // Enhanced prompt formatting for better AI understanding
  let prompt = "🎯 **DECISION ANALYSIS REQUEST**\n\n";
  prompt +=
    "I need expert guidance choosing between these carefully considered options:\n\n";

  options.forEach((option, index) => {
    prompt += `**Option ${index + 1}: ${option.text}**\n`;
    if (option.reason && option.reason.trim()) {
      prompt += `📝 My thoughts: ${option.reason.trim()}\n`;
    }
    prompt += `⭐ Priority level: ${
      option.text.length > 50 ? "High" : "Standard"
    }\n\n`;
  });

  prompt += `**What I need from you:**
- Analyze each option using decision science frameworks
- Consider my personal context and reasoning
- Recommend the SINGLE best choice with strong justification
- Provide specific next steps I can take immediately

Please give me your most insightful analysis to help me move forward with confidence.`;

  try {
    onProgressUpdate &&
      onProgressUpdate("🧠 Analyzing your decision context...");

    // Add artificial intelligence to the UX
    await new Promise((resolve) => setTimeout(resolve, 800));
    onProgressUpdate &&
      onProgressUpdate("🔍 Evaluating options with advanced algorithms...");

    const response = await axios.post(
      `${PROXY_URL}/api/claude`,
      {
        prompt,
        systemPrompt: SYSTEM_PROMPT,
      },
      {
        timeout: 45000,
        headers: {
          "Content-Type": "application/json",
          "X-Request-Source": "choose-wise-web",
        },
      }
    );

    onProgressUpdate &&
      onProgressUpdate("✨ Finalizing your personalized recommendation...");
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      response: response.data.response,
      timestamp: response.data.timestamp,
      performance: response.data.performance,
      cached: response.data.cached,
      model: response.data.performance?.model || "ai-advisor",
    };
  } catch (error) {
    console.error("AI Service Error:", error);

    // Enhanced error messages for better user experience
    if (error.response?.status === 429) {
      throw new Error(
        "🚀 High demand detected! Our AI is popular right now. Please try again in 30 seconds for the best analysis."
      );
    } else if (error.response?.status === 500) {
      throw new Error(
        "🔧 Our AI advisor is optimizing. Please try again in a moment for premium analysis."
      );
    } else if (error.code === "ERR_NETWORK") {
      throw new Error(
        "🌐 Connection hiccup detected. Please check your internet and try again."
      );
    } else if (error.code === "ECONNABORTED") {
      throw new Error(
        "⏱️ Complex decision detected! Try shorter option descriptions for faster analysis."
      );
    } else {
      throw new Error(
        "🤖 AI advisor temporarily busy. Refresh and try again for expert guidance!"
      );
    }
  }
};

// Enhanced random choice with psychological insights
const getRandomChoice = (options) => {
  if (!options || options.length < 2) {
    throw new Error(
      "Please provide at least 2 options for an insightful gut check."
    );
  }

  const validOptions = options.filter((opt) => opt.text && opt.text.trim());
  if (validOptions.length < 2) {
    throw new Error(
      "Please provide at least 2 complete options for meaningful analysis."
    );
  }

  const randomIndex = Math.floor(Math.random() * validOptions.length);
  const randomChoice = validOptions[randomIndex];

  return {
    response: `🎲 **Gut Check Result: "${randomChoice.text}"**

🧠 **Psychological Insight:** Your immediate emotional reaction to this random result is valuable data about your true preferences.

**How do you feel about this choice?**
• 😊 **Excited or relieved?** → This option might align with your deeper desires
• 😟 **Disappointed or anxious?** → You may prefer one of the other options
• 😐 **Neutral?** → Consider what factors would make you more enthusiastic

🎯 **Next Step:** Use this gut reaction as additional input for your rational decision-making process. Your intuition often knows things your logical mind hasn't fully processed yet.

**Pro Tip:** The best decisions combine analytical thinking with emotional intelligence. Now you have both!`,
    timestamp: new Date().toISOString(),
    performance: { duration: 0, model: "intuition-engine" },
  };
};

// Memoized components for performance
const Header = memo(() => (
  <div className="header">
    <div className="hero-content">
      <h1 className="logo">
        <Brain className="logo-icon" />
        Choose-Wise
      </h1>
      <p className="tagline">
        AI Decision Maker Tool - Make Smarter Choices with Confidence
      </p>
      <p className="description">
        Struggling with tough decisions? Get expert AI analysis for career
        choices, relationships, business decisions, and life changes. Our
        advanced decision-making tool helps you choose wisely with personalized
        recommendations based on your unique situation.
      </p>
      <div className="hero-features">
        <div className="feature">
          <Target size={16} />
          <span>Personalized Analysis</span>
        </div>
        <div className="feature">
          <TrendingUp size={16} />
          <span>Data-Driven Insights</span>
        </div>
        <div className="feature">
          <Zap size={16} />
          <span>Instant Results</span>
        </div>
      </div>
    </div>
  </div>
));

const PrivacyNotice = memo(() => (
  <div className="privacy-notice">
    <Shield className="privacy-icon" size={16} />
    <strong>🔒 100% Private & Secure:</strong> Your decisions stay confidential.
    We process your information securely and never store or share your personal
    choices. Advanced encryption protects your privacy at every step.
  </div>
));

const ServerStatus = memo(({ status }) => {
  if (status === "checking") {
    return (
      <div className="status-checking">
        <Clock size={16} />
        <span>🚀 Connecting to AI decision advisor...</span>
      </div>
    );
  }

  if (status === "connected") {
    return (
      <div className="status-connected">
        <CheckCircle size={16} />
        <span>✅ AI Decision Expert Ready - Premium Analysis Available</span>
      </div>
    );
  }

  return null;
});

const OptionInput = memo(({ option, index, onChange, onRemove, canRemove }) => {
  const handleOptionChange = useCallback(
    (field, value) => {
      onChange(index, { ...option, [field]: value });
    },
    [index, option, onChange]
  );

  // Enhanced placeholders for better user guidance
  const placeholders = {
    0: "Take the new job at Microsoft",
    1: "Stay at current company and ask for promotion",
    2: "Start my own consulting business",
    3: "Take a career break to travel",
    4: "Go back to school for MBA",
  };

  const thoughtPlaceholders = {
    0: "Better salary and growth opportunities, but longer commute and new team dynamics...",
    1: "Comfortable environment and great colleagues, but limited growth potential...",
    2: "Freedom and unlimited potential, but financial risk and uncertainty...",
    3: "Life experience and clarity, but career gap and financial impact...",
    4: "Advanced skills and network, but time investment and student loans...",
  };

  return (
    <div className="option-container">
      <div className="option-header">
        <label className="label">
          <Target size={14} className="option-icon" />
          Choice {index + 1}:
        </label>
        {canRemove && (
          <button
            className="btn btn-remove"
            onClick={() => onRemove(index)}
            title="Remove this option"
            aria-label="Remove option"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <input
        type="text"
        className="input-field"
        placeholder={placeholders[index] || "Enter your option here..."}
        value={option.text}
        onChange={(e) => handleOptionChange("text", e.target.value)}
        maxLength={200}
      />

      <label className="label">
        💭 Your thoughts about this choice (helps AI give better advice):
      </label>
      <textarea
        className="textarea-field"
        placeholder={
          thoughtPlaceholders[index] ||
          "What are your concerns, hopes, or considerations about this option?"
        }
        value={option.reason}
        onChange={(e) => handleOptionChange("reason", e.target.value)}
        maxLength={500}
      />
      {option.reason && (
        <div className="character-count">
          {option.reason.length}/500 characters
        </div>
      )}
    </div>
  );
});

const LoadingSpinner = memo(({ text = "🧠 Analyzing..." }) => (
  <div className="loading-spinner">
    <div className="spinner-container">
      <div className="spinner"></div>
      <Brain className="spinner-brain" size={20} />
    </div>
    <span className="loading-text">{text}</span>
  </div>
));

const ResultSection = memo(({ result, isVisible }) => {
  const [feedback, setFeedback] = useState(null);
  const [showThanks, setShowThanks] = useState(false);

  const handleFeedback = useCallback(
    (type) => {
      setFeedback(type);
      setShowThanks(true);

      // Track feedback for analytics
      if (window.gtag) {
        window.gtag("event", "feedback", {
          feedback_type: type,
          result_cached: result?.cached || false,
        });
      }

      setTimeout(() => setShowThanks(false), 3000);
    },
    [result?.cached]
  );

  if (!isVisible || !result) return null;

  const formatResult = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/🎯/g, "🎯")
      .replace(/💡/g, "💡")
      .replace(/📊/g, "📊")
      .replace(/🚀/g, "🚀")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>");
  };

  return (
    <div className="result-section">
      <div className="result-header">
        <h3 className="result-title">
          <Brain size={24} className="result-icon" />
          AI Decision Analysis
        </h3>
        {result.cached && <div className="cached-badge">⚡ Instant Result</div>}
      </div>

      <div
        className="result-content"
        dangerouslySetInnerHTML={{
          __html: "<div>" + formatResult(result.response) + "</div>",
        }}
      />

      {result.performance && (
        <div className="performance-info">
          <div className="perf-item">
            <Zap size={14} />
            <span>Analysis time: {result.performance.duration || 0}ms</span>
          </div>
          {result.performance.model && (
            <div className="perf-item">
              <Brain size={14} />
              <span>Model: {result.performance.model}</span>
            </div>
          )}
          {result.performance.tokensUsed && (
            <div className="perf-item">
              <TrendingUp size={14} />
              <span>
                Complexity:{" "}
                {result.performance.tokensUsed > 500 ? "High" : "Standard"}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="feedback-section">
        <p className="feedback-question">
          💬 Was this analysis helpful for your decision?
        </p>
        <div className="feedback-buttons">
          <button
            className={`feedback-btn ${feedback === "yes" ? "selected" : ""}`}
            onClick={() => handleFeedback("yes")}
          >
            <ThumbsUp size={16} />
            Yes, very helpful!
          </button>
          <button
            className={`feedback-btn ${feedback === "no" ? "selected" : ""}`}
            onClick={() => handleFeedback("no")}
          >
            <ThumbsDown size={16} />
            Could be better
          </button>
        </div>
        {showThanks && (
          <div className="thanks-message">
            🙏 Thank you! Your feedback helps us improve our AI advisor.
          </div>
        )}
      </div>

      {result.timestamp && (
        <div className="timestamp">
          Generated: {new Date(result.timestamp).toLocaleString()}
        </div>
      )}
    </div>
  );
});

// Main App Component with SEO and performance optimizations
const App = () => {
  const [options, setOptions] = useState([
    { text: "", reason: "" },
    { text: "", reason: "" },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [serverStatus, setServerStatus] = useState("checking");
  const [loadingMessage, setLoadingMessage] = useState("🧠 Analyzing...");

  // SEO and performance optimizations
  useEffect(() => {
    // Update document title for SEO
    document.title =
      "Choose-Wise - AI Decision Maker Tool | Make Smart Choices with AI Advice";

    // Add structured data for rich snippets
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Choose-Wise",
      description: "AI-powered decision making tool for life choices",
      url: window.location.href,
      applicationCategory: "UtilityApplication",
      offers: {
        "@type": "Offer",
        price: "0",
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Server connection check with retry logic
  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        const response = await axios.get(`${PROXY_URL}/health`, {
          timeout: 5000,
        });
        if (response.status === 200) {
          setServerStatus("connected");
          setError("");
        }
      } catch (error) {
        setServerStatus("disconnected");
      }
    };

    checkServerConnection();
    const statusInterval = setInterval(checkServerConnection, 30000);
    return () => clearInterval(statusInterval);
  }, []);

  const handleOptionChange = useCallback((index, newOption) => {
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[index] = newOption;
      return newOptions;
    });
  }, []);

  const addOption = useCallback(() => {
    if (options.length < 5) {
      setOptions((prev) => [...prev, { text: "", reason: "" }]);
    }
  }, [options.length]);

  const removeOption = useCallback(
    (index) => {
      if (options.length > 2) {
        setOptions((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [options.length]
  );

  const scrollToResult = useCallback(() => {
    setTimeout(() => {
      const element = document.getElementById("result-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, []);

  const updateLoadingMessage = useCallback((message) => {
    setLoadingMessage(message);
  }, []);

  const handleGetAdvice = useCallback(async () => {
    setError("");
    setIsLoading(true);
    setShowResult(false);
    updateLoadingMessage("🎯 Preparing your analysis...");

    // Analytics tracking
    if (window.gtag) {
      window.gtag("event", "get_advice_started", {
        options_count: options.filter((opt) => opt.text.trim()).length,
      });
    }

    try {
      const validOptions = options.filter((opt) => opt.text && opt.text.trim());
      if (validOptions.length < 2) {
        throw new Error(
          "💡 Please enter at least 2 options to get meaningful AI analysis and recommendations."
        );
      }

      // Check for very short options
      const shortOptions = validOptions.filter(
        (opt) => opt.text.trim().length < 5
      );
      if (shortOptions.length > 0) {
        throw new Error(
          "🎯 Please provide more detailed options (at least 5 characters each) for better AI analysis."
        );
      }

      if (serverStatus === "disconnected") {
        try {
          await axios.get(`${PROXY_URL}/health`, { timeout: 3000 });
          setServerStatus("connected");
        } catch (connectionError) {
          throw new Error(
            "🌐 Unable to connect to our AI advisor. Please check your internet connection and try again."
          );
        }
      }

      updateLoadingMessage("🧠 AI analyzing your decision context...");
      await new Promise((resolve) => setTimeout(resolve, 300));

      const advice = await getAIAdvice(validOptions, updateLoadingMessage);

      setResult(advice);
      setShowResult(true);
      scrollToResult();

      // Analytics tracking
      if (window.gtag) {
        window.gtag("event", "get_advice_completed", {
          cached: advice.cached || false,
          model: advice.model || "unknown",
          duration: advice.performance?.duration || 0,
        });
      }
    } catch (err) {
      console.error("Error getting advice:", err);
      setError(
        err.message ||
          "🤖 Unable to get advice right now. Please try again in a moment."
      );

      // Analytics tracking
      if (window.gtag) {
        window.gtag("event", "get_advice_error", {
          error_message: err.message,
        });
      }

      if (err.message.includes("connect")) {
        setServerStatus("disconnected");
      }
    } finally {
      setIsLoading(false);
      updateLoadingMessage("🧠 Analyzing...");
    }
  }, [options, serverStatus, updateLoadingMessage, scrollToResult]);

  const handleRandomChoice = useCallback(() => {
    setError("");

    // Analytics tracking
    if (window.gtag) {
      window.gtag("event", "random_choice_used");
    }

    try {
      const validOptions = options.filter((opt) => opt.text && opt.text.trim());
      const randomAdvice = getRandomChoice(validOptions);
      setResult(randomAdvice);
      setShowResult(true);
      scrollToResult();
    } catch (err) {
      setError(err.message);
    }
  }, [options, scrollToResult]);

  const resetForm = useCallback(() => {
    setOptions([
      { text: "", reason: "" },
      { text: "", reason: "" },
    ]);
    setResult(null);
    setShowResult(false);
    setError("");

    // Analytics tracking
    if (window.gtag) {
      window.gtag("event", "form_reset");
    }
  }, []);

  const retryConnection = useCallback(async () => {
    setServerStatus("checking");
    setError("");

    try {
      await axios.get(`${PROXY_URL}/health`, { timeout: 5000 });
      setServerStatus("connected");
    } catch (error) {
      setServerStatus("disconnected");
      setError(
        "🔧 Still unable to connect. Please ensure you have a stable internet connection and try again."
      );
    }
  }, []);

  // Count valid options for UI feedback
  const validOptionsCount = options.filter((opt) => opt.text.trim()).length;

  return (
    <div className="container">
      <div className="card">
        <Header />
        <ServerStatus status={serverStatus} />

        {serverStatus === "disconnected" && error && (
          <div className="error-message">
            <div className="error-header">
              <AlertCircle size={20} />
              <strong>Connection Issue</strong>
            </div>
            <p>{error}</p>
            <button
              className="btn btn-secondary retry-btn"
              onClick={retryConnection}
              disabled={serverStatus === "checking"}
            >
              {serverStatus === "checking"
                ? "🔄 Reconnecting..."
                : "🔄 Try Again"}
            </button>
          </div>
        )}

        <PrivacyNotice />

        <div className="input-section">
          <h2 className="section-title">🎯 What decision are you facing?</h2>
          <p className="section-subtitle">
            Enter your options below. The more context you provide, the better
            our AI can help you choose wisely.
          </p>

          {error && !error.includes("Connection") && (
            <div className="error-message">
              <div className="error-header">
                <AlertCircle size={16} />
                {error}
              </div>
            </div>
          )}

          <div className="options-container">
            {options.map((option, index) => (
              <OptionInput
                key={index}
                option={option}
                index={index}
                onChange={handleOptionChange}
                onRemove={removeOption}
                canRemove={options.length > 2}
              />
            ))}
          </div>

          <div className="add-option-section">
            {options.length < 5 && (
              <button
                className="btn btn-add"
                onClick={addOption}
                disabled={isLoading}
              >
                <Plus size={16} />
                Add Another Option ({options.length}/5)
              </button>
            )}
            <div className="option-counter">
              ✅ {validOptionsCount} option{validOptionsCount !== 1 ? "s" : ""}{" "}
              ready
              {validOptionsCount >= 2 && (
                <span className="ready-indicator">• Ready for analysis!</span>
              )}
            </div>
          </div>

          <div className="action-buttons">
            <button
              className="btn btn-primary"
              onClick={handleGetAdvice}
              disabled={isLoading || validOptionsCount < 2}
            >
              {isLoading ? (
                <LoadingSpinner text={loadingMessage} />
              ) : (
                <>
                  <Sparkles size={16} />
                  Get Expert AI Analysis
                  {validOptionsCount >= 2 && (
                    <span className="btn-badge">
                      {validOptionsCount} options
                    </span>
                  )}
                </>
              )}
            </button>

            <button
              className="btn btn-secondary"
              onClick={handleRandomChoice}
              disabled={isLoading || validOptionsCount < 2}
              title="Sometimes a random choice can reveal your true preferences"
            >
              <Dice6 size={16} />
              Quick Gut Check
            </button>

            {showResult && (
              <button
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={isLoading}
              >
                <Target size={16} />
                Start New Decision
              </button>
            )}
          </div>

          {validOptionsCount < 2 && (
            <div className="helper-text">
              💡 <strong>Tip:</strong> Add at least 2 options to get AI-powered
              decision analysis
            </div>
          )}
        </div>

        <div id="result-section">
          <ResultSection result={result} isVisible={showResult} />
        </div>

        {/* Lazy-loaded sections for SEO and engagement */}
        <Suspense
          fallback={
            <div className="loading-placeholder">
              Loading additional content...
            </div>
          }
        >
          <FAQSection />
        </Suspense>

        {/* Call-to-action for engagement */}
        {!showResult && validOptionsCount === 0 && (
          <div className="cta-section">
            <h3>🎯 Common Decisions We Help With:</h3>
            <div className="decision-examples">
              <div
                className="example-item"
                onClick={() => {
                  setOptions([
                    {
                      text: "Take the job offer",
                      reason: "Better salary and growth opportunities",
                    },
                    {
                      text: "Stay at current job",
                      reason:
                        "Comfortable environment and good work-life balance",
                    },
                  ]);
                }}
              >
                💼 Career Changes
              </div>
              <div
                className="example-item"
                onClick={() => {
                  setOptions([
                    {
                      text: "Move to the new city",
                      reason: "Better opportunities and adventure",
                    },
                    {
                      text: "Stay where I am",
                      reason: "Established social network and comfort zone",
                    },
                  ]);
                }}
              >
                🏠 Life Transitions
              </div>
              <div
                className="example-item"
                onClick={() => {
                  setOptions([
                    {
                      text: "Start my own business",
                      reason: "Freedom and unlimited potential",
                    },
                    {
                      text: "Keep my stable job",
                      reason: "Steady income and benefits",
                    },
                  ]);
                }}
              >
                🚀 Business Decisions
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with SEO links */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Choose-Wise</h4>
            <p>AI-powered decision making for smarter choices</p>
          </div>
          <div className="footer-section">
            <h4>Decision Types</h4>
            <a href="#career">Career Decisions </a>
            <a href="#relationships">Relationship Advice </a>
            <a href="#business">Business Choices</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Choose-Wise. Make every decision count.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
