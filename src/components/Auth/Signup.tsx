/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Auth/Signup.tsx
import React from "react";
import { useState, type ChangeEvent, type FormEvent, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInput";
import { signup } from "../../services/api/auth/auth";
import type { SignupData } from "../../services/api/auth/auth-interface";
import { encryptWithHMAC } from "../../utils/security/encryption";
import { useToast } from "../../utils/toaster/useToast";

interface SignupForm {
  name: string;
  email: string;
  password: string;
}

interface SignupState {
  isLoading: boolean;
  error: string | null;
}

// Password strength validation (same as reset password)
const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/(?=.*[a-z])/.test(password)) errors.push("One lowercase letter");
  if (!/(?=.*[A-Z])/.test(password)) errors.push("One uppercase letter");
  if (!/(?=.*\d)/.test(password)) errors.push("One number");
  if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) errors.push("One special character");
  return errors;
};

export default function Signup() {
  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: ""
  });
  const [state, setState] = useState<SignupState>({
    isLoading: false,
    error: null
  });

  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  // Clear session storage on component mount
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  // Handle form input changes
  const handleChange = useCallback((
    field: keyof SignupForm
  ) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    // Clear error when user starts typing
    if (state.error) {
      setState(prev => ({ ...prev, error: null }));
    }
  }, [state.error]);

  // Validate form inputs
  const validateForm = useCallback((): boolean => {
    const { name, email, password } = form;

    if (!name.trim()) {
      setState(prev => ({ ...prev, error: "Name is required" }));
      return false;
    }

    if (!email.trim()) {
      setState(prev => ({ ...prev, error: "Email is required" }));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setState(prev => ({ ...prev, error: "Please enter a valid email address" }));
      return false;
    }

    if (!password) {
      setState(prev => ({ ...prev, error: "Password is required" }));
      return false;
    }

    // Enhanced password validation (same as reset password)
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setState(prev => ({
        ...prev,
        error: `Password must contain: ${passwordErrors.join(", ")}`
      }));
      return false;
    }

    return true;
  }, [form]);

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const signupPayload: SignupData = {
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim()
      };


      // const encryptedValue = encryptWithHMAC(signupPayload);
      const response = await signup(signupPayload);

      if (response.data?.accessToken) {
        sessionStorage.setItem("accessToken", response.data.accessToken);
        sessionStorage.setItem("email", form.email.trim());
        showSuccess(response.message || "Account created successfully!");
        navigate("/login");
      } else {
        throw new Error("Invalid signup response: No access token received");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Signup failed. Please try again.";
      setState(prev => ({ ...prev, error: errorMessage }));
      showError(errorMessage);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const passwordErrors = validatePassword(form.password);
  const isPasswordStrong = form.password.length > 0 && passwordErrors.length === 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-2xl border border-blue-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-2">
            Create Your Account
          </h2>
        </div>

        {state.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {state.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              onChange={handleChange("name")}
              disabled={state.isLoading}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={form.email}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              onChange={handleChange("email")}
              disabled={state.isLoading}
              required
            />
          </div>

          <div>
            {/* <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              onChange={handleChange("password")}
              disabled={state.isLoading}
              required
              autoComplete="new-password"
            /> */}

            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <PasswordInput
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange("password")}
            />

            {form.password && (
              <div className="mt-2">
                <div className="text-xs text-gray-600 mb-2">Password must contain:</div>
                <div className="space-y-1">
                  {["8+ characters", "Lowercase letter", "Uppercase letter", "Number", "Special character"].map((req, index) => {
                    const isMet = index === 0 ? form.password.length >= 8 :
                      index === 1 ? /[a-z]/.test(form.password) :
                        index === 2 ? /[A-Z]/.test(form.password) :
                          index === 3 ? /\d/.test(form.password) :
                            /[!@#$%^&*(),.?":{}|<>]/.test(form.password);
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

          <button
            type="submit"
            disabled={state.isLoading || !isPasswordStrong}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {state.isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:opacity-80 font-medium underline transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}