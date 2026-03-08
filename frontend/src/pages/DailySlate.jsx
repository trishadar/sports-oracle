import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, RefreshCw, ChevronDown } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { getDailySlate, saveSignal } from '../lib/api';
import SignalCard from '../components/SignalCard';
import AnalysisLoader from '../components/AnalysisLoader';

const SPORTS = ['NBA', 'NFL', 'MLB', 'NHL', 'Soccer', 'MMA', 'Tennis'];

export default function DailySlate() {
  const [sport, setSport] = useState('NBA');
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const { getToken } = useAuth();

  async function fetchSlate() {
    setLoading(true);
    setError(null);
    setSignals([]);
    try {
      const res = await getDailySlate(sport, getToken);
      const data = Array.isArray(res.signals) ? res.signals : [];
      setSignals(data);
      setLoaded(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="text-xs font-mono text-oracle-dim mb-1">DAILY ANALYSIS</div>
        <h1 className="font-display text-4xl text-white tracking-wider">TODAY'S SLATE</h1>
        <p className="text-oracle-dim text-sm mt-1">Oracle scans all games and surfaces the highest-value plays of the day.</p>
      </div>

      {/* Controls */}
      <div className="oracle-card p-5 mb-6 flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-48">
          <div className="text-xs font-mono text-oracle-dim mb-2">SELECT SPORT</div>
          <div className="relative">
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full appearance-none bg-oracle-bg border border-oracle-border rounded-lg px-3 py-2.5 text-oracle-text text-sm font-mono focus:outline-none focus:border-oracle-accent/50 pr-8 cursor-pointer"
            >
              {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-oracle-dim pointer-events-none" />
          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={fetchSlate}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-oracle-accent text-oracle-bg font-semibold text-sm hover:bg-oracle-accent/90 transition-colors disabled:opacity-50 glow-accent"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Scanning...' : loaded ? 'Refresh Slate' : 'Scan Today\'s Slate'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading && <AnalysisLoader key="loader" />}
        {error && !loading && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="oracle-card p-6 text-center">
            <p className="text-oracle-red font-mono text-sm">{error}</p>
          </motion.div>
        )}
        {!loading && loaded && signals.length === 0 && !error && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="oracle-card p-12 text-center">
            <Calendar className="w-10 h-10 text-oracle-dim mx-auto mb-3" />
            <p className="text-oracle-dim font-mono text-sm">No high-value plays found for today's {sport} slate.</p>
          </motion.div>
        )}
        {!loading && signals.length > 0 && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-xs font-mono text-oracle-dim">
                {signals.length} PLAY{signals.length !== 1 ? 'S' : ''} IDENTIFIED
              </div>
              <div className="h-px flex-1 bg-oracle-border" />
              <div className="text-xs font-mono text-oracle-green">RANKED BY CONFIDENCE</div>
            </div>
            <div className="space-y-6">
              {signals
                .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
                .map((sig, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-oracle-border flex items-center justify-center text-xs font-mono text-oracle-dim">
                        {i + 1}
                      </div>
                      <div className="h-px flex-1 bg-oracle-border" />
                    </div>
                    <SignalCard signal={sig} onSave={saveSignal} />
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
        {!loading && !loaded && (
          <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="oracle-card p-12 text-center border-dashed"
          >
            <Calendar className="w-12 h-12 text-oracle-border mx-auto mb-4" />
            <div className="font-display text-2xl text-oracle-dim tracking-wider mb-2">SELECT A SPORT</div>
            <p className="text-oracle-dim text-sm">Choose a sport above and click "Scan Today's Slate" to find the best plays.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
