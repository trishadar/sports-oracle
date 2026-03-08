import { SignIn, SignUp } from '@clerk/clerk-react';
import { Activity } from 'lucide-react';

export default function AuthPage({ mode }) {
  return (
    <div className="min-h-screen bg-oracle-bg flex flex-col items-center justify-center p-4"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.08) 0%, #080b10 60%)'
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-oracle-accent/10 border border-oracle-accent/30 flex items-center justify-center glow-accent">
          <Activity className="w-6 h-6 text-oracle-accent" />
        </div>
        <div>
          <div className="font-display text-3xl text-white tracking-wider text-glow-accent">ORACLE</div>
          <div className="text-oracle-dim text-xs font-mono">SPORTS INTELLIGENCE</div>
        </div>
      </div>

      <p className="text-oracle-dim text-sm font-mono mb-8 text-center max-w-xs">
        AI-powered betting signals. Sign in to get your 3 free daily analyses.
      </p>

      {/* Clerk component — auto-styled via appearance */}
      {mode === 'sign-in' ? (
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/"
          appearance={clerkAppearance}
        />
      ) : (
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/"
          appearance={clerkAppearance}
        />
      )}

      <p className="mt-6 text-xs text-oracle-dim text-center max-w-xs">
        For entertainment purposes only. Please gamble responsibly.
      </p>
    </div>
  );
}

const clerkAppearance = {
  variables: {
    colorPrimary: '#00d4ff',
    colorBackground: '#0d1117',
    colorInputBackground: '#080b10',
    colorInputText: '#e2e8f0',
    colorText: '#e2e8f0',
    colorTextSecondary: '#8892a4',
    colorNeutral: '#1a2332',
    borderRadius: '8px',
    fontFamily: '"DM Sans", sans-serif',
  },
  elements: {
    card: {
      background: '#0d1117',
      border: '1px solid #1a2332',
      boxShadow: '0 0 40px rgba(0,212,255,0.05)',
    },
    headerTitle: {
      fontFamily: '"Bebas Neue", cursive',
      fontSize: '1.8rem',
      letterSpacing: '0.1em',
      color: '#ffffff',
    },
    headerSubtitle: { color: '#8892a4', fontSize: '0.8rem' },
    formButtonPrimary: {
      background: '#00d4ff',
      color: '#080b10',
      fontWeight: '600',
      '&:hover': { background: '#00b8d9' },
    },
    footerActionLink: { color: '#00d4ff' },
    identityPreviewText: { color: '#e2e8f0' },
    formFieldInput: {
      background: '#080b10',
      border: '1px solid #1a2332',
      color: '#e2e8f0',
    },
    dividerLine: { background: '#1a2332' },
    dividerText: { color: '#4a5568' },
    socialButtonsBlockButton: {
      background: '#111820',
      border: '1px solid #1a2332',
      color: '#e2e8f0',
    },
  },
};
