import React, { useState, useEffect } from 'react';

export default function StakingTab({ wallet, onOpenWalletModal, onDisconnectWallet }) {
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedTier, setSelectedTier] = useState('scout');
  
  const [walletBalance, setWalletBalance] = useState(380250.50);
  const [stakedBalance, setStakedBalance] = useState(120000.00);
  const [claimableUsdc, setClaimableUsdc] = useState(14.82);

  // Yield ticking loop (dripping USDC rewards)
  useEffect(() => {
    let interval;
    if (wallet.connected && stakedBalance > 0) {
      interval = setInterval(() => {
        const rate = selectedTier === 'trencher' ? 0.000015 : 0.000005;
        const tickReward = (stakedBalance * rate) * (1 + Math.random() * 0.2);
        setClaimableUsdc(prev => prev + tickReward);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [wallet.connected, stakedBalance, selectedTier]);

  const handleStake = (e) => {
    e.preventDefault();
    const val = parseFloat(stakeAmount);
    if (isNaN(val) || val <= 0 || val > walletBalance) return;

    setWalletBalance(prev => prev - val);
    setStakedBalance(prev => prev + val);
    setStakeAmount('');
  };

  const handleUnstake = () => {
    if (stakedBalance <= 0) return;
    setWalletBalance(prev => prev + stakedBalance);
    setStakedBalance(0);
  };

  const handleClaim = () => {
    if (claimableUsdc <= 0) return;
    alert(`Claimed $${claimableUsdc.toFixed(4)} USDC to wallet ${wallet.address.slice(0, 6)}...`);
    setClaimableUsdc(0);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-[#18181b]">
      
      {/* Top row: Wallet status card */}
      <div className="editorial-card rounded p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-zinc-100 border border-zinc-900 flex items-center justify-center font-mono text-xs font-bold text-zinc-900">
            {wallet.connected ? 'OK' : '--'}
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-zinc-950 uppercase tracking-wider">Solana Web3 Identity</h3>
            <p className="text-xs text-zinc-500 mt-0.5 font-mono">
              {wallet.connected 
                ? `Active Ledger Adapter: ${wallet.type} [${wallet.address.slice(0, 6)}...${wallet.address.slice(-6)}]` 
                : 'Connect your cryptographic signature to interact with local staking programs.'
              }
            </p>
          </div>
        </div>

        <div>
          {wallet.connected ? (
            <button
              onClick={onDisconnectWallet}
              className="text-xs font-mono px-4 py-2 border border-zinc-900 bg-white hover:bg-zinc-950 hover:text-white rounded transition-colors font-bold"
            >
              DISCONNECT WALLET
            </button>
          ) : (
            <button
              onClick={onOpenWalletModal}
              className="text-xs font-display px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded transition-colors font-bold tracking-wide border border-zinc-950"
            >
              CONNECT SOLANA WALLET
            </button>
          )}
        </div>
      </div>

      {wallet.connected ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Staking Controls (Left 3 cols) */}
          <div className="lg:col-span-3 editorial-card rounded p-5 flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex justify-between items-center border-b border-zinc-200 pb-3 mb-4">
                <h4 className="font-display font-bold text-sm text-zinc-950 uppercase tracking-wider">Protocol Staking Engine</h4>
                <div className="flex gap-2 font-mono text-[10px]">
                  <button
                    onClick={() => setSelectedTier('scout')}
                    className={`px-3 py-1.5 rounded border transition-all font-bold ${selectedTier === 'scout' ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-300 text-zinc-400 hover:text-zinc-700'}`}
                  >
                    Tier I // Scout
                  </button>
                  <button
                    onClick={() => setSelectedTier('trencher')}
                    className={`px-3 py-1.5 rounded border transition-all font-bold ${selectedTier === 'trencher' ? 'bg-zinc-950 text-white border-zinc-950' : 'border-zinc-300 text-zinc-400 hover:text-zinc-700'}`}
                  >
                    Tier II // Trencher
                  </button>
                </div>
              </div>

              {/* Tier Description */}
              <div className="bg-[#fcfcfb] border border-zinc-200 rounded p-4 mb-5">
                {selectedTier === 'scout' ? (
                  <>
                    <h5 className="font-display font-bold text-xs text-zinc-900 uppercase tracking-wider mb-1">Tier I // Scout Node Operator</h5>
                    <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                      Unlocks GPU spec-decoding jobs queue routing. Minimum requirement: 100,000 WANSOM. Rewards settled programmatically in network fees emissions.
                    </p>
                    <div className="flex gap-6 mt-3 text-[10px] font-mono">
                      <div>
                        <span className="text-zinc-400 block">APY Yield</span>
                        <span className="text-sm font-bold text-zinc-900">18.5%</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block">Min Staked</span>
                        <span className="text-sm font-bold text-zinc-900">100,000 WANSOM</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block">Lock Duration</span>
                        <span className="text-sm font-bold text-zinc-900">None (Liquid)</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h5 className="font-display font-bold text-xs text-zinc-900 uppercase tracking-wider mb-1">Tier II // Auto-Trencher Suite</h5>
                    <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                      Unlocks early access autonomous execution pipelines and developer sandbox profiles. Yield returns are calculated from shared USDC pool revenues.
                    </p>
                    <div className="flex gap-6 mt-3 text-[10px] font-mono">
                      <div>
                        <span className="text-zinc-400 block">APY Yield</span>
                        <span className="text-sm font-bold text-zinc-900">48.2%</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block">Min Staked</span>
                        <span className="text-sm font-bold text-zinc-900">250,000 WANSOM</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block">Lock Duration</span>
                        <span className="text-sm font-bold text-zinc-900">90 Days</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Form Input */}
              <form onSubmit={handleStake} className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-baseline font-mono text-[10px]">
                    <span className="text-zinc-400">Lock Capital:</span>
                    <button 
                      type="button"
                      onClick={() => setStakeAmount(walletBalance.toString())}
                      className="text-zinc-900 font-bold hover:underline"
                    >
                      MAX: {walletBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} WANSOM
                    </button>
                  </div>
                  <div className="relative flex items-center bg-[#fdfdfc] border border-zinc-900 rounded">
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="w-full bg-transparent py-3 pl-4 pr-24 text-xs font-mono text-zinc-900 focus:outline-none"
                    />
                    <span className="absolute right-4 font-mono text-xs text-zinc-400">WANSOM</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-zinc-950 text-white hover:bg-zinc-800 rounded font-display font-bold text-xs transition-colors"
                  >
                    STAKE TOKENS
                  </button>
                  {stakedBalance > 0 && (
                    <button
                      type="button"
                      onClick={handleUnstake}
                      className="px-6 py-2.5 border border-zinc-900 bg-white hover:bg-zinc-50 rounded font-display font-bold text-xs text-zinc-900 transition-colors"
                    >
                      UNSTAKE ALL
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Staking Wallet Balances (Right 2 cols) */}
          <div className="lg:col-span-2 editorial-card rounded p-5 flex flex-col justify-between min-h-[380px]">
            <div>
              <h4 className="font-display font-bold text-sm text-zinc-950 uppercase tracking-wider mb-4">Staking Balances</h4>
              
              <div className="space-y-4">
                
                {/* Wallet Balance Card */}
                <div className="bg-zinc-50 border border-zinc-200 rounded p-4 font-mono text-xs relative overflow-hidden">
                  <span className="text-zinc-400 block uppercase tracking-wide text-[9px] mb-1">Available in Wallet</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-xl font-bold text-zinc-900">
                      {walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-normal">WANSOM</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-2">
                    Gas: <span className="text-zinc-700 font-bold">{wallet.solBalance} SOL</span>
                  </div>
                </div>

                {/* Staked Balance Card */}
                <div className="bg-zinc-50 border border-zinc-200 rounded p-4 font-mono text-xs relative overflow-hidden">
                  <span className="text-zinc-400 block uppercase tracking-wide text-[9px] mb-1">Staked Capital Ledger</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-xl font-bold text-zinc-900">
                      {stakedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-normal">WANSOM</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-2">
                    Tier status: <span className="text-zinc-700 font-bold">{selectedTier === 'trencher' ? 'Auto-Trencher II' : 'Scout Node I'}</span>
                  </div>
                </div>

                {/* Claimable Pool Card */}
                <div className="bg-zinc-50 border border-zinc-200 rounded p-4 font-mono text-xs relative overflow-hidden">
                  <span className="text-zinc-400 block uppercase tracking-wide text-[9px] mb-1">Accumulating USDC Rewards</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-xl font-bold text-zinc-900">
                      ${claimableUsdc.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 })}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-normal">USDC</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-zinc-950 rounded-full animate-ping"></span>
                    USDC revenue stream active
                  </div>
                </div>

              </div>
            </div>

            <div className="border-t border-zinc-200 pt-4 mt-6">
              <button
                disabled={claimableUsdc <= 0}
                onClick={handleClaim}
                className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 text-white rounded font-display font-bold text-xs transition-colors uppercase tracking-wider"
              >
                CLAIM ACCUMULATED YIELD
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="editorial-card rounded py-16 text-center">
          <svg className="w-10 h-10 mx-auto text-zinc-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h4 className="font-display font-bold text-base text-zinc-900">Cryptographic Identity Verification Required</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 mb-5 leading-relaxed font-mono">
            Access to on-chain staking variables is gated by signature validation.
          </p>
          <button
            onClick={onOpenWalletModal}
            className="text-xs font-display px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded transition-colors font-bold tracking-wide"
          >
            CONNECT WALLET
          </button>
        </div>
      )}

    </div>
  );
}
