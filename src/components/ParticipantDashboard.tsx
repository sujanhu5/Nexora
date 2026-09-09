import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  MapPin, 
  CreditCard, 
  UserCheck, 
  Lock,
  Sparkles,
  Wifi,
  Ticket
} from 'lucide-react';
import { TeamRegistration, UserAuthSession } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';

interface ParticipantDashboardProps {
  team: TeamRegistration | null;
  authSession: UserAuthSession;
  onOpenRegister: () => void;
  onLogout: () => void;
  onViewCoordinators: () => void;
}

export const ParticipantDashboard: React.FC<ParticipantDashboardProps> = ({
  team,
  authSession,
  onOpenRegister,
  onLogout
}) => {
  if (!team) {
    return (
      <div className="py-20 max-w-2xl mx-auto px-4 text-center">
        <div className="glass-panel p-8 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            Welcome, {authSession.name || 'Innovator'}!
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            No active team registration is currently associated with <span className="text-cyan-400 font-medium">{authSession.email}</span>.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenRegister}
              className="glass-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
            >
              ENROLL YOUR TEAM (₹500)
            </button>
            <button
              onClick={onLogout}
              className="glass-btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 cursor-pointer"
            >
              SIGN OUT
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const isApproved = team.approvalStatus === 'approved';
  const isRejected = team.approvalStatus === 'rejected';

  return (
    <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-7 glass-panel rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              PARTICIPANT BADGE DESK
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-mono font-semibold text-cyan-300 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              {team.registrationNumber}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Team: {team.teamName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track: <strong className="text-cyan-400 font-semibold">{team.domain}</strong> • Idea: {team.projectTitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePrint}
            className="glass-btn-secondary px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Print Pass / PDF</span>
          </button>
          <button
            onClick={onLogout}
            className="glass-btn-secondary px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-rose-400 cursor-pointer transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Registration Approval Status */}
        <div className={`p-5 glass-card rounded-2xl flex items-center gap-4 ${
          isApproved 
            ? 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
            : isRejected 
            ? 'border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.15)]' 
            : 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
        }`}>
          <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            {isApproved ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : isRejected ? (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            ) : (
              <Clock className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              APPROVAL STATUS
            </span>
            <p className="text-sm font-bold capitalize text-white mt-0.5">
              {team.approvalStatus.replace('_', ' ')}
            </p>
            <span className="text-xs text-slate-400">
              {isApproved ? 'Confirmed for Arena Entry' : isRejected ? 'Contact Support' : 'Under Review'}
            </span>
          </div>
        </div>

        {/* Payment Verification Status */}
        <div className="p-5 glass-card rounded-2xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 text-cyan-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              REGISTRATION FEE (₹{team.registrationFee})
            </span>
            <p className="text-sm font-bold capitalize text-white mt-0.5">
              {team.paymentStatus}
            </p>
            <span className="text-xs text-slate-400 truncate block max-w-[180px]">
              UTR: {team.transactionId}
            </span>
          </div>
        </div>

        {/* Venue Workstation */}
        <div className="p-5 glass-card rounded-2xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              ARENA POD ASSIGNMENT
            </span>
            <p className="text-sm font-bold text-white mt-0.5">
              {isApproved ? 'Pod 14, Block-C (2nd Flr)' : 'Allocation Upon Check-In'}
            </p>
            <span className="text-xs text-cyan-400 font-medium">Gigabit LAN & Power Ready</span>
          </div>
        </div>

      </div>

      {/* Official Printable Event Hall Pass / Ticket */}
      <div className="p-6 sm:p-8 glass-panel rounded-3xl relative overflow-hidden print:border-black print:text-black print:bg-white">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-2 border border-cyan-500/25">
              <Ticket className="w-3.5 h-3.5" />
              <span>OFFICIAL EVENT ENTRY CREDENTIAL</span>
            </div>
            <h3 className="text-2xl font-display font-extrabold text-white">
              IDEATHON 2026
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Turing Auditorium & Innovation Labs • October 24 - 25, 2026
            </p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">PASS IDENTIFIER</span>
            <span className="text-base font-mono font-bold text-cyan-400">{team.registrationNumber}</span>
          </div>
        </div>

        {/* Ticket Details & QR Code */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Team Name</span>
                <span className="text-sm font-bold text-white">{team.teamName}</span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Domain Track</span>
                <span className="text-sm font-bold text-cyan-400">{team.domain}</span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Institution</span>
                <span className="text-sm font-bold text-slate-200 truncate block">
                  {team.members[0]?.college || 'College'}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Team Leader</span>
                <span className="text-sm font-bold text-white">{team.members[0]?.name}</span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Team Size</span>
                <span className="text-sm font-bold text-slate-200">{team.members.length} Innovators</span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block uppercase flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-cyan-400" />
                  <span>Wi-Fi Token</span>
                </span>
                <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20 inline-block mt-0.5">
                  IDEA26#NET_912
                </span>
              </div>
            </div>

            {/* Reviewer Remarks */}
            {team.reviewerNotes && (
              <div className="p-3.5 rounded-2xl glass-slot text-xs">
                <span className="font-semibold text-slate-300 block mb-0.5">
                  Coordinator Remarks:
                </span>
                <p className="text-slate-400 italic">
                  "{team.reviewerNotes}"
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Lock className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span>
                Data secured with AES-GCM encryption. Valid upon presenting physical college identity cards.
              </span>
            </div>

          </div>

          {/* QR Code Pass Preview */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl glass-slot text-center">
            <div className="bg-white p-3 rounded-2xl shadow-lg">
              <QRCodeDisplay
                value={`https://ideathon2026.edu/verify?id=${team.registrationNumber}&team=${encodeURIComponent(team.teamName)}`}
                size={135}
              />
            </div>
            <span className="text-xs text-slate-400 mt-3 block font-medium">
              Scan at Gate 3 Turnstile
            </span>
            <span className="text-[11px] font-bold text-cyan-400 mt-0.5">
              DIGITAL ENTRANCE PASS
            </span>
          </div>

        </div>

      </div>

      {/* Team Roster */}
      <div className="p-6 sm:p-7 glass-panel rounded-3xl">
        <h3 className="text-base font-display font-bold text-white mb-4 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          <span>Registered Team Roster ({team.members.length} Innovators)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {team.members.map((member, i) => (
            <div key={member.id || i} className="p-4 rounded-2xl glass-slot">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                  {member.role}
                </span>
                <span className="text-xs text-slate-500">#{i + 1}</span>
              </div>
              <p className="text-xs font-bold text-white">{member.name}</p>
              {member.email ? (
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{member.email}</p>
              ) : (
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Contact via Team Leader</p>
              )}
              <p className="text-[11px] text-slate-500 mt-1 truncate">
                ID: {member.studentId}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
