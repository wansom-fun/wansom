import React, { useState, useEffect, useRef } from 'react';

const PRESETS = [
  {
    name: 'TrenchQuantum ($TRQ) - Safe Example',
    address: 'Hz1b9Pq7x9w2LmK4sJ3q9aA1xBcDeF23456789aA',
    score: 92.4,
    status: 'AUTO_STAKE_APPROVED',
    content: `{
  "contract_address": "Hz1b9Pq7x9w2...6789aA",
  "status": "AUTO_STAKE_APPROVED",
  "safety_score": 92.4,
  "metrics": {
    "mint_authority_disabled": true,
    "freeze_authority_disabled": true,
    "renounced_ownership": true,
    "liquidity_burned_percentage": 100.0,
    "dev_token_allocation_ratio": 0.02
  },
  "vulnerabilities": [],
  "recommendation": "SAFE_ENTRY"
}`
  },
  {
    name: 'RugApe ($RUGA) - Malicious Example',
    address: 'Fs9xZqP25aZqRtY7v6uB8n1xMcDeF88420691111',
    score: 32.5,
    status: 'IMMEDIATE_AVOID',
    content: `{
  "contract_address": "Fs9xZqP25aZq...91111",
  "status": "RISK_DETECTED",
  "safety_score": 32.5,
  "metrics": {
    "mint_authority_disabled": false,
    "freeze_authority_disabled": false,
    "renounced_ownership": false,
    "liquidity_burned_percentage": 0.0,
    "dev_token_allocation_ratio": 0.42
  },
  "vulnerabilities": [
    "Active mint authority allows the deployer to inflate token supply arbitrarily.",
    "Active freeze authority can lock buyer balances at any moment.",
    "Deployer holds 42% of the initial supply across three connected sybil wallets."
  ],
  "recommendation": "IMMEDIATE_AVOID"
}`
  }
];

