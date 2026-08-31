import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDisaster } from '../../context/DisasterContext';

export const ShelterDashboardView: React.FC = () => {
  const { 
    selectedShelterNode, 
    shelterNodes, 
    setSelectedShelterNode, 
    setActiveTab, 
    citizenSOSTickets, 
    restockOrders
  } = useDisaster();

  const containerRef = useRef<HTMLDivElement>(null);
  const kpiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (kpiRef.current) {
      gsap.fromTo(
        kpiRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' }
      );
    }
  }, []);

  const shelter = selectedShelterNode || shelterNodes[0];

  if (!shelter) {
    return <div className="text-[#475569] p-8 text-center font-['JetBrains_Mono',monospace]">Loading Shelter Node…</div>;
  }

  const occupied = shelter.currentOccupancy;
  const totalCap = shelter.totalBedCapacity;
  const available = Math.max(0, totalCap - occupied);
  const utilRate = totalCap > 0 ? Math.round((occupied / totalCap) * 100) : 0;
  const criticalItems = shelter.inventory.filter(i => i.status === 'CRITICAL_DEFICIT' || i.status === 'LOW');
  const activeOrders = restockOrders.filter(o => o.status !== 'DELIVERED');

  return (
    <div ref={containerRef} className="bg-[#f8fafc] text-[#0f172a] font-['Inter',sans-serif] min-h-screen pb-16 space-y-6">
      
      {/* Top Header & Facility Selector */}
      <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-[2px] bg-[#dbeafe] text-[#1d4ed8] font-['JetBrains_Mono',monospace] text-[11px] font-bold">
              NODE ID: {shelter.code || shelter.id}
            </span>
            <span className="px-2 py-0.5 rounded-[2px] bg-[#dcfce7] text-[#15803d] font-['JetBrains_Mono',monospace] text-[11px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#15803d] animate-pulse" />
              <span>LIVE ACTIVE</span>
            </span>
          </div>

          <h1 className="font-['Outfit',sans-serif] text-2xl font-extrabold text-[#0f172a] tracking-tight">
            {shelter.name}
          </h1>

          <p className="text-xs text-[#475569] mt-0.5">
            {shelter.address} • Incharge: <strong className="text-[#0f172a]">{shelter.officerInCharge}</strong> ({shelter.contactPhone})
          </p>
        </div>

        {/* Dropdown & CTAs */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={shelter.id}
            onChange={(e) => {
              const found = shelterNodes.find(s => s.id === e.target.value);
              if (found) setSelectedShelterNode(found);
            }}
            className="bg-[#f8fafc] border border-[#e2e8f0] text-xs font-['JetBrains_Mono',monospace] text-[#0f172a] px-3 py-2 rounded-[4px] focus:outline-none focus:border-[#2563eb] cursor-pointer"
          >
            {shelterNodes.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.currentOccupancy}/{s.totalBedCapacity})
              </option>
            ))}
          </select>

          <button
            onClick={() => setActiveTab('shelter-occupancy')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-['JetBrains_Mono',monospace] font-bold text-xs uppercase rounded-[4px] transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            <span>Check-in Resident</span>
          </button>
        </div>
      </div>

      {/* 5-KPI Strip */}
      <div ref={kpiRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Occupancy Rate */}
        <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#475569]">
            <span className="font-['JetBrains_Mono',monospace] text-xs font-bold uppercase">Occupancy Rate</span>
            <span className="material-symbols-outlined text-sm text-[#2563eb]">hotel</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-[#0f172a]">{utilRate}%</span>
            <span className="font-['JetBrains_Mono',monospace] text-xs text-[#475569]">{occupied}/{totalCap}</span>
          </div>
          <div className="w-full bg-[#f1f5f9] h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                utilRate > 90 ? 'bg-[#dc2626]' : utilRate > 75 ? 'bg-[#d97706]' : 'bg-[#2563eb]'
              }`}
              style={{ width: `${Math.min(100, utilRate)}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Available Beds */}
        <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#475569]">
            <span className="font-['JetBrains_Mono',monospace] text-xs font-bold uppercase">Available Beds</span>
            <span className="material-symbols-outlined text-sm text-[#15803d]">check_circle</span>
          </div>
          <div className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-[#15803d]">
            {available}
          </div>
          <p className="text-[11px] text-[#475569]">Immediate intake capacity</p>
        </div>

        {/* KPI 3: Sector Distress SOS */}
        <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#475569]">
            <span className="font-['JetBrains_Mono',monospace] text-xs font-bold uppercase">Sector Distress</span>
            <span className="material-symbols-outlined text-sm text-[#d97706]">emergency</span>
          </div>
          <div className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-[#d97706]">
            {citizenSOSTickets.length}
          </div>
          <p className="text-[11px] text-[#475569]">Active SOS requests</p>
        </div>

        {/* KPI 4: Critical Stock Deficits */}
        <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#475569]">
            <span className="font-['JetBrains_Mono',monospace] text-xs font-bold uppercase">Stock Alerts</span>
            <span className="material-symbols-outlined text-sm text-[#dc2626]">warning</span>
          </div>
          <div className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-[#dc2626]">
            {criticalItems.length}
          </div>
          <p className="text-[11px] text-[#475569]">Commodities below threshold</p>
        </div>

        {/* KPI 5: Pending DDMA Orders */}
        <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#475569]">
            <span className="font-['JetBrains_Mono',monospace] text-xs font-bold uppercase">DDMA Deliveries</span>
            <span className="material-symbols-outlined text-sm text-[#2563eb]">local_shipping</span>
          </div>
          <div className="font-['JetBrains_Mono',monospace] text-2xl font-bold text-[#2563eb]">
            {activeOrders.length}
          </div>
          <p className="text-[11px] text-[#475569]">Convoys en route</p>
        </div>

      </div>

      {/* Main Two-Column Operations Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Demographics & Critical Inventory (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Demographics Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-['Outfit',sans-serif] text-base font-bold text-[#0f172a]">
                Resident Demographics Breakdown
              </h3>
              <span className="font-['JetBrains_Mono',monospace] text-xs text-[#475569]">
                Total Registered: {occupied}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div className="p-3 bg-[#f8fafc] rounded-[4px] border border-[#e2e8f0] text-center">
                <span className="text-[11px] text-[#475569] font-medium block">Adult Men</span>
                <span className="font-['JetBrains_Mono',monospace] text-lg font-bold text-[#0f172a]">{shelter.occupancyBreakdown.adultMen}</span>
              </div>
              <div className="p-3 bg-[#f8fafc] rounded-[4px] border border-[#e2e8f0] text-center">
                <span className="text-[11px] text-[#475569] font-medium block">Adult Women</span>
                <span className="font-['JetBrains_Mono',monospace] text-lg font-bold text-[#0f172a]">{shelter.occupancyBreakdown.adultWomen}</span>
              </div>
              <div className="p-3 bg-[#f8fafc] rounded-[4px] border border-[#e2e8f0] text-center">
                <span className="text-[11px] text-[#475569] font-medium block">Children</span>
                <span className="font-['JetBrains_Mono',monospace] text-lg font-bold text-[#0f172a]">{shelter.occupancyBreakdown.children}</span>
              </div>
              <div className="p-3 bg-[#f8fafc] rounded-[4px] border border-[#e2e8f0] text-center">
                <span className="text-[11px] text-[#475569] font-medium block">Infants</span>
                <span className="font-['JetBrains_Mono',monospace] text-lg font-bold text-[#b45309]">{shelter.occupancyBreakdown.infants}</span>
              </div>
              <div className="p-3 bg-[#f8fafc] rounded-[4px] border border-[#e2e8f0] text-center">
                <span className="text-[11px] text-[#475569] font-medium block">Elderly</span>
                <span className="font-['JetBrains_Mono',monospace] text-lg font-bold text-[#0f172a]">{shelter.occupancyBreakdown.elderly}</span>
              </div>
              <div className="p-3 bg-[#fee2e2] rounded-[4px] border border-[#fca5a5] text-center">
                <span className="text-[11px] text-[#991b1b] font-medium block">Injured</span>
                <span className="font-['JetBrains_Mono',monospace] text-lg font-bold text-[#dc2626]">{shelter.occupancyBreakdown.injured}</span>
              </div>
            </div>
          </div>

          {/* Critical Inventory Table */}
          <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-['Outfit',sans-serif] text-base font-bold text-[#0f172a]">
                Facility Resource Stockpile
              </h3>
              <button
                onClick={() => setActiveTab('shelter-requests')}
                className="text-xs font-['JetBrains_Mono',monospace] font-bold text-[#2563eb] hover:underline cursor-pointer"
              >
                + Request DDMA Restock
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-['Inter',sans-serif]">
                <thead>
                  <tr className="bg-[#f8fafc] text-[#475569] border-b border-[#e2e8f0]">
                    <th className="py-2.5 px-3 font-semibold">Commodity</th>
                    <th className="py-2.5 px-3 font-semibold">Category</th>
                    <th className="py-2.5 px-3 font-semibold">Stock Quantity</th>
                    <th className="py-2.5 px-3 font-semibold">Safety Min</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {shelter.inventory.map(item => (
                    <tr key={item.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="py-3 px-3 font-bold text-[#0f172a]">{item.name}</td>
                      <td className="py-3 px-3 text-[#475569] font-['JetBrains_Mono',monospace] text-[11px]">{item.category}</td>
                      <td className="py-3 px-3 font-['JetBrains_Mono',monospace] font-bold text-[#0f172a]">
                        {item.quantity.toLocaleString()} {item.unit}
                      </td>
                      <td className="py-3 px-3 text-[#475569] font-['JetBrains_Mono',monospace]">
                        {item.minThreshold.toLocaleString()} {item.unit}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-['JetBrains_Mono',monospace] font-bold ${
                          item.status === 'OPTIMAL' ? 'bg-[#dcfce7] text-[#15803d]' :
                          item.status === 'LOW' ? 'bg-[#fef3c7] text-[#b45309]' :
                          'bg-[#fee2e2] text-[#dc2626]'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Quick Action Hub (col-span-4) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Quick Operations Strip */}
          <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-5 shadow-xs space-y-3">
            <h4 className="font-['Outfit',sans-serif] text-sm font-bold text-[#0f172a] uppercase tracking-wider">
              Coordinator Actions
            </h4>

            <button
              onClick={() => setActiveTab('shelter-occupancy')}
              className="w-full py-2.5 px-3 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded-[4px] text-xs font-semibold text-[#0f172a] flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2563eb] text-sm">badge</span>
                <span>Resident Check-In & Registry</span>
              </div>
              <span className="material-symbols-outlined text-sm text-[#475569]">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveTab('shelter-citizen-requests')}
              className="w-full py-2.5 px-3 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded-[4px] text-xs font-semibold text-[#0f172a] flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d97706] text-sm">contact_emergency</span>
                <span>Sector Citizen Triage</span>
              </div>
              <span className="material-symbols-outlined text-sm text-[#475569]">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveTab('shelter-requests')}
              className="w-full py-2.5 px-3 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded-[4px] text-xs font-semibold text-[#0f172a] flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2563eb] text-sm">local_shipping</span>
                <span>DDMA Supply Requisitions</span>
              </div>
              <span className="material-symbols-outlined text-sm text-[#475569]">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveTab('missing-persons')}
              className="w-full py-2.5 px-3 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded-[4px] text-xs font-semibold text-[#0f172a] flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#7e22ce] text-sm">person_search</span>
                <span>Missing Persons Cross-Check</span>
              </div>
              <span className="material-symbols-outlined text-sm text-[#475569]">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveTab('shelter-announcements')}
              className="w-full py-2.5 px-3 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded-[4px] text-xs font-semibold text-[#0f172a] flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#059669] text-sm">campaign</span>
                <span>Camp Loudspeaker PA System</span>
              </div>
              <span className="material-symbols-outlined text-sm text-[#475569]">chevron_right</span>
            </button>
          </div>

          {/* Infrastructure Health Telemetry */}
          <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-5 shadow-xs space-y-3">
            <h4 className="font-['Outfit',sans-serif] text-sm font-bold text-[#0f172a] uppercase tracking-wider">
              Infrastructure Telemetry
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-[#f8fafc] rounded-[4px] border border-[#e2e8f0]">
                <span className="text-[#475569]">Generator Fuel</span>
                <span className="font-['JetBrains_Mono',monospace] font-bold text-[#0f172a]">{shelter.generatorFuelHours} Hours Remaining</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#f8fafc] rounded-[4px] border border-[#e2e8f0]">
                <span className="text-[#475569]">Water Reserves</span>
                <span className="font-['JetBrains_Mono',monospace] font-bold text-[#0284c7]">{shelter.waterReservesLiters.toLocaleString()} Liters</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#f8fafc] rounded-[4px] border border-[#e2e8f0]">
                <span className="text-[#475569]">Ration Stock</span>
                <span className="font-['JetBrains_Mono',monospace] font-bold text-[#15803d]">{shelter.rationDaysRemaining} Days Available</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
