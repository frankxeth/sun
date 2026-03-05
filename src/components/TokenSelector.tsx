import { useState } from 'react';
import type { Token } from '../types';
import { TESTNET_TOKENS } from '../lib/constants';

interface Props {
  selected: Token | null;
  onSelect: (token: Token) => void;
  exclude?: Token | null;
  label: string;
}

export function TokenSelector({ selected, onSelect, exclude, label }: Props) {
  const [open, setOpen] = useState(false);
  const tokens = TESTNET_TOKENS.filter(t => t.symbol !== exclude?.symbol);

  return (
    <div className="token-selector-wrapper">
      <span className="token-label">{label}</span>
      <button className="token-btn" onClick={() => setOpen(true)}>
        {selected ? (
          <>
            <span className="token-icon">{selected.logoChar}</span>
            <span className="token-symbol">{selected.symbol}</span>
          </>
        ) : (
          <span className="token-symbol">Select token</span>
        )}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div className="token-modal-overlay" onClick={() => setOpen(false)}>
          <div className="token-modal" onClick={e => e.stopPropagation()}>
            <div className="token-modal-header">
              <span>Select Token</span>
              <button className="modal-close" onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="token-list">
              {tokens.map(token => (
                <button
                  key={token.symbol}
                  className={`token-item ${selected?.symbol === token.symbol ? 'active' : ''}`}
                  onClick={() => { onSelect(token); setOpen(false); }}
                >
                  <span className="token-item-icon">{token.logoChar}</span>
                  <div className="token-item-info">
                    <span className="token-item-symbol">{token.symbol}</span>
                    <span className="token-item-name">{token.name}</span>
                  </div>
                  <span className="token-item-tag">OP-20</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
