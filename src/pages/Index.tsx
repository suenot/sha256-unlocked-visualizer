
import { useState } from 'react';
import { sha256, H_CONSTANTS, K_CONSTANTS } from '@/utils/sha256';
import { bytesToBinary, hexToBinary, numberToHex } from '@/utils/bitOperations';
import { Textarea } from "@/components/ui/textarea";
import PreprocessingVisualizer from '@/components/PreprocessingVisualizer';
import MessageScheduleVisualizer from '@/components/MessageScheduleVisualizer';
import CompressionVisualizer from '@/components/CompressionVisualizer';

const SHA256Visualizer = () => {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [binaryInput, setBinaryInput] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showBinary, setShowBinary] = useState(true);

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
    <div className="container mx-auto p-4 lg:p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-center">
        SHA-256 Interactive Visualizer
      </h1>
      
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        <div>
          <label htmlFor="input" className="block text-xl mb-4">
            Enter Text to Hash
          </label>
          <Textarea 
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
                <code className="text-xs">{binaryInput}</code>
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl mb-4">Hash Result</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <div className="mb-4">
              <strong>SHA-256 Hash:</strong>
              <p className="break-all text-blue-600 dark:text-blue-400 font-mono">{hash}</p>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <span>View:</span>
              <button 
                onClick={() => setShowBinary(!showBinary)} 
                className="px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm"
              >
                {showBinary ? "Show Hex" : "Show Binary"}
              </button>
            </div>
            <div className="mt-2">
              <p className="break-all text-sm text-green-600 dark:text-green-400 font-mono">
                {showBinary ? hexToBinary(hash) : hash}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Algorithm Visualization Tabs */}
      <div className="mt-12">
        <h2 className="text-2xl mb-6">SHA-256 Algorithm Visualization</h2>
        
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-4">
            <button
              className={`py-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'preprocessing' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('preprocessing')}
            >
              1. Preprocessing
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'schedule' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('schedule')}
            >
              2. Message Schedule
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'compression' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('compression')}
            >
              3. Compression
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'constants' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('constants')}
            >
              Constants
            </button>
          </nav>
        </div>
        
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">SHA-256 Algorithm Overview</h3>
              <p className="mb-4">
                The SHA-256 algorithm takes an input message and produces a 256-bit (32-byte) hash value. 
                The process involves several key steps:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  <strong>Preprocessing</strong>: Pad the message to ensure its length is a multiple of 512 bits.
                </li>
                <li>
                  <strong>Message Schedule</strong>: Break the message into blocks and prepare 64 words for each block.
                </li>
                <li>
                  <strong>Compression Function</strong>: Process each block through 64 rounds of operations to update the hash values.
                </li>
                <li>
                  <strong>Final Hash</strong>: Concatenate the final hash values to produce the 256-bit digest.
                </li>
              </ol>
              <p className="mt-4">
                Use the tabs above to explore each step in detail with interactive visualizations.
              </p>
            </div>
          )}
          
          {activeTab === 'preprocessing' && input && (
            <PreprocessingVisualizer message={input} />
          )}
          
          {activeTab === 'schedule' && input && (
            <MessageScheduleVisualizer message={input} />
          )}
          
          {activeTab === 'compression' && (
            <CompressionVisualizer />
          )}
          
          {activeTab === 'constants' && (
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">SHA-256 Constants</h3>
              
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-3">Initial Hash Values (H₀-H₇)</h4>
                <p className="mb-2 text-sm">First 32 bits of the fractional parts of the square roots of the first 8 primes.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {H_CONSTANTS.map((value, i) => (
                    <div key={i} className="bg-white dark:bg-gray-700 p-3 rounded-md">
                      <div className="text-sm font-semibold">H{i}</div>
                      <div className="font-mono text-xs">0x{numberToHex(value)}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-3">Round Constants (K₀-K₆₃)</h4>
                <p className="mb-2 text-sm">First 32 bits of the fractional parts of the cube roots of the first 64 primes.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 max-h-96 overflow-y-auto">
                  {K_CONSTANTS.slice(0, 16).map((value, i) => (
                    <div key={i} className="bg-white dark:bg-gray-700 p-3 rounded-md">
                      <div className="text-sm font-semibold">K{i}</div>
                      <div className="font-mono text-xs">0x{numberToHex(value)}</div>
                    </div>
                  ))}
                  <div className="col-span-2 md:col-span-4 text-center text-gray-500 italic">
                    (showing first 16 of 64 constants)
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab !== 'overview' && !input && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-800 dark:text-yellow-200">
                Enter some text in the input field above to see the visualization.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SHA256Visualizer;
