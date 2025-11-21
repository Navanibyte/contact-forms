import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { resetPasswordLink } from "../../services/api/auth/auth";
import { encryptWithHMACResetPassword } from "../../utils/security/encryption";
import { useToast } from "../../utils/toaster/useToast";

// Password strength validation
const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/(?=.*[a-z])/.test(password)) errors.push("One lowercase letter");
  if (!/(?=.*[A-Z])/.test(password)) errors.push("One uppercase letter");
  if (!/(?=.*\d)/.test(password)) errors.push("One number");
  if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) errors.push("One special character");
  return errors;
};

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      showError("Invalid reset link. Please request a new reset link.");
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      showError(`Password requirements: ${passwordErrors.join(", ")}`);
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const encryptedData = encryptWithHMACResetPassword(token, password)
      const result = await resetPasswordLink(encryptedData);

      if (result.success) {
        showSuccess("Password reset successfully! You can now login with your new password.");
        navigate("/login");
      } else {
        showError(result.message || "Failed to reset password");
      }
    } catch (err: unknown) {
      console.error("Password reset error:", err);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Failed to reset password";
        showError(errorMessage);

        // If token is invalid/expired, suggest requesting new link
        if (err.response?.status === 400) {
          setTimeout(() => {
            navigate("/forgot-password");
          }, 3000);
        }
      } else {
        showError("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordErrors = validatePassword(password);
  const isPasswordStrong = password.length > 0 && passwordErrors.length === 0;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-2xl border border-blue-100">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Invalid Reset Link</h3>
            <p className="text-gray-600 mb-4">This password reset link is missing the required token.</p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-colors"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-2xl border border-blue-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-2">
            Reset Password
          </h2>
          <p className="text-gray-600 text-sm">
            Create a new strong password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
            />
            {password && (
              <div className="mt-2">
                <div className="text-xs text-gray-600 mb-2">Password must contain:</div>
                <div className="space-y-1">
                  {["8+ characters", "Lowercase letter", "Uppercase letter", "Number", "Special character"].map((req, index) => {
                    const isMet = index === 0 ? password.length >= 8 :
                      index === 1 ? /[a-z]/.test(password) :
                        index === 2 ? /[A-Z]/.test(password) :
                          index === 3 ? /\d/.test(password) :
                            /[!@#$%^&*(),.?":{}|<>]/.test(password);
                    return (
                      <div key={req} className={`text-xs flex items-center ${isMet ? 'text-green-600' : 'text-gray-400'}`}>
                        <span className="mr-2">{isMet ? '✓' : '○'}</span>
                        {req}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${confirmPassword && !passwordsMatch ? 'border-red-300' : 'border-gray-300'
                }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
            />
            {confirmPassword && !passwordsMatch && (
              <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            disabled={loading || !isPasswordStrong || !passwordsMatch}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting Password...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-primary hover:opacity-80 text-sm font-medium transition-colors"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    </div>
  );
}