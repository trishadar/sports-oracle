import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronDown, Lock } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { generateSignal, saveSignal, LimitReachedError } from '../lib/api';
import SignalCard from '../components/SignalCard';
import AnalysisLoader from '../components/AnalysisLoader';

const SPORTS = ['NBA', 'NFL', 'MLB', 'NHL', 'Soccer', 'Tennis', 'MMA'];
const BET_TYPES = ['Spread', 'Moneyline', 'Total (O/U)', 'Player Prop', 'Team Prop'];

const EXAMPLES = [
  'Lakers vs Celtics, Lakers -3.5, tonight',
  'Chiefs vs Ravens spread, Sunday',
  'Yankees vs Red Sox Over 8.5 runs',
  'Nuggets Jokic over 27.5 points',
  'Man City vs Arsenal moneyline',
];

export default function SignalGenerator() {
  const [form, setForm] = useState({
    query: '',
    sport: 'NBA',
    matchup: '',
    line: '',
    gameTime: '',
    bankroll: '1000',
    betType: 'Spread',
  });
  const [loading, setLoading] = useState(false);
  const [loaderStep, setLoaderStep] = useState(0);
  const [signal, setSignal] = useState(null);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [limitError, setLimitError] = useState(null);
  const stepRef = useRef(null);
  const { getToken } = useAuth();

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit() {
    if (!form.query.trim()) return;
    setLoading(true);
    setSignal(null);
    setError(null);
    setLimitError(null);
    setLoaderStep(0);
    setSaved(false);

    let s = 0;
    stepRef.current = setInterval(() => {
      s++;
      setLoaderStep(s);
      if (s >= 6) clearInterval(stepRef.current);
    }, 1800);

    try {
      const res = await generateSignal(form, getToken);
      clearInterval(stepRef.current);
      setSignal(res.signal);
    } catch (e) {
      clearInterval(stepRef.current);
      if (e instanceof LimitReachedError) {
        setLimitError(e.message);
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(sig) {
    try {
      await saveSignal(sig);
      setSaved(true);
    } catch {}
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="text-xs font-mono text-oracle-dim mb-1">AI ANALYSIS ENGINE</div>
        <h1 className="font-display text-4xl text-white tracking-wider">SIGNAL GENERATOR</h1>
        <p className="text-oracle-dim text-sm mt-1">Describe the bet you're considering. Oracle will analyze all data sources and generate a signal.</p>
      </div>

      {/* Example chips */}
      <div className="mb-6">
        <div className="text-xs font-mono text-oracle-dim mb-2">TRY AN EXAMPLE:</div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => update('query', ex)}
              className="px-3 py-1.5 rounded-full text-xs border border-oracle-border text-oracle-dim hover:border-oracle-accent/30 hover:text-oracle-accent transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="oracle-card p-6 mb-6">
        <div className="mb-4">
          <label className="text-xs font-mono text-oracle-dim mb-2 block">BET QUERY *</label>
          <textarea
            value={form.query}
            onChange={(e) => update('query', e.target.value)}
            placeholder="e.g. Lakers -3.5 vs Celtics tonight, or Mahomes over 280 passing yards Sunday..."
            rows={3}
            className="w-full bg-oracle-bg border border-oracle-border rounded-lg px-4 py-3 text-oracle-text placeholder-oracle-muted text-sm font-body resize-none focus:outline-none focus:border-oracle-accent/50 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs font-mono text-oracle-dim mb-2 block">SPORT</label>
            <SelectField value={form.sport} options={SPORTS} onChange={(v) => update('sport', v)} />
          </div>
          <div>
            <label className="text-xs font-mono text-oracle-dim mb-2 block">BET TYPE</label>
            <SelectField value={form.betType} options={BET_TYPES} onChange={(v) => update('betType', v)} />
          </div>
          <div>
            <label className="text-xs font-mono text-oracle-dim mb-2 block">CURRENT LINE</label>
            <input
              value={form.line}
              onChange={(e) => update('line', e.target.value)}
              placeholder="-3.5, +110, O8.5..."
              className="w-full bg-oracle-bg border border-oracle-border rounded-lg px-3 py-2.5 text-oracle-text placeholder-oracle-muted text-sm font-mono focus:outline-none focus:border-oracle-accent/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-oracle-dim mb-2 block">MATCHUP</label>
            <input
              value={form.matchup}
              onChange={(e) => update('matchup', e.target.value)}
              placeholder="Team A vs Team B"
              className="w-full bg-oracle-bg border border-oracle-border rounded-lg px-3 py-2.5 text-oracle-text placeholder-oracle-muted text-sm focus:outline-none focus:border-oracle-accent/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-oracle-dim mb-2 block">GAME TIME</label>
            <input
              value={form.gameTime}
              onChange={(e) => update('gameTime', e.target.value)}
              placeholder="7:30 PM ET"
              className="w-full bg-oracle-bg border border-oracle-border rounded-lg px-3 py-2.5 text-oracle-text placeholder-oracle-muted text-sm focus:outline-none focus:border-oracle-accent/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-oracle-dim mb-2 block">BANKROLL ($)</label>
            <input
              value={form.bankroll}
              onChange={(e) => update('bankroll', e.target.value)}
              placeholder="1000"
              type="number"
              className="w-full bg-oracle-bg border border-oracle-border rounded-lg px-3 py-2.5 text-oracle-text placeholder-oracle-muted text-sm font-mono focus:outline-none focus:border-oracle-accent/50 transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !form.query.trim()}
          className="w-full py-3.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-oracle-accent text-oracle-bg hover:bg-oracle-accent/90 glow-accent"
        >
          <Zap className="w-4 h-4" />
          {loading ? 'Analyzing...' : 'Generate Signal'}
        </button>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {loading && <AnalysisLoader key="loader" step={loaderStep} />}
        {error && !loading && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="oracle-card p-6 border-oracle-red/30 text-center">
            <p className="text-oracle-red font-mono text-sm">{error}</p>
          </motion.div>
        )}
        {limitError && !loading && (
          <motion.div key="limit" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="oracle-card p-8 text-center border-oracle-gold/30"
            style={{ background: 'linear-gradient(135deg, #111820, #1a1500)' }}
          >
            <div className="w-14 h-14 rounded-full bg-oracle-gold/10 border border-oracle-gold/30 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-oracle-gold" />
            </div>
            <div className="font-display text-3xl text-oracle-gold tracking-wider mb-2">FREE LIMIT REACHED</div>
            <p className="text-oracle-dim text-sm max-w-sm mx-auto mb-6 leading-relaxed">{limitError}</p>
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-2">
              <div className="p-4 rounded-lg border border-oracle-border bg-oracle-bg text-center">
                <div className="font-display text-2xl text-white tracking-wider">$5<span className="text-sm text-oracle-dim">/mo</span></div>
                <div className="text-xs font-mono text-oracle-dim mt-1">PRO</div>
                <div className="text-xs text-oracle-text mt-2">20 signals/day</div>
              </div>
              <div className="p-4 rounded-lg border border-oracle-gold/30 bg-oracle-gold/5 text-center">
                <div className="font-display text-2xl text-oracle-gold tracking-wider">$10<span className="text-sm text-oracle-dim">/mo</span></div>
                <div className="text-xs font-mono text-oracle-gold mt-1">UNLIMITED</div>
                <div className="text-xs text-oracle-text mt-2">No limits</div>
              </div>
            </div>
            <p className="text-xs text-oracle-dim font-mono mt-4">Payments coming soon — check back shortly!</p>
          </motion.div>
        )}
        {signal && !loading && (
          <motion.div key="signal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {saved && (
              <div className="mb-3 text-center text-xs font-mono text-oracle-green">✓ Signal saved to history</div>
            )}
            <SignalCard signal={signal} onSave={handleSave} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SelectField({ value, options, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-oracle-bg border border-oracle-border rounded-lg px-3 py-2.5 text-oracle-text text-sm font-mono focus:outline-none focus:border-oracle-accent/50 transition-colors pr-8 cursor-pointer"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-oracle-dim pointer-events-none" />
    </div>
  );
}
