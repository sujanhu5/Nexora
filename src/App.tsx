import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DomainsSection } from './components/DomainsSection';
import { GuidelinesSection } from './components/GuidelinesSection';
import { VenueContactSection } from './components/VenueContactSection';
import { RegistrationModal } from './components/RegistrationModal';
import { Galaxy } from './components/Galaxy';
import { NexoraLogo } from './components/NexoraLogo';

import { 
  getStoredRegistrations, 
  saveStoredRegistrations 
} from './services/storageService';
import { TeamRegistration } from './types';

export default function App() {
  const [registrations, setRegistrations] = useState<TeamRegistration[]>([]);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Initialize data from local storage
  useEffect(() => {
    const loadedTeams = getStoredRegistrations();
    setRegistrations(loadedTeams);
  }, []);

  const handleSuccessfulRegistration = (newTeam: TeamRegistration) => {
    const updated = [newTeam, ...registrations];
    setRegistrations(updated);
    saveStoredRegistrations(updated);
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black font-sans relative overflow-x-hidden bg-black">
      
      {/* Dynamic Galaxy Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-black">
        {/* Deep Celestial Nebula Radial Aura */}
        <div 
          className="pointer-events-none fixed inset-0 w-full h-full -z-10"
          style={{
            background: 'radial-gradient(circle at 50% 15%, rgba(56, 189, 248, 0.18) 0%, rgba(14, 165, 233, 0.05) 42%, transparent 75%)'
          }}
          aria-hidden="true"
        />

        <div className="w-full h-full absolute inset-0">
          <Galaxy
            starSpeed={0.5}
            density={0.5}
            hueShift={140}
            speed={1}
            glowIntensity={0.3}
            saturation={0}
            mouseRepulsion
            repulsionStrength={1.5}
            twinkleIntensity={0.3}
            rotationSpeed={0.1}
            transparent
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Top Cyber Navigation Bar (No Sign In, No Pass) */}
      <Navbar />

      {/* Main Event Showcase */}
      <main className="flex-grow relative z-10">
        
        {/* Single Registration CTA Location */}
        <HeroSection
          onRegisterClick={() => setIsRegisterOpen(true)}
          totalRegistered={registrations.length}
        />

        {/* 10 Domains Grid - Name Only */}
        <DomainsSection />

        {/* Guidelines - No Rubric, No FAQs */}
        <GuidelinesSection />

        {/* Venue & Coordinators - CSE Block, SJBIT + Single Card for Coordinators */}
        <VenueContactSection />

      </main>

      {/* Technical Ideathon Footer */}
      <footer className="relative z-10 backdrop-blur-md bg-black/40 border-t border-cyan-500/20 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-cyan-500/20">
            <div>
              <div className="flex items-center gap-3">
                <NexoraLogo size="sm" showWordmark={true} />
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono font-semibold text-[10px] border border-cyan-500/30">
                  8-HOUR IDEATHON
                </span>
              </div>
              <p className="text-slate-300 mt-2 max-w-md text-xs leading-relaxed font-sans">
                Hosted at CSE Block, SJBIT. 8-hour college ideathon & prototype challenge across 10 innovation domains.
              </p>
            </div>

            {/* Section Navigation Links */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-semibold">
              <a href="#domains" className="hover:text-cyan-300 transition-colors">Domains</a>
              <a href="#guidelines" className="hover:text-cyan-300 transition-colors">Guidelines</a>
              <a href="#venue" className="hover:text-cyan-300 transition-colors">Venue & Coordinators</a>
              <a href="mailto:sjbit.nexora@gmail.com" className="hover:text-cyan-300 text-cyan-400 transition-colors">sjbit.nexora@gmail.com</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Department of Computer Science & Engineering, SJBIT.</span>
            </div>
            <div>
              © 2026 NEXORA • SJBIT. All rights reserved.
            </div>
          </div>

        </div>
      </footer>

      {/* Single Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccessfulRegistration={handleSuccessfulRegistration}
      />

    </div>
  );
}
