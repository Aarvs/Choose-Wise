import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

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
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="result-section">
      <h3 className="result-title">AI Recommendation:</h3>
      <div 
        className="result-content"
        dangerouslySetInnerHTML={{ 
          __html: '<p>' + formatResult(result) + '</p>' 
        }}
      />
      
      <div className="feedback-section">
        <p>Was this advice helpful?</p>
        <div className="feedback-buttons">
          <button
            className={`feedback-btn ${feedback === 'yes' ? 'selected' : ''}`}
            onClick={() => handleFeedback('yes')}
          >
            <ThumbsUp size={16} style={{ marginRight: '0.5rem' }} />
            Yes
          </button>
          <button
            className={`feedback-btn ${feedback === 'no' ? 'selected' : ''}`}
            onClick={() => handleFeedback('no')}
          >
            <ThumbsDown size={16} style={{ marginRight: '0.5rem' }} />
            No
          </button>
        </div>
        {showThanks && (
          <div style={{ 
            marginTop: '1rem', 
            color: '#48bb78', 
            fontWeight: '500' 
          }}>
            Thank you for your feedback!
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultSection;