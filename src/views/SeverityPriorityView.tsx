import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { 
  TrendingUp, 
  Sparkles, 
  ArrowUpDown
} from 'lucide-react';

export const SeverityPriorityView: React.FC = () => {
  const { zones, setSelectedZone, setActiveTab } = useDisaster();
  const [sortBy, setSortBy] = useState<'rank' | 'severity' | 'pop' | 'deficit'>('severity');
  const [sortAsc, setSortAsc] = useState(false);

  // Dynamic formula weights
  const [weights] = useState({
    pop: 25,
    infra: 20,
    medical: 20,
    access: 15,
    intensity: 10,
    time: 10
  });

  const sortedZones = [...zones].sort((a, b) => {
    let diff = 0;
    if (sortBy === 'severity') diff = b.severityScore - a.severityScore;
    else if (sortBy === 'pop') diff = b.affectedPopulation - a.affectedPopulation;
    else if (sortBy === 'deficit') diff = b.waterDeficitLiters - a.waterDeficitLiters;
    else diff = a.priorityRank - b.priorityRank;
    return sortAsc ? -diff : diff;
  });

  const handleSort = (type: typeof sortBy) => {
    if (sortBy === type) setSortAsc(!sortAsc);
    else {
      setSortBy(type);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Header */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="text-[10px] font-bold tracking-wider text-[#1E3A8A] uppercase flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>OBJECTIVE DISASTER QUANTIFICATION</span>
          </div>
          <h2 className="text-base font-bold text-[#0F2042] font-heading mt-0.5">
            Severity Assessment & Multi-Factor Prioritization Engine
          </h2>
          <p className="text-xs text-gray-500">
            Computes a deterministic, explainable Relief Grid Severity Score (0–100) for every administrative block to eliminate guesswork in asset deployment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500 bg-[#F8FAFC] border border-[#D9DEE5] px-2.5 py-1 rounded">
            Formula v3.1 (DDMA Approved)
          </span>
        </div>
      </div>

      {/* Transparent Model Breakdown & Weight Indicators */}
      <div className="gov-card p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4F46E5]" />
            <h3 className="text-xs font-bold text-[#0F2042] uppercase tracking-wider">
              Transparent Multi-Criteria Severity Formula
            </h3>
          </div>
          <span className="text-[11px] text-gray-400 font-mono">
            Total Weighted Sum = 100%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <div className="p-2.5 bg-[#F8FAFC] border border-[#D9DEE5] rounded">
            <div className="text-[10px] text-gray-500 font-bold uppercase">Population Impact</div>
            <div className="text-base font-bold text-[#0F2042] font-mono mt-0.5">{weights.pop}%</div>
            <div className="text-[10px] text-gray-400">Exposure & vulnerability</div>
          </div>

          <div className="p-2.5 bg-[#F8FAFC] border border-[#D9DEE5] rounded">
            <div className="text-[10px] text-gray-500 font-bold uppercase">Infrastructure Damage</div>
            <div className="text-base font-bold text-[#0F2042] font-mono mt-0.5">{weights.infra}%</div>
            <div className="text-[10px] text-gray-400">Structural failure index</div>
          </div>

          <div className="p-2.5 bg-[#F8FAFC] border border-[#D9DEE5] rounded">
            <div className="text-[10px] text-gray-500 font-bold uppercase">Medical Urgency</div>
            <div className="text-base font-bold text-[#DC2626] font-mono mt-0.5">{weights.medical}%</div>
            <div className="text-[10px] text-gray-400">Casualties & trauma triage</div>
          </div>

          <div className="p-2.5 bg-[#F8FAFC] border border-[#D9DEE5] rounded">
            <div className="text-[10px] text-gray-500 font-bold uppercase">Accessibility & Cutoff</div>
            <div className="text-base font-bold text-[#EA580C] font-mono mt-0.5">{weights.access}%</div>
            <div className="text-[10px] text-gray-400">Road / bridge disruptions</div>
          </div>

          <div className="p-2.5 bg-[#F8FAFC] border border-[#D9DEE5] rounded">
            <div className="text-[10px] text-gray-500 font-bold uppercase">Disaster Intensity</div>
            <div className="text-base font-bold text-[#0F2042] font-mono mt-0.5">{weights.intensity}%</div>
            <div className="text-[10px] text-gray-400">Inundation & shake depth</div>
          </div>

          <div className="p-2.5 bg-[#F8FAFC] border border-[#D9DEE5] rounded">
            <div className="text-[10px] text-gray-500 font-bold uppercase">Time Criticality</div>
            <div className="text-base font-bold text-[#0F2042] font-mono mt-0.5">{weights.time}%</div>
            <div className="text-[10px] text-gray-400">Golden hour decay curve</div>
          </div>
        </div>

        {/* Severity Classification Thresholds */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-3 text-[11px]">
          <span className="font-bold text-gray-700">Classification Tiers:</span>
          <span className="badge-critical">80–100 CRITICAL</span>
          <span className="badge-high">60–79 HIGH</span>
          <span className="badge-warning">40–59 MODERATE</span>
          <span className="badge-stable">0–39 LOW / STABLE</span>
        </div>
      </div>

      {/* Comprehensive Zone Ranking Table */}
      <div className="gov-card p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-2">
          <div className="text-xs font-bold text-[#0F2042] uppercase tracking-wider">
            All Administrative Blocks Ranked by Relief Grid Priority Score
          </div>
          <span className="text-xs text-gray-500">
            Showing 12 Revenue Sectors
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('rank')} className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    <span>Rank</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th>Location / Ward</th>
                <th>Circle Block</th>
                <th onClick={() => handleSort('severity')} className="num cursor-pointer">
                  <div className="flex items-center justify-end gap-1">
                    <span>Severity Score</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th onClick={() => handleSort('pop')} className="num cursor-pointer">
                  <div className="flex items-center justify-end gap-1">
                    <span>Affected Population</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="num">Casualties</th>
                <th>Road Status</th>
                <th onClick={() => handleSort('deficit')} className="num cursor-pointer">
                  <div className="flex items-center justify-end gap-1">
                    <span>Water Deficit</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th>Deterioration</th>
                <th className="num">Inspector</th>
              </tr>
            </thead>
            <tbody>
              {sortedZones.map((zone) => (
                <tr 
                  key={zone.id}
                  onClick={() => {
                    setSelectedZone(zone);
                    setActiveTab('command-center');
                  }}
                  className="hover:bg-blue-50/50 cursor-pointer"
                >
                  <td className="font-bold text-[#0F2042] font-mono">
                    #{zone.priorityRank.toString().padStart(2, '0')}
                  </td>
                  <td className="font-bold text-[#0F2042]">
                    {zone.name} <span className="text-gray-400 font-normal">({zone.code})</span>
                  </td>
                  <td className="text-gray-600 text-xs">
                    {zone.blockName}
                  </td>
                  <td className="num font-bold font-mono text-red-600">
                    {zone.severityScore} / 100
                  </td>
                  <td className="num font-mono">
                    {zone.affectedPopulation.toLocaleString()}
                  </td>
                  <td className="num font-mono text-gray-700">
                    {zone.reportedCasualties}
                  </td>
                  <td>
                    <span className={
                      zone.roadAccessStatus === 'BLOCKED' ? 'badge-critical' :
                      zone.roadAccessStatus === 'RESTRICTED' ? 'badge-warning' :
                      'badge-stable'
                    }>
                      {zone.roadAccessStatus}
                    </span>
                  </td>
                  <td className="num font-mono font-bold text-[#DC2626]">
                    {zone.waterDeficitLiters.toLocaleString()} L
                  </td>
                  <td>
                    <span className="text-[10px] font-bold text-gray-600">
                      {zone.deteriorationTrend}
                    </span>
                  </td>
                  <td className="num">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedZone(zone);
                        setActiveTab('command-center');
                      }}
                      className="px-2.5 py-1 bg-[#1E3A8A] hover:bg-[#152e6f] text-white text-[10px] font-bold rounded cursor-pointer"
                    >
                      Inspect in GIS
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
