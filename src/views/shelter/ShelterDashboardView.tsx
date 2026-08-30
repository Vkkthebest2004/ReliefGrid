import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDisaster } from '../../context/DisasterContext';
import { 
  Users, 
  Bed, 
  AlertTriangle, 
  Truck, 
  Plus, 
  LifeBuoy, 
  Home, 
  Phone, 
  Activity, 
  Zap
} from 'lucide-react';

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
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, []);

  const shelter = selectedShelterNode || shelterNodes[0];

  if (!shelter) {
    return <div className="text-slate-400 p-8 text-center">Loading Shelter Management Node…</div>;
  }

  const occupied = shelter.currentOccupancy;
  const totalCap = shelter.totalBedCapacity;
  const available = Math.max(0, totalCap - occupied);
  const utilRate = totalCap > 0 ? Math.round((occupied / totalCap) * 100) : 0;
  const criticalItems = shelter.inventory.filter(i => i.status === 'CRITICAL_DEFICIT' || i.status === 'LOW');
  const activeOrders = restockOrders.filter(o => o.status !== 'DELIVERED');

  return (
    <div ref={containerRef} className="space-y-6 pb-20 font-body-md">
      {/* Top Header & Facility Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold flex items-center gap-1">
              <Home size={12} />
              <span>DEOC Relief Hub Node</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Operational Active</span>
            </span>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">
            {shelter.name}
          </h1>

          <p className="text-xs text-slate-400 mt-0.5">
            {shelter.address} • Officer-in-Charge: <strong className="text-slate-200">{shelter.officerInCharge}</strong> ({shelter.contactPhone})
          </p>
        </div>

        {/* Shelter Switcher Dropdown & CTAs */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={shelter.id}
            onChange={(e) => {
              const found = shelterNodes.find(s => s.id === e.target.value);
              if (found) setSelectedShelterNode(found);
            }}
            className="bg-slate-950 border border-slate-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            {shelterNodes.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.currentOccupancy}/{s.totalBedCapacity})
              </option>
            ))}
          </select>

          <button
            onClick={() => setActiveTab('shelter-occupancy')}
            className="flex items-center gap-2 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
          >
            <Users size={14} />
            <span>Record Intake</span>
          </button>

          <button
            onClick={() => setActiveTab('shelter-requests')}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>Request Supplies</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Stat Cards */}
      <div ref={kpiRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Occupancy */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Current Occupancy</span>
            <Users size={18} className="text-purple-400" />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <strong className="text-2xl font-black text-white font-mono">{occupied}</strong>
              <span className="text-xs text-slate-500">/ {totalCap} beds</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full ${utilRate > 85 ? 'bg-amber-500' : 'bg-purple-500'}`} 
                style={{ width: `${utilRate}%` }} 
              />
            </div>
            <p className="text-[10px] text-slate-400 font-medium">{utilRate}% Facility Capacity Utilized</p>
          </div>
        </div>

        {/* Available Capacity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Available Capacity</span>
            <Bed size={18} className="text-emerald-400" />
          </div>
          <div className="space-y-1">
            <strong className="text-2xl font-black text-emerald-400 font-mono">{available}</strong>
            <p className="text-[10px] text-slate-400">Vaccinated & Sanitized Spaces</p>
          </div>
        </div>

        {/* Citizen SOS Requests */}
        <div 
          onClick={() => setActiveTab('shelter-citizen-requests')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 shadow-xl flex flex-col justify-between cursor-pointer group transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Citizen Requests</span>
            <LifeBuoy size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <strong className="text-2xl font-black text-amber-400 font-mono">{citizenSOSTickets.length}</strong>
              <span className="text-[10px] text-amber-400 font-bold">Active in Sector</span>
            </div>
            <p className="text-[10px] text-slate-400">Incoming triage tickets</p>
          </div>
        </div>

        {/* Resource Stock Deficits */}
        <div 
          onClick={() => setActiveTab('shelter-resources')}
          className="bg-slate-900 border border-slate-800 hover:border-red-500/50 rounded-2xl p-4 shadow-xl flex flex-col justify-between cursor-pointer group transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Stock Alerts</span>
            <AlertTriangle size={18} className="text-red-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="space-y-1">
            <strong className="text-2xl font-black text-red-400 font-mono">{criticalItems.length}</strong>
            <p className="text-[10px] text-slate-400">Items below min threshold</p>
          </div>
        </div>

        {/* Active Requisitions */}
        <div 
          onClick={() => setActiveTab('shelter-requests')}
          className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-4 shadow-xl flex flex-col justify-between cursor-pointer group transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">DDMA Orders</span>
            <Truck size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="space-y-1">
            <strong className="text-2xl font-black text-blue-400 font-mono">{activeOrders.length}</strong>
            <p className="text-[10px] text-slate-400">In-transit relief consignments</p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns */}
        <div className="lg:col-span-7 space-y-6">
          {/* Incoming Citizen Distress Requests */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LifeBuoy size={18} className="text-amber-400" />
                <h3 className="text-sm font-extrabold text-white">Incoming Citizen Distress Requests</h3>
              </div>
              <button
                onClick={() => setActiveTab('shelter-citizen-requests')}
                className="text-xs font-bold text-amber-400 hover:underline cursor-pointer"
              >
                View All ({citizenSOSTickets.length}) →
              </button>
            </div>

            <div className="space-y-2.5">
              {citizenSOSTickets.slice(0, 3).map((ticket) => (
                <div 
                  key={ticket.id}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">{ticket.id}</span>
                      <span className="px-2 py-0.2 rounded-full bg-red-950 text-red-300 text-[10px] font-bold">
                        Triage: {ticket.triagePriorityScore}/100
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {ticket.waterLevel.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white">
                      {ticket.citizenName} • {ticket.trappedCount} trapped
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {ticket.landmark} • {ticket.medicalDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${ticket.phone}`}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Phone size={12} />
                      <span>Call</span>
                    </a>
                    <button
                      onClick={() => setActiveTab('shelter-citizen-requests')}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Process Intake
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demographics Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-purple-400" />
                <h3 className="text-sm font-extrabold text-white">Resident Demographics Breakdown</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Total Occupants: {occupied}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Adult Men</span>
                <strong className="text-lg font-black text-white font-mono">{shelter.occupancyBreakdown.adultMen}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Adult Women</span>
                <strong className="text-lg font-black text-white font-mono">{shelter.occupancyBreakdown.adultWomen}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Children (5-17)</span>
                <strong className="text-lg font-black text-sky-400 font-mono">{shelter.occupancyBreakdown.children}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Infants (0-4)</span>
                <strong className="text-lg font-black text-purple-400 font-mono">{shelter.occupancyBreakdown.infants}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Elderly (65+)</span>
                <strong className="text-lg font-black text-amber-400 font-mono">{shelter.occupancyBreakdown.elderly}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Injured / Medical</span>
                <strong className="text-lg font-black text-red-400 font-mono">{shelter.occupancyBreakdown.injured}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns */}
        <div className="lg:col-span-5 space-y-6">
          {/* Inventory Status List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-emerald-400" />
                <h3 className="text-sm font-extrabold text-white">Shelter Resource Stocks</h3>
              </div>
              <button
                onClick={() => setActiveTab('shelter-resources')}
                className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
              >
                Manage Inventory →
              </button>
            </div>

            <div className="space-y-3">
              {shelter.inventory.map((item) => {
                const isCrit = item.status === 'CRITICAL_DEFICIT';
                const isLow = item.status === 'LOW';
                return (
                  <div key={item.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">{item.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Min Threshold: {item.minThreshold} {item.unit}</span>
                    </div>
                    <div className="text-right">
                      <strong className={`text-sm font-mono font-black ${isCrit ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {item.quantity} {item.unit}
                      </strong>
                      <span className={`block text-[9px] font-bold uppercase tracking-wider ${isCrit ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Power & Critical Infrastructure Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" />
              <h3 className="text-sm font-extrabold text-white">Power & Utilities Grid</h3>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Main Grid Connection:</span>
                <strong className="text-amber-400">Offline (Substation Flooded)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Generator Backup:</span>
                <strong className="text-emerald-400">Active (45 kVA Diesel Unit)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Diesel Fuel Remaining:</span>
                <strong className="text-white font-mono">{shelter.generatorFuelHours} Hours Runtime</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Potable Water Reserves:</span>
                <strong className="text-blue-400 font-mono">{shelter.waterReservesLiters.toLocaleString()} Liters</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rations Remaining:</span>
                <strong className="text-emerald-400 font-mono">{shelter.rationDaysRemaining} Days Supply</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
