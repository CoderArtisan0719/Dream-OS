export interface ISwapWidget {
  amount: number;
  coin: string;
  balance: number;
  tag: string;
  coinAmount: number;
  tokenIcon: string;
}

export interface TokenOption {
  logoURI: string;
  name: string;
  amount?: number;
  rate?: number;
  symbol: string;
}