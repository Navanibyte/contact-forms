import axios from "axios";
import { requestPasswordReset } from "../../services/api/auth/auth";
import { encryptWithHMAC } from "../../utils/security/encryption";
import type { IforgetPasswordPayload } from "../../utils/security/encryption.interface";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../utils/toaster/useToast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showError("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const payload: IforgetPasswordPayload = {
        email: email
      }
      const encryptedValue = encryptWithHMAC(payload);
      const result = await requestPasswordReset(encryptedValue);

      if (result.success) {
        showSuccess("If your email exists, a reset link has been sent");
        setEmail("");
      } else {
        showError(result.message || "Failed to send reset link");
      }
    } catch (err: unknown) {
      console.error("Password reset request error:", err);
      if (axios.isAxiosError(err)) {
        showError(err.response?.data?.message || "Failed to process your request");
      } else {
        showError("Failed to process your request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-2xl border border-blue-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Enter your email address and we'll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your registered email"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Reset Link...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-primary hover:opacity-80 text-sm font-medium transition-colors"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}