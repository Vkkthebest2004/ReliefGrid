import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { 
  X, 
  Users, 
  HeartPulse, 
  Building2, 
  Truck, 
  Droplets, 
  Home, 
  TrendingUp, 
  Sparkles, 
  FileText
} from 'lucide-react';

export const ZoneDrawer: React.FC = () => {
  const { 
    selectedZone, 
    setSelectedZone, 
    setActiveTab, 
    setIsOptimizationModalOpen,
    reports
  } = useDisaster();

  if (!selectedZone) return null;

  const zoneReports = reports.filter(r => r.zoneId === selectedZone.id);

  const getSeverityBadgeClass = (category: string) => {
    switch (category) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MODERATE': return 'badge-warning';
      default: return 'badge-stable';
    }
  };

  return (
    <div className="w-80 lg:w-96 bg-white border-l border-[#D9DEE5] flex flex-col h-full shadow-lg flex-shrink-0 animate-in slide-in-from-right duration-250 z-30 select-none">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#D9DEE5] bg-[#F8FAFC] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
              {selectedZone.code}
            </span>
            <span className={getSeverityBadgeClass(selectedZone.severityCategory)}>
              {selectedZone.severityCategory}
            </span>
          </div>
          <h2 className="text-base font-bold text-[#0F2042] font-heading mt-0.5 leading-tight">
            {selectedZone.name}
          </h2>
          <div className="text-[11px] text-gray-500 font-medium">
            {selectedZone.blockName} • Updated {selectedZone.lastUpdated}
          </div>
        </div>

        <button
          onClick={() => setSelectedZone(null)}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          title="Close Zone Intelligence"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        
        {/* Severity Score Hero Card */}
        <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-md flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-[#991B1B] uppercase tracking-wider">
              RELIEF GRID SEVERITY INDEX
            </div>
            <div className="text-2xl font-black text-[#DC2626] font-mono leading-none mt-1">
              {selectedZone.severityScore} <span className="text-xs font-semibold text-gray-500">/ 100</span>
            </div>
            <div className="text-[11px] text-[#7F1D1D] font-medium mt-1">
              Rank #{selectedZone.priorityRank} in District Priority Order
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#DC2626] bg-white px-2 py-1 rounded border border-red-200">
              <TrendingUp className="w-3 h-3" />
              {selectedZone.deteriorationTrend}
            </span>
          </div>
        </div>

        {/* Operational Metrics Grid */}
        <div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            FIELD SITUATION METRICS
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-[#F8FAFC] border border-[#D9DEE5] rounded">
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Estimated Affected</span>
              </div>
              <div className="text-sm font-bold text-[#0F2042] mt-1 font-mono">
                {selectedZone.affectedPopulation.toLocaleString()}
              </div>
              <div className="text-[10px] text-gray-400">
                of {selectedZone.population.toLocaleString()} pop.
              </div>
            </div>

            <div className="p-2.5 bg-[#F8FAFC] border border-[#D9DEE5] rounded">
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                <HeartPulse className="w-3.5 h-3.5 text-red-600" />
                <span>Medical Triage</span>
              </div>
              <div className="text-sm font-bold text-[#DC2626] mt-1 font-mono">
                {selectedZone.medicalUrgencyCases} urgent
              </div>
              <div className="text-[10px] text-gray-400">
                {selectedZone.reportedCasualties} casualties logged
              </div>
            </div>

            <div className="p-2.5 bg-[#F8FAFC] border border-[#D9DEE5] rounded">
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Infra Damage</span>
              </div>
              <div className="text-sm font-bold text-[#0F2042] mt-1 font-mono">
                {selectedZone.infrastructureDamagePct}%
              </div>
              <div className="text-[10px] text-gray-400">
                Structural failure
              </div>
            </div>

            <div className="p-2.5 bg-[#F8FAFC] border border-[#D9DEE5] rounded">
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                <Truck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Road Access</span>
              </div>
              <div className={`text-xs font-bold mt-1 ${
                selectedZone.roadAccessStatus === 'BLOCKED' ? 'text-red-600' :
                selectedZone.roadAccessStatus === 'RESTRICTED' ? 'text-orange-600' :
                'text-green-600'
              }`}>
                {selectedZone.roadAccessStatus}
              </div>
              <div className="text-[10px] text-gray-400">
                Bridge disrupted
              </div>
            </div>

            <div className="p-2.5 bg-[#F8FAFC] border border-[#D9DEE5] rounded">
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                <Home className="w-3.5 h-3.5 text-blue-600" />
                <span>Shelter Stress</span>
              </div>
              <div className="text-sm font-bold text-[#0F2042] mt-1 font-mono">
                {selectedZone.shelterCapacityPct}%
              </div>
              <div className="text-[10px] text-red-600 font-semibold">
                Near capacity limit
              </div>
            </div>

            <div className="p-2.5 bg-[#F8FAFC] border border-[#D9DEE5] rounded">
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                <span>Water Deficit</span>
              </div>
              <div className="text-sm font-bold text-[#DC2626] mt-1 font-mono">
                {selectedZone.waterDeficitLiters.toLocaleString()} L
              </div>
              <div className="text-[10px] text-gray-400">
                Immediate requirement
              </div>
            </div>
          </div>
        </div>

        {/* Priority Need Hierarchy */}
        <div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            PRIORITY INTERVENTION HIERARCHY
          </div>

          <div className="space-y-1.5">
            {selectedZone.topNeeds.map((need, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-[#F8FAFC] border border-[#D9DEE5] rounded">
                <span className="w-4 h-4 rounded-full bg-[#0F2042] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="font-semibold text-[#0F2042] text-xs flex-1">
                  {need}
                </span>
                <span className="text-[10px] text-blue-700 font-bold">
                  {idx === 0 ? 'Urgent' : 'High'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Criteria Transparent Scoring Formula */}
        <div className="p-3 bg-[#EEF2FF] border border-[#C7D2FE] rounded">
          <div className="text-[10px] font-bold text-[#3730A3] uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSPARENT SEVERITY MODEL</span>
          </div>
          <div className="text-[10px] text-gray-600 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Pop. Impact (25%):</span>
              <strong className="text-[#0F2042]">{selectedZone.populationImpactScore} / 100</strong>
            </div>
            <div className="flex justify-between">
              <span>Infra Damage (20%):</span>
              <strong className="text-[#0F2042]">{selectedZone.infrastructureDamageScore} / 100</strong>
            </div>
            <div className="flex justify-between">
              <span>Medical Urgency (20%):</span>
              <strong className="text-[#0F2042]">{selectedZone.medicalUrgencyScore} / 100</strong>
            </div>
            <div className="flex justify-between">
              <span>Accessibility Block (15%):</span>
              <strong className="text-[#0F2042]">{selectedZone.accessibilityScore} / 100</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Drawer Action Footer */}
      <div className="p-3 border-t border-[#D9DEE5] bg-[#F8FAFC] space-y-2">
        <button
          onClick={() => setIsOptimizationModalOpen(true)}
          className="w-full py-2 px-3 bg-[#1E3A8A] hover:bg-[#152e6f] text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-blue-200" />
          <span>Plan Resource Allocation</span>
        </button>

        <button
          onClick={() => setActiveTab('incident-intelligence')}
          className="w-full py-2 px-3 bg-white hover:bg-gray-50 border border-[#D9DEE5] text-[#0F2042] text-xs font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-gray-500" />
          <span>View Verified Reports ({zoneReports.length})</span>
        </button>
      </div>

    </div>
  );
};
