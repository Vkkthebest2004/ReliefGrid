import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDisaster } from '../../context/DisasterContext';

export const CitizenHomeView: React.FC = () => {
  const { 
    citizenUser, 
    setActiveTab, 
    shelterNodes,
    citizenSOSTickets
  } = useDisaster();

  const [isSafe, setIsSafe] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, []);

  const nearestShelter = shelterNodes[0] || {
    name: 'Pandu Relief Camp #1',
    currentOccupancy: 742,
    totalBedCapacity: 850,
    contactPhone: '+91 94350-88123'
  };

  const availableBeds = nearestShelter.totalBedCapacity - nearestShelter.currentOccupancy;

  return (
    <div ref={containerRef} className="bg-[#f8fafc] text-[#0f172a] font-['Inter',sans-serif] min-h-screen pb-16 selection:bg-[#dbeafe] selection:text-[#1e3a8a]">
      {/* Broadcast Alert Banner */}
      <div className="bg-[#fef3c7] border-b border-[#fcd34d] px-4 sm:px-8 py-3 flex items-start justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <span 
            className="material-symbols-outlined text-[#b45309] mt-0.5" 
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
          <div>
            <h3 className="text-sm font-bold text-[#78350f]">
              URGENT: Flash Flood & River Inundation Advisory
            </h3>
            <p className="text-xs text-[#92400e] mt-0.5">
              High water discharge alert in Brahmaputra basin. Seek verified shelter hubs in Kamrup Metro immediately.
            </p>
          </div>
        </div>

        <button 
          onClick={() => setActiveTab('citizen-find-safety')}
          className="text-xs font-['JetBrains_Mono',monospace] font-bold text-[#b45309] underline hover:text-[#78350f] cursor-pointer whitespace-nowrap"
        >
          View Map →
        </button>
      </div>

      <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
        
        {/* Top Citizen Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-[4px] border border-[#e2e8f0] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[4px] bg-[#dbeafe] text-[#2563eb] flex items-center justify-center font-extrabold text-base">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-['Outfit',sans-serif] text-lg font-bold text-[#0f172a]">
                  {citizenUser?.name || 'Rahul Kalita'}
                </h1>
                <span className="px-2 py-0.5 rounded-[4px] bg-[#dcfce7] text-[#15803d] font-['JetBrains_Mono',monospace] text-[10px] font-bold border border-[#bbf7d0]">
                  GPS SYNCHRONIZED
                </span>
              </div>
              <p className="font-['JetBrains_Mono',monospace] text-xs text-[#475569]">
                {citizenUser?.phone || '+91 98640-12345'} • Kamrup Metro Sector
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('citizen-requests')}
              className="px-3 py-1.5 rounded-[4px] bg-[#f1f5f9] hover:bg-[#e2e8f0] text-xs font-semibold text-[#0f172a] border border-[#cbd5e1] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">track_changes</span>
              <span>My Requests ({citizenSOSTickets.length})</span>
            </button>
          </div>
        </div>

        {/* Hero / Critical Action Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SOS Action Card */}
          <div className="lg:col-span-8 bg-white border border-[#e2e8f0] rounded-[4px] p-6 sm:p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden shadow-xs">
            <div className="z-10 text-center mb-6 w-full flex justify-between items-start">
              <div className="font-['JetBrains_Mono',monospace] text-xs font-semibold text-[#475569] bg-[#f8fafc] px-2.5 py-1 rounded-[4px] border border-[#cbd5e1] shadow-xs">
                SYS.STATUS: OPERATIONAL
              </div>
              <div className="flex items-center gap-2 bg-[#f8fafc] px-2.5 py-1 rounded-[4px] border border-[#cbd5e1] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse"></span>
                <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#0284c7]">
                  GPS LOCK: 26.1582° N, 91.6795° E
                </span>
              </div>
            </div>

            {/* Glowing Big SOS Button */}
            <div className="relative z-10 w-44 h-44 flex items-center justify-center cursor-pointer group my-2">
              <button 
                onClick={() => setActiveTab('citizen-need-help')}
                className="w-32 h-32 rounded-[16px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-['Outfit',sans-serif] text-3xl font-extrabold shadow-[0_8px_24px_rgba(220,38,38,0.4)] flex flex-col items-center justify-center z-20 group-active:scale-95 transition-all duration-150 border-4 border-white cursor-pointer"
              >
                <span>SOS</span>
                <span className="font-['JetBrains_Mono',monospace] text-[10px] uppercase font-bold tracking-wider mt-1 opacity-90">
                  Tap For Help
                </span>
              </button>
            </div>

            <p className="mt-6 font-['Inter',sans-serif] text-xs text-[#475569] text-center max-w-md z-10 bg-[#f8fafc] px-4 py-2 rounded-[4px] border border-[#e2e8f0]">
              Broadcasts immediate rescue coordinates to NDRF Swift Water units and the nearest relief camp coordinator.
            </p>
          </div>

          {/* Right Column: Status & Safety */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Safety Status Toggle */}
            <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-6 relative overflow-hidden shadow-xs">
              <div className="absolute top-0 left-0 bg-[#e0f2fe] px-3 py-1 rounded-br-[4px] border-b border-r border-[#0284c7]/20">
                <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[#0c4a6e] uppercase tracking-wider">
                  Personal Status
                </span>
              </div>

              <div className="mt-6 flex flex-col items-center justify-center text-center">
                <span 
                  className="material-symbols-outlined text-4xl text-[#0284c7] mb-2" 
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  health_and_safety
                </span>
                <h2 className="font-['Outfit',sans-serif] text-lg font-bold text-[#0f172a] mb-1">
                  Welfare Check-In
                </h2>
                <p className="text-xs text-[#475569] mb-4">
                  Mark yourself as safe to notify family and local disaster authorities.
                </p>

                <button
                  type="button"
                  onClick={() => setIsSafe(!isSafe)}
                  className={`w-full py-2.5 px-4 rounded-[4px] font-['JetBrains_Mono',monospace] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                    isSafe 
                      ? 'bg-[#dcfce7] text-[#15803d] border-[#86efac]' 
                      : 'bg-[#fee2e2] text-[#dc2626] border-[#fca5a5]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {isSafe ? 'check_circle' : 'warning'}
                  </span>
                  <span>{isSafe ? "STATUS: I AM SAFE" : "STATUS: NEED ASSISTANCE"}</span>
                </button>
              </div>
            </div>

            {/* Nearest Shelter Card */}
            <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[#475569] uppercase tracking-wider">
                  Nearest Relief Hub
                </span>
                <span className="px-2 py-0.5 bg-[#dcfce7] text-[#15803d] font-['JetBrains_Mono',monospace] text-[10px] font-bold rounded-[2px]">
                  {availableBeds} Beds Free
                </span>
              </div>

              <div>
                <h4 className="font-['Outfit',sans-serif] text-sm font-bold text-[#0f172a]">
                  {nearestShelter.name}
                </h4>
                <p className="font-['JetBrains_Mono',monospace] text-xs text-[#0284c7] mt-0.5">
                  1.2 km away • Incharge: {nearestShelter.contactPhone}
                </p>
              </div>

              <button
                onClick={() => setActiveTab('citizen-find-safety')}
                className="w-full py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-['JetBrains_Mono',monospace] text-xs font-bold rounded-[4px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">directions</span>
                <span>Get Safe Route</span>
              </button>
            </div>

          </div>
        </div>

        {/* 4 Core Quick Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('citizen-find-safety')}
            className="bg-white border border-[#e2e8f0] hover:border-[#2563eb] rounded-[4px] p-4 text-left shadow-xs transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-[4px] bg-[#dbeafe] text-[#2563eb] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined">explore</span>
            </div>
            <div>
              <h4 className="font-['Outfit',sans-serif] text-sm font-bold text-[#0f172a]">Verified Safe Zones</h4>
              <p className="text-xs text-[#475569] mt-0.5">Find food, medical & bed hubs on Leaflet map</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('missing-persons')}
            className="bg-white border border-[#e2e8f0] hover:border-[#2563eb] rounded-[4px] p-4 text-left shadow-xs transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-[4px] bg-[#f3e8ff] text-[#7e22ce] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined">person_search</span>
            </div>
            <div>
              <h4 className="font-['Outfit',sans-serif] text-sm font-bold text-[#0f172a]">Find Family Members</h4>
              <p className="text-xs text-[#475569] mt-0.5">Cross-check shelter resident logs in real time</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('citizen-report')}
            className="bg-white border border-[#e2e8f0] hover:border-[#2563eb] rounded-[4px] p-4 text-left shadow-xs transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-[4px] bg-[#ffedd5] text-[#c2410c] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined">report_problem</span>
            </div>
            <div>
              <h4 className="font-['Outfit',sans-serif] text-sm font-bold text-[#0f172a]">Report Field Hazard</h4>
              <p className="text-xs text-[#475569] mt-0.5">4-step wizard to report road cuts & breaches</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('citizen-requests')}
            className="bg-white border border-[#e2e8f0] hover:border-[#2563eb] rounded-[4px] p-4 text-left shadow-xs transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-[4px] bg-[#ecfdf5] text-[#059669] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined">track_changes</span>
            </div>
            <div>
              <h4 className="font-['Outfit',sans-serif] text-sm font-bold text-[#0f172a]">Rescue Progression</h4>
              <p className="text-xs text-[#475569] mt-0.5">Track dispatched boat ETA & tactical units</p>
            </div>
          </button>
        </div>

        {/* Emergency Helpline Strip */}
        <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2 text-[#475569]">
            <span className="material-symbols-outlined text-[#dc2626]">call</span>
            <span className="font-bold">Official 24/7 Helplines:</span>
          </div>
          <div className="flex items-center gap-4 font-['JetBrains_Mono',monospace] font-bold text-[#0f172a]">
            <span>State EOC: <strong className="text-[#2563eb]">1070</strong></span>
            <span>District: <strong className="text-[#b45309]">1077</strong></span>
            <span>Emergency Services: <strong className="text-[#dc2626]">112</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
};
