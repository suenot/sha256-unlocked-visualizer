import { Code } from 'lucide-react';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const AlgorithmDiagrams = () => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize mermaid with configuration
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'sans-serif',
      flowchart: {
        htmlLabels: true,
        curve: 'linear',
      },
    });
    
    // Render all diagrams
    mermaid.run();
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg space-y-8" ref={mermaidRef}>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Code className="h-5 w-5" />
        SHA-256 Algorithm Flow
      </h3>

      <div className="space-y-6">
        {/* Overview Flow */}
        <div>
          <h4 className="text-lg font-medium mb-3">High-Level Overview</h4>
          <div className="mermaid">
            {`
            flowchart TD
              Input[Input Message] --> Preprocess[Preprocessing]
              Preprocess --> Schedule[Message Schedule]
              Schedule --> Compress[Compression Function]
              Compress --> Hash[Final Hash]
              
              style Input fill:#f9f,stroke:#333,stroke-width:2px
              style Hash fill:#9f9,stroke:#333,stroke-width:2px
            `}
          </div>
        </div>

        {/* Detailed Main Process */}
        <div>
          <h4 className="text-lg font-medium mb-3">Detailed SHA-256 Process Flow</h4>
          <div className="mermaid">
            {`
            flowchart TD
                subgraph "SHA256MainProcess"
                direction TD
                A[Input Message] --> B[Preprocessing]
                B --> C[Initialize Hash Values]
                C --> D[Process Message Blocks]
                D --> E[Produce Final Hash]
                end
                
                subgraph "Preprocessing"
                direction TD
                B1[Pad Message] --> B2[Split into Blocks]
                B2 --> B3[Prepare Message Schedule]
                end
                
                subgraph "ProcessMessageBlocks"
                direction TD
                D1[Initialize Working Variables a-h] --> D2[Main Compression Loop]
                D2 --> D3[Update Hash Values]
                D3 --> D4{More Blocks?}
                D4 -->|Yes| D1
                D4 -->|No| E
                end
                
                subgraph "MainCompressionLoop"
                direction TD
                R1[Round 1] --> R2[Round 2]
                R2 --> R3[Round 3]
                R3 --> R4[...]
                R4 --> R64[Round 64]
                end
            `}
          </div>
        </div>

        {/* Preprocessing */}
        <div>
          <h4 className="text-lg font-medium mb-3">Message Preprocessing</h4>
          <div className="mermaid">
            {`
            flowchart LR
              M[Message] --> B[Convert to Binary]
              B --> P1[Append 1 bit]
              P1 --> P0[Pad with 0s]
              P0 --> L[Append Length]
              
              style M fill:#f9f,stroke:#333,stroke-width:2px
              style L fill:#9f9,stroke:#333,stroke-width:2px
            `}
          </div>
        </div>

        {/* Message Schedule */}
        <div>
          <h4 className="text-lg font-medium mb-3">Message Schedule Generation</h4>
          <div className="mermaid">
            {`
            flowchart TD
              Block[512-bit Block] --> Split[Split into 16 Words]
              Split --> W0["W0-W15<br>Direct from Block"]
              Split --> Extend["W16-W63<br>Extended Words"]
              
              subgraph Extension
              direction TD
              Extend --> Calculate["Wi = σ1(Wi-2) + Wi-7<br>+ σ0(Wi-15) + Wi-16"]
              end
              
              style Block fill:#f9f,stroke:#333,stroke-width:2px
              style Calculate fill:#9f9,stroke:#333,stroke-width:2px
            `}
          </div>
        </div>

        {/* Detailed Message Schedule */}
        <div>
          <h4 className="text-lg font-medium mb-3">Detailed Message Schedule Expansion</h4>
          <div className="mermaid">
            {`
            flowchart TD
                subgraph MessageScheduleExpansion
                direction TD
                A[16 Words from Message Block] --> B[Extend to 64 Words]
                B --> C{For i = 16 to 63}
                C --> D["W[i] = sigma1(W[i-2]) + W[i-7]<br>+ sigma0(W[i-15]) + W[i-16]"]
                D --> C
                end
                
                subgraph sigma0Function
                direction TD
                s01[ROTR 7] --> s04[XOR]
                s02[ROTR 18] --> s04
                s03[SHR 3] --> s04
                end
                
                subgraph sigma1Function
                direction TD
                s11[ROTR 17] --> s14[XOR]
                s12[ROTR 19] --> s14
                s13[SHR 10] --> s14
                end
                
                style A fill:#f9f,stroke:#333,stroke-width:2px
                style D fill:#bbf,stroke:#333,stroke-width:2px
            `}
          </div>
        </div>

        {/* Compression Function */}
        <div>
          <h4 className="text-lg font-medium mb-3">Compression Function</h4>
          <div className="mermaid">
            {`
            flowchart TD
              subgraph EachRound
              direction TD
              T1["T1 = h + Σ1(e) + Ch(e,f,g) + Kt + Wt"] 
              T2["T2 = Σ0(a) + Maj(a,b,c)"]
              T1 --> Update[Update a-h variables]
              T2 --> Update
              end
              
              Init[Initialize a-h] --> Round[Process Round]
              Round --> Next[Next Round]
              Next -->|After 64 rounds| Final[Update Hash Values]
              
              style Init fill:#f9f,stroke:#333,stroke-width:2px
              style Final fill:#9f9,stroke:#333,stroke-width:2px
            `}
          </div>
        </div>

        {/* Single Round Detailed */}
        <div>
          <h4 className="text-lg font-medium mb-3">Single Round Detailed</h4>
          <div className="mermaid">
            {`
            flowchart TD
                subgraph SingleRound
                direction TD
                A["a,b,c,d,e,f,g,h"] --> B["Ch Function: e,f,g"]
                A --> C["Maj Function: a,b,c"]
                A --> D["Sigma0: a"]
                A --> E["Sigma1: e"]
                
                B --> F[Compression]
                C --> F
                D --> F
                E --> F
                
                F --> G["New a,b,c,d,e,f,g,h"]
                end
                
                subgraph ChFunction
                direction TD
                CH1["e AND f"] --> CH3[XOR]
                CH2["NOT e AND g"] --> CH3
                end
                
                subgraph MajFunction
                direction TD
                MAJ1["a AND b"] --> MAJ4[XOR]
                MAJ2["a AND c"] --> MAJ4
                MAJ3["b AND c"] --> MAJ4
                end
                
                subgraph Sigma0Function
                direction TD
                S01["ROTR 2"] --> S04[XOR]
                S02["ROTR 13"] --> S04
                S03["ROTR 22"] --> S04
                end
                
                subgraph Sigma1Function
                direction TD
                S11["ROTR 6"] --> S14[XOR]
                S12["ROTR 11"] --> S14
                S13["ROTR 25"] --> S14
                end
            `}
          </div>
        </div>

        {/* Bit Operations */}
        <div>
          <h4 className="text-lg font-medium mb-3">Core Operations</h4>
          <div className="mermaid">
            {`
            flowchart TD
              subgraph BitOperations
              direction TD
              Ch["Ch(x,y,z) = (x AND y) XOR (NOT x AND z)"]
              Maj["Maj(x,y,z) = (x AND y) XOR (x AND z) XOR (y AND z)"]
              Sig0["Σ0(x) = ROTR2(x) XOR ROTR13(x) XOR ROTR22(x)"]
              Sig1["Σ1(x) = ROTR6(x) XOR ROTR11(x) XOR ROTR25(x)"]
              end
            `}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmDiagrams;
