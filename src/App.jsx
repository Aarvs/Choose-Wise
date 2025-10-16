import { SYSTEM_PROMPT } from "./utils/prompts";
import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import axios from "axios";

// Server configuration
const PROXY_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Enhanced AI service call - Seamless user experience
const getAIAdvice = async (options, onProgressUpdate, abortSignal) => {
  if (!options || options.length < 2) {
    throw new Error("Please provide at least 2 options to compare.");
  }

  let prompt = "I need help deciding between these options:\n\n";

  options.forEach((option, index) => {
    prompt += `**Option ${index + 1}: ${option.text}**\n`;
    if (option.reason && option.reason.trim()) {
      prompt += `My thoughts: ${option.reason.trim()}\n`;
    }
    prompt += "\n";
  });

  try {
    onProgressUpdate && onProgressUpdate("Analyzing your options...");

    const response = await axios.post(
      `${PROXY_URL}/api/claude`,
      {
        prompt,
        systemPrompt: SYSTEM_PROMPT,
      },
      {
        timeout: 60000, // ✅ Reduced to 60 seconds
        headers: {
          'Content-Type': 'application/json'
        },
        signal: abortSignal // ✅ Add abort signal
      }
    );

    onProgressUpdate && onProgressUpdate("Finalizing recommendation...");
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      response: response.data.response,
      timestamp: response.data.timestamp,
      metadata: {
        service: response.data.service
      }
    };
  } catch (error) {
    if (error.name === 'CanceledError') {
      throw error;
    }
    
    console.error("AI Service Error:", error);

    // User-friendly error messages
    if (error.response?.status === 401) {
      throw new Error("Service configuration issue. Please contact support.");
    } else if (error.response?.status === 429) {
      throw new Error("High demand detected. Please try again in a moment.");
    } else if (error.code === "ERR_NETWORK") {
      throw new Error(
        "Cannot connect to advice service. Please check your connection."
      );
    } else if (error.code === "ECONNABORTED") {
      throw new Error(
        "Request timeout. Please try with shorter descriptions."
      );
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error(
        "Unable to analyze your options right now. Please try again."
      );
    }
  }
};

// Random choice generator
const getRandomChoice = (options) => {
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

  return {
    response: `🎲 **Random Gut Check Result:** ${randomChoice.text}

Sometimes our gut reaction to a random choice can tell us a lot! How do you feel about this result? Excited? Disappointed? That feeling might be your intuition trying to guide you toward what you really want.

Use this as a data point, not the final answer. If you're happy with this random pick, maybe that option resonates with you more than you realized. If you're hoping for a different result, that's valuable information too!

**Next steps:** Consider how this random result makes you feel, then use that insight to inform your actual decision-making process.`,
    timestamp: new Date().toISOString(),
  };
};

// Components
const Header = () => {
  return (
    <div className="header">
      <h1 className="logo">Choose-Wise</h1>
      <p className="tagline">Get unbiased, wise advice on any decision</p>
      <p className="description">
        Making tough choices? Get thoughtful analysis from our AI advisor to
        help you think through your options objectively. Simply enter your
        choices and any thoughts you have about them.
      </p>
    </div>
  );
};

const PrivacyNotice = () => {
  return (
    <div className="privacy-notice">
      <Shield
        className="privacy-icon"
        size={16}
        style={{ display: "inline", marginRight: "0.5rem" }}
      />
      <strong>Your privacy matters:</strong> Nothing you enter is saved, stored,
      or shared. Your decision details stay completely private and are processed
      only to give you advice.
    </div>
  );
};

const ServerStatus = ({ status }) => {
  if (status === "checking") {
    return (
      <div className="status-checking">
        <Clock size={16} />
        <span>Connecting to advice service...</span>
      </div>
    );
  }

  if (status === "connected") {
    return (
      <div className="status-connected">
        <CheckCircle size={16} />
        <span>AI advisor ready</span>
      </div>
    );
  }

  return null; // Don't show disconnected status to avoid alarming users
};

const OptionInput = ({ option, index, onChange, onRemove, canRemove }) => {
  const handleOptionChange = (field, value) => {
    onChange(index, { ...option, [field]: value });
  };

  return (
    <div className="option-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <label className="label" style={{ margin: 0, flex: 1 }}>
          Option {index + 1}:
        </label>
        {canRemove && (
          <button
            className="btn btn-remove"
            onClick={() => onRemove(index)}
            style={{ padding: "0.25rem 0.5rem" }}
            title="Remove this option"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <input
        type="text"
        className="input-field"
        placeholder={`e.g., ${index === 0 ? "Take the new job offer" : "Stay in current position"
          }`}
        value={option.text}
        onChange={(e) => handleOptionChange("text", e.target.value)}
      />

      <label className="label">Your thoughts (optional):</label>
      <textarea
        className="textarea-field"
        placeholder={`e.g., ${index === 0
            ? "Better salary but longer commute..."
            : "Comfortable but limited growth..."
          }`}
        value={option.reason}
        onChange={(e) => handleOptionChange("reason", e.target.value)}
      />
    </div>
  );
};

const LoadingSpinner = ({ text = "Analyzing..." }) => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <span>{text}</span>
    </div>
  );
};

