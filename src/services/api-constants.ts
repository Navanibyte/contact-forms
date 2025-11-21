// src/services/api/api-constants.ts

export const API_BASE_URL: string = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"; // your FastAPI backend base URL

export const AUTH_ENDPOINTS = {
    // Base auth endpoints
    AUTH: "auth",
    LOGIN: "log-in",
    SIGNUP: "sign-up",
    SEND_OTP: "send-otp",
    VERIFY_OTP: "verify-otp",
    RESET_PASSWORD_OTP: "reset-password-otp",
    RESET_PASSWORD: "reset-password",
    FORGET_PASSWORD: "forgot-password",

    // OAuth endpoints
    GOOGLE_LOGIN: "login/google",
    GOOGLE_CALLBACK: "callback/google",

    // 2FA endpoints
    TWO_FA_SETUP: "2fa/setup",
    TWO_FA_ENABLE: "2fa/enable",
    TWO_FA_DISABLE: "2fa/disable",
    TWO_FA_VERIFY: "2fa/verify",
    TWO_FA_STATUS: "2fa/status",
    LOGIN_VERIFY_2FA: "login/verify-2fa",

    //Chatbots endpoints
    CREATE_CHATBOT: 'chatbot/create-agent',
    FILE_UPLOAD: 'chatbot/file-upload',
    GET_CHATBOT_CONFIGURATION_By_AGENT_ID: 'chatbot/configuration',
    GET_CHATBOT_TRAINING_By_AGENT_ID: 'chatbot/training',
    CHATBOT_AGENTS: 'chatbot/agents',
    GET_AGENT_BY_ID: 'chatbot/agents/:id',
    CHAT: 'chatbot/chat',
    SAVE_CHATBOT: 'chatbot/save-chatbot',
    DELETE_FILE: 'chatbot/delete-file',
    CHAT_HISTORY: 'chatbot/chat/all_history'



} as const;

export type AuthEndpoint = typeof AUTH_ENDPOINTS[keyof typeof AUTH_ENDPOINTS];

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
    return `${API_BASE_URL}/api/auth/${endpoint}`;
};

export const buildChatBotApiUrl = (endpoint: string): string => {
    return `${API_BASE_URL}/api/${endpoint}`
}


// Pre-built API URLs for common endpoints
export const API_URLS = {
    LOGIN: buildApiUrl(AUTH_ENDPOINTS.LOGIN),
    SIGNUP: buildApiUrl(AUTH_ENDPOINTS.SIGNUP),
    SEND_OTP: buildApiUrl(AUTH_ENDPOINTS.SEND_OTP),
    VERIFY_OTP: buildApiUrl(AUTH_ENDPOINTS.VERIFY_OTP),
    RESET_PASSWORD_OTP: buildApiUrl(AUTH_ENDPOINTS.RESET_PASSWORD_OTP),
    RESET_PASSWORD: buildApiUrl(AUTH_ENDPOINTS.RESET_PASSWORD),
    GOOGLE_LOGIN: buildApiUrl(AUTH_ENDPOINTS.GOOGLE_LOGIN),
    GOOGLE_CALLBACK: buildApiUrl(AUTH_ENDPOINTS.GOOGLE_CALLBACK),
    TWO_FA_SETUP: buildApiUrl(AUTH_ENDPOINTS.TWO_FA_SETUP),
    TWO_FA_ENABLE: buildApiUrl(AUTH_ENDPOINTS.TWO_FA_ENABLE),
    TWO_FA_DISABLE: buildApiUrl(AUTH_ENDPOINTS.TWO_FA_DISABLE),
    TWO_FA_VERIFY: buildApiUrl(AUTH_ENDPOINTS.TWO_FA_VERIFY),
    TWO_FA_STATUS: buildApiUrl(AUTH_ENDPOINTS.TWO_FA_STATUS),
    LOGIN_VERIFY_2FA: buildApiUrl(AUTH_ENDPOINTS.LOGIN_VERIFY_2FA),
    FORGET_PASSWORD: buildApiUrl(AUTH_ENDPOINTS.FORGET_PASSWORD),

    CHAT_FILE_UPLOAD: buildChatBotApiUrl(AUTH_ENDPOINTS.FILE_UPLOAD),
    CHAT_COFIGURATION_BY_ID: buildChatBotApiUrl(AUTH_ENDPOINTS.GET_CHATBOT_CONFIGURATION_By_AGENT_ID),
    CHAT_TRAINING_BY_ID: buildChatBotApiUrl(AUTH_ENDPOINTS.GET_CHATBOT_TRAINING_By_AGENT_ID),
    CHAT_AGENTS: buildChatBotApiUrl(AUTH_ENDPOINTS.CHATBOT_AGENTS),
    CHAT: buildChatBotApiUrl(AUTH_ENDPOINTS.CHAT),
    SAVE_CHAT_BOT: buildChatBotApiUrl(AUTH_ENDPOINTS.SAVE_CHATBOT),
    CREATE_CHAT_BOT: buildChatBotApiUrl(AUTH_ENDPOINTS.CREATE_CHATBOT),
    DELETE_FILE: buildChatBotApiUrl(AUTH_ENDPOINTS.DELETE_FILE),
    CHAT_ALL_HISTORY: buildChatBotApiUrl(AUTH_ENDPOINTS.CHAT_HISTORY)


} as const;
