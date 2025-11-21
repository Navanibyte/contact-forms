export interface ForgotPasswordRequest {
    email: string;
  }
  
export  interface ForgotPasswordResponse {
    message: string;
    success: boolean;
  }