import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDisaster } from '../context/DisasterContext';
import { 
  Shield, 
  Building2, 
  Home, 
  ArrowRight, 
  Radio, 
  CheckCircle2, 
  ArrowLeft
} from 'lucide-react';

export const RoleSelectionView: React.FC = () => {
  const { setActiveTab, selectRole, loginAsOfficer, loginAsShelterCoordinator, loginAsCitizen } = useDisaster();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardsRef.current) {
      const cards = cardsRef.current.children;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 35, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.12, 
          ease: 'back.out(1.4)' 
        }
      );
    }
  }, []);

  const handleSelectRole = (role: 'OFFICER' | 'SHELTER_COORDINATOR' | 'CITIZEN') => {
    selectRole(role);
    if (role === 'OFFICER') {
      setActiveTab('secure-login');
    } else if (role === 'SHELTER_COORDINATOR') {
      setActiveTab('shelter-auth');
    } else {
      setActiveTab('citizen-auth');
    }
  };

  const handleQuickDemo = (role: 'OFFICER' | 'SHELTER_COORDINATOR' | 'CITIZEN') => {
    if (role === 'OFFICER') {
      loginAsOfficer('AS-DDMA-7402');
      setActiveTab('command-center');
    } else if (role === 'SHELTER_COORDINATOR') {
      loginAsShelterCoordinator('SH-GHY-001');
      setActiveTab('shelter-dashboard');
    } else {
      loginAsCitizen('Citizen User', '+91 98765-43210');
      setActiveTab('citizen-home');
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative overflow-hidden font-body-md">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Government Strip & Back Navigation */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between z-10">
        <button
          onClick={() => setActiveTab('official-portal')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-800 transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to ASDMA Portal</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Unified Access Gateway • Secure 256-bit TLS</span>
        </div>
      </header>

      {/* Hero Content & Multi-step Indicator */}
      <main className="max-w-6xl mx-auto w-full my-auto py-8 z-10 flex flex-col items-center">
        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-6 bg-slate-900/90 border border-slate-800 rounded-full px-5 py-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <CheckCircle2 size={14} />
            <span>1. State Gateway</span>
          </div>
          <span className="text-slate-600">/</span>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
            <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-extrabold">2</span>
            <span>2. Select Access Role</span>
          </div>
          <span className="text-slate-600">/</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px]">3</span>
            <span>3. Authenticate</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Shield size={13} />
            Institutional Disaster Management Protocol
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Choose Your Operational Portal
          </h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Select your assigned governance tier to enter the designated operational console. All actions are logged under the Disaster Management Act, 2005.
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* 1. GOVERNMENT OFFICER CARD */}
          <div className="group relative bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-blue-500/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between">
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-wider uppercase">
                Tier 1 Official
              </span>
            </div>

            <div>
              <div className="w-14 h-14 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-105 group-hover:bg-blue-600/20 transition-all">
                <Building2 size={28} />
              </div>

              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                Government Emergency Command
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-5">
                For NDMA, SDMA, and District Emergency Response Officers (DEOC). Full tactical control, AI-driven resource dispatch, and GIS simulation.
              </p>

              {/* Feature Checklist */}
              <div className="space-y-2 pt-3 border-t border-slate-800/80 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 size={13} className="text-blue-400 shrink-0" />
                  <span>RADS Multi-criteria Resource Solver</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 size={13} className="text-blue-400 shrink-0" />
                  <span>Hydrodynamic Flood Inundation Engine</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 size={13} className="text-blue-400 shrink-0" />
                  <span>Tactical OpenStreetMap & Route Detours</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 size={13} className="text-blue-400 shrink-0" />
                  <span>District Incident Triage & Verification</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleSelectRole('OFFICER')}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                <span>Officer Secure Login</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => handleQuickDemo('OFFICER')}
                className="w-full py-2 px-3 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer border border-slate-800"
              >
                ⚡ Instant Officer Demo (Bypass Auth)
              </button>
            </div>
          </div>

          {/* 2. SHELTER COORDINATOR CARD */}
          <div className="group relative bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-purple-500/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col justify-between">
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold tracking-wider uppercase">
                Field Operations
              </span>
            </div>

            <div>
              <div className="w-14 h-14 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-105 group-hover:bg-purple-600/20 transition-all">
                <Home size={28} />
              </div>

              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                Shelter & Relief Camp Node
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-5">
                For Camp Commanders, Shelter In-Charges, and Ground Coordinators. Real-time capacity, victim intake, inventory, and NGO network synchronization.
              </p>

              {/* Feature Checklist */}
              <div className="space-y-2 pt-3 border-t border-slate-800/80 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 size={13} className="text-purple-400 shrink-0" />
                  <span>Real-Time Bed & Demographics Occupancy</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 size={13} className="text-purple-400 shrink-0" />
                  <span>Citizen Request Triage & Fulfillment</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 size={13} className="text-purple-400 shrink-0" />
                  <span>Inventory Alerts & Reorder Requisitions</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 size={13} className="text-purple-400 shrink-0" />
                  <span>Active NGO Network Coordination Hub</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleSelectRole('SHELTER_COORDINATOR')}
                className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
              >
                <span>Shelter Coordinator Login</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => handleQuickDemo('SHELTER_COORDINATOR')}
                className="w-full py-2 px-3 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer border border-slate-800"
              >
                ⚡ Instant Shelter Demo (Pandu Camp #1)
              </button>
            </div>
          </div>

          {/* 3. CITIZEN & VICTIM PORTAL */}
          <div className="group relative bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between">
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold tracking-wider uppercase">
                Public Access
              </span>
            </div>

            <div>
              <div className="w-14 h-14 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-105 group-hover:bg-amber-600/20 transition-all">
                <Radio size={28} className="animate-pulse" />
              </div>

              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Citizen Distress & Safety Hub
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-5">
                For impacted citizens and victims. One-tap SOS distress beacon, GPS-guided nearby verified shelters/hospitals, and status tracking.
              </p>

              {/* Feature Checklist */}
              <div className="space-y-2 pt-3 border-t border-slate-800/80 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                  <span>One-Tap SOS Beacon with GPS & Voice</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                  <span>Live Verified Shelters, Hospitals & Food</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                  <span>"I'm Safe" / Emergency Status Sharing</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                  <span>Hazard Incident Reporting & Tracking</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleSelectRole('CITIZEN')}
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-600/20 cursor-pointer"
              >
                <span>Citizen Sign In / Register</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => handleQuickDemo('CITIZEN')}
                className="w-full py-2 px-3 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer border border-slate-800"
              >
                ⚡ Instant Citizen Access (Guest Mode)
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-slate-500 py-4 border-t border-slate-900 z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>ReliefGrid Unified Platform • Governed by NDMA & ASDMA</span>
        <span>Disaster Emergency Helplines: 1070 (National) • 1077 (Assam ASDMA) • 112 (Universal)</span>
      </footer>
    </div>
  );
};
