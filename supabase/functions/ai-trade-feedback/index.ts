
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
    const { date, user_id, trades, daily_summary } = await req.json();

    if (!trades || trades.length === 0) {
      return new Response(JSON.stringify({ 
        feedback: "No trades found for this day." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const tradeSummary = trades.map((t: any) => ({
      symbol: t.symbol,
      pnl: t.pnl,
      risk_percent: t.risk_percent,
      session: t.session,
      strategy_tag: t.strategy_tag,
      entry_time: t.entry_time,
      lot_size: t.lot_size
    }));

    const prompt = `
As a professional trading psychology coach, analyze this trading day (${date}) and provide specific, actionable feedback.

DAILY SUMMARY:
- Net P&L: $${daily_summary.net_pnl}
- Total Trades: ${daily_summary.trade_count}
- AI Flagged: ${daily_summary.ai_flagged ? 'Yes' : 'No'}

INDIVIDUAL TRADES:
${JSON.stringify(tradeSummary, null, 2)}

Please provide feedback on:
1. **Risk Management**: Comment on position sizing and risk per trade
2. **Overtrading**: Assess if the number of trades is appropriate
3. **Session Timing**: Evaluate if trades align with proper market sessions
4. **Strategy Consistency**: Check for strategy adherence and discipline
5. **Performance Patterns**: Identify any concerning patterns

Keep feedback concise but specific. Highlight both strengths and areas for improvement.
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
            content: 'You are a professional trading psychology coach specializing in forex and derivatives trading. Provide constructive, specific feedback to help traders improve their performance and discipline.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const feedback = data.choices[0].message.content;

    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-trade-feedback function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      feedback: 'Unable to generate AI feedback at this time. Please try again later.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
