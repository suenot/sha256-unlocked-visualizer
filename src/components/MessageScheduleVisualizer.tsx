
import { useState, useEffect } from 'react';
import { createMessageSchedule } from '@/utils/sha256';
import { numberToHex } from '@/utils/bitOperations';

interface MessageScheduleVisualizerProps {
  message: string;
}

const MessageScheduleVisualizer = ({ message }: MessageScheduleVisualizerProps) => {
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [messageSchedule, setMessageSchedule] = useState<number[]>([]);
  const [showHex, setShowHex] = useState(true);
  
  useEffect(() => {
    if (message) {
      // In a real application, you would get the preprocessed message blocks
      // For simplicity, we're using just the first block
      const encoder = new TextEncoder();
      const messageBytes = Array.from(encoder.encode(message));
      
      // Pad the array to 64 bytes (512 bits) for demonstration purposes
      const paddedBytes = [...messageBytes];
      if (paddedBytes.length > 64) {
        paddedBytes.splice(64); // Truncate to 64 bytes for visualization
      } else {
        // Add padding - simplified for demonstration
        paddedBytes.push(0x80); // Append 1 bit
        while (paddedBytes.length < 64) {
          paddedBytes.push(0);
        }
      }
      
      // Generate message schedule for the block
      const schedule = createMessageSchedule(paddedBytes);
      setMessageSchedule(schedule);
    }
  }, [message]);
  
  const getWordDescription = (index: number): string => {
    if (index < 16) {
      return `Direct from message block (32-bit word ${index})`;
    } else {
      return `W${index} = σ₁(W${index-2}) + W${index-7} + σ₀(W${index-15}) + W${index-16}`;
    }
  };
  
  const formatWord = (word: number): string => {
    return showHex ? `0x${numberToHex(word)}` : `${word.toString()}`;
  };
  
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg space-y-4 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Message Schedule (W₀ to W₆₃)</h3>
        <button
          onClick={() => setShowHex(!showHex)}
          className="px-3 py-1 text-xs rounded-md bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
        >
          {showHex ? "Show Decimal" : "Show Hex"}
        </button>
      </div>
      
      <div className="grid grid-cols-8 gap-2">
        {messageSchedule.map((word, index) => (
          <div 
            key={index}
            className={`
              p-2 rounded-md text-center cursor-pointer transition-colors
              ${selectedWord === index 
                ? 'bg-blue-500 text-white' 
                : 'bg-white dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600'}
              ${index < 16 ? 'ring-1 ring-green-500' : ''}
              ${index >= 16 && index < 32 ? 'ring-1 ring-blue-500' : ''}
              ${index >= 32 && index < 48 ? 'ring-1 ring-purple-500' : ''}
              ${index >= 48 ? 'ring-1 ring-red-500' : ''}
            `}
            onClick={() => setSelectedWord(index)}
          >
            <div className="text-xs font-mono truncate">W<sub>{index}</sub></div>
            <div className="text-xs font-mono mt-1 truncate">{formatWord(word)}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-2 text-xs flex space-x-4">
        <span className="flex items-center"><span className="inline-block w-3 h-3 bg-green-500 mr-1 rounded-sm"></span> Words 0-15 (Direct)</span>
        <span className="flex items-center"><span className="inline-block w-3 h-3 bg-blue-500 mr-1 rounded-sm"></span> Words 16-31</span>
        <span className="flex items-center"><span className="inline-block w-3 h-3 bg-purple-500 mr-1 rounded-sm"></span> Words 32-47</span>
        <span className="flex items-center"><span className="inline-block w-3 h-3 bg-red-500 mr-1 rounded-sm"></span> Words 48-63</span>
      </div>
      
      {selectedWord !== null && (
        <div className="bg-white dark:bg-gray-700 p-4 rounded-md mt-4">
          <h4 className="font-semibold mb-2">Word W{selectedWord}</h4>
          <p className="text-sm mb-2">{getWordDescription(selectedWord)}</p>
          <div className="text-sm font-mono bg-gray-50 dark:bg-gray-900 p-3 rounded">
            <div>Value: {formatWord(messageSchedule[selectedWord] || 0)}</div>
          </div>
          
          {selectedWord >= 16 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Calculation:</p>
              <div className="text-xs font-mono bg-gray-50 dark:bg-gray-900 p-3 rounded space-y-2">
                <p className="border-b pb-2 dark:border-gray-700">
                  <span className="font-bold">σ₁(W{selectedWord-2})</span> = (W{selectedWord-2} ⋙ 17) ⊕ (W{selectedWord-2} ⋙ 19) ⊕ (W{selectedWord-2} ≫ 10)
                </p>
                <p className="border-b pb-2 dark:border-gray-700">
                  <span className="font-bold">σ₀(W{selectedWord-15})</span> = (W{selectedWord-15} ⋙ 7) ⊕ (W{selectedWord-15} ⋙ 18) ⊕ (W{selectedWord-15} ≫ 3)
                </p>
                <p className="border-b pb-2 dark:border-gray-700">
                  <span className="font-bold">W{selectedWord-16}</span> = {formatWord(messageSchedule[selectedWord-16] || 0)}
                </p>
                <p className="border-b pb-2 dark:border-gray-700">
                  <span className="font-bold">W{selectedWord-7}</span> = {formatWord(messageSchedule[selectedWord-7] || 0)}
                </p>
                <p className="mt-2 pt-1 font-bold">
                  W{selectedWord} = σ₁(W{selectedWord-2}) + W{selectedWord-7} + σ₀(W{selectedWord-15}) + W{selectedWord-16} = {formatWord(messageSchedule[selectedWord] || 0)}
                </p>
              </div>
            </div>
          )}
          
          {selectedWord < 16 && (
            <div className="mt-4">
              <p className="text-sm font-medium">Source:</p>
              <div className="text-xs font-mono bg-gray-50 dark:bg-gray-900 p-3 rounded">
                <p>This word comes directly from the padded message block</p>
                <p className="mt-2">Byte positions {selectedWord * 4} to {(selectedWord * 4) + 3}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageScheduleVisualizer;
