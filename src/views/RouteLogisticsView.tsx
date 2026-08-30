import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { 
  Truck, 
  AlertTriangle, 
  RotateCcw
} from 'lucide-react';

export const RouteLogisticsView: React.FC = () => {
  const { routes, toggleRouteBlockage } = useDisaster();

  return (
    <div className="space-y-4 select-none">
      
      {/* Header */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="text-[10px] font-bold tracking-wider text-[#1E3A8A] uppercase flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            <span>CRITICAL SUPPLY CHAIN & LOGISTICS RESILIENCE</span>
          </div>
          <h2 className="text-base font-bold text-[#0F2042] font-heading mt-0.5">
            Transport Network Monitoring & Disruption Rerouting Engine
          </h2>
          <p className="text-xs text-gray-500">
            Dynamically monitors arterial bridge and road blockages, recalculating emergency transit ETAs and diversion corridors to isolated zones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-critical font-mono">
            {routes.filter(r => r.status === 'BLOCKED').length} Arterial Disruption Active
          </span>
        </div>
      </div>

      {/* Disruption Alert Card (NH-27 Simulation Showcase) */}
      <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-md space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 text-[#DC2626] rounded">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wide bg-white px-2 py-0.5 rounded border border-red-200">
                  CRITICAL INFRASTRUCTURE CUTOFF
                </span>
                <span className="text-xs font-mono text-gray-500">NH-27 Connector Ch. 18+200</span>
              </div>
              <h3 className="text-sm font-bold text-[#991B1B] mt-0.5">
                Structural Bridge Failure — Nandipur Sector Land Access Disrupted
              </h3>
              <p className="text-xs text-[#7F1D1D] mt-1 leading-snug">
                Span #3 collapsed due to combined seismic lateral shear and Brahmaputra torrential flood surge. Direct road access to 4,000 residents severed.
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleRouteBlockage('route-nh27-nandipur')}
            className="px-3.5 py-1.5 bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs font-bold rounded shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Simulate / Toggle Disruption</span>
          </button>
        </div>

        {/* Dynamic Recalculation Comparison Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-red-200/70 text-xs">
          <div className="p-2.5 bg-white border border-red-100 rounded">
            <div className="text-[10px] text-gray-500 font-semibold uppercase">Standard Direct ETA</div>
            <div className="text-base font-bold text-gray-700 font-mono mt-0.5">42 Minutes</div>
            <div className="text-[10px] text-gray-400">Via NH-27 Express link (18.4 km)</div>
          </div>

          <div className="p-2.5 bg-white border border-red-100 rounded">
            <div className="text-[10px] text-red-700 font-semibold uppercase">Dynamic Detour ETA</div>
            <div className="text-base font-bold text-[#DC2626] font-mono mt-0.5">78 Minutes (1h 18m)</div>
            <div className="text-[10px] text-red-600 font-semibold">Delay Penalty: +36 Minutes</div>
          </div>

          <div className="p-2.5 bg-white border border-red-100 rounded">
            <div className="text-[10px] text-blue-700 font-semibold uppercase">Detour Corridor</div>
            <div className="text-xs font-bold text-[#0F2042] mt-0.5 truncate">G.S. Road & Palasbari Corridor</div>
            <div className="text-[10px] text-blue-700 font-semibold">Single-lane heavy escort active</div>
          </div>
        </div>
      </div>

      {/* Monitored Routes Inventory Table */}
      <div className="gov-card p-4 space-y-3">
        <div className="text-xs font-bold text-[#0F2042] uppercase tracking-wider">
          District Emergency Transport Corridor Matrix
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Corridor Name</th>
                <th>Supply Origin</th>
                <th>Destination Sector</th>
                <th>Status</th>
                <th className="num">Normal ETA</th>
                <th className="num">Current ETA</th>
                <th className="num">Delay</th>
                <th>Detour Routing</th>
                <th className="num">Simulation Action</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((rt) => (
                <tr key={rt.id}>
                  <td className="font-bold text-[#0F2042]">
                    {rt.roadName}
                  </td>
                  <td className="text-xs text-gray-600">
                    {rt.origin}
                  </td>
                  <td className="font-semibold text-gray-800">
                    {rt.destination}
                  </td>
                  <td>
                    <span className={
                      rt.status === 'BLOCKED' ? 'badge-critical' :
                      rt.status === 'RESTRICTED' ? 'badge-warning' :
                      'badge-stable'
                    }>
                      {rt.status}
                    </span>
                  </td>
                  <td className="num font-mono text-gray-500">
                    {rt.originalEtaMin}m
                  </td>
                  <td className="num font-bold font-mono text-[#0F2042]">
                    {rt.currentEtaMin}m
                  </td>
                  <td className="num font-bold font-mono text-red-600">
                    {rt.delayMin > 0 ? `+${rt.delayMin}m` : '0m'}
                  </td>
                  <td className="text-xs text-gray-600 max-w-xs truncate">
                    {rt.detourAvailable ? rt.detourRouteName || 'Available' : 'No alternative bridge'}
                  </td>
                  <td className="num">
                    <button
                      onClick={() => toggleRouteBlockage(rt.id)}
                      className="px-2 py-1 bg-[#1E3A8A] hover:bg-[#152e6f] text-white text-[10px] font-bold rounded cursor-pointer"
                    >
                      {rt.status === 'BLOCKED' ? 'Clear Route' : 'Trigger Block'}
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
