import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Trophy, 
  Users, 
  ArrowRight, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';
import { SplittingNexoraTitle } from './SplittingNexoraTitle';
import { NexoraLogo } from './NexoraLogo';

interface HeroSectionProps {
  onRegisterClick: () => void;
  totalRegistered: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRegisterClick,
  totalRegistered
}) => {
  // Live Countdown targeting Oct 30, 2026 09:00 AM IST
  const targetDate = new Date('2026-10-30T09:00:00+05:30').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 53,
    hours: 14,
    minutes: 32,
    seconds: 40
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const slotsLeft = Math.max(0, EVENT_DETAILS.totalSlots - totalRegistered);

  const scrollToDomains = () => {
    document.getElementById('domains')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Title Container */}
        <div className="text-center max-w-5xl mx-auto space-y-4">
          
          {/* Official NEXORA Celestial Logo Emblem Centerpiece */}
          <div className="flex justify-center -mb-2">
            <NexoraLogo size="md" showWordmark={false} />
          </div>

          {/* Splitting NEXORA Title - Just like before */}
          <div className="relative py-1">
            <SplittingNexoraTitle />

            <p className="text-sm sm:text-xl md:text-2xl font-tech font-bold uppercase tracking-[0.45em] sm:tracking-[0.6em] text-cyan-200 mt-2">
              IDEATHON 2026
            </p>

            <div className="flex items-center justify-center gap-3 mt-3 text-[10px] sm:text-xs font-mono text-cyan-400/90 uppercase tracking-widest">
              <span>8-HOUR SPRINT</span>
              <span className="text-cyan-500/40">——</span>
              <span>10 DOMAINS</span>
              <span className="text-cyan-500/40">——</span>
              <span>₹40K PRIZE POOL</span>
            </div>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed pt-2">
            An intensive 8-hour college ideathon and rapid prototyping challenge. Students collaborate in teams of 1 to 4 to engineer innovative solutions across 10 high-impact domains at CSE Block, SJBIT.
          </p>
        </div>

        {/* Action CTA - Single Registration Location */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onRegisterClick}
            className="glass-btn-primary w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-xs sm:text-sm text-white tracking-wider font-tech uppercase cursor-pointer group shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)]"
          >
            <Sparkles className="w-4 h-4 text-cyan-100 group-hover:rotate-12 transition-transform" />
            <span>REGISTER YOUR TEAM</span>
            <span className="px-2.5 py-0.5 rounded-md bg-black/40 text-xs font-mono font-semibold text-cyan-300 border border-cyan-400/30">
              1–4 Members
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={scrollToDomains}
            className="glass-btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-xs sm:text-sm text-slate-200 cursor-pointer group hover:text-white"
          >
            <span>View 10 Domains</span>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* 3 Metric Cards for NEXORA */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          
          {/* Card 1: 8-Hour Hackathon Sprint */}
          <div className="cyber-card p-6 sm:p-7 rounded-2xl group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400 group-hover:text-cyan-300 transition-colors">
                EVENT DURATION
              </span>
              <div className="cyber-dot" />
            </div>
            <div className="text-4xl sm:text-5xl font-syne font-extrabold text-white tracking-tight group-hover:text-cyan-200 transition-colors">
              8 Hours
            </div>
          </div>

          {/* Card 2: Total Prize Pool */}
          <div className="cyber-card p-6 sm:p-7 rounded-2xl group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400 group-hover:text-cyan-300 transition-colors">
                TOTAL PRIZE POOL
              </span>
              <div className="cyber-dot" />
            </div>
            <div className="text-4xl sm:text-5xl font-syne font-extrabold text-white tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-sky-400 group-hover:from-cyan-200 group-hover:to-cyan-400 transition-all">
              ₹40,000
            </div>
          </div>

          {/* Card 3: 10 Innovation Domains */}
          <div className="cyber-card p-6 sm:p-7 rounded-2xl group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400 group-hover:text-cyan-300 transition-colors">
                INNOVATION DOMAINS
              </span>
              <div className="cyber-dot" />
            </div>
            <div className="text-4xl sm:text-5xl font-syne font-extrabold text-white tracking-tight group-hover:text-cyan-200 transition-colors">
              10 Tracks
            </div>
          </div>

        </div>

        {/* Live Countdown Clock */}
        <div className="mt-10 max-w-xl mx-auto p-5 rounded-2xl cyber-card group cursor-pointer">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2 group-hover:text-cyan-300 transition-colors">
              <Clock className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
              EVENT KICKOFF COUNTDOWN
            </span>
            <span className="text-[10px] font-mono text-slate-400 group-hover:text-cyan-400 transition-colors">
              {slotsLeft} SLOTS REMAINING
            </span>
          </div>
          
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 text-center">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOURS', value: timeLeft.hours },
              { label: 'MINUTES', value: timeLeft.minutes },
              { label: 'SECONDS', value: timeLeft.seconds }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="p-3 sm:p-4 rounded-xl bg-black/60 border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-cyan-950/20 hover:scale-105 transition-all duration-300 ease-out"
              >
                <span className="block text-2xl sm:text-4xl font-tech font-extrabold text-white tracking-tight hover:text-cyan-300 transition-colors">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono font-semibold text-cyan-400/80 tracking-widest">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Essential Quick Details Strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-5xl mx-auto">
          <div className="cyber-card p-4 rounded-xl group cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
              <div className="cyber-dot" />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 group-hover:text-cyan-400 transition-colors">Date & Duration</p>
            <p className="text-xs sm:text-sm font-bold text-white mt-0.5 group-hover:text-cyan-200 transition-colors">{EVENT_DETAILS.dates} ({EVENT_DETAILS.duration})</p>
          </div>

          <div className="cyber-card p-4 rounded-xl group cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <MapPin className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
              <div className="cyber-dot" />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 group-hover:text-cyan-400 transition-colors">Venue</p>
            <p className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate group-hover:text-cyan-200 transition-colors" title={EVENT_DETAILS.venue}>
              {EVENT_DETAILS.venue}
            </p>
          </div>

          <div className="cyber-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-4 h-4 text-cyan-400" />
              <div className="cyber-dot" />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Prize Pool</p>
            <p className="text-xs sm:text-sm font-bold text-white mt-0.5">{EVENT_DETAILS.prizePool}</p>
          </div>

          <div className="cyber-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <div className="cyber-dot" />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Team Size</p>
            <p className="text-xs sm:text-sm font-bold text-white mt-0.5">1–4 Members</p>
          </div>
        </div>

      </div>
    </section>
  );
};
