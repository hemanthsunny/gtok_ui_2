import CryptoJS from 'crypto-js'

const encryptText = (text) => {
  const cipherText = CryptoJS.AES.encrypt(text, '$0202kotGsteL').toString()
  return cipherText
}

export default encryptText
