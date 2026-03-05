import { useWallet } from './hooks/useWallet';
import { useSwap } from './hooks/useSwap';
import { Header } from './components/Header';
import { SwapCard } from './components/SwapCard';
import './styles.css';

export default function App() {
  const { wallet, connect, disconnect } = useWallet();
  const {
    swap, txStatus,
    updateAmountIn, updateAmountOut,
    flipTokens, setTokenIn, setTokenOut,
    setSlippage, executeSwap, getRate,
  } = useSwap(wallet.address);

  return (
    <div className="app">
      {/* Animated background */}
      <div className="bg-grid" />
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <div className="bg-glow bg-glow-3" />

      <Header wallet={wallet} onConnect={connect} onDisconnect={disconnect} />

      <main className="main">
        <div className="main-content">
          <SwapCard
            swap={swap}
            txStatus={txStatus}
            connected={wallet.connected}
            onAmountInChange={updateAmountIn}
            onAmountOutChange={updateAmountOut}
            onFlip={flipTokens}
            onTokenIn={setTokenIn as any}
            onTokenOut={setTokenOut as any}
            onSlippage={setSlippage}
            onSwap={executeSwap}
            onConnect={connect}
            getRate={getRate}
          />

          {/* Market ticker */}
          <div className="market-ticker">
            <div className="ticker-item">
              <span className="ticker-label">BTC/USDT</span>
              <span className="ticker-value">$58,200</span>
              <span className="ticker-change positive">+2.4%</span>
            </div>
            <div className="ticker-divider" />
            <div className="ticker-item">
              <span className="ticker-label">MOTO/BTC</span>
              <span className="ticker-value">0.0000172</span>
              <span className="ticker-change negative">-0.8%</span>
            </div>
            <div className="ticker-divider" />
            <div className="ticker-item">
              <span className="ticker-label">ORDI/BTC</span>
              <span className="ticker-value">0.001136</span>
              <span className="ticker-change positive">+5.1%</span>
            </div>
            <div className="ticker-divider" />
            <div className="ticker-item">
              <span className="ticker-label">TVL</span>
              <span className="ticker-value">$2.4M</span>
              <span className="ticker-change positive">+12.3%</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <span>Built on Bitcoin L1 via OP_NET · Testnet</span>
        <span className="footer-sep">·</span>
        <a href="https://opnet.org" target="_blank" rel="noopener noreferrer">opnet.org ↗</a>
      </footer>
    </div>
  );
}
