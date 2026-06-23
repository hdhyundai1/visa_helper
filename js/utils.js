import { CONFIG } from './config.js';

export async function getCryptoKey(salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(salt.padEnd(32, '0').slice(0, 32)), { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
    return keyMaterial;
}

export async function encryptData(text) {
    if (!text) return "";
    try {
        const key = await getCryptoKey(CONFIG.secretSalt);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encodedText = new TextEncoder().encode(text);
        const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, encodedText);
        
        const combined = new Uint8Array(iv.length + ciphertext.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(ciphertext), iv.length);
        return btoa(String.fromCharCode(...combined));
    } catch(e) { return text; }
}

export async function decryptData(base64Cipher) {
    if (!base64Cipher || !base64Cipher.startsWith) return base64Cipher;
    try {
        const binaryStr = atob(base64Cipher);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
        
        const iv = bytes.slice(0, 12);
        const data = bytes.slice(12);
        const key = await getCryptoKey(CONFIG.secretSalt);
        
        const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, data);
        return new TextDecoder().decode(decrypted);
    } catch(e) { return base64Cipher; } 
}

export async function fetchWithBackoff(url, payload) {
    const delays = [1000, 2000, 4000, 8000, 16000];
    for (let i = 0; i < delays.length + 1; i++) {
        try {
            const response = await fetch(url, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(payload) 
            });
            if (!response.ok) throw new Error(`HTTP 에러: ${response.status}`);
            return await response.json();
        } catch (e) {
            if (i === delays.length) throw e;
            await new Promise(r => setTimeout(r, delays[i]));
        }
    }
}

export function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64); 
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
