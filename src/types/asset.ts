
export interface AssetStrength {
  asset: string;
  name: string;
  strength: number;
  change: number;
  category: string;
  price?: number;
  priceChange?: number;
  timeframes?: {
    M1: number;
    M5: number;
    M15: number;
    M30: number;
    H1: number;
    H4: number;
    D1: number;
    W1: number;
    MN: number;
  };
}

export interface CurrencyHeatMapProps {
  preview?: boolean;
}
