import { TokenSelector } from './TokenSelector';
import type { SwapState, TxStatus } from '../types';

interface Props {
  swap: SwapState;
  txStatus: TxStatus;
  connected: boolean;
  onAmountInChange: (v: string) => void;
  onAmountOutChange: (v: string) => void;
  onFlip: () => void;
  onTokenIn: (t: SwapState['tokenIn'] & {}) => void;
  onTokenOut: (t: SwapState['tokenOut'] & {}) => void;
  onSlippage: (s: number) => void;
  onSwap: () => void;
  onConnect: () => void;
  getRate: (a: string, b: string) => number;
}

const SLIPPAGE_OPTS = [0.1, 0.5, 1.0, 3.0];

export function SwapCard({
  swap, txStatus, connected,
  onAmountInChange, onAmountOutChange,
  onFlip, onTokenIn, onTokenOut,
  onSlippage, onSwap, onConnect, getRate,
}: Props) {
  const isLoading = txStatus.status === 'simulating' || txStatus.status === 'pending';
  const canSwap = connected && swap.tokenIn && swap.tokenOut && swap.amountIn && parseFloat(swap.amountIn) > 0;

  const rate = swap.tokenIn && swap.tokenOut
    ? getRate(swap.tokenIn.symbol, swap.tokenOut.symbol)
    : null;

  return (
    <div className="swap-card">
      {/* Header */}
      <div className="swap-card-header">
        <h2 className="swap-title">Swap</h2>
        <div className="settings-row">
          <span className="slippage-label">Slippage</span>
          {SLIPPAGE_OPTS.map(s => (
            <button
              key={s}
              className={`slippage-btn ${swap.slippage === s ? 'active' : ''}`}
              onClick={() => onSlippage(s)}
            >
              {s}%
            </button>
          ))}
        </div>
      </div>

      {/* Input: Pay */}
      <div className="swap-input-group">
        <div className="swap-input-header">
          <TokenSelector
            selected={swap.tokenIn}
            onSelect={onTokenIn as any}
            exclude={swap.tokenOut}
            label="You Pay"
          />
          <span className="balance-hint">Balance: —</span>
        </div>
        <input
          className="swap-amount-input"
          type="number"
          placeholder="0.0"
          value={swap.amountIn}
          onChange={e => onAmountInChange(e.target.value)}
          min="0"
        />
        {swap.amountIn && swap.tokenIn && (
          <span className="usd-hint">≈ ${(parseFloat(swap.amountIn) * 58200).toLocaleString()}</span>
        )}
      </div>

      {/* Flip */}
      <div className="flip-row">
        <button className="flip-btn" onClick={onFlip} title="Flip tokens">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 3L6 17M6 17L3 14M6 17L9 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 17L14 3M14 3L11 6M14 3L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {rate !== null && swap.tokenIn && swap.tokenOut && (
          <span className="rate-display">
            1 {swap.tokenIn.symbol} = {rate >= 1 ? rate.toLocaleString() : rate.toFixed(8)} {swap.tokenOut.symbol}
          </span>
        )}
      </div>

      {/* Input: Receive */}
      <div className="swap-input-group">
        <div className="swap-input-header">
          <TokenSelector
            selected={swap.tokenOut}
            onSelect={onTokenOut as any}
            exclude={swap.tokenIn}
            label="You Receive"
          />
          <span className="balance-hint">Balance: —</span>
        </div>
        <input
          className="swap-amount-input"
          type="number"
          placeholder="0.0"
          value={swap.amountOut}
          onChange={e => onAmountOutChange(e.target.value)}
          min="0"
        />
      </div>

      {/* Price Impact */}
      {swap.priceImpact !== null && (
        <div className={`price-impact ${swap.priceImpact > 5 ? 'high' : swap.priceImpact > 2 ? 'medium' : 'low'}`}>
          <span>Price Impact</span>
          <span>{swap.priceImpact.toFixed(2)}%</span>
        </div>
      )}

      {/* Tx Details */}
      {swap.tokenIn && swap.tokenOut && swap.amountOut && (
        <div className="tx-details">
          <div className="tx-detail-row">
            <span>Min. Received</span>
            <span>{(parseFloat(swap.amountOut || '0') * (1 - swap.slippage / 100)).toFixed(6)} {swap.tokenOut.symbol}</span>
          </div>
          <div className="tx-detail-row">
            <span>Network Fee</span>
            <span>~0.0001 BTC</span>
          </div>
          <div className="tx-detail-row">
            <span>Route</span>
            <span>{swap.tokenIn.symbol} → {swap.tokenOut.symbol}</span>
          </div>
        </div>
      )}

      {/* Action Button */}
      {!connected ? (
        <button className="swap-btn connect" onClick={onConnect}>
          Connect Wallet
        </button>
      ) : (
        <button
          className={`swap-btn ${isLoading ? 'loading' : ''} ${!canSwap ? 'disabled' : ''}`}
          onClick={onSwap}
          disabled={!canSwap || isLoading}
        >
          {isLoading ? (
            <span className="btn-content">
              <span className="spinner" />
              {txStatus.status === 'simulating' ? 'Simulating...' : 'Broadcasting...'}
            </span>
          ) : (
            'Swap'
          )}
        </button>
      )}

      {/* Tx Status */}
      {txStatus.status === 'success' && (
        <div className="tx-status success">
          <span>✓ {txStatus.message}</span>
          {txStatus.txId && (
            <a
              href={`https://testnet.opnet.org/tx/${txStatus.txId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tx-link"
            >
              View on Explorer ↗
            </a>
          )}
        </div>
      )}
      {txStatus.status === 'error' && (
        <div className="tx-status error">
          <span>✗ {txStatus.message}</span>
        </div>
      )}
    </div>
  );
}
