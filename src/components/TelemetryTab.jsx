import React, { useState, useEffect, useRef } from 'react';

const generateAddress = () => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let addr = '';
  for (let i = 0; i < 8; i++) {
    addr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return addr + '...' + addr;
};

const tokenNames = [
  { name: 'TrenchQuantum', symbol: 'TRQ' },
  { name: 'CyberBull', symbol: 'CBULL' },
  { name: 'SolanaPlasma', symbol: 'SLP' },
  { name: 'JitoSpike', symbol: 'JTS' },
  { name: 'PumpApe', symbol: 'PAPE' },
  { name: 'HeliusFlux', symbol: 'HLX' },
  { name: 'TeeShield', symbol: 'TEES' },
  { name: 'WansomSpec', symbol: 'WSPEC' },
  { name: 'RaydiumRaptor', symbol: 'RRAP' },
  { name: 'GeyserStream', symbol: 'GSTR' }
];

const nodes = ['Node-0x9eA2', 'Node-0x4fBc', 'Node-0x7aDf', 'Node-0x12dE', 'Node-0x8b3C', 'Node-0x5e2A'];
const locations = ['Tokyo', 'Singapore', 'Frankfurt', 'New York', 'London', 'Reykjavik'];

export default function TelemetryTab() {
  const [logs, setLogs] = useState([]);
  const [activeCU, setActiveCU] = useState(843);
  const [totalAudits, setTotalAudits] = useState(41920);
  const [burnedWansom, setBurnedWansom] = useState(12048590.22);
  const [chartData, setChartData] = useState([
    780, 795, 790, 810, 805, 820, 815, 830, 825, 843, 838, 840, 845, 841, 843
  ]);

  const terminalRef = useRef(null);

  useEffect(() => {
    const initialLogs = [
      {
        time: '18:50:12',
        type: 'INGEST',
        text: 'Established connection to Solana Mainnet RPC node. Ledger monitoring active.',
        color: 'text-zinc-600'
      },
      {
        time: '18:51:00',
        type: 'SYSTEM',
        text: 'SolanaIngressSimulator initialized: telemetry generator running local fallback mode.',
        color: 'text-zinc-800 font-bold'
      },
      {
        time: '18:52:10',
        type: 'QUEUE',
        text: `Mapping contracts at program address [6EF8...Pool]`,
        color: 'text-zinc-900'
      },
      {
        time: '18:53:15',
        type: 'INGEST',
        text: `New mint detected [address: Dk9w...e8Zq] on Raydium.`,
        color: 'text-zinc-700'
      },
      {
        time: '18:53:16',
        type: 'AUDIT',
        text: `Routing code signature to Node-0x8b3C (Location: Singapore).`,
        color: 'text-zinc-800'
      },
      {
        time: '18:53:18',
        type: 'RESULT',
        text: `safety_score = 42.1. WARNING: Dev wallet holding 32% of liquidity. AUTO_STAKE_DENIED.`,
        color: 'text-zinc-900 underline decoration-zinc-400'
      }
    ];
    setLogs(initialLogs);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      const randToken = tokenNames[Math.floor(Math.random() * tokenNames.length)];
      const randAddr = generateAddress();
      const randNode = nodes[Math.floor(Math.random() * nodes.length)];
      const randLoc = locations[Math.floor(Math.random() * locations.length)];
      const score = (70 + Math.random() * 29).toFixed(1);
      const isApproved = Math.random() > 0.3;

      setActiveCU(prev => {
        const delta = Math.floor(Math.random() * 31) - 15;
        const nextVal = Math.max(750, Math.min(950, prev + delta));
        setChartData(prevData => [...prevData.slice(1), nextVal]);
        return nextVal;
      });

      setTotalAudits(prev => prev + 1);
      setBurnedWansom(prev => prev + parseFloat((Math.random() * 1.5).toFixed(4)));

      const newLogs = [
        {
          time: timestamp,
          type: 'INGEST',
          text: `Token mint detected [address: ${randAddr}] on ${Math.random() > 0.5 ? 'Pump.fun' : 'Raydium'} (${randToken.name} / $${randToken.symbol})`,
          color: 'text-zinc-700'
        },
        {
          time: timestamp,
          type: 'AUDIT',
          text: `Routing code signature and metadata bytecode to ${randNode} (Location: ${randLoc}).`,
          color: 'text-zinc-800'
        },
        {
          time: timestamp,
          type: 'RESULT',
          text: `safety_score = ${score}. ${isApproved ? 'Executing buy order via Jito Bundle.' : 'Analysis completed. Action: AUTO_STAKE_DENIED.'}`,
          color: isApproved ? 'text-zinc-950 font-bold' : 'text-zinc-600 line-through'
        }
      ];

      setLogs(prev => [...prev, ...newLogs].slice(-40));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const chartWidth = 500;
  const chartHeight = 120;
  const maxVal = Math.max(...chartData, 950);
  const minVal = Math.min(...chartData, 700);

  const getPoints = () => {
    const segmentWidth = chartWidth / (chartData.length - 1);
    return chartData.map((val, idx) => {
      const x = idx * segmentWidth;
      const y = chartHeight - ((val - minVal) / (maxVal - minVal)) * (chartHeight - 20) - 10;
      return `${x},${y}`;
    }).join(' ');
  };

  const getAreaPoints = () => {
    const points = getPoints();
    const segmentWidth = chartWidth / (chartData.length - 1);
    const lastX = (chartData.length - 1) * segmentWidth;
    return `0,${chartHeight} ${points} ${lastX},${chartHeight}`;
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-[#18181b]">
      
      {/* Network Metrics Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Metric 1 */}
        <div className="editorial-card rounded p-5 relative overflow-hidden">
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block mb-1">01 // Active Compute Units</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold tracking-tight font-display text-zinc-950">
              {activeCU}
            </span>
            <span className="text-xs text-zinc-500 font-mono">CU/s</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-zinc-950 rounded-full"></span>
            Aggregate node processing load
          </p>
        </div>

        {/* Metric 2 */}
        <div className="editorial-card rounded p-5 relative overflow-hidden">
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block mb-1">02 // Cumulative Audits</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold tracking-tight font-display text-zinc-950">
              {totalAudits.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-500 font-mono">contracts</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono mt-3">
            Average accuracy rating: <span className="font-semibold text-zinc-900">99.84%</span>
          </p>
        </div>

        {/* Metric 3 */}
        <div className="editorial-card rounded p-5 relative overflow-hidden">
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block mb-1">03 // Deflation Counter</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold tracking-tight font-display text-zinc-900">
              {burnedWansom.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-zinc-500 font-mono">burned</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono mt-3">
            Programmatic buyback: <span className="font-semibold text-zinc-900">20% fee burned</span>
          </p>
        </div>

      </div>

      {/* Socials & Protocol buttons row */}
      <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] my-1">
        <button
          disabled
          className="px-3.5 py-2 border border-zinc-300 bg-zinc-50 text-zinc-400 cursor-not-allowed rounded font-bold uppercase tracking-wider"
        >
          CA // NOT LIVE YET
        </button>
        <a
          href="https://x.com/wansomdotfun"
          target="_blank"
          rel="noreferrer"
          className="px-3.5 py-2 border border-zinc-950 bg-white hover:bg-zinc-950 hover:text-white text-zinc-900 rounded font-bold uppercase tracking-wider transition-colors inline-block"
        >
          X / TWITTER
        </a>
        <a
          href="https://github.com/wansom-fun/wansom"
          target="_blank"
          rel="noreferrer"
          className="px-3.5 py-2 border border-zinc-950 bg-white hover:bg-zinc-950 hover:text-white text-zinc-900 rounded font-bold uppercase tracking-wider transition-colors inline-block"
        >
          GITHUB
        </a>
      </div>

      {/* Main Grid: Terminal Feed + CU Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Live Solana Ingress Terminal (Left 3 cols) */}
        <div className="lg:col-span-3 flex flex-col editorial-card rounded overflow-hidden min-h-[380px] lg:min-h-[440px]">
          <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-950 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              <span className="font-mono text-[10px] font-bold tracking-widest">SOLANA INGRESS TELEMETRY</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
              STATE: LIVE_FEED
            </span>
          </div>

          <div 
            ref={terminalRef}
            className="flex-1 terminal-screen p-4 font-mono text-[11px] leading-relaxed overflow-y-auto max-h-[380px] text-zinc-850"
          >
            <div className="scanline-effect"></div>
            {logs.map((log, index) => (
              <div key={index} className="mb-2 flex items-start gap-2 hover:bg-zinc-100/50 py-0.5 px-1 rounded transition-colors border-b border-zinc-100/30">
                <span className="text-zinc-400 select-none shrink-0 font-normal">[{log.time}]</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] select-none font-bold shrink-0
                  ${log.type === 'INGEST' ? 'bg-zinc-100 text-zinc-700 border border-zinc-200' : ''}
                  ${log.type === 'SYSTEM' ? 'bg-zinc-900 text-white' : ''}
                  ${log.type === 'AUDIT' ? 'bg-zinc-200 text-zinc-800' : ''}
                  ${log.type === 'QUEUE' ? 'bg-zinc-50 text-zinc-600 border border-zinc-200' : ''}
                  ${log.type === 'RESULT' ? 'bg-zinc-950 text-white' : ''}
                `}>
                  {log.type}
                </span>
                <span className={`${log.color} font-mono`}>{log.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Node Performance Chart (Right 2 cols) */}
        <div className="lg:col-span-2 editorial-card rounded p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-zinc-950">Network Compute Load</h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Real-time representation of aggregate Compute Units allocated across the validating Scout Nodes.
            </p>
          </div>

          {/* Glowing SVG Chart */}
          <div className="w-full flex justify-center items-center my-6 bg-white border border-zinc-250 rounded p-2 relative overflow-hidden">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#18181b" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#18181b" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Horizontal Grid lines */}
              <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#e4e4e7" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="0" y1={chartHeight * 0.5} x2={chartWidth} y2={chartHeight * 0.5} stroke="#e4e4e7" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#e4e4e7" strokeWidth="1" strokeDasharray="2 2" />
              
              {/* Area Fill */}
              <polygon points={getAreaPoints()} fill="url(#chartFill)" />
              
              {/* Solid Line */}
              <polyline
                fill="none"
                stroke="#18181b"
                strokeWidth="2"
                points={getPoints()}
                strokeLinecap="square"
                strokeLinejoin="miter"
              />

              {/* Point Indicator */}
              {chartData.length > 0 && (() => {
                const segmentWidth = chartWidth / (chartData.length - 1);
                const x = (chartData.length - 1) * segmentWidth;
                const lastVal = chartData[chartData.length - 1];
                const y = chartHeight - ((lastVal - minVal) / (maxVal - minVal)) * (chartHeight - 20) - 10;
                return (
                  <g>
                    <circle cx={x} cy={y} r="5" fill="#18181b" />
                    <circle cx={x} cy={y} r="2" fill="#fff" />
                  </g>
                );
              })()}
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-zinc-200 pt-4 text-xs font-mono">
            <div>
              <span className="text-zinc-400 block">Peak Load (24h)</span>
              <span className="text-sm font-bold text-zinc-900">942 CU/s</span>
            </div>
            <div>
              <span className="text-zinc-400 block">Avg Latency</span>
              <span className="text-sm font-bold text-zinc-900">118.5 ms</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
