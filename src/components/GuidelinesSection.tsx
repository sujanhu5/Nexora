import React from 'react';
import { 
  FileCheck, 
  Users2, 
  Lightbulb, 
  FileText, 
  Clock, 
  ShieldAlert, 
  Laptop, 
  CheckCircle2
} from 'lucide-react';
import { GUIDELINES } from '../data/eventData';

export const GuidelinesSection: React.FC = () => {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'team-eligibility':
        return <Users2 className="w-5 h-5 text-cyan-400" />;
      case 'idea-originality':
        return <Lightbulb className="w-5 h-5 text-sky-400" />;
      case 'abstract-synopsis':
        return <FileText className="w-5 h-5 text-indigo-400" />;
      case 'presentation-rules':
        return <Clock className="w-5 h-5 text-teal-400" />;
      case 'conduct-disqualification':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      default:
        return <FileCheck className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getCategoryBorder = (id: string) => {
    switch (id) {
      case 'team-eligibility':
        return 'hover:border-cyan-500/40 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]';
      case 'idea-originality':
        return 'hover:border-sky-500/40 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]';
      case 'abstract-synopsis':
        return 'hover:border-indigo-500/40 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]';
      case 'presentation-rules':
        return 'hover:border-teal-500/40 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.15)]';
      case 'conduct-disqualification':
        return 'hover:border-rose-500/40 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]';
      default:
        return 'hover:border-cyan-500/40';
    }
  };

  return (
    <section id="guidelines" className="py-20 scroll-mt-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>OFFICIAL EVENT STANDARDS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Guidelines & Rules
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Comprehensive participation rules, team eligibility, submission formats, and presentation protocols for NEXORA 2026.
          </p>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 max-w-5xl mx-auto">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
              <Users2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Team Size</p>
              <p className="text-xs font-semibold text-white">1–4 Members</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">File Format</p>
              <p className="text-xs font-semibold text-white">TeamName.pdf</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Presentation</p>
              <p className="text-xs font-semibold text-white">10–15m + 3–5m Q&A</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Laptop className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Hardware</p>
              <p className="text-xs font-semibold text-white">Bring Own Laptops</p>
            </div>
          </div>
        </div>

        {/* Core Guidelines Grid */}
        <div className="space-y-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {GUIDELINES.map((guide) => (
              <div 
                key={guide.id}
                className={`cyber-card p-6 sm:p-7 rounded-2xl flex flex-col justify-between group transition-all duration-300 ${getCategoryBorder(guide.id)}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                      {getCategoryIcon(guide.id)}
                    </div>
                    {guide.badge && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold tracking-wider bg-white/5 border border-white/10 text-cyan-300 uppercase">
                        {guide.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white font-display uppercase tracking-wider mb-1 group-hover:text-cyan-200 transition-colors">
                    {guide.category}
                  </h3>
                  {guide.subtitle && (
                    <p className="text-xs text-slate-400 font-sans mb-4">
                      {guide.subtitle}
                    </p>
                  )}

                  <ul className="space-y-3.5 mt-2">
                    {guide.rules.map((rule, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 hover:text-slate-100 leading-relaxed transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0 group-hover:text-cyan-300" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
