import * as CryptoJS from 'crypto-js';

export class CryptoUtil {
  private static readonly SECRET_KEY = 'P0rt4lTr4b4j0_S3cr3t_K3y_2026';

  static encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString();
  }

  static decrypt(encryptedData: string): string | null {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedString ? decryptedString : null;
    } catch (e) {
      return null;
    }
  }

  static saveSession(sessionObj: any): void {
    const jsonStr = JSON.stringify(sessionObj);
    const encrypted = this.encrypt(jsonStr);
    localStorage.setItem('userSession', encrypted);
  }

  static getSession(): any | null {
    const encrypted = localStorage.getItem('userSession');
    if (!encrypted) return null;
    const decryptedStr = this.decrypt(encrypted);
    if (!decryptedStr) return null;
    try {
      return JSON.parse(decryptedStr);
    } catch (e) {
      return null;
    }
  }

  static removeSession(): void {
    localStorage.removeItem('userSession');
  }
}
