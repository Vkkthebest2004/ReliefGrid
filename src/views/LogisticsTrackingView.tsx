import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDisaster } from '../context/DisasterContext';
import type { ResourceDispatchMovement } from '../types';

export const LogisticsTrackingView: React.FC = () => {
  const { dispatchMovements, updateDispatchStatus, setActiveTab } = useDisaster();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });
    }
  }, []);

  const filteredMovements = dispatchMovements.filter(m => {
    if (filterStatus === 'ALL') return true;
    return m.status === filterStatus;
  });

  const getTransportIcon = (type: ResourceDispatchMovement['transportType']) => {
    switch (type) {
      case 'All-Terrain Truck': return 'local_shipping';
      case 'IAF Helicopter': return 'flight';
      case 'SDRF Inflatable Boat': return 'sailing';
      case 'Emergency Ambulance': return 'emergency';
      case 'Heavy Freight Logistics': return 'fire_truck';
      default: return 'local_shipping';
    }
  };

  const getStatusBadgeClass = (status: ResourceDispatchMovement['status']) => {
    switch (status) {
      case 'ALLOCATED': return 'bg-surface-container text-on-surface-variant';
      case 'DISPATCHED': return 'bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]/30';
      case 'IN_TRANSIT': return 'bg-[#659dfe]/20 text-[#003370] border border-[#659dfe]/40 animate-pulse';
      case 'ARRIVED': return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border border-green-300';
      default: return 'bg-surface-container text-on-surface';
    }
  };

  return (
    <div ref={containerRef} className="w-full space-y-6 select-none font-body-md text-on-background">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-outline-variant pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-primary text-on-primary text-xs font-bold px-2 py-0.5 rounded font-mono">
              LOGISTICS DISPATCH TRACKER
            </span>
            <span className="text-xs text-on-surface-variant">• Section 18 Pipeline Protocol</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">
            Resource Movement & Convoy Logistics
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Live telemetry tracking of supply dispatches from regional warehouse depots to affected disaster zones.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('allocation-planner')}
            className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-4 py-2 rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>New Allocation Dispatch</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 bg-surface-container-low p-2 rounded-xl border border-outline-variant">
        {['ALL', 'IN_TRANSIT', 'DISPATCHED', 'ARRIVED', 'DELIVERED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterStatus === st 
                ? 'bg-primary text-on-primary' 
                : 'bg-surface text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {st.replace('_', ' ')} {st === 'ALL' ? `(${dispatchMovements.length})` : ''}
          </button>
        ))}
      </div>

      {/* Dispatches List */}
      <div ref={listRef} className="space-y-4">
        {filteredMovements.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-outline-variant rounded-xl text-on-surface-variant text-sm">
            No active dispatches found for status "{filterStatus}".
          </div>
        ) : (
          filteredMovements.map((movement) => (
            <div 
              key={movement.id}
              className="bg-surface border border-outline-variant rounded-xl p-5 shadow-xs flex flex-col gap-4"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-outline-variant/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[22px]">
                      {getTransportIcon(movement.transportType)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                        {movement.quantity.toLocaleString()} {movement.unit} of {movement.resourceName}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${getStatusBadgeClass(movement.status)}`}>
                        {movement.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-on-surface-variant font-mono">
                      Carrier: <strong>{movement.transportType}</strong> • ETA: ~{movement.etaHours} Hours • Authorized by {movement.approvedBy}
                    </div>
                  </div>
                </div>

                {/* Status Update Quick Triggers */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <span className="text-[11px] text-on-surface-variant mr-1">Advance Status:</span>
                  {movement.status === 'DISPATCHED' && (
                    <button
                      onClick={() => updateDispatchStatus(movement.id, 'IN_TRANSIT')}
                      className="bg-secondary/15 hover:bg-secondary/30 text-secondary text-xs font-bold px-2.5 py-1 rounded transition-colors cursor-pointer"
                    >
                      Mark In-Transit →
                    </button>
                  )}
                  {movement.status === 'IN_TRANSIT' && (
                    <button
                      onClick={() => updateDispatchStatus(movement.id, 'ARRIVED')}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-bold px-2.5 py-1 rounded transition-colors cursor-pointer"
                    >
                      Mark Arrived →
                    </button>
                  )}
                  {movement.status === 'ARRIVED' && (
                    <button
                      onClick={() => updateDispatchStatus(movement.id, 'DELIVERED')}
                      className="bg-green-100 hover:bg-green-200 text-green-800 text-xs font-bold px-2.5 py-1 rounded transition-colors cursor-pointer"
                    >
                      Confirm Delivered ✓
                    </button>
                  )}
                  {movement.status === 'DELIVERED' && (
                    <span className="text-green-700 text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Delivered at Destination</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Logistics Movement Diagram (Section 18) */}
              <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  {/* Origin */}
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20"></div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Source Origin Depot</span>
                      <strong className="text-primary text-sm">{movement.sourceLocation}</strong>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold block">Target Destination</span>
                      <strong className="text-primary text-sm">{movement.targetRegionName}</strong>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-error ring-4 ring-error/20"></div>
                  </div>
                </div>

                {/* Animated Movement Progress Line */}
                <div className="relative w-full h-3 bg-surface-container-high rounded-full overflow-hidden flex items-center">
                  <div 
                    className="h-full bg-gradient-to-r from-primary via-secondary to-green-600 transition-all duration-700 rounded-full"
                    style={{ width: `${movement.progressPct}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] text-on-surface-variant font-mono">
                  <span>Dispatched: {movement.dispatchedAt}</span>
                  <span className="font-bold text-secondary">{movement.progressPct}% Traversed</span>
                  <span>Destination ETA: {movement.status === 'DELIVERED' ? 'Complete' : `${movement.etaHours}h`}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
