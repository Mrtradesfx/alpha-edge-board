
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { week, user_id, stats } = await req.json();

    const prompt = `
As a professional trading psychology coach, analyze this weekly trading performance (Week ${week}) and provide strategic insights.

WEEKLY PERFORMANCE METRICS:
- Total Trades: ${stats.totalTrades}
- Net P&L: $${stats.totalPnl.toFixed(2)}
- Win Rate: ${stats.winRate.toFixed(1)}%
- Average Risk per Trade: ${stats.avgRisk.toFixed(1)}%
- Overtrading Flag: ${stats.overtradingFlag ? 'YES' : 'NO'}
- Trading Sessions: ${stats.sessionAlignment.join(', ') || 'None specified'}
- Dominant Strategy: ${stats.dominantStrategy}

Please provide strategic weekly insights focusing on:

1. **Weekly Performance Review**: Overall assessment of the week's trading
2. **Risk Management Analysis**: Evaluation of risk consistency and sizing
3. **Trading Frequency**: Assessment of trade frequency and potential overtrading
4. **Session Analysis**: Effectiveness of chosen trading sessions
5. **Strategy Focus**: Consistency and effectiveness of trading approach
6. **Recommendations**: 2-3 specific actionable improvements for next week

Keep insights strategic and forward-looking. Focus on behavioral patterns and improvements.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional trading psychology coach specializing in weekly performance analysis and strategic planning for forex and derivatives traders.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const feedback = data.choices[0].message.content;

    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-weekly-feedback function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      feedback: 'Unable to generate weekly insights at this time. Please try again later.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
