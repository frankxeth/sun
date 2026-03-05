export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoChar: string;
}

export interface SwapState {
  tokenIn: Token | null;
  tokenOut: Token | null;
  amountIn: string;
  amountOut: string;
  slippage: number;
  priceImpact: number | null;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  network: string | null;
  connecting: boolean;
}

export interface TxStatus {
  status: 'idle' | 'simulating' | 'pending' | 'success' | 'error';
  message: string;
  txId?: string;
}
