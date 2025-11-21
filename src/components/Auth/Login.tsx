/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Auth/Login.tsx
import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { loginUser } from "../../services/api/auth/auth";
import PasswordInput from "./PasswordInput";
import { encryptWithHMAC } from "../../utils/security/encryption";
import OTPVerificationModal from "./OTPVerificationModal";
import type { IsignupLoginPayload } from "../../utils/security/encryption.interface";
import { API_URLS } from "../../services/api-constants";
import { useToast } from "../../utils/toaster/useToast";

interface FormState {
  email: string;
  password: string;
}

export default function Login() {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: IsignupLoginPayload = {
        email: form.email?.trim(),
        password: form.password?.trim()
      }
      // const encryptedValue = encryptWithHMAC(payload);
      const res = await loginUser(payload);
      console.log("Login response:", res.data);

      if (res?.data) {
        if ('requires_2fa' in res.data && res.data.requires_2fa) {
          sessionStorage.setItem('partialToken', res.data.partial_token);
          sessionStorage.setItem("user_id", res.data.user_id)
          setUserEmail(res.data.email || form.email);
          setShowOTPModal(true);
          showSuccess("Please enter your 2FA code");
        } else if ('access_token' in res.data && res.data.access_token) {
          localStorage.setItem("accessToken", res.data.access_token);
          localStorage.setItem("token", res.data.access_token);
          sessionStorage.setItem("accessToken", res.data.access_token);
          sessionStorage.setItem("email", form.email);
          sessionStorage.setItem("user_id", res.data.user_id)
          showSuccess(res.message || "Login successful");
          navigate("/dashboard");
        } else {
          throw new Error("Invalid login response");
        }
      } else {
        throw new Error("No response data");
      }

    } catch (error: any) {
      console.error(error);
      showError(error.response?.data?.message || error.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = (data: any) => {
    // Handle different possible response structures
    const accessToken = data?.access_token || data?.data?.access_token;

    if (accessToken) {
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("email", userEmail);
      sessionStorage.removeItem('partialToken');
      showSuccess("Login successful!");
      navigate("/dashboard");
    } else {
      console.error('No access token in OTP response:', data);
      showError("Authentication failed. Please try again.");
    }
  };


  const handleChange = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 shadow-md rounded-2xl">
          <h2 className="text-3xl font-semibold text-center mb-6">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              onChange={handleChange("email")}
              required
            />
            <PasswordInput
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange("password")}
            />
            <div className="flex justify-end mt-4 text-sm">
              <Link to="/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-2 text-gray-400 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <button
            onClick={() => window.location.href = API_URLS.GOOGLE_LOGIN}
            className="flex items-center justify-center w-full border p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FcGoogle size={22} className="mr-2" />
            Sign in with Google
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onSuccess={handleOTPSuccess}
        title="Two-Factor Authentication"
        description="Please enter the 6-digit code from your authenticator app to complete your login."
        submitButtonText="Verify & Login"
        submitButtonColor="green"
        endpoint={API_URLS.LOGIN_VERIFY_2FA}
        tokenType="partial"
      />
    </>
  );
}