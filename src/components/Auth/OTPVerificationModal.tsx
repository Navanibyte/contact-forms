/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data?: any) => void;
  title: string;
  description: string;
  submitButtonText: string;
  submitButtonColor: 'blue' | 'red' | 'green';
  endpoint: string;
  tokenType: 'access' | 'partial';
  successMessage?: string;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title,
  description,
  submitButtonText,
  submitButtonColor,
  endpoint,
  tokenType,
  successMessage = 'Operation completed successfully'
}) => {
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const token = tokenType === 'partial'
        ? sessionStorage.getItem('partialToken')
        : sessionStorage.getItem('accessToken');

      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await axios.post(
        endpoint,
        { token: otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success || response.data.message === 'Login successful') {
        onSuccess(response.data);
      } else {
        setError(response.data.message || 'Operation failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.detail || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOtp('');
    setError('');
    onClose();
  };

  const getButtonColor = () => {
    switch (submitButtonColor) {
      case 'red': return 'bg-red-500 hover:bg-red-600';
      case 'green': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-primary hover:opacity-90';
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-slate-600 text-sm">{description}</p>

          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center text-lg font-mono"
              maxLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || otp.length !== 6}
              className={`flex-1 ${getButtonColor()} text-primary-foreground py-2 px-4 rounded-lg disabled:opacity-50 transition-colors`}
            >
              {loading ? 'Verifying...' : submitButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OTPVerificationModal;