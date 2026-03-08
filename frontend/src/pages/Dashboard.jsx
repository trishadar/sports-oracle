import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Calendar, Layers, TrendingUp, Activity, ArrowRight } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const SPORTS = ['NBA', 'NFL', 'MLB', 'NHL', 'Soccer', 'MMA'];

const MOCK_PERFORMANCE = [
  { day: 'Mon', winRate: 62 },
  { day: 'Tue', winRate: 71 },
  { day: 'Wed', winRate: 55 },
  { day: 'Thu', winRate: 78 },
  { day: 'Fri', winRate: 65 },
  { day: 'Sat', winRate: 82 },
  { day: 'Sun', winRate: 69 },
];

export default function Dashboard() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl border border-oracle-border p-8"
          style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f1a2e 100%)' }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #00d4ff, transparent)' }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-5 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #00ff87, transparent)' }} />

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-oracle-green animate-pulse" />
              <span className="text-xs font-mono text-oracle-dim">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} — SYSTEM ACTIVE
              </span>
            </div>
            <h1 className="font-display text-6xl text-white tracking-wider mb-2 text-glow-accent">
              SPORTS ORACLE
            </h1>
            <p className="text-oracle-dim max-w-lg text-sm leading-relaxed">
              AI-powered betting intelligence. Real-time analysis of injuries, line movement, 
              sharp money, and performance data to generate high-confidence bet signals.
            </p>
            <div className="flex gap-3 mt-6">
              <Link to="/signal"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-oracle-accent text-oracle-bg text-sm font-semibold hover:bg-oracle-accent/90 transition-colors glow-accent"
              >
                <Zap className="w-4 h-4" /> Generate Signal
              </Link>
              <Link to="/slate"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-oracle-border text-oracle-text text-sm hover:border-oracle-accent/30 transition-colors"
              >
                <Calendar className="w-4 h-4" /> Today's Slate
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'SIGNALS TODAY', value: '0', sub: 'generated', color: '#00d4ff' },
          { label: 'AVG CONFIDENCE', value: '—', sub: 'across signals', color: '#00ff87' },
          { label: 'STRONG BETS', value: '0', sub: 'high conviction', color: '#ffd700' },
          { label: 'DATA SOURCES', value: '∞', sub: 'live feeds', color: '#ffaa00' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="oracle-card p-5"
          >
            <div className="text-xs font-mono text-oracle-dim mb-2">{stat.label}</div>
            <div className="text-3xl font-display tracking-wider" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-oracle-dim mt-1">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Performance chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="oracle-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-mono text-oracle-dim">SYSTEM PERFORMANCE</div>
              <div className="font-display text-xl text-white tracking-wider">WIN RATE TREND</div>
            </div>
            <Activity className="w-4 h-4 text-oracle-accent" />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={MOCK_PERFORMANCE}>
              <defs>
                <linearGradient id="winGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#4a5568', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#111820', border: '1px solid #1a2332', borderRadius: 6, fontFamily: 'JetBrains Mono', fontSize: 11 }}
                labelStyle={{ color: '#8892a4' }}
                itemStyle={{ color: '#00d4ff' }}
              />
              <Area type="monotone" dataKey="winRate" stroke="#00d4ff" strokeWidth={2} fill="url(#winGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="oracle-card p-6"
        >
          <div className="text-xs font-mono text-oracle-dim mb-2">QUICK ACTIONS</div>
          <div className="font-display text-xl text-white tracking-wider mb-4">LAUNCH ANALYSIS</div>
          <div className="space-y-3">
            {[
              { label: 'Analyze a specific game', sub: 'Enter matchup & line', icon: Zap, path: '/signal', color: '#00d4ff' },
              { label: "Today's best plays", sub: 'Full slate scan', icon: Calendar, path: '/slate', color: '#00ff87' },
              { label: 'Build a parlay', sub: 'Multi-leg analysis', icon: Layers, path: '/parlay', color: '#ffd700' },
              { label: 'Breaking news intel', sub: 'Injury & lineup news', icon: TrendingUp, path: '/intel', color: '#ffaa00' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  to={item.path}
                  className="flex items-center gap-4 p-3 rounded-lg border border-oracle-border hover:border-oracle-accent/20 hover:bg-oracle-border/20 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                    <Icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-oracle-text">{item.label}</div>
                    <div className="text-xs text-oracle-dim">{item.sub}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-oracle-dim group-hover:text-oracle-accent transition-colors" />
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Sports grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="oracle-card p-6"
      >
        <div className="text-xs font-mono text-oracle-dim mb-2">SUPPORTED SPORTS</div>
        <div className="font-display text-xl text-white tracking-wider mb-4">COVERAGE</div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {SPORTS.map((sport) => (
            <Link
              key={sport}
              to={`/slate?sport=${sport}`}
              className="p-3 rounded-lg border border-oracle-border hover:border-oracle-accent/30 text-center transition-all hover:bg-oracle-accent/5 group"
            >
              <div className="font-display text-xl text-white group-hover:text-oracle-accent transition-colors tracking-wider">
                {sport}
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
