import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyNotice = () => {
  return (
    <div className="privacy-notice">
      <Shield className="privacy-icon" size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
      <strong>Your privacy matters:</strong> Your decision details are sent securely to the selected AI service 
      for analysis and immediately deleted. Nothing is stored on our servers or shared with third parties. 
      Each AI provider has their own privacy policies for API usage.
    </div>
  );
};

export default PrivacyNotice;