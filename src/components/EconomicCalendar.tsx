
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Globe, RefreshCw, AlertCircle, ExternalLink, Brain, Loader2 } from "lucide-react";
import { useState } from "react";
import { useEconomicCalendar } from "@/hooks/useEconomicCalendar";

interface EconomicCalendarProps {
  preview?: boolean;
}

const EconomicCalendar = ({ preview = false }: EconomicCalendarProps) => {
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedImpact, setSelectedImpact] = useState("all");
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const { data: events = [], isLoading, error, refetch } = useEconomicCalendar([
    'United States', 
    'Euro Zone', 
    'United Kingdom', 
    'Canada', 
    'Japan'
  ]);

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
      JPY: "🇯🇵",
      AUD: "🇦🇺",
      CHF: "🇨🇭",
      NZD: "🇳🇿"
    };
    return flags[currency] || "🌍";
  };

  const filteredEvents = events.filter(event => {
    const countryMatch = selectedCountry === "all" || event.country === selectedCountry;
    const impactMatch = selectedImpact === "all" || event.impact === selectedImpact;
    return countryMatch && impactMatch;
  });

  const displayEvents = preview ? filteredEvents.slice(0, 3) : filteredEvents;

  const analyzeWithAI = async () => {
    if (filteredEvents.length === 0) {
      setAnalysisError("No events to analyze");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAiAnalysis(null);

    try {
      const prompt = `
Here is a list of upcoming forex news events:

${JSON.stringify(filteredEvents, null, 2)}

Analyze these events and provide insights on:
1. Which events are likely to have significant market impact
2. How they might affect major currency pairs (EUR/USD, GBP/USD, USD/JPY, etc.)
3. Potential impact on commodities (Gold, Oil) and crypto markets
4. Any correlations between events
5. Risk assessment and trading considerations

Provide a concise but comprehensive analysis with reasoning.
`;

      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`AI analysis failed: ${response.status}`);
      }

      const data = await response.json();
      setAiAnalysis(data.analysis || 'No analysis generated');
    } catch (error) {
      console.error('AI Analysis Error:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Failed to analyze events');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Error state component
  const ErrorState = ({ isPreview = false }: { isPreview?: boolean }) => (
    <div className={`text-center ${isPreview ? 'py-4' : 'py-8'}`}>
      <AlertCircle className={`mx-auto text-red-400 mb-3 ${isPreview ? 'w-6 h-6' : 'w-8 h-8'}`} />
      <div className="text-red-400 mb-2">
        {isPreview ? 'API Access Required' : 'Economic Calendar Unavailable'}
      </div>
      <div className={`text-gray-400 mb-4 ${isPreview ? 'text-xs' : 'text-sm'}`}>
        Trading Economics API requires authentication
      </div>
      {!isPreview && (
        <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
          <a 
            href="https://tradingeconomics.com/contact.aspx?subject=API"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Get API Access
          </a>
        </div>
      )}
    </div>
  );

  if (preview) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Economic Calendar
            {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-4 bg-gray-600 rounded"></div>
                    <div className="w-6 h-6 bg-gray-600 rounded"></div>
                    <div className="w-32 h-4 bg-gray-600 rounded"></div>
                  </div>
                  <div className="w-16 h-6 bg-gray-600 rounded"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorState isPreview={true} />
          ) : (
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
              {displayEvents.length === 0 && !isLoading && !error && (
                <div className="text-center py-4 text-gray-400">
                  No events scheduled for today
                </div>
              )}
            </div>
          )}
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
              {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
            </CardTitle>
            {!error && (
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
                    <SelectItem value="JPY" className="text-white">🇯🇵 JPY</SelectItem>
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

                {displayEvents.length > 0 && (
                  <button
                    onClick={analyzeWithAI}
                    disabled={isAnalyzing}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Brain className="w-4 h-4" />
                    )}
                    {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
                  </button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-gray-700/30 border-gray-600 animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-4 bg-gray-600 rounded"></div>
                        <div className="w-8 h-8 bg-gray-600 rounded"></div>
                        <div className="w-20 h-6 bg-gray-600 rounded"></div>
                      </div>
                    </div>
                    <div className="w-48 h-6 bg-gray-600 rounded mb-3"></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="w-16 h-8 bg-gray-600 rounded"></div>
                      <div className="w-16 h-8 bg-gray-600 rounded"></div>
                      <div className="w-16 h-8 bg-gray-600 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <ErrorState />
          ) : (
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
              
              {displayEvents.length === 0 && !error && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">No events match your filters</div>
                  <div className="text-sm text-gray-500">Try adjusting your country or impact level filters</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {(aiAnalysis || analysisError) && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Market Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysisError ? (
              <div className="text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                {analysisError}
              </div>
            ) : (
              <div className="text-gray-300 text-sm whitespace-pre-wrap">
                {aiAnalysis}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EconomicCalendar;
