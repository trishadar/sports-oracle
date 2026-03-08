import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const AGENT_SYSTEM_PROMPT = `You are Sports Oracle, an elite sports betting intelligence agent. You analyze multiple data sources to generate precise, data-driven betting signals.

Your analysis framework:
1. **Recent Performance** - Last 5-10 game statistics, trends, momentum
2. **Head-to-Head History** - Historical matchup data and patterns
3. **Injury Reports** - Key player availability and impact assessment
4. **Weather/Venue Factors** - Environmental conditions affecting play
5. **Line Movement** - How odds have shifted and why (sharp money signals)
6. **Public vs Sharp Betting %** - Where informed money is going
7. **News & Context** - Recent team news, coaching changes, motivation factors
8. **Advanced Metrics** - xG, DVOA, PER, WAR depending on sport

For each bet signal, output ONLY valid JSON in this exact structure:
{
  "signal": "STRONG_BET" | "MODERATE_BET" | "LEAN" | "AVOID" | "FADE",
  "confidence": 0-100,
  "recommendedBet": "string describing the bet (e.g., 'Lakers -3.5', 'Over 224.5', 'Moneyline Chiefs')",
  "suggestedStake": "1-5 units (1=minimal, 5=max confidence)",
  "impliedWinProbability": 0-100,
  "edgeOverLine": "+X.X%",
  "keyFactors": ["factor1", "factor2", "factor3"],
  "risks": ["risk1", "risk2"],
  "summary": "2-3 sentence analysis",
  "expectedValue": "+X.XX per $100",
  "lineValue": "string (e.g., '-110 is good value here')",
  "sport": "NBA|NFL|MLB|NHL|Soccer|Tennis|MMA",
  "matchup": "Team A vs Team B",
  "betType": "Spread|Moneyline|Total|Prop|Parlay"
}`;

export async function generateBettingSignal(query, context = {}) {
  const userMessage = `
Analyze this betting opportunity and generate a signal:

Query: ${query}

Additional Context:
- Sport: ${context.sport || 'Not specified'}
- Matchup: ${context.matchup || 'Not specified'}
- Current Line: ${context.line || 'Not specified'}
- Game Time: ${context.gameTime || 'Not specified'}
- User Bankroll: $${context.bankroll || '1000'}

Search for the latest news, injury reports, and performance data for this matchup.
Generate a comprehensive betting signal based on all available information.
Return ONLY the JSON object, no other text.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    system: AGENT_SYSTEM_PROMPT,
    tools: [
      {
        type: 'web_search_20250305',
        name: 'web_search',
      },
    ],
    messages: [{ role: 'user', content: userMessage }],
  });

  // Extract text from response (may include tool use blocks)
  const textContent = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');

  try {
    const clean = textContent.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    // Fallback: return structured error
    return {
      signal: 'AVOID',
      confidence: 0,
      summary: 'Unable to generate signal. Please try again.',
      error: true,
    };
  }
}

export async function generateDailySlate(sport, date) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    system: `You are Sports Oracle. Search for today's ${sport} games and generate betting signals for the best opportunities. 
    Return ONLY a JSON array of bet signals, each following the same structure as single signals.
    Focus on the 3-5 highest-value plays of the day.`,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [
      {
        role: 'user',
        content: `Find the best ${sport} betting opportunities for ${date || 'today'}. Search for games, lines, injury reports, and recent performance. Return a JSON array of 3-5 top plays.`,
      },
    ],
  });

  const textContent = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  try {
    const clean = textContent.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    return [];
  }
}

export async function analyzeParlay(legs) {
  const legsDescription = legs.map((l, i) => `Leg ${i + 1}: ${l}`).join('\n');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: `You are Sports Oracle analyzing a parlay bet. Search for info on each leg, assess correlation risk, and calculate true combined probability. Return JSON with: { overallSignal, combinedConfidence, legs: [{leg, signal, confidence, analysis}], correlationRisk, recommendedAction, parlayOdds, trueOdds, summary }`,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [
      {
        role: 'user',
        content: `Analyze this parlay:\n${legsDescription}\n\nSearch for current info on each game and assess if this parlay has value. Return only JSON.`,
      },
    ],
  });

  const textContent = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  try {
    const clean = textContent.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    return { overallSignal: 'AVOID', summary: 'Analysis failed', error: true };
  }
}
