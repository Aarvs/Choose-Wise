import React from 'react';
import { AI_MODELS } from '../utils/constants';

const ModelSelector = ({ selectedModel, onModelChange }) => {
  const availableModels = Object.values(AI_MODELS).filter(model => model.available);

  if (availableModels.length === 0) {
    return (
      <div className="error-message">
        <strong>No AI models available.</strong> Please configure at least one API key in your .env file.
      </div>
    );
  }

  return (
    <div className="model-selector">
      <h3>Choose your AI advisor:</h3>
      <div className="model-options">
        {availableModels.map((model) => (
          <div
            key={model.id}
            className={`model-option ${selectedModel === model.id ? 'selected' : ''}`}
            onClick={() => onModelChange(model.id)}
          >
            <h4>{model.name}</h4>
            <p>{model.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;