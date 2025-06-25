
export interface NewsLocation {
  id: number;
  lat: number;
  lng: number;
  intensity: number;
  sentiment: "bullish" | "bearish" | "neutral";
  headline: string;
}

export interface GlobeAnimationProps {
  canvas: HTMLCanvasElement;
  newsLocations: NewsLocation[];
  rotationRef: React.MutableRefObject<number>;
}
