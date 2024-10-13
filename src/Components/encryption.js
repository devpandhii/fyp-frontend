// src/utils/encryption.js

// import { config } from 'dotenv';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { useState } from 'react';
import { decryptData } from './decryption';
import Loader from './Loader';

const SECRET_KEY = CryptoJS.enc.Hex.parse('a3bce21f8a2d9e1f4c3e5f6789abdef01234567890abcdef1234567890abcdef'); // Your generated key

const encryptData = (data) => {
  try {
    console.log("Data before encryption:", data);

    const iv = CryptoJS.lib.WordArray.random(16);
    console.log("Generated IV:", iv.toString(CryptoJS.enc.Hex));

    const jsonString = JSON.stringify(data);
    console.log("Stringified data:", jsonString);

    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    console.log("Encrypted ciphertext:", encrypted.ciphertext.toString(CryptoJS.enc.Base64));

    const encryptedData = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
    console.log("Final encrypted data (Base64):", encryptedData);

    return encryptedData;
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
};



const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  // withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  // const[isLoader,setIsLoader] = useState(false);
  // setIsLoader(true);
  if (config.data) {
    console.log("Original config data: ", config.data);
    try {
      // Encrypt the data
      const encrypted = encryptData(config.data);
      console.log("Encrypted data: ", encrypted);

      // Set the encrypted data in the request payload
      config.data = { data: encrypted };
      console.log('Final request data after encryption: ', config.data);
    } catch (error) {
      console.error("Failed to encrypt data:", error);
      // setIsLoader(false);
    }
  } else {
    console.log("No data found in config to encrypt.");
  }
  return config;
}, (error) => {
  // setIsLoader(false);
  console.error("Error in request interceptor: ", error);
  return Promise.reject(error);
});

export { encryptData, apiClient };