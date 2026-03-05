# OPNet DEX — Testnet Frontend

A Bitcoin L1 DEX swap interface built on OP_NET.

## Stack
- React 18 + TypeScript
- Vite 5
- `opnet` SDK for contract interaction
- `@btc-vision/walletconnect` for wallet modal
- `@btc-vision/transaction` for ABI types

## Setup

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production → dist/
```

## Architecture

```
src/
  components/
    Header.tsx        — Nav + wallet connect/disconnect
    SwapCard.tsx      — Main swap UI (amounts, slippage, tx details)
    TokenSelector.tsx — Token picker modal
  hooks/
    useWallet.ts      — OP_WALLET / window.opnet connection
    useSwap.ts        — Swap state + OPNet contract calls
  lib/
    constants.ts      — Testnet RPC, token list, mock rates
  types/
    index.ts          — Shared TypeScript types
  App.tsx             — Root layout
  styles.css          — Full design system
  main.tsx            — Entry point
```

## Connecting to Real Contracts

In `src/hooks/useSwap.ts`, replace the mock simulation block with:

```typescript
import { JSONRpcProvider, getContract } from 'opnet';
import { ROUTER_ABI } from './abi'; // your router ABI
import { TESTNET_RPC } from '../lib/constants';

const provider = new JSONRpcProvider(TESTNET_RPC);
const contract = getContract<RouterABI>(
  ROUTER_ADDRESS,
  ROUTER_ABI,
  provider,
  'testnet',
  walletAddress
);

// Simulate first
const sim = await contract.swap(tokenIn.address, tokenOut.address, amountIn, minOut);
if ('error' in sim) throw new Error(sim.error);

// Send with null signers (frontend rule)
const tx = await sim.sendTransaction({
  signer: null,
  mldsaSigner: null,
  refundTo: walletAddress,
});
```

## Wallet

The app checks for `window.opnet` (injected by the OP_WALLET browser extension).
Falls back to a demo/mock connection if not installed.

## Deploy

```bash
npm run build
# Upload dist/ to IPFS or a .btc domain
```
