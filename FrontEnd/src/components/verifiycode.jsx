import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { verifyCodeApi } from '../apis/Api'; 
import '../css/regstyle.css';

const VerificationPopup = ({ onClose, onVerified }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleCodeChange = (e) => setCode(e.target.value);

  const handleVerify = () => {
    setError('');
    verifyCodeApi(code)
      .then(res => {
        if (res.data.success) {
          toast.success(res.data.message);
          onVerified(); 
        } else {
          setError(res.data.message);
        }
      })
      .catch(err => {
        setError("Verification failed. Please try again.");
      });
  };

  return (
    <div className="verification-popup">
      <div className="popup-content">
        <h2>Enter Verification Code</h2>
        <input
          type="text"
          value={code}
          onChange={handleCodeChange}
          placeholder="Enter 4-digit code"
          maxLength="4"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button onClick={handleVerify}>Verify</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default VerificationPopup;
