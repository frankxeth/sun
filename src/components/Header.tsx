import type { WalletState } from '../types';

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

interface Props {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function Header({ wallet, onConnect, onDisconnect }: Props) {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-mark">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <polygon points="14,7 21,11 21,19 14,23 7,19 7,11" fill="currentColor" opacity="0.3"/>
              <circle cx="14" cy="14" r="3" fill="currentColor"/>
            </svg>
          </div>
          <span className="logo-text">OP<span>DEX</span></span>
        </div>
        <nav className="nav-links">
          <a className="nav-link active" href="#">Swap</a>
          <a className="nav-link" href="#">Pools</a>
          <a className="nav-link" href="#">Analytics</a>
        </nav>
      </div>

      <div className="header-right">
        <div className="network-badge">
          <span className="network-dot" />
          Testnet
        </div>
        {wallet.connected ? (
          <div className="wallet-connected">
            <span className="wallet-addr">{truncateAddress(wallet.address!)}</span>
            <button className="disconnect-btn" onClick={onDisconnect} title="Disconnect">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2h3v10H9M5 5L2 7l3 2M2 7h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        ) : (
          <button className="connect-wallet-btn" onClick={onConnect} disabled={wallet.connecting}>
            {wallet.connecting ? (
              <><span className="spinner-sm" /> Connecting...</>
            ) : (
              'Connect Wallet'
            )}
          </button>
        )}
      </div>
    </header>
  );
}
