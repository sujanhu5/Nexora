import React from 'react';
import { Layers } from 'lucide-react';
import { DOMAINS_LIST } from '../data/eventData';

export const DomainsSection: React.FC = () => {
  return (
    <section id="domains" className="py-20 scroll-mt-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>CHALLENGE TRACKS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            10 Innovation Domains
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Select an area of impact and build your prototype at NEXORA 2026.
          </p>
        </div>

        {/* 10 Domains Grid - Clean, displaying only the domain name without any emojis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {DOMAINS_LIST.map((domain, idx) => (
            <div
              key={domain.id}
              className="cyber-card p-5 rounded-2xl flex items-center gap-4 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-sm text-cyan-400 flex-shrink-0 group-hover:scale-110 group-hover:border-cyan-400/60 group-hover:bg-cyan-900/40 group-hover:text-cyan-200 transition-all duration-300 ease-out shadow-inner">
                <span>{String(idx + 1).padStart(2, '0')}</span>
              </div>
              <div className="flex-grow min-w-0">
                <span className="text-[10px] font-mono text-cyan-400 group-hover:text-cyan-300 font-semibold tracking-wider uppercase block transition-colors duration-200">
                  Domain {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white font-display group-hover:text-cyan-200 transition-colors duration-200 leading-snug">
                  {domain.title}
                </h3>
              </div>
              <div className="cyber-dot opacity-60 group-hover:opacity-100 flex-shrink-0" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
