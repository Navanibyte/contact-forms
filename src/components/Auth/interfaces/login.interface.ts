export interface LoginRequestModel {
    encryptedData: string;
}

export interface LoginTwoFAResponseData {
    requires_2fa: boolean;
    partial_token: string;
    email: string;
    message: string;
    user_id: string;
}

export interface LoginSuccessResponseData {
    access_token: string;
    user_id: string;
}

export interface LoginResponseModel {
    statusCode: number; 
    message: string;     
    data?: LoginSuccessResponseData;
}

export interface LoginTwoFAResponseModel {
    statusCode: number; 
    message: string;   
    data?: LoginTwoFAResponseData;
}

export interface LoginErrorResponseModel {
    statusCode: number; 
    message: string;    
    data?: null;
}

export type LoginResponse = LoginResponseModel | LoginTwoFAResponseModel | LoginErrorResponseModel;
