import 'dotenv/config';
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Get live scores and game info
router.get('/live/:sport', async (req, res) => {
  try {
    const { sport } = req.params;
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{
        role: 'user',
        content: `Search for live ${sport} scores and today's upcoming games. Return JSON array: [{homeTeam, awayTeam, score, status, time, sport}]. Return ONLY JSON array.`
      }]
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('');
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      const games = JSON.parse(clean);
      res.json({ success: true, games });
    } catch {
      res.json({ success: true, games: [] });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get injury report
router.get('/injuries/:team', async (req, res) => {
  try {
    const { team } = req.params;
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{
        role: 'user',
        content: `Search for the latest injury report for ${team}. Return JSON: {team, injuries: [{player, position, status, notes}]}. Return ONLY JSON.`
      }]
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('');
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      res.json({ success: true, ...JSON.parse(clean) });
    } catch {
      res.json({ success: true, team, injuries: [] });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get trending news
router.get('/news/:sport', async (req, res) => {
  try {
    const { sport } = req.params;
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{
        role: 'user',
        content: `Find the top 5 most important ${sport} betting-relevant news stories today. Return JSON array: [{headline, summary, impact: "HIGH"|"MEDIUM"|"LOW", team, publishedAt}]. ONLY JSON.`
      }]
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('');
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      const news = JSON.parse(clean);
      res.json({ success: true, news });
    } catch {
      res.json({ success: true, news: [] });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
