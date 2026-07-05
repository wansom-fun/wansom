import { useState, useEffect } from 'react';
import TelemetryTab from './components/TelemetryTab';
import ScoutNodesTab from './components/ScoutNodesTab';
import AuditPlaygroundTab from './components/AuditPlaygroundTab';
import StakingTab from './components/StakingTab';

function App() {
  const [activeTab, setActiveTab] = useState('telemetry');
  const [activeCuTicker, setActiveCuTicker] = useState(843);
  const [nodesCount] = useState(142);
  const [totalBurned, setTotalBurned] = useState(12048590.22);
  
  // Wallet Modal visibility
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Global wallet state
  const [wallet, setWallet] = useState({
    connected: false,
    address: '',
    type: '',
    solBalance: 0
  });

  // Providers detection helpers
  const getPhantomProvider = () => {
    if (typeof window === 'undefined') return null;
    if ('solana' in window) {
      const provider = window.solana;
      if (provider?.isPhantom) return provider;
    }
    if (window.phantom?.solana) {
      return window.phantom.solana;
    }
    return null;
  };

  const getSolflareProvider = () => {
    if (typeof window === 'undefined') return null;
    if ('solflare' in window) {
      return window.solflare;
    }
    return null;
  };

  const getBackpackProvider = () => {
    if (typeof window === 'undefined') return null;
    if ('backpack' in window) {
      return window.backpack;
    }
    return null;
  };

  // Auto-connect if wallet is already trusted
  useEffect(() => {
    const autoConnect = async () => {
      try {
        const phantom = getPhantomProvider();
        if (phantom) {
          const resp = await phantom.connect({ onlyIfTrusted: true });
          if (resp?.publicKey) {
            setWallet({
              connected: true,
              address: resp.publicKey.toString(),
              type: 'Phantom',
              solBalance: 42.50
            });
          }
        }
      } catch (err) {
        // Silent failure (expected if not trusted yet)
      }
    };
    autoConnect();
  }, []);

  // Listen to Phantom account changes
  useEffect(() => {
    const phantom = getPhantomProvider();
    if (phantom && wallet.type === 'Phantom') {
      const handleAccountChange = (publicKey) => {
        if (publicKey) {
          setWallet(prev => ({
            ...prev,
            address: publicKey.toString()
          }));
        } else {
          setWallet({
            connected: false,
            address: '',
            type: '',
            solBalance: 0
          });
        }
      };
      phantom.on('accountChanged', handleAccountChange);
      return () => {
        phantom.off('accountChanged', handleAccountChange);
      };
    }
  }, [wallet.type]);

  // Connect Routine
  const handleConnectWallet = async (type) => {
    try {
      let provider = null;
      if (type === 'Phantom') {
        provider = getPhantomProvider();
        if (!provider) {
          window.open('https://phantom.app/', '_blank');
          return;
        }
        const resp = await provider.connect();
        setWallet({
          connected: true,
          address: resp.publicKey.toString(),
          type: 'Phantom',
          solBalance: 42.50
        });
      } else if (type === 'Solflare') {
        provider = getSolflareProvider();
        if (!provider) {
          window.open('https://solflare.com/', '_blank');
          return;
        }
        await provider.connect();
        setWallet({
          connected: true,
          address: provider.publicKey.toString(),
          type: 'Solflare',
          solBalance: 12.80
        });
      } else if (type === 'Backpack') {
        provider = getBackpackProvider();
        if (!provider) {
          window.open('https://www.backpack.app/', '_blank');
          return;
        }
        await provider.connect();
        setWallet({
          connected: true,
          address: provider.publicKey.toString(),
          type: 'Backpack',
          solBalance: 75.30
        });
      }
      setShowWalletModal(false);
    } catch (err) {
      console.error('Wallet connection rejected:', err);
      alert('Wallet connection rejected by user.');
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      if (wallet.type === 'Phantom') {
        const p = getPhantomProvider();
        if (p) await p.disconnect();
      } else if (wallet.type === 'Solflare') {
        const s = getSolflareProvider();
        if (s) await s.disconnect();
      }
      // Backpack disconnect is handled by clearing state directly
    } catch (e) {
      console.error('Wallet disconnect error:', e);
    }
    setWallet({
      connected: false,
      address: '',
      type: '',
      solBalance: 0
    });
  };

  // Ticking stats header
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCuTicker(prev => {
        const delta = Math.floor(Math.random() * 21) - 10;
        return Math.max(780, Math.min(940, prev + delta));
      });
      setTotalBurned(prev => prev + parseFloat((Math.random() * 0.05).toFixed(4)));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const isPhantomInstalled = typeof window !== 'undefined' && !!getPhantomProvider();
  const isSolflareInstalled = typeof window !== 'undefined' && !!getSolflareProvider();
  const isBackpackInstalled = typeof window !== 'undefined' && !!getBackpackProvider();

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#18181b] flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Printed grid blueprint lines backdrop */}
      <div className="absolute inset-0 glowing-grid opacity-85 pointer-events-none z-0"></div>
      
      {/* Header Container */}
      <header className="w-full border-b border-zinc-950 bg-white/95 backdrop-blur-sm z-20 relative">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo & title */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 border border-zinc-950 bg-zinc-950">
              <span className="font-display font-extrabold text-white text-base tracking-widest">W</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-bold text-lg tracking-wider text-zinc-950">WANSOM</span>
                <span className="text-[9px] font-mono text-zinc-400 tracking-widest uppercase">system</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 block leading-none mt-0.5">
                Autonomous Cognitive Execution Layer
              </span>
            </div>
          </div>

          {/* Network statistics ticker bar */}
          <div className="flex flex-wrap justify-center items-center gap-4 font-mono text-[10px] text-zinc-655">
            <div className="flex items-center gap-2 bg-[#fcfcfb] border border-zinc-200 rounded px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse"></span>
              <span>Telemetry: <span className="font-bold text-zinc-950">{nodesCount} Nodes</span></span>
            </div>
            
            <div className="flex items-center gap-2 bg-[#fcfcfb] border border-zinc-200 rounded px-3 py-1.5">
              <span>Performance: <span className="font-bold text-zinc-950">{activeCuTicker} CU/s</span></span>
            </div>

            <div className="flex items-center gap-2 bg-[#fcfcfb] border border-zinc-200 rounded px-3 py-1.5">
              <span>Ledger Burn: <span className="font-bold text-zinc-950">
                {totalBurned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span></span>
            </div>
          </div>

          {/* Wallet Address Display */}
          <div className="flex items-center gap-3">
            {wallet.connected ? (
              <button
                onClick={handleDisconnectWallet}
                title="Click to Disconnect"
                className="flex items-center gap-2 bg-zinc-50 border border-zinc-950 hover:bg-zinc-100 px-3 py-1.5 rounded font-mono text-[11px] text-zinc-900 font-semibold transition-colors"
              >
                <span className="w-1.5 h-1.5 bg-zinc-950 rounded-full animate-ping"></span>
                <span>{wallet.type}</span>
                <span className="text-zinc-300">|</span>
                <span>{wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowWalletModal(true)}
                className="px-4 py-2 border border-zinc-950 hover:bg-zinc-50 bg-white rounded font-display text-xs text-zinc-900 font-bold transition-colors"
              >
                CONNECT WALLET
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Editorial Index Tab Navigation */}
      <nav className="w-full bg-[#f5f5f4]/80 border-b border-zinc-200 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-center md:justify-start gap-1 font-display">
          
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-2 text-[11px] font-bold tracking-wider uppercase transition-all rounded font-mono
              ${activeTab === 'telemetry' 
                ? 'bg-zinc-950 text-white border border-zinc-950' 
                : 'border border-transparent text-zinc-500 hover:text-zinc-900'
              }
            `}
          >
            01 // Ingress Telemetry
          </button>

          <button
            onClick={() => setActiveTab('nodes')}
            className={`px-4 py-2 text-[11px] font-bold tracking-wider uppercase transition-all rounded font-mono
              ${activeTab === 'nodes' 
                ? 'bg-zinc-950 text-white border border-zinc-950' 
                : 'border border-transparent text-zinc-500 hover:text-zinc-900'
              }
            `}
          >
            02 // Scout Nodes Mesh
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`px-4 py-2 text-[11px] font-bold tracking-wider uppercase transition-all rounded font-mono
              ${activeTab === 'playground' 
                ? 'bg-zinc-950 text-white border border-zinc-950' 
                : 'border border-transparent text-zinc-500 hover:text-zinc-900'
              }
            `}
          >
            03 // LLM Playground
          </button>

          <button
            onClick={() => setActiveTab('staking')}
            className={`px-4 py-2 text-[11px] font-bold tracking-wider uppercase transition-all rounded font-mono
              ${activeTab === 'staking' 
                ? 'bg-zinc-950 text-white border border-zinc-950' 
                : 'border border-transparent text-zinc-500 hover:text-zinc-900'
              }
            `}
          >
            04 // Staking Ledger
          </button>

        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 z-10 relative">
        {activeTab === 'telemetry' && <TelemetryTab />}
        {activeTab === 'nodes' && <ScoutNodesTab />}
        {activeTab === 'playground' && (
          <AuditPlaygroundTab 
            wallet={wallet} 
            onOpenWalletModal={() => setShowWalletModal(true)} 
          />
        )}
        {activeTab === 'staking' && (
          <StakingTab 
            wallet={wallet} 
            setWallet={setWallet} 
            onOpenWalletModal={() => setShowWalletModal(true)}
            onDisconnectWallet={handleDisconnectWallet}
          />
        )}
      </main>

      {/* Editorial Footer Container */}
      <footer className="w-full border-t border-zinc-200 bg-[#f5f5f4] py-6 z-20 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-zinc-400">
          <div>
            WANSOM SYSTEM // PROTOCOL SPECIFICATIONS FOR DECENTRALIZED COGNITIVE TRADING
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-zinc-650">
              <span className="w-1.5 h-1.5 bg-zinc-950 rounded-full"></span> 
              LEDGER INGRESS: SYNCED
            </span>
            <span className="text-zinc-300">|</span>
            <span className="flex items-center gap-1.5 font-semibold text-zinc-650">
              <span className="w-1.5 h-1.5 bg-zinc-950 rounded-full"></span> 
              DATABASE: SQLite
            </span>
          </div>
          <div>
            RECONCILED ON-CHAIN 2026. STABLE EMISSION FRAMEWORK.
          </div>
        </div>
      </footer>

      {/* Real Solana Wallet Selector Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-white border border-zinc-950 rounded p-5 w-full max-w-sm relative">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-3 mb-4">
              <h4 className="font-display font-bold text-sm text-zinc-900 uppercase tracking-wider">Connect Solana Wallet</h4>
              <button 
                onClick={() => setShowWalletModal(false)}
                className="text-zinc-400 hover:text-zinc-600 font-mono text-xs"
              >
                CLOSE
              </button>
            </div>
            
            <div className="space-y-2">
              {/* Phantom Button */}
              <button
                onClick={() => handleConnectWallet('Phantom')}
                className="w-full bg-[#fdfdfc] border border-zinc-200 hover:border-zinc-950 p-3 rounded flex items-center justify-between text-left font-bold text-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-[10px] text-white font-extrabold font-mono">Ph</div>
                  <span>Phantom Wallet</span>
                </div>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${isPhantomInstalled ? 'bg-zinc-100 text-zinc-900 border border-zinc-950' : 'text-zinc-400 bg-zinc-50'}`}>
                  {isPhantomInstalled ? 'DETECTED' : 'INSTALL'}
                </span>
              </button>

              {/* Solflare Button */}
              <button
                onClick={() => handleConnectWallet('Solflare')}
                className="w-full bg-[#fdfdfc] border border-zinc-200 hover:border-zinc-950 p-3 rounded flex items-center justify-between text-left font-bold text-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-[10px] text-white font-extrabold font-mono">Sf</div>
                  <span>Solflare Wallet</span>
                </div>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${isSolflareInstalled ? 'bg-zinc-100 text-zinc-900 border border-zinc-950' : 'text-zinc-400 bg-zinc-50'}`}>
                  {isSolflareInstalled ? 'DETECTED' : 'INSTALL'}
                </span>
              </button>

              {/* Backpack Button */}
              <button
                onClick={() => handleConnectWallet('Backpack')}
                className="w-full bg-[#fdfdfc] border border-zinc-200 hover:border-zinc-950 p-3 rounded flex items-center justify-between text-left font-bold text-zinc-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center text-[10px] text-white font-extrabold font-mono">Bp</div>
                  <span>Backpack Wallet</span>
                </div>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${isBackpackInstalled ? 'bg-zinc-100 text-zinc-900 border border-zinc-950' : 'text-zinc-400 bg-zinc-50'}`}>
                  {isBackpackInstalled ? 'DETECTED' : 'INSTALL'}
                </span>
              </button>
            </div>
            
            <p className="text-[9px] text-zinc-400 mt-4 leading-relaxed">
              * Extension auto-detection runs client-side. If a wallet is not installed, clicking will redirect to its installation page.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
