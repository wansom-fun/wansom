import React, { useState, useEffect } from 'react';

const initialNodes = [
  { id: 'Node-0x9eA2', location: 'Tokyo, JP', hardware: 'NVIDIA H100 SXM5', ping: 38, reputation: 99.8, earned: 145920.12, status: 'active' },
  { id: 'Node-0x4fBc', location: 'Frankfurt, DE', hardware: 'NVIDIA RTX 4090', ping: 42, reputation: 99.5, earned: 92830.45, status: 'active' },
  { id: 'Node-0x7aDf', location: 'Singapore, SG', hardware: 'NVIDIA A100 PCIe', ping: 51, reputation: 98.9, earned: 110420.33, status: 'active' },
  { id: 'Node-0x12dE', location: 'New York, US', hardware: 'NVIDIA RTX 4090', ping: 15, reputation: 99.9, earned: 215420.80, status: 'active' },
  { id: 'Node-0x8b3C', location: 'London, UK', hardware: 'NVIDIA RTX 3090 Ti', ping: 28, reputation: 99.1, earned: 74900.50, status: 'active' },
  { id: 'Node-0x5e2A', location: 'Reykjavik, IS', hardware: 'NVIDIA A10G GPU', ping: 84, reputation: 97.4, earned: 38200.12, status: 'idle' }
];

