import { useState, useCallback } from 'react';
import type { SwapState, TxStatus } from '../types';
import { TESTNET_TOKENS, MOCK_RATES } from '../lib/constants';

const DEFAULT_STATE: SwapState = {
  tokenIn: TESTNET_TOKENS[0],
  tokenOut: TESTNET_TOKENS[2],
  amountIn: '',
  amountOut: '',
  slippage: 0.5,
  priceImpact: null,
};

export function useSwap(walletAddress: string | null) {
  const [swap, setSwap] = useState<SwapState>(DEFAULT_STATE);
  const [txStatus, setTxStatus] = useState<TxStatus>({ status: 'idle', message: '' });

  const getRate = useCallback((symbolIn: string, symbolOut: string): number => {
    return MOCK_RATES[symbolIn]?.[symbolOut] ?? 0;
  }, []);

  const updateAmountIn = useCallback((value: string) => {
    setSwap(s => {
      if (!s.tokenIn || !s.tokenOut) return { ...s, amountIn: value };
      const rate = getRate(s.tokenIn.symbol, s.tokenOut.symbol);
      const parsed = parseFloat(value);
      const amountOut = isNaN(parsed) || parsed === 0 ? '' : (parsed * rate).toFixed(6);
      const impact = isNaN(parsed) ? null : Math.min(parsed * 0.003, 15);
      return { ...s, amountIn: value, amountOut, priceImpact: impact };
    });
  }, [getRate]);

  const updateAmountOut = useCallback((value: string) => {
    setSwap(s => {
      if (!s.tokenIn || !s.tokenOut) return { ...s, amountOut: value };
      const rate = getRate(s.tokenIn.symbol, s.tokenOut.symbol);
      const parsed = parseFloat(value);
      const amountIn = isNaN(parsed) || parsed === 0 || rate === 0 ? '' : (parsed / rate).toFixed(8);
      const impact = isNaN(parsed) ? null : Math.min(parsed * 0.003, 15);
      return { ...s, amountOut: value, amountIn, priceImpact: impact };
    });
  }, [getRate]);

  const flipTokens = useCallback(() => {
    setSwap(s => ({
      ...s,
      tokenIn: s.tokenOut,
      tokenOut: s.tokenIn,
      amountIn: s.amountOut,
      amountOut: s.amountIn,
    }));
  }, []);

  const setTokenIn = useCallback((token: typeof TESTNET_TOKENS[0]) => {
    setSwap(s => {
      const newOut = s.tokenOut?.symbol === token.symbol ? s.tokenIn : s.tokenOut;
      const rate = getRate(token.symbol, newOut?.symbol ?? '');
      const parsed = parseFloat(s.amountIn);
      const amountOut = isNaN(parsed) || !newOut ? '' : (parsed * rate).toFixed(6);
      return { ...s, tokenIn: token, tokenOut: newOut, amountOut };
    });
  }, [getRate]);

  const setTokenOut = useCallback((token: typeof TESTNET_TOKENS[0]) => {
    setSwap(s => {
      const newIn = s.tokenIn?.symbol === token.symbol ? s.tokenOut : s.tokenIn;
      const rate = getRate(newIn?.symbol ?? '', token.symbol);
      const parsed = parseFloat(s.amountIn);
      const amountOut = isNaN(parsed) || !newIn ? '' : (parsed * rate).toFixed(6);
      return { ...s, tokenOut: token, tokenIn: newIn, amountOut };
    });
  }, [getRate]);

  const setSlippage = useCallback((slippage: number) => {
    setSwap(s => ({ ...s, slippage }));
  }, []);

  const executeSwap = useCallback(async () => {
    if (!walletAddress || !swap.tokenIn || !swap.tokenOut || !swap.amountIn) return;

    setTxStatus({ status: 'simulating', message: 'Simulating transaction...' });

    try {
      // In production, this is where you'd do:
      // const provider = new JSONRpcProvider(TESTNET_RPC);
      // const contract = getContract<RouterABI>(ROUTER_ADDRESS, ROUTER_ABI, provider, 'testnet', walletAddress);
      // const sim = await contract.swap(tokenIn.address, tokenOut.address, amountIn, minOut);
      // if ('error' in sim) throw new Error(sim.error);
      // const tx = await sim.sendTransaction({ signer: null, mldsaSigner: null, refundTo: walletAddress });

      await new Promise(res => setTimeout(res, 1500));
      setTxStatus({ status: 'pending', message: 'Broadcasting to Bitcoin testnet...' });
      await new Promise(res => setTimeout(res, 2000));

      const mockTxId = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxStatus({
        status: 'success',
        message: `Swapped ${swap.amountIn} ${swap.tokenIn.symbol} → ${swap.amountOut} ${swap.tokenOut.symbol}`,
        txId: mockTxId,
      });

      setSwap(s => ({ ...s, amountIn: '', amountOut: '', priceImpact: null }));
    } catch (err) {
      setTxStatus({ status: 'error', message: err instanceof Error ? err.message : 'Swap failed' });
    }
  }, [walletAddress, swap]);

  const resetTxStatus = useCallback(() => {
    setTxStatus({ status: 'idle', message: '' });
  }, []);

  return {
    swap,
    txStatus,
    updateAmountIn,
    updateAmountOut,
    flipTokens,
    setTokenIn,
    setTokenOut,
    setSlippage,
    executeSwap,
    resetTxStatus,
    getRate,
  };
}
