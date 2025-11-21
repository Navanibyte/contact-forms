export interface IsignupLoginPayload {
  email: string;
  password: string;
  name?: string;
}

export interface IencryptedPayload {
  encryptedPayload: string;
}

export interface IforgetPasswordPayload{
  email:string
}
