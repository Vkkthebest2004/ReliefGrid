import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDisaster } from '../context/DisasterContext';
import type { GovernmentResource, ExtendedResourceCategory } from '../types';

export const ResourceGridView: React.FC = () => {
  const { 
    governmentResources, 
    setSelectedGovernmentResource, 
    setActiveTab, 
    setSelectedRegion, 
    regionAssessments,
    dispatchMovements 
  } = useDisaster();

  const [activeCategory, setActiveCategory] = useState<ExtendedResourceCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResId, setSelectedResId] = useState<string>('res-food-kits');

  const containerRef = useRef<HTMLDivElement>(null);
  const kpiRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const selectedResDetails = governmentResources.find(r => r.id === selectedResId) || governmentResources[0];

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );
    }
    if (kpiRef.current) {
      gsap.fromTo(
        kpiRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'back.out(1.4)' }
      );
    }
  }, []);

  const filteredResources = governmentResources.filter(res => {
    const matchesCategory = activeCategory === 'ALL' || res.category === activeCategory;
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate Aggregated National KPIs
  const totalAvailableCount = governmentResources.reduce((acc, curr) => acc + curr.totalAvailable, 0);
  const totalDeployedCount = governmentResources.reduce((acc, curr) => acc + curr.allocated, 0);
  const totalGapCount = governmentResources.reduce((acc, curr) => acc + curr.gap, 0);
  const criticalShortageCount = governmentResources.filter(r => r.urgency === 'CRITICAL' && r.gap > 0).length;

  const handleAllocateClick = (res: GovernmentResource) => {
    setSelectedGovernmentResource(res);
    const target = regionAssessments.find(r => r.requirements.some(req => req.resourceId === res.id));
    if (target) setSelectedRegion(target);
    setActiveTab('allocation-planner');
  };

  return (
    <div ref={containerRef} className="w-full space-y-6 select-none font-body-md text-on-background">
      {/* Top Header & Context */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-outline-variant pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-primary-container text-on-primary-container text-xs font-bold px-2 py-0.5 rounded font-mono">
              AS-DDMA RESOURCE GRID
            </span>
            <span className="text-xs text-on-surface-variant">• 12 Warehouses & Depots Linked</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">
            Government Resource Management & Availability
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Live inventory tracking, location depots, allocated capacity, and critical region shortage gaps.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('allocation-planner')}
            className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-4 py-2.5 rounded shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">hub</span>
            <span>Open Allocation Engine</span>
          </button>
          <button
            onClick={() => setActiveTab('logistics-tracker')}
            className="bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant font-label-md text-label-md px-4 py-2.5 rounded shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            <span>Logistics Pipeline</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div ref={kpiRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Resources */}
        <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start text-on-surface-variant font-label-sm text-label-sm uppercase">
            <span>Total Resources</span>
            <span className="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
          </div>
          <div className="font-display-lg text-[30px] font-black text-primary mt-2">
            {totalAvailableCount.toLocaleString()}
          </div>
          <div className="text-xs text-on-surface-variant mt-1">Across 5 Institutional Categories</div>
        </div>

        {/* Resources Deployed */}
        <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start text-on-surface-variant font-label-sm text-label-sm uppercase">
            <span>Resources Deployed</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">send</span>
          </div>
          <div className="font-display-lg text-[30px] font-black text-secondary mt-2">
            {totalDeployedCount.toLocaleString()}
          </div>
          <div className="text-xs text-on-surface-variant mt-1">
            {totalAvailableCount > 0 ? Math.round((totalDeployedCount / totalAvailableCount) * 100) : 0}% of stock committed
          </div>
        </div>

        {/* Unmet Requirements / Deficit */}
        <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start text-on-surface-variant font-label-sm text-label-sm uppercase">
            <span>Unmet Requirements</span>
            <span className="material-symbols-outlined text-error text-[20px]">warning</span>
          </div>
          <div className="font-display-lg text-[30px] font-black text-error mt-2">
            {totalGapCount.toLocaleString()}
          </div>
          <div className="text-xs text-error font-semibold mt-1">
            {criticalShortageCount} Critical Deficit Categories
          </div>
        </div>

        {/* Active Operations */}
        <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start text-on-surface-variant font-label-sm text-label-sm uppercase">
            <span>Active Operations</span>
            <span className="material-symbols-outlined text-primary text-[20px]">sync</span>
          </div>
          <div className="font-display-lg text-[30px] font-black text-primary mt-2">
            {dispatchMovements.length}
          </div>
          <div className="text-xs text-green-700 font-semibold mt-1">
            {dispatchMovements.filter(d => d.status === 'IN_TRANSIT' || d.status === 'DISPATCHED').length} En-Route Dispatches
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-surface-container-low p-2 rounded-xl border border-outline-variant">
        {/* Category Buttons */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeCategory === 'ALL' 
                ? 'bg-primary text-on-primary' 
                : 'bg-surface text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            All Resources ({governmentResources.length})
          </button>
          <button
            onClick={() => setActiveCategory('ESSENTIAL_SUPPLIES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'ESSENTIAL_SUPPLIES' 
                ? 'bg-primary text-on-primary' 
                : 'bg-surface text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">inventory_2</span>
            <span>Essential Supplies</span>
          </button>
          <button
            onClick={() => setActiveCategory('MEDICAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'MEDICAL' 
                ? 'bg-primary text-on-primary' 
                : 'bg-surface text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">medical_services</span>
            <span>Medical</span>
          </button>
          <button
            onClick={() => setActiveCategory('RESCUE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'RESCUE' 
                ? 'bg-primary text-on-primary' 
                : 'bg-surface text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">sailing</span>
            <span>Rescue</span>
          </button>
          <button
            onClick={() => setActiveCategory('INFRASTRUCTURE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'INFRASTRUCTURE' 
                ? 'bg-primary text-on-primary' 
                : 'bg-surface text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">bolt</span>
            <span>Infrastructure</span>
          </button>
          <button
            onClick={() => setActiveCategory('HUMAN_RESOURCES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'HUMAN_RESOURCES' 
                ? 'bg-primary text-on-primary' 
                : 'bg-surface text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">badge</span>
            <span>Personnel</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter resources..."
            className="w-full pl-9 pr-3 py-1.5 bg-surface border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
        </div>
      </div>

      {/* Main Resource Grid & Detailed Location Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Full Comprehensive Resource Table (8 cols) */}
        <div ref={tableRef} className="lg:col-span-8 bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-xs flex flex-col">
          <div className="px-5 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-primary">
                Resource Availability & Deficit Ledger
              </h2>
              <p className="text-xs text-on-surface-variant">Click any resource row to inspect warehouse depot breakdown.</p>
            </div>
            <span className="text-xs font-mono text-on-surface-variant">Showing {filteredResources.length} items</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant">
                  <th className="py-3 px-4 font-bold">Resource</th>
                  <th className="py-3 px-3 font-bold text-right">Total Available</th>
                  <th className="py-3 px-3 font-bold text-right text-secondary">Allocated</th>
                  <th className="py-3 px-3 font-bold text-right text-primary">Remaining</th>
                  <th className="py-3 px-3 font-bold text-right">Required</th>
                  <th className="py-3 px-3 font-bold text-right text-error">Gap</th>
                  <th className="py-3 px-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 font-body-sm">
                {filteredResources.map((res) => {
                  const isSelected = selectedResDetails?.id === res.id;
                  const isCritical = res.urgency === 'CRITICAL' && res.gap > 0;

                  return (
                    <tr 
                      key={res.id}
                      onClick={() => setSelectedResId(res.id)}
                      className={`hover:bg-surface-container-low transition-colors cursor-pointer ${
                        isSelected ? 'bg-surface-container ring-1 ring-primary/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="font-bold text-primary text-sm">{res.name}</div>
                          {isCritical && (
                            <span className="bg-error-container text-on-error-container text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                              DEFICIT
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-on-surface-variant capitalize">
                          {res.category.replace('_', ' ').toLowerCase()}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-on-surface">
                        {res.totalAvailable.toLocaleString()} <span className="text-[10px] font-normal text-on-surface-variant">{res.unit}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-secondary">
                        {res.allocated.toLocaleString()} <span className="text-[10px] font-normal text-on-surface-variant">{res.unit}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-primary bg-primary/5">
                        {res.remaining.toLocaleString()} <span className="text-[10px] font-normal text-on-surface-variant">{res.unit}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-on-surface">
                        {res.required.toLocaleString()} <span className="text-[10px] font-normal text-on-surface-variant">{res.unit}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-error">
                        {res.gap > 0 ? `-${res.gap.toLocaleString()}` : '0'} <span className="text-[10px] font-normal text-error/80">{res.unit}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAllocateClick(res);
                          }}
                          className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary text-[11px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer"
                        >
                          Allocate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Selected Resource Inspector & Depot Locations (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {selectedResDetails ? (
            <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-xs flex flex-col gap-4 sticky top-20">
              {/* Header */}
              <div className="border-b border-outline-variant pb-3">
                <div className="flex justify-between items-start">
                  <span className="bg-surface-container text-on-surface-variant text-[11px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                    {selectedResDetails.category.replace('_', ' ')}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                    selectedResDetails.gap > 0 ? 'bg-error-container text-on-error-container' : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedResDetails.gap > 0 ? `SHORTAGE: ${selectedResDetails.gap.toLocaleString()} ${selectedResDetails.unit}` : 'SUFFICIENT STOCK'}
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-primary mt-2">
                  {selectedResDetails.name}
                </h3>
              </div>

              {/* Live Availability Status Card (Section 9 & 16) */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
                <div className="text-xs text-on-surface-variant font-label-sm uppercase">Available Remaining</div>
                <div className="font-display-lg text-[32px] font-black text-primary font-mono mt-1">
                  {selectedResDetails.remaining.toLocaleString()} <span className="text-sm font-normal text-on-surface-variant">{selectedResDetails.unit}</span>
                </div>
                <div className="text-xs text-on-surface-variant mt-0.5">
                  out of {selectedResDetails.totalAvailable.toLocaleString()} Total Stock
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden flex mt-3">
                  <div 
                    className="bg-primary transition-all duration-500" 
                    style={{ width: `${(selectedResDetails.remaining / selectedResDetails.totalAvailable) * 100}%` }}
                    title={`Available: ${selectedResDetails.remaining}`}
                  />
                  <div 
                    className="bg-secondary transition-all duration-500" 
                    style={{ width: `${(selectedResDetails.inTransit / selectedResDetails.totalAvailable) * 100}%` }}
                    title={`In Transit: ${selectedResDetails.inTransit}`}
                  />
                  <div 
                    className="bg-green-600 transition-all duration-500" 
                    style={{ width: `${(selectedResDetails.delivered / selectedResDetails.totalAvailable) * 100}%` }}
                    title={`Delivered: ${selectedResDetails.delivered}`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] mt-2 font-mono text-center">
                  <div><span className="w-2 h-2 rounded-full bg-primary inline-block mr-1"></span>Available: <strong>{selectedResDetails.remaining}</strong></div>
                  <div><span className="w-2 h-2 rounded-full bg-secondary inline-block mr-1"></span>Transit: <strong>{selectedResDetails.inTransit}</strong></div>
                  <div><span className="w-2 h-2 rounded-full bg-green-600 inline-block mr-1"></span>Delivered: <strong>{selectedResDetails.delivered}</strong></div>
                </div>
              </div>

              {/* Warehouse Locations (Section 8) */}
              <div>
                <h4 className="font-label-md text-label-md font-bold text-primary mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">warehouse</span>
                  <span>Depot & Warehouse Locations</span>
                </h4>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {selectedResDetails.locations.map(loc => (
                    <div key={loc.id} className="p-2.5 border border-outline-variant rounded-lg bg-surface-container-lowest flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-primary">{loc.name}</div>
                        <div className="text-[11px] text-on-surface-variant">{loc.district} • {loc.status}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold font-mono text-primary text-sm">
                          {loc.quantity.toLocaleString()} <span className="text-[10px] font-normal">{selectedResDetails.unit}</span>
                        </div>
                        <span className="text-[10px] bg-surface-container px-1.5 py-0.2 rounded text-on-surface-variant font-mono">
                          {loc.dispatchCapacity} CAPACITY
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Action */}
              {selectedResDetails.recommendedAction && (
                <div className="p-3 border-l-4 border-secondary bg-surface-container-low rounded-r text-xs">
                  <div className="font-bold text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                    <span>AI Recommendation</span>
                  </div>
                  <p className="text-on-surface-variant mt-1 leading-relaxed">
                    {selectedResDetails.recommendedAction}
                  </p>
                </div>
              )}

              {/* Dispatch Action CTA */}
              <button
                onClick={() => handleAllocateClick(selectedResDetails)}
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-2.5 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer mt-auto"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Dispatch {selectedResDetails.name}</span>
              </button>
            </div>
          ) : (
            <div className="p-8 border border-dashed border-outline-variant rounded-xl text-center text-on-surface-variant text-xs">
              Select any resource from the ledger to inspect warehouse depots.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
