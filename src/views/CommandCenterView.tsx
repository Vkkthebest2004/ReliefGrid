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
    <div className="space-y-4 font-body-md">
      
      {/* 1. Active Event Top Banner */}
      <div className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-error-container/40 border border-error/30 flex items-center justify-center text-error flex-shrink-0 mt-0.5">
            <AlertOctagon className="w-5 h-5" />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-error bg-error-container px-2 py-0.5 rounded font-mono">
                ACTIVE INCIDENT: {disasterEvent.id}
              </span>
              <span className="text-xs text-on-surface-variant font-mono">
                Started: {disasterEvent.startedAt}
              </span>
            </div>
            
            <h2 className="text-lg font-bold text-primary font-heading mt-0.5 leading-tight">
              {disasterEvent.type} — {disasterEvent.secondaryHazard}
            </h2>
            
            <p className="text-xs text-on-surface-variant mt-1 max-w-3xl leading-snug">
              {disasterEvent.description}
            </p>
          </div>
        </div>

        {/* Quick Access to Next Action */}
        <div className="flex items-center gap-2 flex-shrink-0 self-start md:self-center">
          <button
            onClick={() => setActiveTab('region-assessment')}
            className="px-4 py-2.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Assess Region Needs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Live KPI Strip — Real Numbers from Context */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-surface border border-outline-variant rounded-xl p-3 shadow-xs">
          <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">People Affected</div>
          <div className="text-xl font-black text-error font-mono">{totalAffected.toLocaleString()}</div>
          <div className="text-[10px] text-on-surface-variant">{zones.length} Active Zones</div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-xl p-3 shadow-xs">
          <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Inventory</div>
          <div className="text-xl font-black text-primary font-mono">{totalAvailable.toLocaleString()}</div>
          <div className="text-[10px] text-on-surface-variant">{governmentResources.length} Resource Types</div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-xl p-3 shadow-xs">
          <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Deployed</div>
          <div className="text-xl font-black text-secondary font-mono">{totalAllocated.toLocaleString()}</div>
          <div className="text-[10px] text-on-surface-variant">{totalAvailable > 0 ? Math.round((totalAllocated / totalAvailable) * 100) : 0}% Utilization</div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-xl p-3 shadow-xs">
          <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Remaining</div>
          <div className="text-xl font-black text-green-700 font-mono">{totalRemaining.toLocaleString()}</div>
          <div className="text-[10px] text-green-700 font-semibold">Ready to Dispatch</div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-xl p-3 shadow-xs">
          <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Active SOS</div>
          <div className="text-xl font-black text-error font-mono">{activeSOS}</div>
          <div className="text-[10px] text-on-surface-variant">{criticalDeficits} Critical Shortages</div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-xl p-3 shadow-xs">
          <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Shelters</div>
          <div className="text-xl font-black text-primary font-mono">{shelterOccupancy.toLocaleString()}<span className="text-sm text-on-surface-variant font-normal">/{shelterCapacity.toLocaleString()}</span></div>
          <div className="text-[10px] text-on-surface-variant">{shelterCapacity > 0 ? Math.round((shelterOccupancy / shelterCapacity) * 100) : 0}% Occupied</div>
        </div>
      </div>

      {/* 3. Resource Allocation Summary Bar */}
      <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            Resource Allocation Overview
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('asset-inventory')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer font-mono"
            >
              Full Inventory <ArrowUpRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setActiveTab('allocation-planner')}
              className="px-3 py-1.5 bg-primary hover:bg-primary-container text-on-primary text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
            >
              Allocate Resources →
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {governmentResources.filter(r => r.remaining > 0).slice(0, 6).map((res) => {
            const pct = res.totalAvailable > 0 ? Math.round((res.allocated / res.totalAvailable) * 100) : 0;
            return (
              <div 
                key={res.id} 
                className="border border-outline-variant/50 rounded-lg p-2.5 hover:bg-surface-container-low transition-colors cursor-pointer"
                onClick={() => setActiveTab('asset-inventory')}
              >
                <div className="text-[10px] font-bold text-primary truncate mb-1">{res.name.split('(')[0].trim()}</div>
                <div className="text-sm font-black font-mono text-on-surface">
                  {res.remaining.toLocaleString()} <span className="text-[9px] font-normal text-on-surface-variant">{res.unit}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="flex-1 h-1 bg-outline-variant/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${pct > 75 ? 'bg-error' : pct > 40 ? 'bg-amber-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-on-surface-variant">{pct}%</span>
                </div>
                {res.inTransit > 0 && (
                  <div className="text-[9px] text-blue-600 font-mono mt-1">↗ {res.inTransit} in transit</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Full-Width Tactical Map */}
      <div className="w-full space-y-3">
        <GisMap height="500px" />
        <SimulationController />
      </div>

      {/* 5. District Priority Ranking & Resource Deficit Register Table */}
      <div className="bg-surface border border-outline-variant rounded-xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant pb-2">
          <div>
            <div className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase font-mono">
              SECTOR TRIAGE REGISTER
            </div>
            <h3 className="text-sm font-bold text-primary font-heading">
              District Priority Ranking & Resource Deficits
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('region-assessment')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer font-mono"
            >
              <span>Open Needs Assessment Matrix</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-body-sm">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant">
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Location / Ward</th>
                <th className="py-2.5 px-3">Circle Block</th>
                <th className="py-2.5 px-3 text-right">Severity Index</th>
                <th className="py-2.5 px-3 text-right">Affected Pop</th>
                <th className="py-2.5 px-3">Road Status</th>
                <th className="py-2.5 px-3 text-right">Water Deficit</th>
                <th className="py-2.5 px-3">Primary Need</th>
                <th className="py-2.5 px-3">Deterioration</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {zones.slice(0, 6).map((zone) => (
                <tr 
                  key={zone.id} 
                  className="hover:bg-surface-container-low cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedZone(zone);
                    setActiveTab('region-assessment');
                  }}
                >
                  <td className="py-2.5 px-3 font-bold text-primary font-mono">
                    #{zone.priorityRank.toString().padStart(2, '0')}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-primary">
                    {zone.name} ({zone.code})
                  </td>
                  <td className="py-2.5 px-3 text-on-surface-variant text-xs">
                    {zone.blockName}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold font-mono text-error">
                    {zone.severityScore} / 100
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-on-surface">
                    {zone.affectedPopulation.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      zone.roadAccessStatus === 'BLOCKED' ? 'bg-error-container text-on-error-container' :
                      zone.roadAccessStatus === 'RESTRICTED' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {zone.roadAccessStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-error">
                    {zone.waterDeficitLiters.toLocaleString()} L
                  </td>
                  <td className="py-2.5 px-3 text-xs font-semibold text-primary">
                    {zone.topNeeds[0]}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-bold font-mono text-on-surface-variant">
                      {zone.deteriorationTrend}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedZone(zone);
                        setActiveTab('region-assessment');
                      }}
                      className="px-2.5 py-1 bg-primary hover:bg-primary-container text-on-primary text-[10px] font-bold rounded transition-colors cursor-pointer"
                    >
                      Assess Needs →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
