
import { bytesToBinary, stringToUTF8Bytes } from './bitOperations';

// SHA-256 Constants
export const H_CONSTANTS = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
];

export const K_CONSTANTS = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  // ... full 64 constants
];

// Bitwise rotation and shift helpers
const rotr = (x: number, n: number) => 
  ((x >>> n) | (x << (32 - n))) >>> 0;

const ch = (x: number, y: number, z: number) => 
  (x & y) ^ (~x & z);

const maj = (x: number, y: number, z: number) => 
  (x & y) ^ (x & z) ^ (y & z);

const sigma0 = (x: number) => 
  rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22);

const sigma1 = (x: number) => 
  rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25);

const gamma0 = (x: number) => 
  rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3);

const gamma1 = (x: number) => 
  rotr(x, 17) ^ rotr(x, 19) ^ (x >>> 10);

export function preprocessMessage(message: string): number[] {
  const utf8Bytes = stringToUTF8Bytes(message);
  const messageBits = utf8Bytes.length * 8;
  
  // Append '1' bit
  utf8Bytes.push(0x80);
  
  // Pad with zeros until we're 64 bits short of a 512-bit block
  while ((utf8Bytes.length + 8) % 64 !== 0) {
    utf8Bytes.push(0);
  }
  
  // Append 64-bit message length
  const lengthBytes = [
    (messageBits >>> 56) & 0xFF,
    (messageBits >>> 48) & 0xFF,
    (messageBits >>> 40) & 0xFF,
    (messageBits >>> 32) & 0xFF,
    (messageBits >>> 24) & 0xFF,
    (messageBits >>> 16) & 0xFF,
    (messageBits >>> 8) & 0xFF,
    messageBits & 0xFF
  ];
  
  utf8Bytes.push(...lengthBytes);
  
  return utf8Bytes;
}

export function sha256(message: string): string {
  const preprocessedMessage = preprocessMessage(message);
  const hashValues = [...H_CONSTANTS];
  
  // Process each 512-bit block
  for (let i = 0; i < preprocessedMessage.length; i += 64) {
    const messageSchedule = createMessageSchedule(preprocessedMessage.slice(i, i + 64));
    compressBlock(hashValues, messageSchedule);
  }
  
  // Convert final hash to hex string
  return hashValues
    .map(val => val.toString(16).padStart(8, '0'))
    .join('');
}

function createMessageSchedule(block: number[]): number[] {
  const w = new Array(64).fill(0);
  
  // First 16 words are the 512-bit block split into 32-bit chunks
  for (let i = 0; i < 16; i++) {
    w[i] = (block[i * 4] << 24) | 
           (block[i * 4 + 1] << 16) | 
           (block[i * 4 + 2] << 8) | 
           block[i * 4 + 3];
  }
  
  // Extend to 64 words
  for (let i = 16; i < 64; i++) {
    const s0 = gamma0(w[i - 15]);
    const s1 = gamma1(w[i - 2]);
    w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
  }
  
  return w;
}

function compressBlock(hashValues: number[], w: number[]) {
  let [a, b, c, d, e, f, g, h] = hashValues;
  
  // 64 rounds of compression
  for (let i = 0; i < 64; i++) {
    const S1 = sigma1(e);
    const ch_result = ch(e, f, g);
    const temp1 = (h + S1 + ch_result + K_CONSTANTS[i] + w[i]) >>> 0;
    
    const S0 = sigma0(a);
    const maj_result = maj(a, b, c);
    const temp2 = (S0 + maj_result) >>> 0;
    
    h = g;
    g = f;
    f = e;
    e = (d + temp1) >>> 0;
    d = c;
    c = b;
    b = a;
    a = (temp1 + temp2) >>> 0;
  }
  
  // Update hash values
  hashValues[0] = (hashValues[0] + a) >>> 0;
  hashValues[1] = (hashValues[1] + b) >>> 0;
  hashValues[2] = (hashValues[2] + c) >>> 0;
  hashValues[3] = (hashValues[3] + d) >>> 0;
  hashValues[4] = (hashValues[4] + e) >>> 0;
  hashValues[5] = (hashValues[5] + f) >>> 0;
  hashValues[6] = (hashValues[6] + g) >>> 0;
  hashValues[7] = (hashValues[7] + h) >>> 0;
}

export function bytesToHex(bytes: number[]): string {
  return bytes.map(byte => byte.toString(16).padStart(2, '0')).join('');
}
