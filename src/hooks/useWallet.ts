import { useState, useCallback } from 'react';
import type { WalletState } from '../types';

// OPWallet / WalletConnect integration
// The actual wallet is injected as window.opnet by the OP_WALLET browser extension
declare global {
  interface Window {
    opnet?: {
      connect: () => Promise<{ address: string; network: string }>;
      disconnect: () => Promise<void>;
      getAddress: () => Promise<string>;
      getNetwork: () => Promise<string>;
      signTransaction: (tx: unknown) => Promise<unknown>;
      on: (event: string, cb: (...args: unknown[]) => void) => void;
      off: (event: string, cb: (...args: unknown[]) => void) => void;
    };
  }
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    network: null,
    connecting: false,
  });

  const connect = useCallback(async () => {
    setWallet(w => ({ ...w, connecting: true }));
    try {
      if (window.opnet) {
        const result = await window.opnet.connect();
        setWallet({
          connected: true,
          address: result.address,
          network: result.network,
          connecting: false,
        });
      } else {
        // Fallback: simulate connection for UI demo
        await new Promise(res => setTimeout(res, 1200));
        setWallet({
          connected: true,
          address: 'bcrt1q7x8k2m9p3n4r5s6t7u8v9w0a1b2c3d4e5f6g7',
          network: 'testnet',
          connecting: false,
        });
      }
    } catch (err) {
      console.error('Wallet connect failed:', err);
      setWallet(w => ({ ...w, connecting: false }));
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      if (window.opnet) await window.opnet.disconnect();
    } catch {}
    setWallet({ connected: false, address: null, network: null, connecting: false });
  }, []);

  return { wallet, connect, disconnect };
}
