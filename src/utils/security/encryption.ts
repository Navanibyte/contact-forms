import cryptoJs from 'crypto-js';
import type { IforgetPasswordPayload } from './encryption.interface';
import type { IsignupLoginPayload } from './encryption.interface';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'AiTheFuture10101';
const HMAC_KEY = import.meta.env.VITE_HMAC_KEY || 'AiTheHmacDev0101';

// const SECRET_KEY =  'your-secret-key-here';

// const ENCRYPTION_KEY = 'AiTheFuture10101';
// const HMAC_KEY = 'AiTheHmacDev0101';

export const encryptWithHMAC = (payload: IsignupLoginPayload | IforgetPasswordPayload) => {
  try {
    // Validate inputs
    if (!payload.email) {
      throw new Error('Email is required');
    }

    if ("password" in payload) {
      if (
        typeof payload.password !== "string" ||
        payload.password.trim().length === 0
      ) {
        throw new Error("Invalid password format");
      }
    }

    // Generate random IV
    const iv = cryptoJs.lib.WordArray.random(16);

    // 1. Encrypt the data (same)
    const encrypted = cryptoJs.AES.encrypt(
      JSON.stringify(payload),
      cryptoJs.enc.Utf8.parse(ENCRYPTION_KEY),
      {
        iv,
        mode: cryptoJs.mode.CBC,
        padding: cryptoJs.pad.Pkcs7
      }
    );

    // Combine IV + ciphertext
    const combined = iv.concat(encrypted.ciphertext);
    const encryptedData = cryptoJs.enc.Base64.stringify(combined);

    // 2. Create HMAC of the encrypted data
    const hmac = cryptoJs.HmacSHA256(encryptedData, HMAC_KEY).toString();

    // 3. Final format: HMAC::ENCRYPTED_DATA
    const encryptedDataResult = `${hmac}::${encryptedData}`;

    return encryptedDataResult;

  } catch (error) {
    console.error('🔴 HMAC encryption failed:', error);
    throw new Error('Security encryption failed');
  }
};

export const decryptWithHMAC = (encryptedData: string): IsignupLoginPayload => {
  try {
    // Split HMAC and encrypted data
    if (!encryptedData.includes('::')) {
      throw new Error('Invalid encrypted data format');
    }

    const [receivedHmac, actualEncryptedData] = encryptedData.split('::', 2);

    // Verify HMAC
    const calculatedHmac = cryptoJs.HmacSHA256(actualEncryptedData, HMAC_KEY).toString();
    if (calculatedHmac !== receivedHmac) {
      throw new Error('HMAC verification failed');
    }

    // Decrypt the data
    const decrypted = cryptoJs.AES.decrypt(
      actualEncryptedData,
      cryptoJs.enc.Utf8.parse(ENCRYPTION_KEY),
      {
        mode: cryptoJs.mode.CBC,
        padding: cryptoJs.pad.Pkcs7
      }
    );

    const decryptedString = decrypted.toString(cryptoJs.enc.Utf8);
    if (!decryptedString) {
      throw new Error('Failed to decrypt data');
    }

    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('🔴 HMAC decryption failed:', error);
    throw new Error('Security decryption failed');
  }
};



export const encryptWithHMACResetPassword = (token: string, newPassword: string) => {

  try {
    const payload = {
      token,
      new_password: newPassword
    }
    // Generate random IV
    const iv = cryptoJs.lib.WordArray.random(16);

    // 1. Encrypt the data (same as before)
    const encrypted = cryptoJs.AES.encrypt(
      JSON.stringify(payload),
      cryptoJs.enc.Utf8.parse(ENCRYPTION_KEY),
      {
        iv: iv,
        mode: cryptoJs.mode.CBC,
        padding: cryptoJs.pad.Pkcs7
      }
    );

    // Combine IV + ciphertext
    const combined = iv.concat(encrypted.ciphertext);
    const encryptedData = cryptoJs.enc.Base64.stringify(combined);

    // 2. Create HMAC of the encrypted data
    const hmac = cryptoJs.HmacSHA256(encryptedData, HMAC_KEY).toString();

    // 3. Final format: HMAC::ENCRYPTED_DATA
    const encryptedDataResult = `${hmac}::${encryptedData}`;

    return encryptedDataResult;

  } catch (error) {
    console.error('🔴 HMAC encryption failed:', error);
    throw new Error('Security encryption failed');
  }

}
