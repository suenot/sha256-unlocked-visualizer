export function stringToUTF8Bytes(str: string): number[] {
  const encoder = new TextEncoder();
  return Array.from(encoder.encode(str));
}

export function bytesToBinary(bytes: number[]): string {
  return bytes
    .map(byte => byte.toString(2).padStart(8, '0'))
    .join(' ');
}

export function hexToBinary(hex: string): string {
  return hex
    .split('')
    .map(c => parseInt(c, 16).toString(2).padStart(4, '0'))
    .join(' ');
}

export function bytesToHex(bytes: number[]): string {
  return bytes.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export function visualizePadding(message: string): {
  originalBytes: number[];
  withOneBit: number[];
  withZeroPadding: number[];
  withLengthBits: number[];
} {
  const originalBytes = stringToUTF8Bytes(message);
  const messageBits = originalBytes.length * 8;
  
  // Step 1: Original bytes
  
  // Step 2: Append '1' bit (0x80 is 10000000 in binary)
  const withOneBit = [...originalBytes, 0x80];
  
  // Step 3: Pad with zeros until 448 mod 512
  const withZeroPadding = [...withOneBit];
  while ((withZeroPadding.length + 8) % 64 !== 0) {
    withZeroPadding.push(0);
  }
  
  // Step 4: Append 64-bit length
  const withLengthBits = [...withZeroPadding];
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
  withLengthBits.push(...lengthBytes);
  
  return {
    originalBytes,
    withOneBit,
    withZeroPadding,
    withLengthBits
  };
}

// Visualize bit operations
export function visualizeRotateRight(x: number, n: number): string {
  const binary = x.toString(2).padStart(32, '0');
  const rotated = (x >>> n | x << (32 - n)) >>> 0;
  const rotatedBinary = rotated.toString(2).padStart(32, '0');
  
  return `${binary} → ${rotatedBinary}`;
}

export function visualizeXOR(a: number, b: number): string {
  const aBinary = a.toString(2).padStart(32, '0');
  const bBinary = b.toString(2).padStart(32, '0');
  const result = (a ^ b) >>> 0;
  const resultBinary = result.toString(2).padStart(32, '0');
  
  return `${aBinary} ⊕ ${bBinary} = ${resultBinary}`;
}

export function visualizeAND(a: number, b: number): string {
  const aBinary = a.toString(2).padStart(32, '0');
  const bBinary = b.toString(2).padStart(32, '0');
  const result = (a & b) >>> 0;
  const resultBinary = result.toString(2).padStart(32, '0');
  
  return `${aBinary} ∧ ${bBinary} = ${resultBinary}`;
}

export function numberToHex(num: number): string {
  return num.toString(16).padStart(8, '0');
}

// Format for display
export function formatBinary(binary: string, groupSize: number = 8): string {
  // Remove spaces if they exist
  const cleanBinary = binary.replace(/\s/g, '');
  
  let result = '';
  for (let i = 0; i < cleanBinary.length; i += groupSize) {
    result += cleanBinary.slice(i, i + groupSize) + ' ';
  }
  
  return result.trim();
}
