import CryptoJS from 'crypto-js';

export function encryptValue(val: string) {
  return CryptoJS.AES.encrypt(
    val,
    process.env.CRYPTOJS_SECRET_KEY as string
  ).toString();
}

export function decryptValue(val: string) {
  return CryptoJS.AES.decrypt(
    val,
    process.env.CRYPTOJS_SECRET_KEY as string
  ).toString(CryptoJS.enc.Utf8);
}
