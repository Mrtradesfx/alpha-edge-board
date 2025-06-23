
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CurrencyStrength {
  currency: string;
  name: string;
  strength: number;
  change: number;
}

interface CurrencyHeatMapProps {
  preview?: boolean;
}

const CurrencyHeatMap = ({ preview = false }: CurrencyHeatMapProps) => {
  // Mock currency strength data (in a real app, this would come from an API)
  const currencyData: CurrencyStrength[] = [
    { currency: "USD", name: "US Dollar", strength: 85, change: 2.3 },
    { currency: "EUR", name: "Euro", strength: 72, change: -1.2 },
    { currency: "GBP", name: "British Pound", strength: 68, change: 0.8 },
    { currency: "JPY", name: "Japanese Yen", strength: 45, change: -3.1 },
    { currency: "CHF", name: "Swiss Franc", strength: 78, change: 1.5 },
    { currency: "CAD", name: "Canadian Dollar", strength: 62, change: -0.5 },
    { currency: "AUD", name: "Australian Dollar", strength: 58, change: -1.8 },
    { currency: "NZD", name: "New Zealand Dollar", strength: 52, change: -2.2 },
  ];

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return "bg-green-500";
    if (strength >= 70) return "bg-green-400";
    if (strength >= 60) return "bg-yellow-400";
    if (strength >= 50) return "bg-orange-400";
    return "bg-red-500";
  };

  const getStrengthOpacity = (strength: number) => {
    return Math.max(0.3, strength / 100);
  };

  if (preview) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {currencyData.slice(0, 4).map((currency) => (
            <div
              key={currency.currency}
              className={`${getStrengthColor(currency.strength)} rounded p-2 text-white text-center`}
              style={{ opacity: getStrengthOpacity(currency.strength) }}
            >
              <div className="font-bold text-sm">{currency.currency}</div>
              <div className="text-xs">{currency.strength}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-400 text-center">
          Currency Strength Index
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Currency Strength Heat Map
        </CardTitle>
        <p className="text-sm text-gray-400">
          Real-time relative strength of major currencies
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Heat Map Grid */}
          <div className="grid grid-cols-4 gap-3">
            {currencyData.map((currency) => (
              <div
                key={currency.currency}
                className={`${getStrengthColor(currency.strength)} rounded-lg p-4 text-white relative overflow-hidden transition-all duration-300 hover:scale-105`}
                style={{ opacity: getStrengthOpacity(currency.strength) }}
              >
                <div className="relative z-10">
                  <div className="font-bold text-lg">{currency.currency}</div>
                  <div className="text-xs opacity-90 mb-2">{currency.name}</div>
                  <div className="font-semibold text-xl">{currency.strength}</div>
                  <div className="flex items-center gap-1 text-xs">
                    {currency.change >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className={currency.change >= 0 ? "text-green-200" : "text-red-200"}>
                      {currency.change >= 0 ? "+" : ""}{currency.change}%
                    </span>
                  </div>
                </div>
                {/* Background pattern for visual interest */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-white opacity-10 rounded-full transform translate-x-2 -translate-y-2"></div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold text-gray-300">Strength Scale</div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Weak (0-49)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-400 rounded"></div>
                <span>Fair (50-59)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span>Good (60-69)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span>Strong (70-79)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Very Strong (80+)</span>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="text-sm font-semibold text-gray-300 mb-3">Top Performers</div>
            <div className="grid grid-cols-3 gap-4">
              {currencyData
                .sort((a, b) => b.change - a.change)
                .slice(0, 3)
                .map((currency, index) => (
                  <div key={currency.currency} className="text-center">
                    <div className="text-lg font-bold text-white">{currency.currency}</div>
                    <div className="text-xs text-gray-400">{currency.name}</div>
                    <div className="text-green-400 font-semibold">+{currency.change}%</div>
                    {index === 0 && <div className="text-xs text-yellow-400 mt-1">🏆 Best</div>}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyHeatMap;
