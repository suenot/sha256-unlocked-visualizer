
import { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { numberToHex } from '@/utils/bitOperations';
import { H_CONSTANTS } from '@/utils/sha256';

const CompressionVisualizer = () => {
  const [round, setRound] = useState(0);
  
  // This would normally be calculated dynamically based on actual algorithm execution
  // For demonstration purposes, we're using sample data
  const sampleRoundData = [
    { 
      a: 0x6a09e667, b: 0xbb67ae85, c: 0x3c6ef372, d: 0xa54ff53a,
      e: 0x510e527f, f: 0x9b05688c, g: 0x1f83d9ab, h: 0x5be0cd19,
      t1: 0, t2: 0, w: 0, k: 0x428a2f98
    },
    // Additional rounds would be added here in a real implementation
  ];
  
  const workingVars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg space-y-4 mt-6">
      <h3 className="text-xl font-semibold mb-4">Compression Function (Round by Round)</h3>
      
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Round:</span>
          <span className="text-sm font-bold">{round + 1} of 64</span>
        </div>
        
        <Slider
          value={[round]}
          min={0}
          max={63}
          step={1}
          onValueChange={(value) => setRound(value[0])}
          className="w-full"
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {workingVars.map((v) => (
            <div key={v} className="bg-white dark:bg-gray-700 p-4 rounded-md">
              <div className="text-lg font-mono font-bold">{v}</div>
              <div className="text-sm font-mono mt-2">
                0x{numberToHex(sampleRoundData[0][v as keyof typeof sampleRoundData[0]] as number)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-4 rounded-md mt-6">
          <h4 className="text-lg font-semibold mb-2">Round Operations</h4>
          <div className="space-y-2 font-mono text-sm">
            <p>T₁ = h + Σ₁(e) + Ch(e,f,g) + K[round] + W[round]</p>
            <p>T₂ = Σ₀(a) + Maj(a,b,c)</p>
            <p className="mt-4">h = g</p>
            <p>g = f</p>
            <p>f = e</p>
            <p>e = d + T₁</p>
            <p>d = c</p>
            <p>c = b</p>
            <p>b = a</p>
            <p>a = T₁ + T₂</p>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          <p>Note: This is a simplified visualization. In a complete implementation, actual values would be computed in real-time.</p>
        </div>
      </div>
    </div>
  );
};

export default CompressionVisualizer;
