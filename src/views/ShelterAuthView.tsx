import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDisaster } from '../context/DisasterContext';
import { 
  Home, 
  UserCheck, 
  Lock, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Building, 
  KeyRound
} from 'lucide-react';

export const ShelterAuthView: React.FC = () => {
  const { setActiveTab, loginAsShelterCoordinator, shelterNodes } = useDisaster();
  const [selectedShelterId, setSelectedShelterId] = useState('SH-GHY-001');
  const [coordinatorName, setCoordinatorName] = useState('Maj. Vikramjit Saikia');
  const [badgeId, setBadgeId] = useState('SDRF-SC-4409');
  const [passcode, setPasscode] = useState('••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.92, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.4)' }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      loginAsShelterCoordinator(selectedShelterId, coordinatorName);
      setActiveTab('shelter-dashboard');
      setIsSubmitting(false);
    }, 400);
  };

  const handleQuickLogin = (shelterId: string) => {
    loginAsShelterCoordinator(shelterId);
    setActiveTab('shelter-dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative overflow-hidden font-body-md">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between z-10">
        <button
          onClick={() => setActiveTab('role-selection')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-800 transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Change Role</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          <ShieldCheck size={13} />
          <span>Field Coordinator Access</span>
        </div>
      </header>

      {/* Main Card */}
      <main className="max-w-md mx-auto w-full my-auto py-8 z-10">
        <div 
          ref={cardRef}
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50 backdrop-blur-xl relative"
        >
          {/* Brand Icon & Heading */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 shadow-inner">
              <Home size={28} />
            </div>
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-widest">
              Relief Shelter Operational Command
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-1">
              Coordinator Login
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Authenticate to manage resident intake, bed capacity, ration stocks, and district requisition pipelines.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Shelter Selection Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Assigned Relief Shelter / Facility
              </label>
              <div className="relative">
                <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <select
                  value={selectedShelterId}
                  onChange={(e) => setSelectedShelterId(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
                >
                  {shelterNodes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.currentOccupancy}/{s.totalBedCapacity} beds)
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Coordinator Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Coordinator In-Charge Name
              </label>
              <div className="relative">
                <UserCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={coordinatorName}
                  onChange={(e) => setCoordinatorName(e.target.value)}
                  placeholder="e.g. Maj. Vikramjit Saikia"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Badge / ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Field Coordinator Badge ID
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                  placeholder="e.g. SDRF-SC-4409"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Passcode */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Field Clearance Passcode
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/20 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Verifying Facility Access…' : 'Enter Shelter Dashboard'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Quick Hub Shortcuts */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Quick Shelter Demo Switcher
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('SH-GHY-001')}
                className="p-2 text-left bg-slate-950 hover:bg-slate-850 rounded-lg border border-slate-800 text-[11px] font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                <div className="text-purple-400 font-bold">Pandu Camp #1</div>
                <div className="text-[10px] text-slate-500">742/850 (87%)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('SH-GHY-002')}
                className="p-2 text-left bg-slate-950 hover:bg-slate-850 rounded-lg border border-slate-800 text-[11px] font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                <div className="text-purple-400 font-bold">Chandmari Hub #2</div>
                <div className="text-[10px] text-slate-500">310/600 (52%)</div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto w-full text-center text-xs text-slate-600 py-2">
        <span>Assam State Disaster Management Authority • Relief Shelter Subsystem</span>
      </footer>
    </div>
  );
};
