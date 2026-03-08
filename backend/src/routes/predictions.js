import express from 'express';
import { generateBettingSignal, generateDailySlate, analyzeParlay } from '../agents/bettingAgent.js';
import { broadcast } from '../index.js';
import { requireAuth, incrementUsage, usageInfo } from '../middleware/auth.js';

const router = express.Router();

// Get current usage for logged-in user
router.get('/usage', requireAuth, usageInfo);

// Generate single bet signal
router.post('/signal', requireAuth, async (req, res) => {
  try {
    const { query, sport, matchup, line, gameTime, bankroll } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    broadcast({ type: 'analysis_started', matchup: matchup || query });

    const signal = await generateBettingSignal(query, { sport, matchup, line, gameTime, bankroll });

    // Only count usage on success
    const used = incrementUsage(req.userId);

    broadcast({ type: 'signal_ready', signal });
    res.json({ success: true, signal, timestamp: new Date().toISOString(), signalsUsed: used });
  } catch (err) {
    console.error('Signal error:', err);
    res.status(500).json({ error: 'Failed to generate signal', details: err.message });
  }
});

// Daily slate
router.get('/slate/:sport', requireAuth, async (req, res) => {
  try {
    const { sport } = req.params;
    const { date } = req.query;
    const signals = await generateDailySlate(sport, date);
    const used = incrementUsage(req.userId);
    res.json({ success: true, signals, sport, date: date || new Date().toISOString().split('T')[0], signalsUsed: used });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate slate', details: err.message });
  }
});

// Parlay analyzer
router.post('/parlay', requireAuth, async (req, res) => {
  try {
    const { legs } = req.body;
    if (!legs || !Array.isArray(legs) || legs.length < 2) {
      return res.status(400).json({ error: 'At least 2 parlay legs required' });
    }
    const analysis = await analyzeParlay(legs);
    const used = incrementUsage(req.userId);
    res.json({ success: true, analysis, timestamp: new Date().toISOString(), signalsUsed: used });
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze parlay', details: err.message });
  }
});

export default router;
