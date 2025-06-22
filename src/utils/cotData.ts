
export interface COTDataPoint {
  date: string;
  commercial: number;
  nonCommercial: number;
  total: number;
}

export const generateCOTData = (asset: string, offset = 0): COTDataPoint[] => [
  { date: "2024-01-01", commercial: 45000 + offset, nonCommercial: -42000 + offset, total: 3000 + offset },
  { date: "2024-01-08", commercial: 47000 + offset, nonCommercial: -44000 + offset, total: 3000 + offset },
  { date: "2024-01-15", commercial: 43000 + offset, nonCommercial: -40000 + offset, total: 3000 + offset },
  { date: "2024-01-22", commercial: 50000 + offset, nonCommercial: -47000 + offset, total: 3000 + offset },
  { date: "2024-01-29", commercial: 48000 + offset, nonCommercial: -45000 + offset, total: 3000 + offset },
  { date: "2024-02-05", commercial: 52000 + offset, nonCommercial: -49000 + offset, total: 3000 + offset },
];

export const createCombinedData = (data1: COTDataPoint[], data2: COTDataPoint[]) => {
  return data1.map((item, index) => ({
    ...item,
    commercial2: data2[index]?.commercial || 0,
    nonCommercial2: data2[index]?.nonCommercial || 0,
  }));
};

export const createPieData = (cotData: COTDataPoint[]) => [
  { name: "Commercial Long", value: Math.abs(cotData[cotData.length - 1]?.commercial || 0), fill: "#10b981" },
  { name: "Non-Commercial Long", value: Math.abs(cotData[cotData.length - 1]?.nonCommercial || 0), fill: "#ef4444" },
  { name: "Retail Traders", value: 15000, fill: "#3b82f6" },
];
