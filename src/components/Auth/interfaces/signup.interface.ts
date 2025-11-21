

export interface SignupSuccessResponse {
    statusCode: number;
    message: string;
    data?: {
        accessToken: string;
    };
}

export interface SignupOTPResponse {
    statusCode: number; 
    message: string;
    data?: null;
}

export interface SignupErrorResponse {
    statusCode: number; 
    message: string; 
    data?: null;
}

export type SignupResponse = SignupSuccessResponse | SignupOTPResponse | SignupErrorResponse;
