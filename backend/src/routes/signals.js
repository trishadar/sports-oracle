import express from 'express';

const router = express.Router();

// In-memory store (use a real DB like SQLite/Postgres in production)
let signalHistory = [];

router.get('/', (req, res) => {
  res.json({ signals: signalHistory.slice(-50).reverse() });
});

router.post('/', (req, res) => {
  const signal = { ...req.body, id: Date.now(), savedAt: new Date().toISOString() };
  signalHistory.push(signal);
  res.json({ success: true, signal });
});

router.delete('/:id', (req, res) => {
  signalHistory = signalHistory.filter(s => s.id !== parseInt(req.params.id));
  res.json({ success: true });
});

// Stats
router.get('/stats', (req, res) => {
  const total = signalHistory.length;
  const strongBets = signalHistory.filter(s => s.signal === 'STRONG_BET').length;
  const avgConfidence = total > 0 
    ? Math.round(signalHistory.reduce((acc, s) => acc + (s.confidence || 0), 0) / total)
    : 0;
  res.json({ total, strongBets, avgConfidence });
});

export default router;
