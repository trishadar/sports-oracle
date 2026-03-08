import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useClerk } from '@clerk/clerk-react';
import {
  Zap, BarChart2, Calendar, Layers, Clock, Newspaper,
  Menu, X, Activity, Wifi, WifiOff, LogOut, ChevronDown
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: BarChart2 },
  { path: '/signal', label: 'Signal Generator', icon: Zap },
  { path: '/slate', label: 'Daily Slate', icon: Calendar },
  { path: '/parlay', label: 'Parlay Analyzer', icon: Layers },
  { path: '/history', label: 'Signal History', icon: Clock },
  { path: '/intel', label: 'News Intel', icon: Newspaper },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const [liveActivity, setLiveActivity] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    let ws;
    let reconnectTimer;

    function connect() {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = import.meta.env.VITE_API_URL
          ? import.meta.env.VITE_API_URL.replace('https://', '').replace('http://', '')
          : window.location.host;
        ws = new WebSocket(`${protocol}//${host}`);
        ws.onopen = () => setWsConnected(true);
        ws.onclose = () => {
          setWsConnected(false);
          reconnectTimer = setTimeout(connect, 3000);
        };
        ws.onmessage = (e) => {
          const data = JSON.parse(e.data);
          if (data.type !== 'connected') {
            setLiveActivity(data);
            setTimeout(() => setLiveActivity(null), 4000);
          }
        };
      } catch { }
    }
    connect();
    return () => { if (ws) ws.close(); clearTimeout(reconnectTimer); };
  }, []);

  return (
    <div className="flex h-screen bg-oracle-bg overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-64 flex-shrink-0 flex flex-col border-r border-oracle-border bg-oracle-surface z-20"
          >
            {/* Logo */}
            <div className="p-6 border-b border-oracle-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-oracle-accent/10 border border-oracle-accent/30 flex items-center justify-center glow-accent">
                  <Activity className="w-5 h-5 text-oracle-accent" />
                </div>
                <div>
                  <div className="font-display text-2xl text-white tracking-wider text-glow-accent">ORACLE</div>
                  <div className="text-oracle-dim text-xs font-mono">SPORTS INTELLIGENCE</div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="px-4 py-3 border-b border-oracle-border">
              <div className="flex items-center gap-2 text-xs font-mono">
                {wsConnected ? (
                  <><Wifi className="w-3 h-3 text-oracle-green" /><span className="text-oracle-green">LIVE CONNECTION</span></>
                ) : (
                  <><WifiOff className="w-3 h-3 text-oracle-red" /><span className="text-oracle-red">CONNECTING...</span></>
                )}
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body transition-all duration-200 group ${isActive
                      ? 'bg-oracle-accent/10 text-oracle-accent border border-oracle-accent/20'
                      : 'text-oracle-dim hover:text-oracle-text hover:bg-oracle-border/50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{label}</span>
                </NavLink>
              ))}
            </nav>

            {/* User section */}
            {user && (
              <div className="p-4 border-t border-oracle-border">
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-oracle-border/50 transition-colors"
                  >
                    <img
                      src={user.imageUrl}
                      alt={user.firstName}
                      className="w-7 h-7 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-xs font-medium text-oracle-text truncate">
                        {user.firstName || user.emailAddresses[0]?.emailAddress}
                      </div>
                      <div className="text-xs text-oracle-dim font-mono">FREE PLAN</div>
                    </div>
                    <ChevronDown className="w-3 h-3 text-oracle-dim flex-shrink-0" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute bottom-full left-0 right-0 mb-1 oracle-card p-1"
                      >
                        <button
                          onClick={() => signOut()}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-oracle-dim hover:text-oracle-red hover:bg-oracle-red/5 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            <div className="px-4 pb-4">
              <div className="text-xs font-mono text-oracle-dim/50 text-center">
                v1.0.0 — For entertainment only
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-oracle-border bg-oracle-surface/80 backdrop-blur flex items-center px-4 gap-4 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 flex items-center justify-center rounded text-oracle-dim hover:text-oracle-text hover:bg-oracle-border/50 transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <div className="flex-1 font-mono text-xs text-oracle-dim">
            {new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>

          {/* Live activity toast */}
          <AnimatePresence>
            {liveActivity && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-oracle-accent/10 border border-oracle-accent/20 text-oracle-accent text-xs font-mono"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-oracle-accent animate-pulse" />
                {liveActivity.type === 'analysis_started' ? `Analyzing ${liveActivity.matchup}...` : 'Signal ready'}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-2 h-2 rounded-full bg-oracle-green animate-pulse" title="System online" />
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
