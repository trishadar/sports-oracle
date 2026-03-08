import { motion } from 'framer-motion';

const STEPS = [
  'Searching injury reports...',
  'Analyzing recent performance...',
  'Scanning line movement...',
  'Reading sharp money indicators...',
  'Cross-referencing news sources...',
  'Computing edge over line...',
  'Generating signal...',
];

export default function AnalysisLoader({ step = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="oracle-card p-8 text-center"
    >
      {/* Radar animation */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-oracle-border" />
        <div className="absolute inset-2 rounded-full border border-oracle-border/50" />
        <div className="absolute inset-4 rounded-full border border-oracle-border/30" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 270deg, rgba(0,212,255,0.6) 360deg)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-oracle-accent animate-pulse" />
        </div>
      </div>

      <div className="font-display text-2xl text-oracle-accent tracking-widest mb-2">
        ANALYZING
      </div>
      <p className="text-oracle-dim text-sm font-mono">
        Oracle is scanning data sources...
      </p>

      <div className="mt-6 space-y-2">
        {STEPS.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i <= step ? 1 : 0.2, x: 0 }}
            transition={{ delay: i * 0.3 }}
            className={`flex items-center gap-3 text-xs font-mono px-4 py-2 rounded ${
              i < step ? 'text-oracle-green' : i === step ? 'text-oracle-accent' : 'text-oracle-dim'
            }`}
          >
            <span>{i < step ? '✓' : i === step ? '▶' : '○'}</span>
            {s}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
