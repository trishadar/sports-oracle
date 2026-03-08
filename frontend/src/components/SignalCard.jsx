import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Shield, Zap, Target, AlertTriangle, BookmarkPlus } from 'lucide-react';

const SIGNAL_CONFIG = {
  STRONG_BET: { label: 'STRONG BET', color: '#00ff87', bg: 'rgba(0,255,135,0.08)', icon: TrendingUp, glow: 'glow-green' },
  MODERATE_BET: { label: 'MODERATE BET', color: '#00d4ff', bg: 'rgba(0,212,255,0.08)', icon: TrendingUp, glow: 'glow-accent' },
  LEAN: { label: 'LEAN', color: '#ffaa00', bg: 'rgba(255,170,0,0.08)', icon: Minus, glow: '' },
  AVOID: { label: 'AVOID', color: '#ff3b5c', bg: 'rgba(255,59,92,0.08)', icon: TrendingDown, glow: 'glow-red' },
  FADE: { label: 'FADE', color: '#ff3b5c', bg: 'rgba(255,59,92,0.08)', icon: TrendingDown, glow: 'glow-red' },
};

export default function SignalCard({ signal, onSave, showSave = true }) {
  if (!signal) return null;
  const cfg = SIGNAL_CONFIG[signal.signal] || SIGNAL_CONFIG.LEAN;
  const Icon = cfg.icon;
  const confidence = signal.confidence || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`oracle-card p-6 ${cfg.glow} relative overflow-hidden`}
      style={{ borderColor: `${cfg.color}30` }}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"
        style={{ background: `${cfg.color}08` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-bold"
              style={{ color: cfg.color, borderColor: `${cfg.color}40`, background: cfg.bg }}
            >
              <Icon className="w-3 h-3" />
              {cfg.label}
            </div>
            {signal.betType && (
              <span className="px-2 py-1 rounded text-xs font-mono text-oracle-dim border border-oracle-border">
                {signal.betType}
              </span>
            )}
          </div>
          <h2 className="text-xl font-display tracking-wider text-white mt-2">
            {signal.matchup || 'MATCHUP ANALYSIS'}
          </h2>
          {signal.sport && (
            <span className="text-xs font-mono text-oracle-dim">{signal.sport}</span>
          )}
        </div>
        {showSave && onSave && (
          <button
            onClick={() => onSave(signal)}
            className="w-8 h-8 rounded-lg border border-oracle-border flex items-center justify-center text-oracle-dim hover:text-oracle-accent hover:border-oracle-accent/30 transition-colors"
          >
            <BookmarkPlus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Recommended Bet */}
      {signal.recommendedBet && (
        <div className="mb-6 p-4 rounded-lg border" style={{ background: cfg.bg, borderColor: `${cfg.color}20` }}>
          <div className="text-xs font-mono text-oracle-dim mb-1">RECOMMENDED BET</div>
          <div className="text-2xl font-display tracking-wider" style={{ color: cfg.color }}>
            {signal.recommendedBet}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="CONFIDENCE" value={`${confidence}%`} color={cfg.color} />
        <Stat label="STAKE" value={signal.suggestedStake || '—'} color="#e2e8f0" />
        <Stat label="WIN PROB" value={signal.impliedWinProbability ? `${signal.impliedWinProbability}%` : '—'} color={cfg.color} />
        <Stat label="EDGE" value={signal.edgeOverLine || '—'} color={signal.edgeOverLine?.startsWith('+') ? '#00ff87' : '#ff3b5c'} />
      </div>

      {/* Confidence bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-mono text-oracle-dim mb-2">
          <span>CONFIDENCE METER</span>
          <span style={{ color: cfg.color }}>{confidence}%</span>
        </div>
        <div className="h-1.5 bg-oracle-border rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${cfg.color}80, ${cfg.color})` }}
          />
        </div>
      </div>

      {/* EV and Line */}
      {(signal.expectedValue || signal.lineValue) && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {signal.expectedValue && (
            <div className="p-3 rounded-lg bg-oracle-border/30">
              <div className="text-xs font-mono text-oracle-dim mb-1">EXPECTED VALUE</div>
              <div className="font-mono font-bold text-oracle-green">{signal.expectedValue}</div>
            </div>
          )}
          {signal.lineValue && (
            <div className="p-3 rounded-lg bg-oracle-border/30">
              <div className="text-xs font-mono text-oracle-dim mb-1">LINE VALUE</div>
              <div className="font-mono text-sm text-oracle-text">{signal.lineValue}</div>
            </div>
          )}
        </div>
      )}

      {/* Key Factors */}
      {signal.keyFactors?.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-oracle-dim mb-3">
            <Target className="w-3 h-3" />
            KEY FACTORS
          </div>
          <div className="space-y-2">
            {signal.keyFactors.map((factor, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: cfg.color }} />
                <span className="text-oracle-text">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risks */}
      {signal.risks?.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-oracle-dim mb-3">
            <AlertTriangle className="w-3 h-3" />
            RISK FACTORS
          </div>
          <div className="space-y-2">
            {signal.risks.map((risk, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0 bg-oracle-amber" />
                <span className="text-oracle-dim">{risk}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {signal.summary && (
        <div className="mt-4 pt-4 border-t border-oracle-border">
          <div className="flex items-center gap-2 text-xs font-mono text-oracle-dim mb-2">
            <Shield className="w-3 h-3" />
            ORACLE ANALYSIS
          </div>
          <p className="text-sm text-oracle-text leading-relaxed">{signal.summary}</p>
        </div>
      )}
    </motion.div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="p-3 rounded-lg bg-oracle-border/30 text-center">
      <div className="text-xs font-mono text-oracle-dim mb-1">{label}</div>
      <div className="font-mono font-bold text-sm" style={{ color }}>{value}</div>
    </div>
  );
}
