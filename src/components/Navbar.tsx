import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Layers, 
  PhoneCall, 
  FileText
} from 'lucide-react';
import { NexoraLogo } from './NexoraLogo';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Domains', href: '#domains', icon: Layers },
    { label: 'Guidelines', href: '#guidelines', icon: FileText },
    { label: 'Venue & Coordinators', href: '#venue', icon: PhoneCall },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/80 border-b border-cyan-500/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo - Just the word nexora itself like before */}
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center group cursor-pointer"
            id="brand-logo"
            aria-label="nexora"
          >
            <span className="text-2xl sm:text-3xl font-syne font-extrabold tracking-wider text-white group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.6)] transition-all duration-300 uppercase">
              nexora
            </span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.href)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/15 hover:border-cyan-500/30 border border-transparent hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
                >
                  <Icon className="w-3.5 h-3.5 text-cyan-400/70 group-hover:text-cyan-300 group-hover:scale-110 transition-all duration-200" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Date & Venue Indicator Badge in Header */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Oct 30 • CSE Block, SJBIT</span>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-black/60 border border-cyan-500/30 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-cyan-500/20 bg-black/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.href)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-mono text-slate-200 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors text-left cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>
          <div className="px-4 py-2 text-xs font-mono text-cyan-400">
            October 30, 2026 • CSE Block, SJBIT
          </div>
        </div>
      )}
    </header>
  );
};
