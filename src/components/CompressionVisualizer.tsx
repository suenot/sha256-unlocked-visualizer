
import { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { numberToHex, visualizeXOR, visualizeAND } from '@/utils/bitOperations';
import { H_CONSTANTS, K_CONSTANTS } from '@/utils/sha256';
import { 
  Play, 
  Pause, 
  SkipBack, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';

// Sample data structure for visualization
interface RoundData {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  g: number;
  h: number;
  t1: number;
  t2: number;
  w: number;
  k: number;
  ch: number;
  maj: number;
  sigma0: number;
  sigma1: number;
}

const CompressionVisualizer = () => {
  const [round, setRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [roundData, setRoundData] = useState<RoundData[]>([]);
  
  // Generate some sample round data for visualization
  useEffect(() => {
    const generateSampleData = () => {
      const data: RoundData[] = [];
      let currentVars = [...H_CONSTANTS];
      
      for (let i = 0; i < 64; i++) {
        // This is simplified - in a real implementation, values would be computed based on the algorithm
        const [a, b, c, d, e, f, g, h] = currentVars;
        
        // Calculate some sample values - these would normally follow SHA-256 algorithm
        const ch = (e & f) ^ (~e & g);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const sigma0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        const sigma1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        const t1 = (h + sigma1 + ch + K_CONSTANTS[i] + (i * 1000)) >>> 0; // Sample W value as i*1000
        const t2 = (sigma0 + maj) >>> 0;
        
        data.push({
          a, b, c, d, e, f, g, h,
          t1, t2,
          ch, maj, sigma0, sigma1,
          w: i * 1000, // Sample message schedule word
          k: K_CONSTANTS[i]
        });
        
        // Update for next round (simplified)
        const newA = (t1 + t2) >>> 0;
        const newE = (d + t1) >>> 0;
        currentVars = [newA, a, b, c, newE, e, f, g];
      }
      
      return data;
    };
    
    setRoundData(generateSampleData());
  }, []);

  useEffect(() => {
    let timerId: number | null = null;
    
    if (isPlaying && round < 63) {
      timerId = window.setTimeout(() => {
        setRound(prev => prev + 1);
      }, 1000 / speed);
    } else if (round >= 63) {
      setIsPlaying(false);
    }
    
    return () => {
      if (timerId !== null) clearTimeout(timerId);
    };
  }, [isPlaying, round, speed]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setRound(0);
    setIsPlaying(false);
  };

  const handleStepBack = () => {
    if (round > 0) {
      setRound(round - 1);
    }
  };

  const handleStepForward = () => {
    if (round < 63) {
      setRound(round + 1);
    }
  };
  
  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };
  
  const currentRoundData = roundData[round] || {
    a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0,
    t1: 0, t2: 0, ch: 0, maj: 0, sigma0: 0, sigma1: 0, w: 0, k: 0
  };
  
  const workingVars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg space-y-6 mt-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h3 className="text-xl font-semibold">Compression Function (Round by Round)</h3>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium whitespace-nowrap">Animation Speed:</span>
          <Slider
            value={[speed]}
            min={0.5}
            max={3}
            step={0.5}
            onValueChange={handleSpeedChange}
            className="w-24"
          />
          <span className="text-sm">{speed}x</span>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Round:</span>
          <span className="text-sm font-bold">{round + 1} of 64</span>
        </div>
        
        <div className="flex-1">
          <Slider
            value={[round]}
            min={0}
            max={63}
            step={1}
            onValueChange={(value) => {
              setRound(value[0]);
              setIsPlaying(false);
            }}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            title="Reset"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleStepBack}
            disabled={round === 0}
            title="Previous Round"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handlePlayPause}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleStepForward}
            disabled={round === 63}
            title="Next Round"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Working Variables Visualization */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Working Variables (a-h)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {workingVars.map((v) => {
            const value = currentRoundData[v as keyof typeof currentRoundData] as number;
            return (
              <div key={v} className={`
                bg-white dark:bg-gray-700 p-4 rounded-md
                ${['a', 'e'].includes(v) ? 'ring-2 ring-blue-400 dark:ring-blue-500' : ''}
              `}>
                <div className="text-lg font-mono font-bold">{v}</div>
                <div className="text-sm font-mono mt-2 break-all">
                  0x{numberToHex(value)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {v === 'a' && "Updated: T₁ + T₂"}
                  {v === 'e' && "Updated: d + T₁"}
                  {['b', 'c', 'd', 'f', 'g', 'h'].includes(v) && `Shifted from ${
                    { 'b': 'a', 'c': 'b', 'd': 'c', 'f': 'e', 'g': 'f', 'h': 'g' }[v]
                  }`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Function Operations Visualization */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Round Operations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left column - Ch, Maj, Sigma0, Sigma1 functions */}
          <div className="space-y-4">
            <div 
              className={`bg-white dark:bg-gray-700 p-4 rounded-md cursor-pointer transition-all
                ${activeOperation === 'ch' ? 'ring-2 ring-purple-400' : 'hover:bg-gray-50 dark:hover:bg-gray-600'}`}
              onClick={() => setActiveOperation(activeOperation === 'ch' ? null : 'ch')}
            >
              <div className="flex justify-between items-center">
                <h5 className="font-semibold">Ch(e, f, g)</h5>
                <div className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 py-1 px-2 rounded">
                  Choose Function
                </div>
              </div>
              <p className="text-sm font-mono mt-2">(e & f) ^ (~e & g)</p>
              
              {activeOperation === 'ch' && (
                <div className="mt-3 text-sm border-t pt-2 dark:border-gray-600">
                  <p>The Choose function selects bits from f or g based on e:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-xs">
                    <li>If a bit in e is 1, choose the corresponding bit from f</li>
                    <li>If a bit in e is 0, choose the corresponding bit from g</li>
                  </ul>
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded mt-2">
                    <p className="text-xs font-mono">
                      Result: 0x{numberToHex(currentRoundData.ch)}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div 
              className={`bg-white dark:bg-gray-700 p-4 rounded-md cursor-pointer transition-all
                ${activeOperation === 'maj' ? 'ring-2 ring-green-400' : 'hover:bg-gray-50 dark:hover:bg-gray-600'}`}
              onClick={() => setActiveOperation(activeOperation === 'maj' ? null : 'maj')}
            >
              <div className="flex justify-between items-center">
                <h5 className="font-semibold">Maj(a, b, c)</h5>
                <div className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 py-1 px-2 rounded">
                  Majority Function
                </div>
              </div>
              <p className="text-sm font-mono mt-2">(a & b) ^ (a & c) ^ (b & c)</p>
              
              {activeOperation === 'maj' && (
                <div className="mt-3 text-sm border-t pt-2 dark:border-gray-600">
                  <p>The Majority function selects bits based on majority vote:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-xs">
                    <li>For each position, if the majority of a, b, c is 1, output 1</li>
                    <li>Otherwise output 0</li>
                  </ul>
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded mt-2">
                    <p className="text-xs font-mono">
                      Result: 0x{numberToHex(currentRoundData.maj)}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div 
              className={`bg-white dark:bg-gray-700 p-4 rounded-md cursor-pointer transition-all
                ${activeOperation === 'sigma0' ? 'ring-2 ring-blue-400' : 'hover:bg-gray-50 dark:hover:bg-gray-600'}`}
              onClick={() => setActiveOperation(activeOperation === 'sigma0' ? null : 'sigma0')}
            >
              <div className="flex justify-between items-center">
                <h5 className="font-semibold">Σ₀(a)</h5>
                <div className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 py-1 px-2 rounded">
                  Rotation Mix
                </div>
              </div>
              <p className="text-sm font-mono mt-2">(a ⋙ 2) ^ (a ⋙ 13) ^ (a ⋙ 22)</p>
              
              {activeOperation === 'sigma0' && (
                <div className="mt-3 text-sm border-t pt-2 dark:border-gray-600">
                  <p>Mixes the bits of a using three different rotations:</p>
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded mt-2">
                    <p className="text-xs font-mono">
                      Result: 0x{numberToHex(currentRoundData.sigma0)}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div 
              className={`bg-white dark:bg-gray-700 p-4 rounded-md cursor-pointer transition-all
                ${activeOperation === 'sigma1' ? 'ring-2 ring-red-400' : 'hover:bg-gray-50 dark:hover:bg-gray-600'}`}
              onClick={() => setActiveOperation(activeOperation === 'sigma1' ? null : 'sigma1')}
            >
              <div className="flex justify-between items-center">
                <h5 className="font-semibold">Σ₁(e)</h5>
                <div className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 py-1 px-2 rounded">
                  Rotation Mix
                </div>
              </div>
              <p className="text-sm font-mono mt-2">(e ⋙ 6) ^ (e ⋙ 11) ^ (e ⋙ 25)</p>
              
              {activeOperation === 'sigma1' && (
                <div className="mt-3 text-sm border-t pt-2 dark:border-gray-600">
                  <p>Mixes the bits of e using three different rotations:</p>
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded mt-2">
                    <p className="text-xs font-mono">
                      Result: 0x{numberToHex(currentRoundData.sigma1)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right column - T₁, T₂ calculation and variable updates */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-md">
              <h5 className="font-semibold mb-2">T₁ Calculation</h5>
              <div className="space-y-1 font-mono text-sm">
                <p>T₁ = h + Σ₁(e) + Ch(e,f,g) + K[round] + W[round]</p>
                <div className="text-xs mt-2 space-y-1">
                  <p>h = 0x{numberToHex(currentRoundData.h)}</p>
                  <p>Σ₁(e) = 0x{numberToHex(currentRoundData.sigma1)}</p>
                  <p>Ch(e,f,g) = 0x{numberToHex(currentRoundData.ch)}</p>
                  <p>K[{round}] = 0x{numberToHex(currentRoundData.k)}</p>
                  <p>W[{round}] = 0x{numberToHex(currentRoundData.w)}</p>
                </div>
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="font-bold">T₁ = 0x{numberToHex(currentRoundData.t1)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-4 rounded-md">
              <h5 className="font-semibold mb-2">T₂ Calculation</h5>
              <div className="space-y-1 font-mono text-sm">
                <p>T₂ = Σ₀(a) + Maj(a,b,c)</p>
                <div className="text-xs mt-2 space-y-1">
                  <p>Σ₀(a) = 0x{numberToHex(currentRoundData.sigma0)}</p>
                  <p>Maj(a,b,c) = 0x{numberToHex(currentRoundData.maj)}</p>
                </div>
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="font-bold">T₂ = 0x{numberToHex(currentRoundData.t2)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-4 rounded-md">
              <h5 className="font-semibold mb-2">Variable Updates</h5>
              <div className="space-y-1 font-mono text-xs">
                <p>h = g</p>
                <p>g = f</p>
                <p>f = e</p>
                <p className="bg-blue-50 dark:bg-blue-900/30 p-1 rounded">e = d + T₁</p>
                <p>d = c</p>
                <p>c = b</p>
                <p>b = a</p>
                <p className="bg-green-50 dark:bg-green-900/30 p-1 rounded">a = T₁ + T₂</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-4 rounded-md">
              <h5 className="font-semibold mb-2">Round Message Word & Constant</h5>
              <div className="flex justify-between text-xs">
                <div>
                  <p className="font-medium">Message Word W[{round}]:</p>
                  <p className="font-mono">0x{numberToHex(currentRoundData.w)}</p>
                </div>
                <div>
                  <p className="font-medium">Round Constant K[{round}]:</p>
                  <p className="font-mono">0x{numberToHex(currentRoundData.k)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-4 border-t pt-4 dark:border-gray-700">
        <p>Note: This visualization demonstrates the SHA-256 compression function process. Use the controls to step through each of the 64 rounds and see how working variables are updated.</p>
      </div>
    </div>
  );
};

export default CompressionVisualizer;
