import React, { useState } from 'react';
import { Layers, ChevronDown, Sparkles } from 'lucide-react';
import { DOMAINS_LIST } from '../data/eventData';

export const DomainsSection: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleDomain = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

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
            Select an area of impact and build your prototype at NEXORA 2026. Click any domain below to view its challenge scope.
          </p>
        </div>

        {/* 10 Domains Grid with Dropdown Click-to-Expand Descriptions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 max-w-5xl mx-auto items-start">
          {DOMAINS_LIST.map((domain, idx) => {
            const isExpanded = expandedId === domain.id;

            return (
              <div
                key={domain.id}
                id={`domain-card-${domain.id}`}
                onClick={() => toggleDomain(domain.id)}
                className={`cyber-card p-5 rounded-2xl flex flex-col group cursor-pointer transition-all duration-300 ${
                  isExpanded ? 'border-cyan-400/60 bg-cyan-950/30 shadow-[0_0_25px_rgba(6,182,212,0.18)]' : ''
                }`}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-controls={`domain-desc-${domain.id}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDomain(domain.id);
                  }
                }}
              >
                {/* Header Row */}
                <div className="flex items-center gap-4 w-full">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-mono font-bold text-sm flex-shrink-0 transition-all duration-300 ease-out shadow-inner ${
                    isExpanded 
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 scale-105 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400 group-hover:scale-105 group-hover:border-cyan-400/60 group-hover:bg-cyan-900/40 group-hover:text-cyan-200'
                  }`}>
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

                  {/* Dropdown Chevron Indicator */}
                  <div className="flex items-center gap-2 flex-shrink-0 pl-1">
                    <button
                      type="button"
                      id={`domain-toggle-btn-${domain.id}`}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${domain.title} description`}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300 ${
                        isExpanded
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                          : 'bg-white/5 border-white/10 text-slate-400 group-hover:text-white group-hover:border-white/20'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDomain(domain.id);
                      }}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ease-out ${
                          isExpanded ? 'rotate-180 text-cyan-300' : 'text-slate-400 group-hover:text-white'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Dropdown Description (3-4 Sentences) */}
                {isExpanded && (
                  <div
                    id={`domain-desc-${domain.id}`}
                    className="mt-4 pt-3.5 border-t border-cyan-500/20 text-slate-300 animate-in fade-in slide-in-from-top-2 duration-300"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Track Overview & Challenge Scope</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      {domain.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
