import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { 
  TrendingUp, 
  Activity, 
  LifeBuoy, 
  Home, 
  Truck
} from 'lucide-react';

export const MasterAnalyticsView: React.FC = () => {
  const { 
    citizenSOSTickets, 
    shelterNodes, 
    dispatchMovements
  } = useDisaster();

  const totalCapacity = shelterNodes.reduce((acc, s) => acc + s.totalBedCapacity, 0);
  const totalOccupied = shelterNodes.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const overallOccupancyPct = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  const totalDistress = citizenSOSTickets.length;
  const criticalDistress = citizenSOSTickets.filter(t => t.triagePriorityScore >= 80).length;

  return (
    <div className="space-y-6 pb-20 font-body-md">
      {/* Top Hero */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
            Cross-System Intelligence & Metrics
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Master Disaster Response Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Integrated performance telemetry across Government Emergency Command, Shelter Nodes, and Citizen Distress Beacons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">AI RADS Efficiency Gain</span>
            <strong className="text-sm font-mono text-emerald-400">+34% Faster Velocity</strong>
          </div>
        </div>
      </div>

      {/* Top 4 Performance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Shelter Network Saturation</span>
            <Home size={18} className="text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-white font-mono">{overallOccupancyPct}%</strong>
            <span className="text-xs text-slate-500 font-mono">({totalOccupied}/{totalCapacity})</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${overallOccupancyPct}%` }} />
          </div>
          <p className="text-[10px] text-slate-400">Across {shelterNodes.length} designated metropolitan relief camps</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Citizen Triage Escalations</span>
            <LifeBuoy size={18} className="text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-amber-400 font-mono">{criticalDistress}</strong>
            <span className="text-xs text-slate-500">/ {totalDistress} total</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(criticalDistress / Math.max(1, totalDistress)) * 100}%` }} />
          </div>
          <p className="text-[10px] text-slate-400">Severity score ≥ 80 requires immediate SDRF airlift</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Supply Convoys</span>
            <Truck size={18} className="text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-blue-400 font-mono">{dispatchMovements.length}</strong>
            <span className="text-xs text-slate-500 font-mono">Convoys En-Route</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
          </div>
          <p className="text-[10px] text-slate-400">92% Average On-Time Arrival Efficiency</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Medical Coverage Ratio</span>
            <Activity size={18} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <strong className="text-2xl font-black text-emerald-400 font-mono">94.2%</strong>
            <span className="text-xs text-slate-500">Target: 90%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94.2%' }} />
          </div>
          <p className="text-[10px] text-slate-400">Zero life-support stock-outs recorded</p>
        </div>
      </div>

      {/* Two Columns: Comparative Analysis & Shelter Saturation Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Shelter Saturation Matrix */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white">Facility Capacity & Saturation Breakdown</h3>
            <span className="text-xs text-slate-400 font-mono">Live Telemetry</span>
          </div>

          <div className="space-y-3">
            {shelterNodes.map((s) => {
              const util = Math.round((s.currentOccupancy / s.totalBedCapacity) * 100);
              return (
                <div key={s.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-xs text-white block">{s.name}</strong>
                      <span className="text-[10px] text-slate-400">{s.address}</span>
                    </div>
                    <div className="text-right">
                      <strong className="text-xs font-mono text-purple-300 font-bold">{s.currentOccupancy} / {s.totalBedCapacity}</strong>
                      <span className="block text-[10px] text-slate-500 font-mono">{util}% saturated</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full ${util > 85 ? 'bg-amber-500' : 'bg-purple-500'}`} 
                      style={{ width: `${util}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Columns: Algorithm Impact Metric */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" />
            <h3 className="text-sm font-extrabold text-white">RADS Optimization Impact</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 block font-medium">Avg Dispatch Velocity</span>
                <span className="text-[10px] text-slate-500">Manual: 45m vs AI: 22m</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 font-bold font-mono text-xs border border-emerald-800">
                +51% Faster
              </span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 block font-medium">Supply Redundancy Wastage</span>
                <span className="text-[10px] text-slate-500">Uncoordinated: 18% vs AI: 2%</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 font-bold font-mono text-xs border border-emerald-800">
                -89% Waste
              </span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-slate-400 block font-medium">Critical Medical Coverage</span>
                <span className="text-[10px] text-slate-500">Manual: 62% vs AI: 94.2%</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 font-bold font-mono text-xs border border-emerald-800">
                +32.2% Gain
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
