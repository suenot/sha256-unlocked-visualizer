
import { useState } from 'react';
import { sha256 } from '@/utils/sha256';
import { bytesToHex, hexToBinary } from '@/utils/bitOperations';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { X, Plus } from 'lucide-react';

type ComparisonEntry = {
  id: number;
  text: string;
  hash: string;
};

const HashComparisonVisualizer = () => {
  const [entries, setEntries] = useState<ComparisonEntry[]>([
    { id: 1, text: "hello", hash: sha256("hello") },
    { id: 2, text: "Hello", hash: sha256("Hello") }
  ]);
  const [newText, setNewText] = useState("");
  const [showBinary, setShowBinary] = useState(false);
  const [selectedBits, setSelectedBits] = useState<{index: number, bit: number}[]>([]);

  const addNewEntry = () => {
    if (newText.trim()) {
      const newEntry = {
        id: Date.now(),
        text: newText.trim(),
        hash: sha256(newText.trim())
      };
      setEntries([...entries, newEntry]);
      setNewText("");
    }
  };

  const removeEntry = (id: number) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const calculateMatchingBits = (hash1: string, hash2: string): number => {
    const bin1 = hexToBinary(hash1).replace(/\s/g, '');
    const bin2 = hexToBinary(hash2).replace(/\s/g, '');
    let matchCount = 0;
    
    for (let i = 0; i < bin1.length; i++) {
      if (bin1[i] === bin2[i]) matchCount++;
    }
    
    return matchCount;
  };

  const toggleBit = (index: number, bit: number) => {
    const existingSelection = selectedBits.findIndex(
      s => s.index === index && s.bit === bit
    );
    
    if (existingSelection >= 0) {
      setSelectedBits(selectedBits.filter((_, i) => i !== existingSelection));
    } else {
      setSelectedBits([...selectedBits, { index, bit }]);
    }
  };

  const formatHash = (hash: string, highlight: number | null = null) => {
    if (showBinary) {
      const binary = hexToBinary(hash);
      return binary.split(' ').map((group, i) => (
        <span 
          key={i} 
          className={highlight === i ? 'bg-yellow-200 dark:bg-yellow-800' : ''}
        >
          {group}{' '}
        </span>
      ));
    } else {
      return hash.split('').map((char, i) => (
        <span 
          key={i} 
          className={highlight === Math.floor(i / 8) ? 'bg-yellow-200 dark:bg-yellow-800' : ''}
        >
          {char}
        </span>
      ));
    }
  };

  const renderHashComparison = () => {
    if (entries.length < 2) {
      return <p className="text-center text-gray-500 my-4">Add at least 2 entries to compare hashes</p>;
    }

    const referenceHash = entries[0].hash;
    
    return (
      <div className="space-y-6 mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Input</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hash</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matching Bits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {entries.map((entry) => {
                const matchingBits = calculateMatchingBits(referenceHash, entry.hash);
                const matchPercentage = ((matchingBits / 256) * 100).toFixed(2);
                
                return (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 whitespace-nowrap flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeEntry(entry.id)}
                        disabled={entries.length <= 1}
                        className="h-6 w-6 p-0 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <span>{entry.text}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs break-all">
                      {formatHash(entry.hash)}
                    </td>
                    <td className="px-4 py-3">
                      {entry.id === entries[0].id ? (
                        <span className="text-green-600 font-semibold">Reference</span>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${matchPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{matchPercentage}%</span>
                          </div>
                          <div className="text-xs mt-1">
                            {matchingBits} / 256 bits match
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {entries.length === 2 && (
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 mt-4">
            <h4 className="text-lg font-semibold mb-2">Bit-by-Bit Comparison</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {showBinary ? "Binary format: Each character represents 1 bit" : "Hex format: Each character represents 4 bits"}
            </p>
            
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center">
                <div className="w-16">Input 1:</div>
                <div>{entries[0].text}</div>
              </div>
              <div className="flex items-center">
                <div className="w-16">Hash 1:</div>
                <div className="break-all">{formatHash(entries[0].hash)}</div>
              </div>
              <div className="flex items-center mt-2">
                <div className="w-16">Input 2:</div>
                <div>{entries[1].text}</div>
              </div>
              <div className="flex items-center">
                <div className="w-16">Hash 2:</div>
                <div className="break-all">{formatHash(entries[1].hash)}</div>
              </div>
              
              <div className="pt-4 mt-2 border-t dark:border-gray-600">
                <div className="flex items-center">
                  <div className="w-16">Diff:</div>
                  <div className="break-all">
                    {showBinary 
                      ? hexToBinary(entries[0].hash).split('').map((bit, i) => (
                          <span key={i} className={
                            bit === hexToBinary(entries[1].hash).split('')[i] 
                              ? 'text-green-500 dark:text-green-400' 
                              : 'text-red-500 dark:text-red-400 font-bold'
                          }>
                            {bit === ' ' ? ' ' : bit === hexToBinary(entries[1].hash).split('')[i] ? '.' : bit}
                          </span>
                        ))
                      : entries[0].hash.split('').map((char, i) => (
                          <span key={i} className={
                            char === entries[1].hash[i] 
                              ? 'text-green-500 dark:text-green-400' 
                              : 'text-red-500 dark:text-red-400 font-bold'
                          }>
                            {char === entries[1].hash[i] ? '.' : char}
                          </span>
                        ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg space-y-4 mt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Hash Comparison</h3>
        <Button
          onClick={() => setShowBinary(!showBinary)}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Show {showBinary ? "Hex" : "Binary"}
        </Button>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm">
          Compare SHA-256 hashes for different inputs to visualize how small changes in input produce completely different hash values.
        </p>
        
        <div className="flex items-center gap-2">
          <Input 
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Enter text to hash..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') addNewEntry();
            }}
          />
          <Button onClick={addNewEntry} disabled={!newText.trim()}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>
      
      {renderHashComparison()}
      
      <div className="pt-4 mt-2 border-t dark:border-gray-600">
        <h4 className="text-lg font-medium mb-2">Avalanche Effect</h4>
        <p className="text-sm">
          The avalanche effect is a desirable property of cryptographic algorithms where a small change in input results in a significantly different output.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-3">
          <p className="text-sm">
            Try changing a single character in one of the inputs (e.g., "hello" to "helli") and observe how the resulting hash is completely different, with approximately 50% of bits changing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HashComparisonVisualizer;
