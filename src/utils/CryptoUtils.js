import CryptoJS from 'crypto-js';

export const encryptAes = function (aesKey, aesIv, text) {
  var key = CryptoJS.enc.Utf8.parse(aesKey),
    iv = CryptoJS.enc.Utf8.parse(aesIv),
    srcs = CryptoJS.enc.Utf8.parse(text),
    encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  return encrypted.toString();
};

export const decryptAes = function (aesKey, aesIv, srcs) {
  var key = CryptoJS.enc.Utf8.parse(aesKey),
    iv = CryptoJS.enc.Utf8.parse(aesIv),
    decrypted = CryptoJS.AES.decrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  return decrypted.toString(CryptoJS.enc.Utf8);
};
