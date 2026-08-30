import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import type { OperationStatus, OperationTask } from '../types';
import { 
  Radio, 
  Truck, 
  LifeBuoy, 
  HeartPulse, 
  Droplets
} from 'lucide-react';

export const ResponseOperationsView: React.FC = () => {
  const { operations } = useDisaster();

  const getStatusBadge = (status: OperationStatus) => {
    switch (status) {
      case 'ACTIVE': return <span className="badge-critical animate-pulse">ACTIVE MISSION</span>;
      case 'EN_ROUTE': return <span className="badge-high">EN ROUTE</span>;
      case 'DISPATCHED': return <span className="badge-decision">DISPATCHED</span>;
      case 'ARRIVED': return <span className="badge-warning">ON SITE</span>;
      case 'COMPLETED': return <span className="badge-stable">COMPLETED</span>;
      default: return <span className="badge-info">PLANNED</span>;
    }
  };

  const getTypeIcon = (type: OperationTask['operationType']) => {
    switch (type) {
      case 'SEARCH_AND_RESCUE': return <LifeBuoy className="w-4 h-4 text-orange-600" />;
      case 'MEDICAL_AIRLIFT': return <HeartPulse className="w-4 h-4 text-red-600" />;
      case 'WATER_SUPPLY': return <Droplets className="w-4 h-4 text-blue-600" />;
      default: return <Truck className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Header */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="text-[10px] font-bold tracking-wider text-[#1E3A8A] uppercase flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            <span>FIELD EMERGENCY DISPATCH & TASK MONITORING</span>
          </div>
          <h2 className="text-base font-bold text-[#0F2042] font-heading mt-0.5">
            Active Response Operations & Column Telemetry
          </h2>
          <p className="text-xs text-gray-500">
            Real-time status transitions (Planned → Dispatched → En Route → Active → Completed) for specialized disaster response task forces.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-600 bg-[#F8FAFC] border border-[#D9DEE5] px-3 py-1 rounded">
            Active Operations: <strong>{operations.length}</strong>
          </span>
        </div>
      </div>

      {/* Operations List */}
      <div className="space-y-3">
        {operations.map((op) => (
          <div key={op.id} className="gov-card p-4 space-y-3 hover:border-blue-300 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
                  {getTypeIcon(op.operationType)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1E3A8A]">{op.code}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs font-bold text-gray-700">{op.teamName}</span>
                    {getStatusBadge(op.status)}
                  </div>
                  <h3 className="text-sm font-bold text-[#0F2042] font-heading mt-0.5">
                    {op.title}
                  </h3>
                </div>
              </div>

              <div className="text-right text-xs font-mono">
                <div className="text-gray-500">Started: {op.startedAt}</div>
                {op.etaMinutes > 0 ? (
                  <div className="text-[#EA580C] font-bold">ETA on site: {op.etaMinutes} mins</div>
                ) : (
                  <div className="text-[#16A34A] font-bold">Engaged on site</div>
                )}
              </div>
            </div>

            {/* Assigned Vehicles & Personnel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100 text-xs">
              <div>
                <span className="text-gray-500 font-semibold">Target Sector:</span>{' '}
                <strong className="text-[#0F2042]">{op.zoneName}</strong>
              </div>
              <div>
                <span className="text-gray-500 font-semibold">Personnel:</span>{' '}
                <strong className="text-[#0F2042]">{op.personnelCount} Responders</strong>
              </div>
              <div className="truncate">
                <span className="text-gray-500 font-semibold">Assigned Fleet:</span>{' '}
                <strong className="text-[#0F2042] truncate">{op.assignedVehicles}</strong>
              </div>
            </div>

            {/* Mission Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-gray-600">
                <span>Task Execution Progress</span>
                <span className="font-mono">{op.progressPct}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    op.progressPct >= 80 ? 'bg-green-600' :
                    op.progressPct >= 40 ? 'bg-blue-600' :
                    'bg-orange-500'
                  }`}
                  style={{ width: `${op.progressPct}%` }}
                />
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
