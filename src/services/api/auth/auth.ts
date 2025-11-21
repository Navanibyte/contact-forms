/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/api/auth.ts
import axios from "axios";
import type { AxiosResponse } from "axios";
import { API_URLS } from "../../api-constants";
import { type ErrorResponse } from "react-router-dom";
import { type OTPResponse } from "./auth-interface";
import type { SignupResponse } from "../../../components/Auth/interfaces/signup.interface";
import type { LoginResponse } from "../../../components/Auth/interfaces/login.interface";
import type { ResetPasswordResponse } from "../../../components/Auth/interfaces/reset.password.interfaces";
import type { ForgotPasswordResponse } from "../../../components/Auth/interfaces/forget.password.interface";


// -----------------------------
// Login
// -----------------------------
export const loginUser = async (encryptedData: any) => {
    try {
        const response: AxiosResponse = await axios.post(
            API_URLS.LOGIN,
            { ...encryptedData }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data as ErrorResponse || { detail: "Network error" };
    }
};

// -----------------------------
// Google login redirect
// -----------------------------
export const googleLogin = () => {
    window.location.href = API_URLS.GOOGLE_LOGIN;
};

// -----------------------------
// Send OTP
// -----------------------------
export const sendOTP = async (email: string): Promise<OTPResponse> => {
    try {
        const response: AxiosResponse<OTPResponse> = await axios.post(
            API_URLS.SEND_OTP,
            { email }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data as ErrorResponse || { detail: "Network error" };
    }
};

// -----------------------------
// Verify OTP
// -----------------------------
export const verifyOTP = async (email: string, otp: string): Promise<OTPResponse> => {
    try {
        const response: AxiosResponse<OTPResponse> = await axios.post(
            API_URLS.VERIFY_OTP,
            { email, otp }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data as ErrorResponse || { detail: "Network error" };
    }
};

// -----------------------------
// Reset password using OTP
// -----------------------------
export const resetPasswordOTP = async (resetToken: string, newPassword: string): Promise<OTPResponse> => {
    try {
        const response: AxiosResponse<OTPResponse> = await axios.post(
            API_URLS.RESET_PASSWORD_OTP,
            { resetToken, newPassword }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data as ErrorResponse || { detail: "Network error" };
    }
};

// -----------------------------
// Reset password using old password
// -----------------------------
export const resetPassword = async (email: string, newPassword: string, oldPassword: string): Promise<OTPResponse> => {
    try {
        const response: AxiosResponse<OTPResponse> = await axios.post(
            API_URLS.RESET_PASSWORD,
            { email, newPassword, oldPassword }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data as ErrorResponse || { detail: "Network error" };
    }
};

// -----------------------------
// Signup
// -----------------------------
export const signup = async (encryptedData: any) => {
    try {
        const response: AxiosResponse = await axios.post(
            API_URLS.SIGNUP,
            { ...encryptedData }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data as ErrorResponse || { detail: "Network error" };
    }
};


export const requestPasswordReset = async (encryptedData: string): Promise<ForgotPasswordResponse> => {
    try {
        const response = await axios.post<ForgotPasswordResponse>(
            API_URLS.FORGET_PASSWORD,
            { encryptedData }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data as ErrorResponse || { detail: "Network error" };
    }

}

export const resetPasswordLink = async (encryptedData: string): Promise<ResetPasswordResponse> => {
    try {
        const response = await axios.post<ResetPasswordResponse>(
            API_URLS.RESET_PASSWORD,
            { encryptedData: encryptedData }
        );
        return response.data;
    } catch (error: any) {
        throw error.response?.data as ErrorResponse || { detail: "Network error" };
    }

}
