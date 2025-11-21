/* eslint-disable @typescript-eslint/no-explicit-any */
// components/TwoFASetupModal.tsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { API_URLS } from '../../services/api-constants';
import { useToast } from '../../utils/toaster/useToast';

interface TwoFASetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface SetupResponse {
  success: boolean;
  qr_code: string;
  secret: string;
  message: string;
}

const TwoFASetupModal: React.FC<TwoFASetupModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'qr' | 'verify'>('qr');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (isOpen) {
      initializeSetup();
    }
  }, [isOpen]);

  const initializeSetup = async () => {
    try {
      setLoading(true);
      setError('');
      const token = sessionStorage.getItem('accessToken');

      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await axios.post<SetupResponse>(
        API_URLS.TWO_FA_SETUP,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setQrCode(response.data.qr_code);
        setSecret(response.data.secret);
        setStep('qr');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to setup 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const token = sessionStorage.getItem('accessToken');

      await axios.post(
        API_URLS.TWO_FA_ENABLE,
        { token: otp },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showSuccess("Two Factor verified Successfully")
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('qr');
    setOtp('');
    setError('');
    onClose();
  };

  const isBase64Image = qrCode && (qrCode.startsWith('iVBORw0KGgo') || qrCode.startsWith('/9j/') || qrCode.includes('base64'));

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-0">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            Setup Two-Factor Authentication
          </h3>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors rounded-full p-2 hover:bg-slate-100"
            title="Close 2FA Setup"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {step === 'qr' && (
            <div className="space-y-4">
              <p className="text-slate-600 text-sm">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </p>

              {isBase64Image ? (
                <div className="flex justify-center p-4 bg-white border border-slate-200 rounded-lg">
                  <img
                    src={`data:image/png;base64,${qrCode}`}
                    alt="2FA QR Code"
                    className="w-48 h-48 object-contain"
                  />
                </div>
              ) : (
                <div className="flex justify-center p-4 bg-white border border-slate-200 rounded-lg">
                  <div className="w-48 h-48 flex items-center justify-center bg-slate-100 rounded">
                    <p className="text-slate-500 text-sm text-center p-4">
                      QR code not available. Please use the manual code below.
                    </p>
                  </div>
                </div>
              )}

              {secret && (
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-2">Can't scan QR code?</p>
                  <p className="text-xs text-slate-600 mb-3">
                    Enter this code manually in your authenticator app:
                  </p>
                  <div className="bg-white rounded border border-slate-300 p-3 mb-3">
                    <p className="text-sm font-mono text-center break-all select-all">{secret}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(secret)}
                    className="w-full bg-primary text-primary-foreground py-2 px-4 rounded hover:opacity-90 transition-colors text-sm font-medium"
                  >
                    Copy to clipboard
                  </button>
                </div>
              )}

              <button
                onClick={() => setStep('verify')}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Loading...' : 'I\'ve scanned the QR code'}
              </button>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-4">
              <p className="text-slate-600 text-sm">
                Enter the 6-digit code from your authenticator app
              </p>

              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center text-lg font-mono placeholder-slate-400"
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('qr')}
                  className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleVerify}
                  disabled={loading || otp.length !== 6}
                  className="flex-1 bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Verifying...' : 'Verify & Enable'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TwoFASetupModal;