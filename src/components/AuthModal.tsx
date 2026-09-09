import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  ArrowRight,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Ticket
} from 'lucide-react';
import { UserAuthSession, TeamRegistration } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserAuthSession) => void;
  teams: TeamRegistration[];
  onSwitchToRegister: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  teams,
  onSwitchToRegister
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your team leader or participant email address.');
      return;
    }

    // Check if matching team exists
    const matchingTeam = teams.find(
      t => t.leaderEmail.toLowerCase() === email.trim().toLowerCase() ||
           t.members.some(m => Boolean(m.email) && m.email!.toLowerCase() === email.trim().toLowerCase())
    );

    if (matchingTeam) {
      const leader = matchingTeam.members.find(m => m.role === 'Leader') || matchingTeam.members[0];
      const session: UserAuthSession = {
        isAuthenticated: true,
        role: 'participant',
        email: email.trim(),
        name: leader?.name || matchingTeam.teamName,
        teamId: matchingTeam.id
      };
      onLoginSuccess(session);
      onClose();
    } else {
      // Direct access session for participants
      const session: UserAuthSession = {
        isAuthenticated: true,
        role: 'participant',
        email: email.trim(),
        name: email.split('@')[0],
      };
      onLoginSuccess(session);
      onClose();
    }
  };

  const handleQuickLoginWithTeam = (team: TeamRegistration) => {
    const leader = team.members.find(m => m.role === 'Leader') || team.members[0];
    const session: UserAuthSession = {
      isAuthenticated: true,
      role: 'participant',
      email: team.leaderEmail,
      name: leader?.name || team.teamName,
      teamId: team.id
    };
    onLoginSuccess(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
            Participant Sign In
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Access your team registration, ticket pass, and verification status.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Registered Leader / Member Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="leader@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password or Passcode
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-400/60"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Enter the passcode you set during team registration
            </span>
          </div>

          <button
            type="submit"
            className="glass-btn-primary w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>SIGN IN TO MY PASS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Registered Teams Quick Access */}
        {teams.length > 0 && (
          <div className="mt-6 pt-5 border-t border-white/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2.5 text-center">
              Existing Registered Teams:
            </span>

            <div className="space-y-2 max-h-36 overflow-y-auto">
              {teams.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleQuickLoginWithTeam(t)}
                  className="w-full p-2.5 rounded-xl glass-slot text-left flex items-center justify-between text-xs text-slate-200 hover:border-cyan-400/50 transition-colors"
                >
                  <div className="truncate pr-2">
                    <span className="font-bold text-white block truncate">{t.teamName}</span>
                    <span className="text-[11px] text-cyan-400">{t.registrationNumber} • {t.domainTrack}</span>
                  </div>
                  <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Pass</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <button
            onClick={() => {
              onClose();
              onSwitchToRegister();
            }}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
          >
            Haven't registered your team yet? Register Now (₹500)
          </button>
        </div>

      </div>
    </div>
  );
};
