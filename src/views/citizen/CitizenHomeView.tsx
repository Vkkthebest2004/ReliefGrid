import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDisaster } from '../../context/DisasterContext';
import { 
  Shield, 
  Radio, 
  CheckCircle2, 
  MapPin, 
  Megaphone, 
  Phone, 
  Navigation, 
  ArrowRight,
  AlertTriangle,
  ChevronRight,
  LifeBuoy,
  Layers
} from 'lucide-react';

export const CitizenHomeView: React.FC = () => {
  const { 
    citizenUser, 
    setActiveTab, 
    shelterNodes,
    citizenSOSTickets
  } = useDisaster();

  const [citizenStatus, setCitizenStatus] = useState<'SAFE' | 'NEED_HELP' | 'EVACUATED'>('SAFE');

  const containerRef = useRef<HTMLDivElement>(null);
  const sosButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  // Nearest Shelter derived from location
  const nearestShelter = shelterNodes[0];

  const handleUpdateStatus = (newStatus: 'SAFE' | 'NEED_HELP' | 'EVACUATED') => {
    setCitizenStatus(newStatus);
  };

  const handleTriggerQuickSOS = () => {
    setActiveTab('citizen-need-help');
  };

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto space-y-5 pb-16 font-body-md">
      {/* Top Bar for Citizen Portal */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Shield size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold text-white">ReliefGrid Citizen</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                Live Telemetry Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Guwahati Metro • Kamrup District Zone
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('citizen-requests')}
            className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 transition-colors cursor-pointer border border-slate-700/60"
            title="My Rescue Requests"
          >
            <LifeBuoy size={17} />
            {citizenSOSTickets.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                {citizenSOSTickets.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('role-selection')}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/60 transition-colors cursor-pointer"
          >
            <Layers size={13} />
            <span className="hidden sm:inline">Switch Role</span>
          </button>
        </div>
      </div>

      {/* Official Government Emergency Alert */}
      <div 
        onClick={() => setActiveTab('citizen-find-safety')}
        className="bg-gradient-to-r from-red-950/60 via-red-900/40 to-slate-900 border border-red-800/60 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-red-600 transition-all shadow-lg shadow-red-950/20 group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 group-hover:scale-105 transition-transform">
            <AlertTriangle size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
                OFFICIAL DDMA ADVISORY
              </span>
              <span className="text-[10px] text-slate-400">Issued 15m ago</span>
            </div>
            <h2 className="text-xs font-bold text-white mt-1 group-hover:text-red-200 transition-colors">
              Brahmaputra Rising — Evacuate Low-lying Pandu & Maligaon Sectors
            </h2>
            <p className="text-[11px] text-slate-300 mt-0.5">
              High schools and designated shelter camps #1, #2, #4 are operational with dry rations.
            </p>
          </div>
        </div>
        <ChevronRight size={18} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
      </div>

      {/* Primary SOS "GET HELP" Button */}
      <button
        ref={sosButtonRef}
        onClick={handleTriggerQuickSOS}
        className="w-full relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-rose-900 hover:from-red-500 hover:to-rose-800 rounded-3xl p-6 text-white text-left shadow-2xl shadow-red-700/30 border border-red-400/30 cursor-pointer transition-all duration-300 group active:scale-[0.99]"
      >
        {/* Animated Radial Pulse Rings */}
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-red-400/10 blur-2xl group-hover:bg-red-400/20 transition-all pointer-events-none" />
        <div className="absolute right-6 top-6 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white/90 group-hover:scale-110 group-hover:rotate-12 transition-all">
          <Radio size={28} className="animate-pulse" />
        </div>

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-widest text-red-200 mb-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            Emergency SOS Beacon
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>GET EMERGENCY HELP</span>
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </h2>
          <p className="text-xs sm:text-sm text-red-100/90 font-medium mt-1">
            Medical Airlift • Flood Inundation Rescue • Food & Potable Water • SDRF Boat Dispatch
          </p>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-red-200/80">
            <MapPin size={13} />
            <span>GPS location auto-shared directly with DEOC control room</span>
          </div>
        </div>
      </button>

      {/* Near You / Safe Places Widget */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-amber-400" />
            <span className="text-xs font-extrabold text-white uppercase tracking-wider">
              Verified Relief Near You
            </span>
          </div>
          <button
            onClick={() => setActiveTab('citizen-find-safety')}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View Interactive Safety Map</span>
            <ChevronRight size={13} />
          </button>
        </div>

        {nearestShelter ? (
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold">
                  Primary Shelter
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Open & Operational
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">
                {nearestShelter.name}
              </h4>
              <p className="text-[11px] text-slate-400">
                {nearestShelter.address} • <strong className="text-purple-300">{nearestShelter.totalBedCapacity - nearestShelter.currentOccupancy} beds available</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`tel:${nearestShelter.contactPhone}`}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-bold transition-colors border border-slate-700"
              >
                <Phone size={13} />
                <span>Call Center</span>
              </a>
              <button
                onClick={() => setActiveTab('citizen-find-safety')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors shadow-md shadow-amber-500/10 cursor-pointer"
              >
                <Navigation size={13} />
                <span>Directions</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500 py-3 text-center">
            Fetching nearby relief shelters…
          </div>
        )}
      </section>

      {/* Two Column Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* I'm Safe Status Toggle */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className={citizenStatus === 'SAFE' ? 'text-emerald-400' : 'text-slate-400'} />
            <span className="text-xs font-bold text-white">Citizen Welfare Status</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Notify rescue authorities and relatives that you are in a safe location.
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => handleUpdateStatus('SAFE')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                citizenStatus === 'SAFE'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <CheckCircle2 size={13} />
              <span>I'm Safe</span>
            </button>
            <button
              onClick={() => handleUpdateStatus('NEED_HELP')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                citizenStatus === 'NEED_HELP'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <AlertTriangle size={13} />
              <span>Need Help</span>
            </button>
          </div>
        </div>

        {/* Report a Hazard */}
        <div 
          onClick={() => setActiveTab('citizen-report')}
          className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-4 flex flex-col justify-between shadow-xl cursor-pointer group transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Megaphone size={16} className="text-blue-400" />
                <span className="text-xs font-bold text-white">Report Hazard / Breach</span>
              </div>
              <ChevronRight size={15} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-[11px] text-slate-400">
              Report submerged roads, broken levees, fire, or landslides with GPS photos and voice notes.
            </p>
          </div>

          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:text-blue-300">
            <span>Submit Citizen Field Report</span>
            <ArrowRight size={13} />
          </div>
        </div>
      </div>

      {/* Account / Location Strip */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Signed in as <strong className="text-white">{citizenUser?.name || 'Citizen User'}</strong> ({citizenUser?.phone || '+91 98640-12345'})</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('citizen-requests')}
            className="text-amber-400 hover:underline font-bold cursor-pointer"
          >
            My Open Requests ({citizenSOSTickets.length})
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveTab('role-selection')}
            className="text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
