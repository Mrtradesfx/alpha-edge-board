
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  MessageSquare,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JournalEntry {
  id: string;
  text: string;
  timestamp: Date;
  aiAnalysis?: {
    emotionalTone: string;
    tradingIssues: string[];
    recommendations: string[];
    mindsetTip: string;
  };
}

interface TradingInsight {
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
  timestamp: Date;
}

const AITradeCoach = () => {
  const [journalText, setJournalText] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights] = useState<TradingInsight[]>([
    {
      type: 'warning',
      title: 'Revenge Trading Pattern Detected',
      description: 'You tend to increase position sizes after losses. Consider implementing a cooling-off period.',
      timestamp: new Date()
    },
    {
      type: 'success',
      title: 'Strong Morning Performance',
      description: 'Your win rate is 78% between 9-11 AM. Focus your trading during this window.',
      timestamp: new Date()
    },
    {
      type: 'info',
      title: 'Session Length Optimization',
      description: 'Performance decreases after 3 hours of continuous trading. Consider shorter sessions.',
      timestamp: new Date()
    }
  ]);

  const analyzeJournalEntry = async (text: string) => {
    setIsAnalyzing(true);
    
    // Mock AI analysis - replace with actual AI API when Supabase is connected
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    
    const mockAnalysis = {
      emotionalTone: detectEmotionalTone(text),
      tradingIssues: detectTradingIssues(text),
      recommendations: generateRecommendations(text),
      mindsetTip: generateMindsetTip()
    };

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
      aiAnalysis: mockAnalysis
    };

    setEntries(prev => [newEntry, ...prev]);
    setJournalText("");
    setIsAnalyzing(false);
  };

  const detectEmotionalTone = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('frustrated') || lowerText.includes('angry') || lowerText.includes('hate')) {
      return 'Frustrated/Angry';
    }
    if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('nervous')) {
      return 'Anxious';
    }
    if (lowerText.includes('confident') || lowerText.includes('good') || lowerText.includes('great')) {
      return 'Confident';
    }
    return 'Neutral';
  };

  const detectTradingIssues = (text: string): string[] => {
    const issues = [];
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('revenge') || lowerText.includes('get back')) {
      issues.push('Revenge trading tendency');
    }
    if (lowerText.includes('tired') || lowerText.includes('exhausted')) {
      issues.push('Trading while fatigued');
    }
    if (lowerText.includes('fomo') || lowerText.includes('fear of missing')) {
      issues.push('FOMO-driven decisions');
    }
    if (lowerText.includes('overtraded') || lowerText.includes('too many')) {
      issues.push('Overtrading behavior');
    }
    
    return issues.length > 0 ? issues : ['No major issues detected'];
  };

  const generateRecommendations = (text: string): string[] => {
    const recommendations = [];
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('loss') || lowerText.includes('lost')) {
      recommendations.push('Take a 15-minute break before your next trade');
      recommendations.push('Review your risk management rules');
    }
    if (lowerText.includes('emotional')) {
      recommendations.push('Practice deep breathing before trading');
      recommendations.push('Consider reducing position sizes when emotional');
    }
    if (recommendations.length === 0) {
      recommendations.push('Continue following your trading plan');
      recommendations.push('Document what worked well today');
    }
    
    return recommendations;
  };

  const generateMindsetTip = (): string => {
    const tips = [
      "Focus on process over profits. Consistent execution leads to consistent results.",
      "Every loss is tuition paid to the market university. What did you learn?",
      "The market will be here tomorrow. Protect your capital for another day.",
      "Your edge comes from discipline, not from being right all the time.",
      "Trade your plan, don't plan your trades during market hours."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  const handleSubmit = () => {
    if (!journalText.trim()) return;
    analyzeJournalEntry(journalText);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
          <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Trade Coach</h1>
          <p className="text-gray-600 dark:text-gray-400">Personalized trading psychology analysis</p>
        </div>
      </div>

      {/* Trading Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Trading Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
              {insight.type === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />}
              {insight.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
              {insight.type === 'info' && <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{insight.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{insight.description}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {insight.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Journal Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-500" />
            Trading Journal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Reflect on your trading session here... How did you feel? What decisions did you make? Any emotional triggers?"
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            className="min-h-[120px]"
          />
          <Button 
            onClick={handleSubmit} 
            disabled={!journalText.trim() || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Get AI Feedback
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Journal Entries */}
      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {entry.timestamp.toLocaleString()}
                  </Badge>
                  <Badge className={cn(
                    "text-xs",
                    entry.aiAnalysis?.emotionalTone === 'Frustrated/Angry' && "bg-red-100 text-red-700",
                    entry.aiAnalysis?.emotionalTone === 'Anxious' && "bg-yellow-100 text-yellow-700",
                    entry.aiAnalysis?.emotionalTone === 'Confident' && "bg-green-100 text-green-700",
                    entry.aiAnalysis?.emotionalTone === 'Neutral' && "bg-gray-100 text-gray-700"
                  )}>
                    {entry.aiAnalysis?.emotionalTone}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  "{entry.text}"
                </p>
                
                {entry.aiAnalysis && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-2">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">AI Analysis</h4>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Trading Issues:</p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                        {entry.aiAnalysis.tradingIssues.map((issue, idx) => (
                          <li key={idx}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Recommendations:</p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                        {entry.aiAnalysis.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded p-2">
                      <p className="text-sm font-medium text-purple-900 dark:text-purple-100">💡 Mindset Tip:</p>
                      <p className="text-sm text-purple-700 dark:text-purple-300">{entry.aiAnalysis.mindsetTip}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AITradeCoach;
