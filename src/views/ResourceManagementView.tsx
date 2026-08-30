import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import type { ResourceCategory } from '../types';
import { 
  Package, 
  HeartPulse, 
  LifeBuoy, 
  Droplets, 
  Cpu, 
  Warehouse, 
  Sparkles,
  Search
} from 'lucide-react';

export const ResourceManagementView: React.FC = () => {
  const { resources, setIsOptimizationModalOpen } = useDisaster();
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = resources.filter(r => {
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.facilityName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryLabel = (category: ResourceCategory) => {
    switch (category) {
      case 'SEARCH_AND_RESCUE': return 'Search & Rescue';
      case 'MEDICAL': return 'Medical Emergency';
      case 'RELIEF_COMMODITIES': return 'Relief Commodities';
      case 'INFRASTRUCTURE': return 'Infrastructure Support';
    }
  };

  const getCategoryIcon = (category: ResourceCategory) => {
    switch (category) {
      case 'SEARCH_AND_RESCUE': return <LifeBuoy className="w-4 h-4 text-orange-600" />;
      case 'MEDICAL': return <HeartPulse className="w-4 h-4 text-red-600" />;
      case 'RELIEF_COMMODITIES': return <Droplets className="w-4 h-4 text-blue-600" />;
      case 'INFRASTRUCTURE': return <Cpu className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Header */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="text-[10px] font-bold tracking-wider text-[#1E3A8A] uppercase flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" />
            <span>DISASTER RESOURCE INVENTORY & SUPPLY DEPOTS</span>
          </div>
          <h2 className="text-base font-bold text-[#0F2042] font-heading mt-0.5">
            District Emergency Resource Management & Depot Inventory
          </h2>
          <p className="text-xs text-gray-500">
            Real-time multi-agency asset tracking across NDRF, SDRF, Directorate of Health Services, and Public Health Engineering warehouses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOptimizationModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-[#152e6f] text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>AI Allocation Engine</span>
          </button>
        </div>
      </div>

      {/* Category Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(['SEARCH_AND_RESCUE', 'MEDICAL', 'RELIEF_COMMODITIES', 'INFRASTRUCTURE'] as const).map((cat) => {
          const catResources = resources.filter(r => r.category === cat);
          const totalAvail = catResources.reduce((sum, r) => sum + r.available, 0);
          const totalDeploy = catResources.reduce((sum, r) => sum + r.deployed, 0);

          return (
            <div 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`p-3 rounded border transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-[#EFF6FF] border-[#1E3A8A] shadow-xs' 
                  : 'bg-white border-[#D9DEE5] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#0F2042]">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(cat)}
                  <span>{getCategoryLabel(cat)}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">
                  {catResources.length} Types
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-gray-200/60 text-xs">
                <div>
                  <div className="text-[10px] text-gray-500 font-semibold">Available</div>
                  <div className="text-base font-bold text-green-700 font-mono">
                    {totalAvail.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-semibold">Deployed</div>
                  <div className="text-base font-bold text-[#1E3A8A] font-mono">
                    {totalDeploy.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search equipment or depot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#D9DEE5] rounded bg-[#F8FAFC] focus:outline-none focus:border-[#1E3A8A]"
            />
          </div>

          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1.5 text-xs font-bold rounded cursor-pointer ${
              selectedCategory === 'ALL' ? 'bg-[#0F2042] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Show All
          </button>
        </div>

        <div className="text-xs text-gray-500 font-mono">
          Showing {filteredResources.length} of {resources.length} inventory lines
        </div>
      </div>

      {/* Resource Inventory Table */}
      <div className="gov-card p-4">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Resource Name & Specification</th>
                <th>Category</th>
                <th className="num">Available</th>
                <th className="num">Deployed</th>
                <th className="num">In Transit</th>
                <th className="num">Total Asset</th>
                <th>Depot / Staging Base</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((res) => {
                const availPct = Math.round((res.available / res.totalStock) * 100);

                return (
                  <tr key={res.id}>
                    <td className="font-bold text-[#0F2042]">
                      {res.name}
                    </td>
                    <td className="text-xs">
                      <div className="flex items-center gap-1.5">
                        {getCategoryIcon(res.category)}
                        <span>{getCategoryLabel(res.category)}</span>
                      </div>
                    </td>
                    <td className="num font-bold font-mono text-green-700">
                      {res.available.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">{res.unit.split(' ')[0]}</span>
                    </td>
                    <td className="num font-bold font-mono text-[#1E3A8A]">
                      {res.deployed.toLocaleString()}
                    </td>
                    <td className="num font-mono text-amber-700">
                      {res.inTransit.toLocaleString()}
                    </td>
                    <td className="num font-mono text-gray-600 font-bold">
                      {res.totalStock.toLocaleString()}
                    </td>
                    <td className="text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Warehouse className="w-3.5 h-3.5 text-gray-400" />
                        <span>{res.facilityName}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        availPct > 40 ? 'badge-stable' :
                        availPct > 15 ? 'badge-warning' :
                        'badge-critical'
                      }`}>
                        {availPct}% Ready
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
