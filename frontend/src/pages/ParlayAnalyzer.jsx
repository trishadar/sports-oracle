import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Layers, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { analyzeParlay } from '../lib/api';
import AnalysisLoader from '../components/AnalysisLoader';

const SIGNAL_ICON = {
  STRONG_BET: { icon: CheckCircle, color: '#00ff87' },
  MODERATE_BET: { icon: CheckCircle, color: '#00d4ff' },
  LEAN: { icon: AlertCircle, color: '#ffaa00' },
  AVOID: { icon: XCircle, color: '#ff3b5c' },
  FADE: { icon: XCircle, color: '#ff3b5c' },
};

export default function ParlayAnalyzer() {
  const [legs, setLegs] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function addLeg() {
    if (legs.length < 8) setLegs([...legs, '']);
  }

  function removeLeg(i) {
    if (legs.length > 2) setLegs(legs.filter((_, idx) => idx !== i));
  }

  function updateLeg(i, val) {
    const updated = [...legs];
    updated[i] = val;
    setLegs(updated);
  }

  const { getToken } = useAuth();

  async function handleAnalyze() {
    const validLegs = legs.filter((l) => l.trim());
    if (validLegs.length < 2) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await analyzeParlay(validLegs, getToken);
      setResult(res.analysis);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const overallCfg = result ? (SIGNAL_ICON[result.overallSignal] || SIGNAL_ICON.LEAN) : null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="text-xs font-mono text-oracle-dim mb-1">MULTI-LEG ANALYSIS</div>
        <h1 className="font-display text-4xl text-white tracking-wider">PARLAY ANALYZER</h1>
        <p className="text-oracle-dim text-sm mt-1">Add each leg of your parlay. Oracle will assess each bet and calculate true combined probability.</p>
      </div>

      {/* Legs builder */}
      <div className="oracle-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-mono text-oracle-dim">{legs.length} LEGS</div>
          <button
            onClick={addLeg}
            disabled={legs.length >= 8}
            className="flex items-center gap-1.5 text-xs font-mono text-oracle-accent hover:text-oracle-accent/80 transition-colors disabled:opacity-40"
          >
            <Plus className="w-3 h-3" /> ADD LEG
          </button>
        </div>

        <div className="space-y-3">
          {legs.map((leg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-oracle-border flex items-center justify-center text-xs font-mono text-oracle-dim flex-shrink-0">
                {i + 1}
              </div>
              <input
                value={leg}
                onChange={(e) => updateLeg(i, e.target.value)}
                placeholder={`Leg ${i + 1}: e.g. Lakers -3.5, Chiefs ML, Over 224.5...`}
                className="flex-1 bg-oracle-bg border border-oracle-border rounded-lg px-3 py-2.5 text-oracle-text placeholder-oracle-muted text-sm font-mono focus:outline-none focus:border-oracle-accent/50 transition-colors"
              />
              <button
                onClick={() => removeLeg(i)}
                disabled={legs.length <= 2}
                className="w-8 h-8 flex items-center justify-center text-oracle-dim hover:text-oracle-red transition-colors disabled:opacity-30"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || legs.filter(l => l.trim()).length < 2}
          className="w-full mt-5 py-3.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 bg-oracle-accent text-oracle-bg hover:bg-oracle-accent/90 glow-accent"
        >
          <Layers className="w-4 h-4" />
          {loading ? 'Analyzing Parlay...' : 'Analyze Parlay'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading && <AnalysisLoader key="loader" />}
        {error && !loading && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="oracle-card p-6 text-center">
            <p className="text-oracle-red font-mono text-sm">{error}</p>
          </motion.div>
        )}
        {result && !loading && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Overall verdict */}
            <div className="oracle-card p-6" style={{ borderColor: `${overallCfg?.color}30` }}>
              <div className="flex items-center gap-4 mb-4">
                {overallCfg && <overallCfg.icon className="w-8 h-8" style={{ color: overallCfg.color }} />}
                <div>
                  <div className="text-xs font-mono text-oracle-dim">PARLAY VERDICT</div>
                  <div className="font-display text-3xl tracking-wider" style={{ color: overallCfg?.color }}>
                    {result.overallSignal?.replace('_', ' ')}
                  </div>
                </div>
                {result.combinedConfidence && (
                  <div className="ml-auto text-right">
                    <div className="text-xs font-mono text-oracle-dim">COMBINED CONFIDENCE</div>
                    <div className="font-display text-3xl text-white">{result.combinedConfidence}%</div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {result.correlationRisk && (
                  <div className="p-3 rounded-lg bg-oracle-border/30 text-center">
                    <div className="text-xs font-mono text-oracle-dim mb-1">CORRELATION RISK</div>
                    <div className="font-mono font-bold text-sm text-oracle-amber">{result.correlationRisk}</div>
                  </div>
                )}
                {result.parlayOdds && (
                  <div className="p-3 rounded-lg bg-oracle-border/30 text-center">
                    <div className="text-xs font-mono text-oracle-dim mb-1">PARLAY ODDS</div>
                    <div className="font-mono font-bold text-sm text-oracle-text">{result.parlayOdds}</div>
                  </div>
                )}
                {result.trueOdds && (
                  <div className="p-3 rounded-lg bg-oracle-border/30 text-center">
                    <div className="text-xs font-mono text-oracle-dim mb-1">TRUE ODDS</div>
                    <div className="font-mono font-bold text-sm text-oracle-accent">{result.trueOdds}</div>
                  </div>
                )}
              </div>

              {result.summary && (
                <p className="text-sm text-oracle-text leading-relaxed">{result.summary}</p>
              )}
            </div>

            {/* Individual legs */}
            {result.legs?.map((leg, i) => {
              const cfg = SIGNAL_ICON[leg.signal] || SIGNAL_ICON.LEAN;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="oracle-card p-4"
                  style={{ borderColor: `${cfg.color}20` }}
                >
                  <div className="flex items-start gap-3">
                    <cfg.icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: cfg.color }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-mono text-sm text-oracle-text font-medium">{leg.leg}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono" style={{ color: cfg.color }}>{leg.signal?.replace('_', ' ')}</span>
                          {leg.confidence && (
                            <span className="text-xs font-mono text-oracle-dim">{leg.confidence}%</span>
                          )}
                        </div>
                      </div>
                      {leg.analysis && (
                        <p className="text-xs text-oracle-dim leading-relaxed">{leg.analysis}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
