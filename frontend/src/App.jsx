import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SignalGenerator from './pages/SignalGenerator';
import DailySlate from './pages/DailySlate';
import ParlayAnalyzer from './pages/ParlayAnalyzer';
import SignalHistory from './pages/SignalHistory';
import NewsIntel from './pages/NewsIntel';
import AuthPage from './pages/AuthPage';

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
      <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/signal" element={<SignalGenerator />} />
              <Route path="/slate" element={<DailySlate />} />
              <Route path="/parlay" element={<ParlayAnalyzer />} />
              <Route path="/history" element={<SignalHistory />} />
              <Route path="/intel" element={<NewsIntel />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}