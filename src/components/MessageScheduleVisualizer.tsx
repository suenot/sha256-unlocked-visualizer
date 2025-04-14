
import { useState } from 'react';

interface MessageScheduleVisualizerProps {
  message: string;
}

const MessageScheduleVisualizer = ({ message }: MessageScheduleVisualizerProps) => {
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  
  // In a real implementation, this would calculate the actual message schedule
  // For demonstration purposes, we're using placeholder data
  const words = Array(64).fill(0).map((_, i) => ({
    index: i,
    value: `W${i}`,
    description: i < 16 
      ? `Direct from message block` 
      : `W${i} = σ₁(W${i-2}) + W${i-7} + σ₀(W${i-15}) + W${i-16}`
  }));
  
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg space-y-4 mt-6">
      <h3 className="text-xl font-semibold mb-4">Message Schedule (W₀ to W₆₃)</h3>
      
      <div className="grid grid-cols-8 gap-2">
        {words.map((word, index) => (
          <div 
            key={index}
            className={`
              p-2 rounded-md text-center cursor-pointer transition-colors
              ${selectedWord === index 
                ? 'bg-blue-500 text-white' 
                : 'bg-white dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600'}
            `}
            onClick={() => setSelectedWord(index)}
          >
            <span className="text-xs font-mono">{word.value}</span>
          </div>
        ))}
      </div>
      
      {selectedWord !== null && (
        <div className="bg-white dark:bg-gray-700 p-4 rounded-md mt-4">
          <h4 className="font-semibold mb-2">Word W{selectedWord}</h4>
          <p className="text-sm">{words[selectedWord].description}</p>
          
          {selectedWord >= 16 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-mono">Calculation:</p>
              <div className="text-xs font-mono">
                <p>σ₁(W{selectedWord-2}) = (W{selectedWord-2} ⋙ 17) ⊕ (W{selectedWord-2} ⋙ 19) ⊕ (W{selectedWord-2} ≫ 10)</p>
                <p>σ₀(W{selectedWord-15}) = (W{selectedWord-15} ⋙ 7) ⊕ (W{selectedWord-15} ⋙ 18) ⊕ (W{selectedWord-15} ≫ 3)</p>
                <p className="mt-2">W{selectedWord} = σ₁(W{selectedWord-2}) + W{selectedWord-7} + σ₀(W{selectedWord-15}) + W{selectedWord-16}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageScheduleVisualizer;
