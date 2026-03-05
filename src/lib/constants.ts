import type { Token } from '../types';

export const TESTNET_RPC = 'https://testnet.opnet.org';

export const TESTNET_TOKENS: Token[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    address: 'native',
    decimals: 8,
    logoChar: '₿',
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    address: 'bcrt1qtest000wbtc000000000000000000000000000',
    decimals: 8,
    logoChar: 'W',
  },
  {
    symbol: 'MOTO',
    name: 'Moto Token',
    address: 'bcrt1qtest000moto000000000000000000000000000',
    decimals: 18,
    logoChar: 'M',
  },
  {
    symbol: 'PEPE',
    name: 'Pepe OP-20',
    address: 'bcrt1qtest000pepe000000000000000000000000000',
    decimals: 18,
    logoChar: 'P',
  },
  {
    symbol: 'ORDI',
    name: 'Ordi OP-20',
    address: 'bcrt1qtest000ordi000000000000000000000000000',
    decimals: 18,
    logoChar: 'O',
  },
];

export const SLIPPAGE_OPTIONS = [0.1, 0.5, 1.0, 3.0];

export const MOCK_RATES: Record<string, Record<string, number>> = {
  BTC: { WBTC: 1.0, MOTO: 58200, PEPE: 1240000, ORDI: 880 },
  WBTC: { BTC: 1.0, MOTO: 58200, PEPE: 1240000, ORDI: 880 },
  MOTO: { BTC: 0.0000172, WBTC: 0.0000172, PEPE: 21.3, ORDI: 0.0151 },
  PEPE: { BTC: 0.000000807, WBTC: 0.000000807, MOTO: 0.047, ORDI: 0.00071 },
  ORDI: { BTC: 0.001136, WBTC: 0.001136, MOTO: 66.1, PEPE: 1408 },
};
