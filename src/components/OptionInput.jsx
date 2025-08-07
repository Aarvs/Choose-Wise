import React from 'react';
import { Trash2 } from 'lucide-react';

const OptionInput = ({ option, index, onChange, onRemove, canRemove }) => {
  const handleOptionChange = (field, value) => {
    onChange(index, { ...option, [field]: value });
  };

  return (
    <div className="option-container">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
        <label className="label" style={{ margin: 0, flex: 1 }}>
          Option {index + 1}:
        </label>
        {canRemove && (
          <button
            className="btn btn-remove"
            onClick={() => onRemove(index)}
            style={{ padding: '0.25rem 0.5rem' }}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      
      <input
        type="text"
        className="input-field"
        placeholder={`e.g., ${index === 0 ? 'Take the new job offer' : 'Stay in current position'}`}
        value={option.text}
        onChange={(e) => handleOptionChange('text', e.target.value)}
      />
      
      <label className="label">Your thoughts (optional):</label>
      <textarea
        className="textarea-field"
        placeholder={`e.g., ${index === 0 ? 'Better salary but longer commute...' : 'Comfortable but limited growth...'}`}
        value={option.reason}
        onChange={(e) => handleOptionChange('reason', e.target.value)}
      />
    </div>
  );
};

export default OptionInput;