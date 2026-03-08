import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trash2 } from 'lucide-react';
import { getSavedSignals } from '../lib/api';

const SIGNAL_COLORS = {
  STRONG_BET: '#00ff87',
  MODERATE_BET: '#00d4ff',
  LEAN: '#ffaa00',
  AVOID: '#ff3b5c',
  FADE: '#ff3b5c',
};

export default function SignalHistory() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedSignals()
      .then((res) => setSignals(res.signals || []))
      .catch(() => setSignals([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="oracle-card p-6 shimmer h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="text-xs font-mono text-oracle-dim mb-1">ANALYSIS LOG</div>
        <h1 className="font-display text-4xl text-white tracking-wider">SIGNAL HISTORY</h1>
        <p className="text-oracle-dim text-sm mt-1">{signals.length} saved signal{signals.length !== 1 ? 's' : ''}</p>
      </div>

      {signals.length === 0 ? (
        <div className="oracle-card p-12 text-center border-dashed">
          <Clock className="w-12 h-12 text-oracle-border mx-auto mb-4" />
          <div className="font-display text-2xl text-oracle-dim tracking-wider mb-2">NO SIGNALS YET</div>
          <p className="text-oracle-dim text-sm">Generate signals and save them to track your picks here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {signals.map((sig, i) => {
            const color = SIGNAL_COLORS[sig.signal] || '#8892a4';
            return (
              <motion.div
                key={sig.id || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="oracle-card p-4 flex items-center gap-4"
                style={{ borderColor: `${color}20` }}
              >
                <div
                  className="w-1 h-12 rounded-full flex-shrink-0"
                  style={{ background: color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="text-xs font-mono font-bold" style={{ color }}>
                      {sig.signal?.replace('_', ' ')}
                    </span>
                    {sig.sport && <span className="text-xs font-mono text-oracle-dim">{sig.sport}</span>}
                    {sig.betType && <span className="text-xs font-mono text-oracle-dim">{sig.betType}</span>}
                  </div>
                  <div className="font-medium text-oracle-text text-sm truncate">
                    {sig.matchup || sig.recommendedBet || 'Signal'}
                  </div>
                  {sig.recommendedBet && sig.matchup && (
                    <div className="text-xs text-oracle-dim font-mono">{sig.recommendedBet}</div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  {sig.confidence != null && (
                    <div className="font-mono font-bold text-sm" style={{ color }}>{sig.confidence}%</div>
                  )}
                  {sig.savedAt && (
                    <div className="text-xs font-mono text-oracle-dim">
                      {new Date(sig.savedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
