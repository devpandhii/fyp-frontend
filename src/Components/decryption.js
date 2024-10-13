// decryption.js
const CryptoJS = require('crypto-js');

const SECRET_KEY = CryptoJS.enc.Hex.parse('a3bce21f8a2d9e1f4c3e5f6789abdef01234567890abcdef1234567890abcdef'); // Your generated key
// const decryptData = (encryptedData) => {
//   const data = CryptoJS.enc.Base64.parse(encryptedData);
//   const iv = CryptoJS.lib.WordArray.create(data.words.slice(0, 4));
//   const ciphertext = CryptoJS.lib.WordArray.create(data.words.slice(4));

//   const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, SECRET_KEY, {
//     iv: iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7,
//   });

//   return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
// };


const decryptData = (encryptedData) => {
  try {
    console.log("Encrypted data received for decryption:", encryptedData);

    // Decode Base64 string
    const encryptedDataBytes = CryptoJS.enc.Base64.parse(encryptedData);

    // Extract IV from the first 16 bytes
    const iv = CryptoJS.lib.WordArray.create(encryptedDataBytes.words.slice(0, 4));
    console.log("Extracted IV:", iv.toString(CryptoJS.enc.Hex));

    // Extract the ciphertext after the IV
    const ciphertext = CryptoJS.lib.WordArray.create(encryptedDataBytes.words.slice(4));
    console.log("Ciphertext for decryption:", ciphertext.toString(CryptoJS.enc.Base64));

    // Decrypt using the extracted IV and ciphertext
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: ciphertext },
      SECRET_KEY,
      { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    console.log("Decrypted string:", decryptedString);

    // Convert decrypted string back to JSON object
    const decryptedData = JSON.parse(decryptedString);
    console.log("Decrypted data object:", decryptedData);

    return decryptedData;
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
};

// module.exports = { decryptData };

// const decryptMiddleware = (req, res, next) => {
//   try {
//     const encryptedData = req.body.data;
//     console.log(encryptedData);
//     const decryptedData = decryptData(encryptedData);
//     req.body = decryptedData;
//     // logger.info(`Received request on /Login: ${JSON.stringify(req.body)}`);
//     console.log(decryptedData);
//     next();
//   } catch (error) {
//     logger.error(`Decryption error: ${error.message}`);
//     res.status(400).json({ message: 'Invalid data' });
//   }
// };

// const decryptMiddleware = (req, res, next) => {
//   if (req.body && req.body.data) {
//     try {
//       console.log(req.body.data);
//       req.body = decryptData(req.body.data); 
//       console.log("Decrypted data is: ",req.body);// Decrypt the data and replace the request body
//     } catch (error) {
//       return res.status(400).json({ error: 'Invalid encrypted data' });
//     }
//   }
//   next(); // Proceed to the next middleware or route handler
// };

export {decryptData};