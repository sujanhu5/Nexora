import React, { useState } from 'react';
import { MapPin, Phone, Mail, Check, Copy } from 'lucide-react';
import { COORDINATORS, EVENT_DETAILS } from '../data/eventData';

export const VenueContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const emailAddress = "sjbit.nexora@gmail.com";

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="venue" className="py-20 scroll-mt-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>VENUE & CONTACT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Venue & Coordinators
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Campus location, student coordinator contacts, registration issues, and official email for NEXORA 2026.
          </p>
        </div>

        {/* 2 Focused Cards: Venue Card & Coordinators/Contact Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Venue Card */}
          <div className="cyber-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between group cursor-pointer">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-cyan-400 group-hover:text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider transition-colors duration-200">
                  <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span>EVENT VENUE</span>
                </div>
                <div className="cyber-dot" />
              </div>

              <h3 className="text-2xl font-bold text-white font-display mb-2 group-hover:text-cyan-200 transition-colors duration-200">
                {EVENT_DETAILS.venue}
              </h3>

              <div className="space-y-1 text-sm text-slate-300 leading-relaxed">
                <p className="font-semibold text-white">Address:</p>
                <p className="text-slate-300">{EVENT_DETAILS.address}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="group-hover:text-slate-200 transition-colors duration-200">Date: {EVENT_DETAILS.dates}</span>
              <span className="group-hover:text-cyan-300 transition-colors duration-200">Duration: {EVENT_DETAILS.duration}</span>
            </div>
          </div>

          {/* Coordinators, Registration Issues & Email Card */}
          <div className="cyber-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Phone className="w-4 h-4" />
                  <span>EVENT COORDINATORS & SUPPORT</span>
                </div>
                <div className="cyber-dot" />
              </div>

              <h3 className="text-xl font-bold text-white font-display mb-4">
                Contact & Support
              </h3>

              {/* Student Lead Coordinators */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Student Lead Coordinators
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {COORDINATORS.map((coord, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.05] transition-all"
                    >
                      <p className="text-sm font-bold text-white mb-1">
                        {coord.name}
                      </p>
                      <a
                        href={`tel:${coord.phone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors group/phone"
                      >
                        <Phone className="w-3.5 h-3.5 text-cyan-500 group-hover/phone:rotate-12 transition-transform" />
                        <span className="hover:underline font-semibold">{coord.phone}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registration Issue Numbers */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Registration Issues:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href="tel:7904608866"
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/25 hover:border-cyan-400/50 hover:bg-cyan-900/30 text-xs font-mono text-slate-200 hover:text-cyan-200 transition-all group/reg"
                  >
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400 flex-shrink-0 group-hover/reg:scale-110 transition-transform">
                      <Phone className="w-3 h-3" />
                    </div>
                    <span className="font-semibold">+91 79046 08866</span>
                  </a>

                  <a
                    href="tel:7338440272"
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/25 hover:border-cyan-400/50 hover:bg-cyan-900/30 text-xs font-mono text-slate-200 hover:text-cyan-200 transition-all group/reg"
                  >
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400 flex-shrink-0 group-hover/reg:scale-110 transition-transform">
                      <Phone className="w-3 h-3" />
                    </div>
                    <span className="font-semibold">+91 73384 40272</span>
                  </a>
                </div>
              </div>

              {/* Official Email Section */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold mb-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Official Email:</span>
                </p>
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/25 hover:border-cyan-400/50 hover:bg-cyan-900/25 transition-all">
                  <a
                    href={`mailto:${emailAddress}`}
                    className="flex items-center gap-2.5 text-xs sm:text-sm font-mono text-slate-200 hover:text-cyan-300 transition-colors overflow-hidden truncate group/mail"
                  >
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400 flex-shrink-0 group-hover/mail:scale-110 transition-transform">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold underline underline-offset-4 decoration-cyan-500/40 hover:decoration-cyan-300">
                      {emailAddress}
                    </span>
                  </a>

                  <button
                    onClick={handleCopyEmail}
                    title="Copy email address"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all flex-shrink-0 cursor-pointer flex items-center gap-1 text-[11px] font-mono"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold hidden sm:inline">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-white/10 text-[11px] font-mono text-slate-400">
              Reach out directly for squad queries, registration assistance, or event questions.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
