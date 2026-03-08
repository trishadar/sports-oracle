import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, RefreshCw, ChevronDown, AlertCircle, Minus, TrendingUp } from 'lucide-react';
import { getSportsNews, getInjuryReport } from '../lib/api';

const SPORTS = ['NBA', 'NFL', 'MLB', 'NHL', 'Soccer', 'MMA'];
const IMPACT_CONFIG = {
  HIGH: { color: '#ff3b5c', icon: TrendingUp },
  MEDIUM: { color: '#ffaa00', icon: Minus },
  LOW: { color: '#4a5568', icon: AlertCircle },
};

export default function NewsIntel() {
  const [sport, setSport] = useState('NBA');
  const [team, setTeam] = useState('');
  const [news, setNews] = useState([]);
  const [injuries, setInjuries] = useState(null);
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingInjuries, setLoadingInjuries] = useState(false);
  const [activeTab, setActiveTab] = useState('news');

  async function fetchNews() {
    setLoadingNews(true);
    try {
      const res = await getSportsNews(sport);
      setNews(Array.isArray(res.news) ? res.news : []);
    } catch {
      setNews([]);
    } finally {
      setLoadingNews(false);
    }
  }

  async function fetchInjuries() {
    if (!team.trim()) return;
    setLoadingInjuries(true);
    try {
      const res = await getInjuryReport(team);
      setInjuries(res);
    } catch {
      setInjuries(null);
    } finally {
      setLoadingInjuries(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="text-xs font-mono text-oracle-dim mb-1">INTELLIGENCE FEED</div>
        <h1 className="font-display text-4xl text-white tracking-wider">NEWS INTEL</h1>
        <p className="text-oracle-dim text-sm mt-1">Real-time news and injury reports that impact betting lines.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['news', 'injuries'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all ${
              activeTab === tab
                ? 'bg-oracle-accent text-oracle-bg'
                : 'border border-oracle-border text-oracle-dim hover:text-oracle-text'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'news' && (
          <motion.div key="news" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="oracle-card p-5 mb-5 flex items-end gap-4">
              <div className="flex-1">
                <label className="text-xs font-mono text-oracle-dim mb-2 block">SPORT</label>
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
              <button
                onClick={fetchNews}
                disabled={loadingNews}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-oracle-accent text-oracle-bg font-semibold text-sm hover:bg-oracle-accent/90 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loadingNews ? 'animate-spin' : ''}`} />
                Fetch News
              </button>
            </div>

            {loadingNews && (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="oracle-card p-5 shimmer h-24" />)}
              </div>
            )}

            {!loadingNews && news.length > 0 && (
              <div className="space-y-3">
                {news.map((item, i) => {
                  const cfg = IMPACT_CONFIG[item.impact] || IMPACT_CONFIG.LOW;
                  const ImpactIcon = cfg.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="oracle-card p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}
                        >
                          <ImpactIcon className="w-4 h-4" style={{ color: cfg.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-xs font-mono font-bold"
                              style={{ color: cfg.color }}
                            >
                              {item.impact} IMPACT
                            </span>
                            {item.team && <span className="text-xs font-mono text-oracle-dim">{item.team}</span>}
                          </div>
                          <h3 className="text-sm font-medium text-oracle-text mb-1">{item.headline}</h3>
                          <p className="text-xs text-oracle-dim leading-relaxed">{item.summary}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {!loadingNews && news.length === 0 && (
              <div className="oracle-card p-12 text-center border-dashed">
                <Newspaper className="w-12 h-12 text-oracle-border mx-auto mb-4" />
                <p className="text-oracle-dim text-sm font-mono">Select a sport and fetch to see betting-relevant news.</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'injuries' && (
          <motion.div key="injuries" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="oracle-card p-5 mb-5 flex items-end gap-4">
              <div className="flex-1">
                <label className="text-xs font-mono text-oracle-dim mb-2 block">TEAM NAME</label>
                <input
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchInjuries()}
                  placeholder="e.g. Los Angeles Lakers, Kansas City Chiefs..."
                  className="w-full bg-oracle-bg border border-oracle-border rounded-lg px-3 py-2.5 text-oracle-text placeholder-oracle-muted text-sm focus:outline-none focus:border-oracle-accent/50 transition-colors"
                />
              </div>
              <button
                onClick={fetchInjuries}
                disabled={loadingInjuries || !team.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-oracle-accent text-oracle-bg font-semibold text-sm hover:bg-oracle-accent/90 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loadingInjuries ? 'animate-spin' : ''}`} />
                Get Report
              </button>
            </div>

            {loadingInjuries && (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="oracle-card p-4 shimmer h-16" />)}
              </div>
            )}

            {injuries && !loadingInjuries && (
              <div className="oracle-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="font-display text-xl text-white tracking-wider">{injuries.team?.toUpperCase()} INJURY REPORT</div>
                </div>
                {injuries.injuries?.length === 0 && (
                  <p className="text-oracle-dim text-sm font-mono text-center py-4">No significant injuries found.</p>
                )}
                <div className="space-y-3">
                  {injuries.injuries?.map((inj, i) => {
                    const statusColor = inj.status?.toLowerCase().includes('out') ? '#ff3b5c'
                      : inj.status?.toLowerCase().includes('questionable') ? '#ffaa00'
                      : '#00ff87';
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-center gap-4 p-3 rounded-lg bg-oracle-bg border border-oracle-border"
                      >
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColor }} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-oracle-text">{inj.player}</span>
                            {inj.position && <span className="text-xs font-mono text-oracle-dim">{inj.position}</span>}
                          </div>
                          {inj.notes && <p className="text-xs text-oracle-dim mt-0.5">{inj.notes}</p>}
                        </div>
                        <span className="text-xs font-mono font-bold flex-shrink-0" style={{ color: statusColor }}>
                          {inj.status}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
