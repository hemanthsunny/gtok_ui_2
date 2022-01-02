import CryptoJS from "crypto-js";

const decryptText = (text) => {
  const bytes = CryptoJS.AES.decrypt(text, "$0202kotGsteL");
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

export default decryptText;
