
import { Code } from 'lucide-react';

const AlgorithmDiagrams = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg space-y-8">
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
            graph TB
              Input[Input Message] --> Preprocess[Preprocessing]
              Preprocess --> Schedule[Message Schedule]
              Schedule --> Compress[Compression Function]
              Compress --> Hash[Final Hash]
              
              style Input fill:#f9f,stroke:#333,stroke-width:2px
              style Hash fill:#9f9,stroke:#333,stroke-width:2px
            `}
          </div>
        </div>

        {/* Preprocessing */}
        <div>
          <h4 className="text-lg font-medium mb-3">Message Preprocessing</h4>
          <div className="mermaid">
            {`
            graph LR
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
            graph TB
              Block[512-bit Block] --> Split[Split into 16 Words]
              Split --> W0[W0-W15<br/>Direct from Block]
              Split --> Extend[W16-W63<br/>Extended Words]
              
              subgraph Extension
                Extend --> |Using Previous Words| Calculate[Wi = σ1(Wi-2) + Wi-7<br/>+ σ0(Wi-15) + Wi-16]
              end
              
              style Block fill:#f9f,stroke:#333,stroke-width:2px
              style Calculate fill:#9f9,stroke:#333,stroke-width:2px
            `}
          </div>
        </div>

        {/* Compression Function */}
        <div>
          <h4 className="text-lg font-medium mb-3">Compression Function</h4>
          <div className="mermaid">
            {`
            graph TB
              subgraph "Each Round (64 total)"
                T1[T1 = h + Σ1(e) + Ch(e,f,g) + Kt + Wt]
                T2[T2 = Σ0(a) + Maj(a,b,c)]
                
                T1 & T2 --> Update[Update a-h variables]
              end
              
              Init[Initialize a-h] --> Round
              Round[Process Round] --> Next[Next Round]
              Next --> |After 64 rounds| Final[Update Hash Values]
              
              style Init fill:#f9f,stroke:#333,stroke-width:2px
              style Final fill:#9f9,stroke:#333,stroke-width:2px
            `}
          </div>
        </div>

        {/* Bit Operations */}
        <div>
          <h4 className="text-lg font-medium mb-3">Core Operations</h4>
          <div className="mermaid">
            {`
            graph TB
              subgraph "Bit Operations"
                Ch[Ch(x,y,z) = (x∧y)⊕(¬x∧z)]
                Maj[Maj(x,y,z) = (x∧y)⊕(x∧z)⊕(y∧z)]
                Sig0[Σ0(x) = ROTR²(x)⊕ROTR¹³(x)⊕ROTR²²(x)]
                Sig1[Σ1(x) = ROTR⁶(x)⊕ROTR¹¹(x)⊕ROTR²⁵(x)]
              end
            `}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmDiagrams;