export default function ScoutNodesTab() {
  const [nodes, setNodes] = useState(initialNodes);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prevNodes =>
        prevNodes.map(node => {
          if (node.status === 'active') {
            const jitter = Math.floor(Math.random() * 7) - 3;
            const nextPing = Math.max(10, node.ping + jitter);
            const earnInc = parseFloat((Math.random() * 0.05).toFixed(4));
            return { ...node, ping: nextPing, earned: parseFloat((node.earned + earnInc).toFixed(2)) };
          }
          return node;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText('npm install -g @wansom/worker && wansom-worker start --key <YOUR_STAKED_WALLET>');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-[#18181b]">
      
      {/* Visual Global Node Map */}
      <div className="editorial-card rounded p-5 flex flex-col items-center relative overflow-hidden">
        <div className="w-full flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-zinc-950">Global Infrastructure Mesh</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Physical distribution of active nodes executing local LLM transaction evaluations.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-zinc-900 font-semibold">
              <span className="w-2 h-2 rounded-full bg-zinc-950"></span>
              Active ({nodes.filter(n => n.status === 'active').length})
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
              Idle (1)
            </span>
          </div>
        </div>

        {/* Dotted World Map Visual Representation */}
        <div className="w-full max-w-4xl min-h-[220px] md:min-h-[300px] flex items-center justify-center bg-white border border-zinc-200 rounded relative py-4">
          <svg viewBox="0 0 1000 480" className="w-full h-auto opacity-90">
            <defs>
              <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#e4e4e7" />
              </pattern>
            </defs>
            <rect width="1000" height="480" fill="url(#dotPattern)" />
            
            {/* Continent boxes */}
            <path d="M120 180 L280 180 L320 280 L240 380 L180 380 Z" fill="none" stroke="#d4d4d8" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M450 120 L580 120 L660 220 L580 340 L420 340 Z" fill="none" stroke="#d4d4d8" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M720 160 L850 160 L920 280 L800 380 L700 300 Z" fill="none" stroke="#d4d4d8" strokeWidth="1" strokeDasharray="3 3" />

            {/* Connecting routes */}
            <path d="M180 190 Q 320 150 510 180 T 820 200" fill="none" stroke="#e4e4e7" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M510 180 Q 640 280 820 200" fill="none" stroke="#e4e4e7" strokeWidth="1.5" />
            <path d="M180 190 Q 360 260 510 180" fill="none" stroke="#e4e4e7" strokeWidth="1.2" />
            
            {/* Node Pins */}
            {/* New York */}
            <g className="cursor-pointer group">
              <circle cx="180" cy="190" r="10" fill="rgba(12, 12, 14, 0.05)" className="animate-ping" style={{ animationDuration: '4s' }} />
              <circle cx="180" cy="190" r="5.5" fill="#18181b" />
              <circle cx="180" cy="190" r="1.5" fill="#fff" />
              <text x="180" y="175" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="Space Mono" className="opacity-0 group-hover:opacity-100 transition-opacity">US-EAST-01</text>
            </g>

            {/* London */}
            <g className="cursor-pointer group">
              <circle cx="460" cy="140" r="10" fill="rgba(12, 12, 14, 0.05)" className="animate-ping" style={{ animationDuration: '5s' }} />
              <circle cx="460" cy="140" r="5" fill="#18181b" />
              <circle cx="460" cy="140" r="1.5" fill="#fff" />
              <text x="460" y="125" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="Space Mono" className="opacity-0 group-hover:opacity-100 transition-opacity">UK-LON-02</text>
            </g>

            {/* Frankfurt */}
            <g className="cursor-pointer group">
              <circle cx="510" cy="160" r="9" fill="rgba(12, 12, 14, 0.05)" className="animate-ping" style={{ animationDuration: '3.5s' }} />
              <circle cx="510" cy="160" r="5" fill="#18181b" />
              <circle cx="510" cy="160" r="1.5" fill="#fff" />
              <text x="510" y="145" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="Space Mono" className="opacity-0 group-hover:opacity-100 transition-opacity">DE-FRA-01</text>
            </g>

            {/* Reykjavik (Idle) */}
            <g className="cursor-pointer group">
              <circle cx="420" cy="100" r="4.5" fill="#a1a1aa" />
              <text x="420" y="85" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="Space Mono" className="opacity-0 group-hover:opacity-100 transition-opacity">IS-REK-01 (Idle)</text>
            </g>

            {/* Singapore */}
            <g className="cursor-pointer group">
              <circle cx="760" cy="310" r="11" fill="rgba(12, 12, 14, 0.05)" className="animate-ping" style={{ animationDuration: '4.5s' }} />
              <circle cx="760" cy="310" r="5.5" fill="#18181b" />
              <circle cx="760" cy="310" r="1.5" fill="#fff" />
              <text x="760" y="295" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="Space Mono" className="opacity-0 group-hover:opacity-100 transition-opacity">SG-SIN-01</text>
            </g>

            {/* Tokyo */}
            <g className="cursor-pointer group">
              <circle cx="850" cy="200" r="13" fill="rgba(12, 12, 14, 0.05)" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="850" cy="200" r="5.5" fill="#18181b" />
              <circle cx="850" cy="200" r="1.5" fill="#fff" />
              <text x="850" y="185" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="Space Mono" className="opacity-0 group-hover:opacity-100 transition-opacity">JP-NRT-03</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Grid: Active Nodes Table & Daemon Launch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Nodes table list (2 cols) */}
        <div className="lg:col-span-2 editorial-card rounded p-5 overflow-hidden flex flex-col justify-between">
          <div>
            <h4 className="font-display font-bold text-sm text-zinc-950 uppercase tracking-wider mb-4">Node Telemetry Register</h4>
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-[11px] text-left text-zinc-700">
                <thead className="bg-[#fafaf9] text-[10px] text-zinc-500 uppercase tracking-wider border-b border-zinc-300">
                  <tr>
                    <th className="py-2.5 px-3">Node ID</th>
                    <th className="py-2.5 px-3">Hardware Type</th>
                    <th className="py-2.5 px-3">Latency</th>
                    <th className="py-2.5 px-3">Reputation</th>
                    <th className="py-2.5 px-3 text-right">Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {nodes.map(node => (
                    <tr key={node.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-3 px-3 flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${node.status === 'active' ? 'bg-zinc-950' : 'bg-zinc-300'}`}></span>
                        <span className="font-bold text-zinc-900">{node.id}</span>
                        <span className="text-[10px] text-zinc-400">({node.location})</span>
                      </td>
                      <td className="py-3 px-3 text-zinc-650">{node.hardware}</td>
                      <td className="py-3 px-3 text-zinc-800">
                        <span>{node.ping}ms</span>
                      </td>
                      <td className="py-3 px-3 text-zinc-800">{node.reputation}%</td>
                      <td className="py-3 px-3 text-right font-bold text-zinc-900">
                        {node.earned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[9px] text-zinc-400 font-normal">WANSOM</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Worker Node Setup Prompt (1 col) */}
        <div className="editorial-card rounded p-5 flex flex-col justify-between relative overflow-hidden">
          <div>
            <h4 className="font-display font-bold text-sm text-zinc-950 uppercase tracking-wider mb-2">Contribute Compute</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Earn rewards by routing decentralized token audits. Run the lightweight Wansom worker daemon on your local GPU machine.
            </p>

            <div className="mt-5 space-y-2 font-mono text-[10px] text-zinc-600">
              <div className="flex items-center gap-2 bg-[#fdfdfc] border border-zinc-200 p-2">
                <span className="font-bold text-zinc-950">01 //</span>
                <span>Minimum stake: <span className="text-zinc-900 font-bold">100,000 WANSOM</span></span>
              </div>
              <div className="flex items-center gap-2 bg-[#fdfdfc] border border-zinc-200 p-2">
                <span className="font-bold text-zinc-950">02 //</span>
                <span>Required VRAM: <span className="text-zinc-900 font-bold">&gt;= 12GB CUDA</span></span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-zinc-200 pt-4">
            <span className="text-[10px] font-mono text-zinc-400 block mb-2 uppercase tracking-wide">Launch Command (CLI)</span>
            <div className="flex bg-[#fcfcfb] border border-zinc-950 rounded overflow-hidden">
              <div className="flex-1 font-mono text-[10px] p-2.5 text-zinc-600 overflow-x-auto whitespace-nowrap">
                npm install -g @wansom/worker
              </div>
              <button 
                onClick={handleCopy}
                className="bg-zinc-950 hover:bg-zinc-800 text-white font-bold font-mono text-xs px-3 transition-colors shrink-0"
              >
                {copied ? 'DONE' : 'COPY'}
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
