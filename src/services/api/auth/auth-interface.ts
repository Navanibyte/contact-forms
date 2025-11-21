/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ErrorResponse {
    detail: string;
    [key: string]: any;
}


export interface OTPResponse {
    message?: string;
    [key: string]: any;
}

export interface SignupData {
    name?: string;
    email: string;
    password: string;
    [key: string]: any;
}
