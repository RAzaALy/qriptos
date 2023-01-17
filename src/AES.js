import CryptoJS from "crypto-js";

let iv = "1234567890123456";
iv = CryptoJS.enc.Utf8.parse(iv);

export const encrypt = (text, key) => {
  key = CryptoJS.enc.Utf8.parse(key);
  let encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv });
  encrypted = encrypted.toString();
  return encrypted;
};

export const decrypt = (encryptedText, key) => {
  key = CryptoJS.enc.Utf8.parse(key);
  let decrypted = CryptoJS.AES.decrypt(encryptedText, key, { iv: iv });
  decrypted = decrypted.toString(CryptoJS.enc.Utf8);
  return decrypted;
};

 