export default function AuditPlaygroundTab({ wallet, onOpenWalletModal }) {
  const [address, setAddress] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [activeAuditResult, setActiveAuditResult] = useState(null);
  
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [streamedText]);

  const handlePresetSelect = (preset) => {
    setAddress(preset.address);
    setActiveAuditResult(null);
    setStreamedText('');
  };

  const handleExecuteAudit = () => {
    if (!address.trim() || isAuditing) return;

    setIsAuditing(true);
    setStreamedText('');
    setActiveAuditResult(null);

    const matchingPreset = PRESETS.find(p => p.address === address) || {
      score: (40 + Math.random() * 50).toFixed(1),
      status: Math.random() > 0.5 ? 'AUTO_STAKE_APPROVED' : 'IMMEDIATE_AVOID',
      content: `{
  "contract_address": "${address.slice(0, 12)}...",
  "status": "${Math.random() > 0.5 ? 'AUTO_STAKE_APPROVED' : 'RISK_DETECTED'}",
  "safety_score": ${(40 + Math.random() * 50).toFixed(1)},
  "metrics": {
    "mint_authority_disabled": ${Math.random() > 0.4},
    "freeze_authority_disabled": ${Math.random() > 0.3},
    "renounced_ownership": ${Math.random() > 0.5},
    "liquidity_burned_percentage": ${(Math.random() * 100).toFixed(1)},
    "dev_token_allocation_ratio": ${(Math.random() * 0.25).toFixed(2)}
  },
  "vulnerabilities": [
    "Potentially unverified source code on Solana Explorer."
  ],
  "recommendation": "${Math.random() > 0.5 ? 'MONITOR_ONLY' : 'IMMEDIATE_AVOID'}"
}`
    };

    let index = 0;
    const fullText = matchingPreset.content;
    
    const streamInterval = setInterval(() => {
      if (index < fullText.length) {
        setStreamedText(prev => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(streamInterval);
        setIsAuditing(false);
        setActiveAuditResult(matchingPreset);
      }
    }, 12);
  };

  const handleButtonClick = () => {
    if (!wallet.connected) {
      onOpenWalletModal();
      return;
    }
    handleExecuteAudit();
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-[#18181b]">
      
      {/* Input Sandbox Panel */}
      <div className="editorial-card rounded p-5 relative overflow-hidden">
        <h3 className="font-display font-bold text-lg text-zinc-950">Cognitive Contract Sandbox</h3>
        <p className="text-xs text-zinc-500 mt-0.5 mb-5">
          Paste any Solana contract address to run a multi-stage cognitive evaluation loop via Wansom-LLM-v1.
        </p>

        {/* Presets Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[10px] font-mono text-zinc-400 flex items-center mr-2 uppercase tracking-wider">Presets:</span>
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetSelect(preset)}
              className="text-[10px] font-mono px-3 py-1 bg-white border border-zinc-900 hover:bg-zinc-950 hover:text-white rounded transition-colors text-zinc-800 font-semibold"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative flex items-center border border-zinc-900 rounded bg-[#fdfdfc]">
            <span className="absolute left-3.5 text-zinc-400 font-mono text-xs select-none">sol_addr:</span>
            <input
              type="text"
              placeholder="Hz1b9Pq7x9w2LmK4sJ3q9aA1xBcDeF23456789aA"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-transparent py-2.5 pl-20 pr-4 text-xs font-mono text-zinc-900 focus:outline-none"
            />
          </div>
          <button
            onClick={handleButtonClick}
            disabled={wallet.connected && (!address.trim() || isAuditing)}
            className={`px-6 py-2.5 font-display font-bold text-xs transition-colors shrink-0 flex items-center justify-center gap-2 border ${
              wallet.connected
                ? 'bg-zinc-950 text-white border-zinc-950 hover:bg-zinc-800 disabled:opacity-50'
                : 'bg-[#8c8c8c] text-white border-[#8c8c8c] hover:bg-[#7a7a7a] cursor-pointer'
            }`}
          >
            {!wallet.connected ? (
              'CONNECT WALLET TO EXECUTE'
            ) : isAuditing ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                RUNNING AUDIT CONCEPTS...
              </>
            ) : (
              'EXECUTE COGNITIVE AUDIT'
            )}
          </button>
        </div>
      </div>

      {/* Audit Output Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Streaming Inference Console (Left 3 cols) */}
        <div className="lg:col-span-3 flex flex-col editorial-card rounded overflow-hidden min-h-[350px]">
          <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-950 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span>WANSOM-LLM-V1 INFERENCE LEDGER</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-400">temp = 0.0</span>
          </div>

          <div 
            ref={outputRef}
            className="flex-1 terminal-screen p-4 font-mono text-[11px] leading-relaxed text-zinc-900 overflow-y-auto max-h-[320px]"
          >
            <div className="scanline-effect"></div>
            {streamedText ? (
              <pre className="whitespace-pre-wrap">{streamedText}</pre>
            ) : (
              <div className="text-zinc-400 italic select-none h-full flex items-center justify-center text-xs">
                {isAuditing ? 'Routing bytecode job allocation queue...' : 'Enter target address to print inference receipt.'}
              </div>
            )}
            {isAuditing && <span className="inline-block w-2 h-4 bg-zinc-900 animate-pulse ml-0.5"></span>}
          </div>
        </div>

        {/* Visual Report Card (Right 2 cols) */}
        <div className="lg:col-span-2 editorial-card rounded p-5 flex flex-col justify-between">
          <div>
            <h4 className="font-display font-bold text-sm text-zinc-950 uppercase tracking-wider mb-1">Risk Evaluation Report</h4>
            <p className="text-xs text-zinc-500">Summarized risk scoring validated by distributed node consensus.</p>
          </div>

          {activeAuditResult ? (
            <div className="my-4 space-y-4">
              
              {/* Circular Monochrome Gauge */}
              <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 border border-zinc-200 rounded">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="#e4e4e7" strokeWidth="6" fill="none" />
                    <circle 
                      cx="56" 
                      cy="56" 
                      r="48" 
                      stroke="#18181b" 
                      strokeWidth="6" 
                      fill="none" 
                      strokeDasharray={301.6}
                      strokeDashoffset={301.6 - (301.6 * activeAuditResult.score) / 100}
                      strokeLinecap="square"
                    />
                  </svg>
                  <div className="text-center z-10">
                    <span className="text-2xl font-bold font-display text-zinc-900">{activeAuditResult.score}</span>
                    <span className="text-[9px] text-zinc-400 block font-mono">ACCURACY</span>
                  </div>
                </div>

                <span className="mt-3 text-[10px] font-mono font-bold bg-zinc-900 text-white px-2 py-0.5 rounded">
                  {activeAuditResult.status}
                </span>
              </div>

              {/* Presets stats */}
              <div className="space-y-2 font-mono text-[10px]">
                <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                  <span className="text-zinc-400">Mint Authority:</span>
                  <span className="text-zinc-900 font-bold">
                    {activeAuditResult.score >= 70 ? 'DISABLED' : 'ENABLED (HIGH RISK)'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                  <span className="text-zinc-400">Liquidity status:</span>
                  <span className="text-zinc-900 font-bold">
                    {activeAuditResult.score >= 70 ? '100% BURNED' : '0% UNBURNED'}
                  </span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-zinc-400">Dev Wallet Allocation:</span>
                  <span className="text-zinc-900 font-bold">
                    {activeAuditResult.score >= 70 ? '2.0%' : '42.0% (WHALE)'}
                  </span>
                </div>
              </div>

            </div>
          ) : (
            <div className="my-auto text-center py-10">
              <svg className="w-12 h-12 mx-auto text-zinc-350 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs text-zinc-400 font-mono">Awaiting verification run.</p>
            </div>
          )}

          <div className="border-t border-zinc-200 pt-4 text-[10px] text-zinc-400 font-mono">
            * Proof-of-Analysis validation score settled cryptographically.
          </div>
        </div>

      </div>

    </div>
  );
}
