
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
