
import { useState } from 'react';
import { sha256 } from '@/utils/sha256';
import { bytesToBinary, hexToBinary } from '@/utils/bitOperations';

const SHA256Visualizer = () => {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [binaryInput, setBinaryInput] = useState('');
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;
    setInput(newInput);
    
    // Compute hash
    const computedHash = sha256(newInput);
    setHash(computedHash);
    
    // Convert input to binary
    const utf8Bytes = new TextEncoder().encode(newInput);
    setBinaryInput(bytesToBinary(Array.from(utf8Bytes)));
  };

  return (
    <div className="container mx-auto p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">
        SHA-256 Interactive Visualizer
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="input" className="block text-xl mb-4">
            Enter Text to Hash
          </label>
          <textarea 
            id="input"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="w-full p-4 border rounded-lg bg-gray-100 dark:bg-gray-800"
            rows={6}
          />
          
          <div className="mt-6">
            <h2 className="text-2xl mb-4">Input Details</h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p><strong>Length:</strong> {input.length} characters</p>
              <p className="mt-2 break-words">
                <strong>Binary Representation:</strong><br />
                {binaryInput}
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl mb-4">Hash Result</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <div className="mb-4">
              <strong>SHA-256 Hash:</strong>
              <p className="break-all text-blue-600 dark:text-blue-400">{hash}</p>
            </div>
            <div>
              <strong>Binary Hash:</strong>
              <p className="break-all text-sm text-green-600 dark:text-green-400">
                {hexToBinary(hash)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Future: Add detailed processing steps visualization */}
    </div>
  );
};

export default SHA256Visualizer;