const ResultSection = ({ result, isVisible }) => {
  const [feedback, setFeedback] = useState(null);
  const [showThanks, setShowThanks] = useState(false);

  const handleFeedback = (type) => {
    setFeedback(type);
    setShowThanks(true);

    // Hide thanks message after 3 seconds
    setTimeout(() => {
      setShowThanks(false);
    }, 3000);
  };

  if (!isVisible || !result) return null;

  // Format the AI response with proper line breaks and styling
  const formatResult = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>");
  };

  return (
    <div className="result-section">
      <h3 className="result-title">AI Recommendation:</h3>

      <div
        className="result-content"
        dangerouslySetInnerHTML={{
          __html: "<p>" + formatResult(result.response) + "</p>",
        }}
      />

      <div className="feedback-section">
        <p>Was this advice helpful?</p>
        <div className="feedback-buttons">
          <button
            className={`feedback-btn ${feedback === "yes" ? "selected" : ""}`}
            onClick={() => handleFeedback("yes")}
          >
            <ThumbsUp size={16} />
            Yes
          </button>
          <button
            className={`feedback-btn ${feedback === "no" ? "selected" : ""}`}
            onClick={() => handleFeedback("no")}
          >
            <ThumbsDown size={16} />
            No
          </button>
        </div>
        {showThanks && (
          <div className="thanks-message">Thank you for your feedback!</div>
        )}
      </div>

      {result.timestamp && (
        <div className="timestamp">
          Generated at {new Date(result.timestamp).toLocaleString()}
        </div>
      )}
    </div>
  );
};

// Main App Component
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
  const [loadingMessage, setLoadingMessage] = useState("Analyzing...");

  useEffect(() => {
    // Check server connection on startup
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
        // Only show error if user tries to get advice
      }
    };

    checkServerConnection();

    // Periodically check connection (but don't show errors to user)
    const statusInterval = setInterval(() => {
      checkServerConnection();
    }, 120000);

    return () => clearInterval(statusInterval);
  }, []);

  const handleOptionChange = (index, newOption) => {
    const newOptions = [...options];
    newOptions[index] = newOption;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, { text: "", reason: "" }]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const scrollToResult = () => {
    setTimeout(() => {
      const element = document.getElementById("result-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const updateLoadingMessage = (message) => {
    setLoadingMessage(message);
  };

  const handleGetAdvice = async () => {
    setError("");
    setIsLoading(true);
    setShowResult(false);
    updateLoadingMessage("Preparing your request...");

    // ✅ Create abort controller for request cancellation
    const abortController = new AbortController();

    try {
      // Validate inputs
      const validOptions = options.filter((opt) => opt.text && opt.text.trim());
      if (validOptions.length < 2) {
        throw new Error("Please enter at least 2 options to compare.");
      }

      // Check server connection if we know it's down
      if (serverStatus === "disconnected") {
        try {
          await axios.get(`${PROXY_URL}/health`, {
            timeout: 3000,
            signal: abortController.signal
          });
          setServerStatus("connected");
        } catch (connectionError) {
          if (connectionError.name === 'CanceledError') return;
          throw new Error(
            "Cannot connect to advice service. Please check your internet connection and try again."
          );
        }
      }

      updateLoadingMessage("Analyzing your options...");
      await new Promise((resolve) => setTimeout(resolve, 300));

      // ✅ Get AI advice with abort signal
      const advice = await getAIAdvice(
        validOptions,
        updateLoadingMessage,
        abortController.signal
      );

      setResult(advice);
      setShowResult(true);
      scrollToResult();
    } catch (err) {
      if (err.name === 'CanceledError') {
        console.log('Request cancelled');
        return;
      }
      console.error("Error getting advice:", err);
      setError(
        err.message || "Unable to get advice right now. Please try again."
      );

      if (err.message.includes("Cannot connect")) {
        setServerStatus("disconnected");
      }
    } finally {
      setIsLoading(false);
      updateLoadingMessage("Analyzing...");
    }

    // ✅ Cleanup function
    return () => {
      abortController.abort();
    };
  };

  const handleRandomChoice = () => {
    setError("");

    try {
      const validOptions = options.filter((opt) => opt.text && opt.text.trim());
      const randomAdvice = getRandomChoice(validOptions);
      setResult(randomAdvice);
      setShowResult(true);
      scrollToResult();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setOptions([
      { text: "", reason: "" },
      { text: "", reason: "" },
    ]);
    setResult(null);
    setShowResult(false);
    setError("");
  };

  const retryConnection = async () => {
    setServerStatus("checking");
    setError("");

    try {
      await axios.get(`${PROXY_URL}/health`, { timeout: 5000 });
      setServerStatus("connected");
    } catch (error) {
      setServerStatus("disconnected");
      setError(
        "Still unable to connect. Please ensure the server is running and try again."
      );
    }
  };

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
              {serverStatus === "checking" ? "Reconnecting..." : "Try Again"}
            </button>
          </div>
        )}

        <PrivacyNotice />

        <div className="input-section">
          <h2 className="section-title">What are your options?</h2>

          {error && !error.includes("Connection") && (
            <div className="error-message">
              <div className="error-header">
                <AlertCircle size={16} />
                {error}
              </div>
            </div>
          )}

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

          {options.length < 5 && (
            <div className="add-option-section">
              <button className="btn btn-add" onClick={addOption}>
                <Plus size={16} />
                Add Another Option
              </button>
            </div>
          )}

          <div className="buttons">
            <button
              className="btn btn-primary"
              onClick={handleGetAdvice}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner text={loadingMessage} />
              ) : (
                <>
                  <Sparkles size={16} />
                  Get AI Advice
                </>
              )}
            </button>

            <button
              className="btn btn-secondary"
              onClick={handleRandomChoice}
              disabled={isLoading}
            >
              <Dice6 size={16} />
              Random Gut Check
            </button>

            {showResult && (
              <button
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={isLoading}
              >
                Start Over
              </button>
            )}
          </div>
        </div>

        <div id="result-section">
          <ResultSection result={result} isVisible={showResult} />
        </div>
      </div>
    </div>
  );
};

export default App;
