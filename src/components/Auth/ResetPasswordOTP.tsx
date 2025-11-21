/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Auth/ResetPassword.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { resetPasswordOTP } from "../../services/api/auth/auth";
import PasswordInput from "./PasswordInput";

interface FormState {
  password: string;
  confirm: string;
}

export default function ResetPasswordOTP() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      await resetPasswordOTP(token!, form.password);
      toast.success("Password reset successful");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (field: keyof FormState) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [field]: e.target.value });
      };

  return (
    <div className="w-full max-w-md bg-white p-8 shadow-md rounded-2xl">
      <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          placeholder="New Password"
          value={form.password}
          onChange={handleChange("password")}
        />
        <PasswordInput
          placeholder="Confirm Password"
          value={form.confirm}
          onChange={handleChange("confirm")}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
