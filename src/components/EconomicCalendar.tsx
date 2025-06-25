
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Globe } from "lucide-react";
import { useState } from "react";

interface EconomicCalendarProps {
  preview?: boolean;
}

const EconomicCalendar = ({ preview = false }: EconomicCalendarProps) => {
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedImpact, setSelectedImpact] = useState("all");

  // Enhanced mock economic events data
  const events = [
    {
      id: 1,
      time: "08:30",
      country: "USD",
      event: "Non-Farm Payrolls",
      impact: "high",
      forecast: "200K",
      previous: "187K",
      actual: "210K"
    },
    {
      id: 2,
      time: "10:00",
      country: "EUR",
      event: "ECB Interest Rate Decision",
      impact: "high",
      forecast: "4.00%",
      previous: "4.00%",
      actual: null
    },
    {
      id: 3,
      time: "14:00",
      country: "GBP",
      event: "GDP q/q",
      impact: "medium",
      forecast: "0.3%",
      previous: "0.1%",
      actual: null
    },
    {
      id: 4,
      time: "16:30",
      country: "CAD",
      event: "Manufacturing PMI",
      impact: "low",
      forecast: "51.2",
      previous: "50.8",
      actual: null
    },
    {
      id: 5,
      time: "09:45",
      country: "EUR",
      event: "Inflation Rate YoY",
      impact: "high",
      forecast: "2.4%",
      previous: "2.6%",
      actual: "2.4%"
    },
    {
      id: 6,
      time: "15:00",
      country: "USD",
      event: "Fed Chair Speech",
      impact: "high",
      forecast: "-",
      previous: "-",
      actual: null
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getCurrencyFlag = (currency: string) => {
    const flags: Record<string, string> = {
      USD: "🇺🇸",
      EUR: "🇪🇺", 
      GBP: "🇬🇧",
      CAD: "🇨🇦",
      JPY: "🇯🇵"
    };
    return flags[currency] || "🌍";
  };

  const filteredEvents = events.filter(event => {
    const countryMatch = selectedCountry === "all" || event.country === selectedCountry;
    const impactMatch = selectedImpact === "all" || event.impact === selectedImpact;
    return countryMatch && impactMatch;
  });

  const displayEvents = preview ? filteredEvents.slice(0, 3) : filteredEvents;

  if (preview) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Economic Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 font-mono min-w-[3rem]">{event.time}</span>
                  <span className="text-lg">{getCurrencyFlag(event.country)}</span>
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-medium">{event.event}</span>
                    <span className="text-xs text-gray-400">{event.country}</span>
                  </div>
                </div>
                <Badge variant="outline" className={`${getImpactColor(event.impact)} text-xs`}>
                  {event.impact.toUpperCase()}
                </Badge>
              </div>
            ))}
            {filteredEvents.length > 3 && (
              <div className="text-xs text-gray-400 text-center pt-2 border-t border-gray-600">
                {filteredEvents.length - 3} more events today
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Economic Calendar
            </CardTitle>
            <div className="flex gap-2">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all" className="text-white">All Countries</SelectItem>
                  <SelectItem value="USD" className="text-white">🇺🇸 USD</SelectItem>
                  <SelectItem value="EUR" className="text-white">🇪🇺 EUR</SelectItem>
                  <SelectItem value="GBP" className="text-white">🇬🇧 GBP</SelectItem>
                  <SelectItem value="CAD" className="text-white">🇨🇦 CAD</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedImpact} onValueChange={setSelectedImpact}>
                <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Impact" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all" className="text-white">All Impact</SelectItem>
                  <SelectItem value="high" className="text-white">High</SelectItem>
                  <SelectItem value="medium" className="text-white">Medium</SelectItem>
                  <SelectItem value="low" className="text-white">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayEvents.map((event) => (
              <Card key={event.id} className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-mono">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getCurrencyFlag(event.country)}</span>
                        <span className="text-sm text-gray-300">{event.country}</span>
                      </div>
                      <Badge variant="outline" className={getImpactColor(event.impact)}>
                        {event.impact.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <h3 className="text-white font-semibold mb-3">{event.event}</h3>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Forecast</div>
                      <div className="text-blue-400 font-mono">{event.forecast}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Previous</div>
                      <div className="text-gray-300 font-mono">{event.previous}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Actual</div>
                      <div className={`font-mono ${event.actual ? 'text-green-400' : 'text-gray-500'}`}>
                        {event.actual || 'TBD'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {displayEvents.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">No events match your filters</div>
                <div className="text-sm text-gray-500">Try adjusting your country or impact level filters</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EconomicCalendar;
