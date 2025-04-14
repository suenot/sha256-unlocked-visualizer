
import { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { visualizePadding, bytesToBinary } from '@/utils/bitOperations';

interface PreprocessingVisualizerProps {
  message: string;
}

const PreprocessingVisualizer = ({ message }: PreprocessingVisualizerProps) => {
  const [step, setStep] = useState(0);
  const paddingSteps = visualizePadding(message);
  
  const stepLabels = [
    "Original Message (UTF-8)",
    "Append '1' Bit",
    "Add '0' Bits Until 448 mod 512",
    "Append 64-bit Length"
  ];
  
  const getStepData = () => {
    switch(step) {
      case 0:
        return {
          bytes: paddingSteps.originalBytes,
          description: "The original message is first converted to UTF-8 bytes."
        };
      case 1:
        return {
          bytes: paddingSteps.withOneBit,
          description: "A single '1' bit is appended (as a byte with the most significant bit set: 10000000)."
        };
      case 2:
        return {
          bytes: paddingSteps.withZeroPadding,
          description: "Padding with '0' bits until the message length is 448 bits (mod 512)."
        };
      case 3:
        return {
          bytes: paddingSteps.withLengthBits,
          description: "The original message length (in bits) is appended as a 64-bit big-endian integer."
        };
      default:
        return { bytes: [], description: "" };
    }
  };
  
  const stepData = getStepData();
  
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg space-y-4 mt-6">
      <h3 className="text-xl font-semibold mb-4">Preprocessing Visualization</h3>
      
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Step {step + 1}:</span>
          <span className="text-sm font-bold">{stepLabels[step]}</span>
        </div>
        
        <Slider
          value={[step]}
          min={0}
          max={3}
          step={1}
          onValueChange={(value) => setStep(value[0])}
          className="w-full"
        />
        
        <div className="bg-white dark:bg-gray-700 p-4 rounded-md">
          <p className="text-sm mb-4">{stepData.description}</p>
          <div className="overflow-x-auto">
            <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded font-mono whitespace-pre-wrap">
              {bytesToBinary(stepData.bytes)}
            </pre>
          </div>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Bytes: {stepData.bytes.length} | Bits: {stepData.bytes.length * 8}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreprocessingVisualizer;
