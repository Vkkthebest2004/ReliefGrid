import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { GisMap } from '../components/GisMap';
import { SimulationController } from '../components/SimulationController';
import { 
  AlertOctagon, 
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';

export const CommandCenterView: React.FC = () => {
  const { 
    disasterEvent, 
    zones, 
    setSelectedZone,
    setActiveTab,
    governmentResources,
    citizenSOSTickets,
    shelterNodes
  } = useDisaster();

  // ── Compute live aggregated KPIs from real data ──
  const totalAvailable = governmentResources.reduce((a, r) => a + r.totalAvailable, 0);
  const totalAllocated = governmentResources.reduce((a, r) => a + r.allocated, 0);
  const totalRemaining = governmentResources.reduce((a, r) => a + r.remaining, 0);
  const criticalDeficits = governmentResources.filter(r => r.urgency === 'CRITICAL' && r.gap > 0).length;
  const totalAffected = zones.reduce((a, z) => a + z.affectedPopulation, 0);
  const activeSOS = citizenSOSTickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'EVACUATED_TO_SHELTER').length;
  const shelterOccupancy = shelterNodes.reduce((a, s) => a + s.currentOccupancy, 0);
  const shelterCapacity = shelterNodes.reduce((a, s) => a + s.totalBedCapacity, 0);

  return (
    <div className="space-y-4 font-['Inter',sans-serif] bg-[#f8fafc] text-[#0f172a] min-h-screen pb-16">
      
      {/* 1. Active Event Top Banner */}
      <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-[4px] bg-[#fee2e2] border border-[#fca5a5] flex items-center justify-center text-[#dc2626] flex-shrink-0 mt-0.5">
            <AlertOctagon className="w-5 h-5" />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#dc2626] bg-[#fee2e2] px-2 py-0.5 rounded-[2px] font-['JetBrains_Mono',monospace]">
                ACTIVE INCIDENT: {disasterEvent.id}
              </span>
              <span className="text-xs text-[#475569] font-['JetBrains_Mono',monospace]">
                Started: {disasterEvent.startedAt}
              </span>
            </div>
            
            <h2 className="text-lg font-bold text-[#0f172a] font-['Outfit',sans-serif] mt-0.5 leading-tight">
              {disasterEvent.type} — {disasterEvent.secondaryHazard}
            </h2>
            
            <p className="text-xs text-[#475569] mt-1 max-w-3xl leading-snug">
              {disasterEvent.description}
            </p>
          </div>
        </div>

        {/* Quick Access to Next Action */}
        <div className="flex items-center gap-2 flex-shrink-0 self-start md:self-center">
          <button
            onClick={() => setActiveTab('region-assessment')}
            className="px-4 py-2.5 bg-[#004ac6] hover:bg-[#2563eb] text-white text-xs font-['JetBrains_Mono',monospace] font-bold uppercase rounded-[4px] shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Assess Region Needs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Live KPI Strip — Real Numbers from Context */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-3 shadow-xs">
          <div className="text-[10px] font-bold text-[#475569] uppercase font-['JetBrains_Mono',monospace] tracking-wider mb-1">People Affected</div>
          <div className="text-xl font-bold text-[#dc2626] font-['JetBrains_Mono',monospace]">{totalAffected.toLocaleString()}</div>
          <div className="text-[10px] text-[#475569] font-['JetBrains_Mono',monospace]">{zones.length} Active Zones</div>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-3 shadow-xs">
          <div className="text-[10px] font-bold text-[#475569] uppercase font-['JetBrains_Mono',monospace] tracking-wider mb-1">Total Inventory</div>
          <div className="text-xl font-bold text-[#004ac6] font-['JetBrains_Mono',monospace]">{totalAvailable.toLocaleString()}</div>
          <div className="text-[10px] text-[#475569] font-['JetBrains_Mono',monospace]">{governmentResources.length} Resource Types</div>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-3 shadow-xs">
          <div className="text-[10px] font-bold text-[#475569] uppercase font-['JetBrains_Mono',monospace] tracking-wider mb-1">Deployed</div>
          <div className="text-xl font-bold text-[#006780] font-['JetBrains_Mono',monospace]">{totalAllocated.toLocaleString()}</div>
          <div className="text-[10px] text-[#475569] font-['JetBrains_Mono',monospace]">{totalAvailable > 0 ? Math.round((totalAllocated / totalAvailable) * 100) : 0}% Utilization</div>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-3 shadow-xs">
          <div className="text-[10px] font-bold text-[#475569] uppercase font-['JetBrains_Mono',monospace] tracking-wider mb-1">Remaining</div>
          <div className="text-xl font-bold text-[#059669] font-['JetBrains_Mono',monospace]">{totalRemaining.toLocaleString()}</div>
          <div className="text-[10px] text-[#059669] font-['JetBrains_Mono',monospace] font-semibold">Ready to Dispatch</div>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-3 shadow-xs">
          <div className="text-[10px] font-bold text-[#475569] uppercase font-['JetBrains_Mono',monospace] tracking-wider mb-1">Active SOS</div>
          <div className="text-xl font-bold text-[#dc2626] font-['JetBrains_Mono',monospace]">{activeSOS}</div>
          <div className="text-[10px] text-[#475569] font-['JetBrains_Mono',monospace]">{criticalDeficits} Critical Shortages</div>
        </div>
        <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-3 shadow-xs">
          <div className="text-[10px] font-bold text-[#475569] uppercase font-['JetBrains_Mono',monospace] tracking-wider mb-1">Shelter Saturation</div>
          <div className="text-xl font-bold text-[#b45309] font-['JetBrains_Mono',monospace]">
            {shelterCapacity > 0 ? Math.round((shelterOccupancy / shelterCapacity) * 100) : 0}%
          </div>
          <div className="text-[10px] text-[#475569] font-['JetBrains_Mono',monospace]">{shelterOccupancy}/{shelterCapacity} Beds</div>
        </div>
      </div>

      {/* 3. Hydrodynamic Inundation Simulation Controller */}
      <SimulationController />

      {/* 4. Common Operating Picture (COP) Tactical Map */}
      <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-[#0f172a] font-['Outfit',sans-serif]">
              Common Operating Picture (COP) Tactical Map
            </h3>
            <p className="text-xs text-[#475569]">
              Real-time multi-layer GIS visualization showing affected zones, logistics convoys, flood contours, and facility nodes.
            </p>
          </div>
          
          <button
            onClick={() => setActiveTab('live-map')}
            className="text-xs font-['JetBrains_Mono',monospace] font-bold text-[#004ac6] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Full-Screen GIS Map</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="rounded-[4px] overflow-hidden border border-[#e2e8f0] h-[450px]">
          <GisMap />
        </div>
      </div>

      {/* 5. Priority Zones & Deficit Register Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: District Priority Register (col-span-7) */}
        <div className="lg:col-span-7 bg-white border border-[#e2e8f0] rounded-[4px] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#0f172a] font-['Outfit',sans-serif]">
              District Priority Ranking & Need Scores
            </h3>
            <span className="text-[11px] text-[#475569] font-['JetBrains_Mono',monospace]">
              Sorted by Priority Score
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-['Inter',sans-serif]">
              <thead>
                <tr className="bg-[#f8fafc] text-[#475569] border-b border-[#e2e8f0]">
                  <th className="py-2 px-2 font-semibold">Zone</th>
                  <th className="py-2 px-2 font-semibold">Affected</th>
                  <th className="py-2 px-2 font-semibold">Medical Cases</th>
                  <th className="py-2 px-2 font-semibold">Need Score</th>
                  <th className="py-2 px-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {zones.sort((a, b) => b.severityScore - a.severityScore).map((z) => (
                  <tr key={z.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-2.5 px-2 font-bold text-[#0f172a]">
                      <div>{z.name}</div>
                      <span className="text-[10px] text-[#475569] font-['JetBrains_Mono',monospace]">{z.code}</span>
                    </td>
                    <td className="py-2.5 px-2 font-['JetBrains_Mono',monospace]">{z.affectedPopulation.toLocaleString()}</td>
                    <td className="py-2.5 px-2 font-['JetBrains_Mono',monospace] text-[#dc2626] font-semibold">{z.medicalUrgencyCases}</td>
                    <td className="py-2.5 px-2">
                      <span className={`px-2 py-0.5 rounded-[2px] font-['JetBrains_Mono',monospace] text-[11px] font-bold ${
                        z.severityScore >= 80 ? 'bg-[#fee2e2] text-[#dc2626]' :
                        z.severityScore >= 60 ? 'bg-[#fef3c7] text-[#b45309]' :
                        'bg-[#dcfce7] text-[#15803d]'
                      }`}>
                        {z.severityScore}/100
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <button
                        onClick={() => {
                          setSelectedZone(z);
                          setActiveTab('allocation-planner');
                        }}
                        className="px-2.5 py-1 bg-[#f1f5f9] hover:bg-[#004ac6] hover:text-white text-[#0f172a] rounded-[2px] font-['JetBrains_Mono',monospace] text-[11px] font-bold transition-colors cursor-pointer border border-[#cbd5e1]"
                      >
                        Allocate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Command Actions (col-span-5) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white border border-[#e2e8f0] rounded-[4px] p-4 shadow-xs space-y-3">
            <h4 className="font-['Outfit',sans-serif] text-sm font-bold text-[#0f172a] uppercase tracking-wider">
              Emergency Command Directives
            </h4>

            <button
              onClick={() => setActiveTab('allocation-planner')}
              className="w-full py-2.5 px-3 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded-[4px] text-xs font-semibold text-[#0f172a] flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004ac6] text-sm">calculate</span>
                <span>Run RADS Marginal Utility Algorithm</span>
              </div>
              <span className="material-symbols-outlined text-sm text-[#475569]">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveTab('logistics-tracker')}
              className="w-full py-2.5 px-3 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded-[4px] text-xs font-semibold text-[#0f172a] flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006780] text-sm">local_shipping</span>
                <span>Track Relief Supply Convoys</span>
              </div>
              <span className="material-symbols-outlined text-sm text-[#475569]">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveTab('incident-intelligence')}
              className="w-full py-2.5 px-3 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded-[4px] text-xs font-semibold text-[#0f172a] flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d97706] text-sm">campaign</span>
                <span>Triage Field Hazard Incident Reports</span>
              </div>
              <span className="material-symbols-outlined text-sm text-[#475569]">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveTab('reports-audit')}
              className="w-full py-2.5 px-3 bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded-[4px] text-xs font-semibold text-[#0f172a] flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#059669] text-sm">verified</span>
                <span>Generate Official SITREP Audit Report</span>
              </div>
              <span className="material-symbols-outlined text-sm text-[#475569]">chevron_right</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
