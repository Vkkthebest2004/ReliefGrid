import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { 
  Home, 
  Droplets, 
  Utensils, 
  HeartPulse, 
  Zap, 
  AlertTriangle, 
  Phone, 
  UserCheck
} from 'lucide-react';

export const ShelterOperationsView: React.FC = () => {
  const { shelters } = useDisaster();

  const totalCapacity = shelters.reduce((sum, s) => sum + s.capacity, 0);
  const totalOccupancy = shelters.reduce((sum, s) => sum + s.occupancy, 0);
  const totalAvailable = totalCapacity - totalOccupancy;
  const overallOccupancyPct = Math.round((totalOccupancy / totalCapacity) * 100);

  return (
    <div className="space-y-4 select-none">
      
      {/* Header */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="text-[10px] font-bold tracking-wider text-[#1E3A8A] uppercase flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" />
            <span>DISASTER RELIEF SHELTER NETWORK</span>
          </div>
          <h2 className="text-base font-bold text-[#0F2042] font-heading mt-0.5">
            Relief Shelter Operations, Capacity Stress & Evacuee Redirection
          </h2>
          <p className="text-xs text-gray-500">
            Real-time monitoring of designated relief camps, commodity burn rates (water, ration, medical), and early overflow redirection warnings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-700 bg-white border border-[#D9DEE5] px-3 py-1 rounded">
            Overall Occupancy: <strong>{totalOccupancy.toLocaleString()} / {totalCapacity.toLocaleString()} ({overallOccupancyPct}%)</strong>
          </span>
        </div>
      </div>

      {/* District Aggregate Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="gov-card p-3 border-l-4 border-l-[#1E3A8A]">
          <div className="text-[10px] font-bold text-gray-500 uppercase">Total Camps Active</div>
          <div className="text-2xl font-black text-[#0F2042] font-mono mt-1">{shelters.length} Designated</div>
          <div className="text-[10px] text-gray-400">Guwahati Urban & Rural</div>
        </div>

        <div className="gov-card p-3 border-l-4 border-l-[#EA580C]">
          <div className="text-[10px] font-bold text-gray-500 uppercase">Current Evacuees</div>
          <div className="text-2xl font-black text-[#EA580C] font-mono mt-1">{totalOccupancy.toLocaleString()}</div>
          <div className="text-[10px] text-orange-700 font-semibold">{totalAvailable.toLocaleString()} Beds Remaining</div>
        </div>

        <div className="gov-card p-3 border-l-4 border-l-[#DC2626]">
          <div className="text-[10px] font-bold text-gray-500 uppercase">Capacity Stress Warning</div>
          <div className="text-2xl font-black text-[#DC2626] font-mono mt-1">
            {shelters.filter(s => s.status !== 'NORMAL').length}
          </div>
          <div className="text-[10px] text-red-600 font-semibold">Exceeding 85% capacity</div>
        </div>

        <div className="gov-card p-3 border-l-4 border-l-[#16A34A]">
          <div className="text-[10px] font-bold text-gray-500 uppercase">Average Commodity Reserve</div>
          <div className="text-2xl font-black text-green-700 font-mono mt-1">64%</div>
          <div className="text-[10px] text-gray-400">Water, Food, Medical, Power</div>
        </div>
      </div>

      {/* Shelter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shelters.map((sh) => {
          const occPct = Math.round((sh.occupancy / sh.capacity) * 100);
          const isNearCap = sh.status === 'NEAR_CAPACITY' || occPct >= 85;
          const isOverflow = sh.status === 'OVERFLOW_RISK';

          return (
            <div key={sh.id} className={`gov-card p-4 space-y-3 ${isOverflow ? 'border-red-300 bg-red-50/20' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase font-mono">
                      CAMP ID: {sh.id.toUpperCase()}
                    </span>
                    <span className={
                      isOverflow ? 'badge-critical' :
                      isNearCap ? 'badge-warning' :
                      'badge-stable'
                    }>
                      {isOverflow ? 'OVERFLOW RISK' : isNearCap ? 'NEAR CAPACITY (92%)' : 'NORMAL'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0F2042] font-heading mt-0.5">
                    {sh.name}
                  </h3>
                  <div className="text-xs text-gray-500">{sh.locationName}</div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xl font-bold text-[#0F2042]">
                    {sh.occupancy.toLocaleString()} <span className="text-xs font-normal text-gray-400">/ {sh.capacity.toLocaleString()}</span>
                  </div>
                  <div className="text-[10px] font-bold text-gray-500">{occPct}% Full</div>
                </div>
              </div>

              {/* Occupancy Progress Bar */}
              <div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      occPct > 90 ? 'bg-red-600' :
                      occPct > 75 ? 'bg-orange-500' :
                      'bg-blue-600'
                    }`}
                    style={{ width: `${occPct}%` }}
                  />
                </div>
              </div>

              {/* Commodity Stock Bars */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-100 text-center text-xs">
                <div className="p-1.5 bg-[#F8FAFC] rounded border border-gray-200">
                  <div className="flex items-center justify-center gap-1 text-blue-600 text-[10px] font-bold">
                    <Droplets className="w-3 h-3" />
                    <span>Water</span>
                  </div>
                  <div className="font-bold font-mono text-[#0F2042] mt-0.5">{sh.waterPct}%</div>
                </div>

                <div className="p-1.5 bg-[#F8FAFC] rounded border border-gray-200">
                  <div className="flex items-center justify-center gap-1 text-orange-600 text-[10px] font-bold">
                    <Utensils className="w-3 h-3" />
                    <span>Food</span>
                  </div>
                  <div className="font-bold font-mono text-[#0F2042] mt-0.5">{sh.foodPct}%</div>
                </div>

                <div className="p-1.5 bg-[#F8FAFC] rounded border border-gray-200">
                  <div className="flex items-center justify-center gap-1 text-red-600 text-[10px] font-bold">
                    <HeartPulse className="w-3 h-3" />
                    <span>Medical</span>
                  </div>
                  <div className="font-bold font-mono text-[#0F2042] mt-0.5">{sh.medicalPct}%</div>
                </div>

                <div className="p-1.5 bg-[#F8FAFC] rounded border border-gray-200">
                  <div className="flex items-center justify-center gap-1 text-amber-600 text-[10px] font-bold">
                    <Zap className="w-3 h-3" />
                    <span>Power</span>
                  </div>
                  <div className="font-bold font-mono text-[#0F2042] mt-0.5">{sh.powerPct}%</div>
                </div>
              </div>

              {/* Predictive Warning Banner if near capacity */}
              {sh.recommendedRerouteTo && (
                <div className="p-2.5 bg-[#FFFBEB] border border-[#FDE68A] rounded flex items-center justify-between text-xs text-[#92400E]">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                    <span>
                      Approaching capacity limit within 3h. <strong>Recommended Redirection:</strong> {sh.recommendedRerouteTo}
                    </span>
                  </div>
                </div>
              )}

              {/* Camp In-Charge Contact */}
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                  <span>Officer: <strong>{sh.contactPerson}</strong></span>
                </div>
                <div className="flex items-center gap-1 font-mono text-gray-600">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <span>{sh.phone}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
