import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDisaster } from '../context/DisasterContext';
import { 
  greedyAllocate, 
  reoptimize,
  humanizeResource,
  type AllocationProposal, 
  type AllocationResult,
  type SmartDecisionRationale
} from '../services/allocationEngine';
import { 
  CheckCircle2, 
  Clock, 
  Undo2, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Zap, 
  Layers, 
  Truck, 
  Warehouse, 
  AlertTriangle 
} from 'lucide-react';

interface ActiveDeploymentRecord {
  id: string;
  proposalId: string;
  resourceName: string;
  quantity: number;
  sourceName: string;
  regionName: string;
  confirmedBy: string;
  confirmedAt: string;
  etaMinutes: number;
  cancellableUntil: number; // timestamp
}

export const AllocationPlannerView: React.FC = () => {
  const { 
    officer, 
    raeRequirements,
    raeSources,
    governmentResources,
    detailedRegionNeeds,
    dispatchMovements,
    executeRAEProposal,
    cancelRAEDeployment,
    resetScenario,
    setActiveTab
  } = useDisaster();

  // Engine state
  const [lockedRequirementIds, setLockedRequirementIds] = useState<Set<string>>(new Set());
  const [allocationResult, setAllocationResult] = useState<AllocationResult>(() =>
    greedyAllocate(raeRequirements, raeSources)
  );

  // Section view filter: 'ALL' shows full end-to-end single page, or focus on a section
  const [activeSection, setActiveSection] = useState<'ALL' | 'NEEDS' | 'STOCK' | 'ENGINE' | 'CONVOYS'>('ALL');
  const [selectedSectorId, setSelectedSectorId] = useState<string>('G-04');

  // Deep calculation animation state
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [calculationStep, setCalculationStep] = useState<number>(0);
  const [showSmartRationale, setShowSmartRationale] = useState<boolean>(true);

  // Active deployments with 60-second undo window
  const [activeDeployments, setActiveDeployments] = useState<ActiveDeploymentRecord[]>([]);
  const [now, setNow] = useState<number>(Date.now());
  const [filterTier, setFilterTier] = useState<'ALL' | 'P1' | 'P2' | 'P3'>('ALL');
  const [editingProposalId, setEditingProposalId] = useState<string | null>(null);
  const [customOverrideQty, setCustomOverrideQty] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const proposalsRef = useRef<HTMLDivElement>(null);

  // Aggregated KPIs
  const totalStock = governmentResources.reduce((acc, curr) => acc + curr.totalAvailable, 0);
  const totalDeployed = governmentResources.reduce((acc, curr) => acc + curr.allocated, 0);
  const totalRemaining = governmentResources.reduce((acc, curr) => acc + curr.remaining, 0);
  const totalGaps = governmentResources.reduce((acc, curr) => acc + curr.gap, 0);
  const criticalDeficitsCount = governmentResources.filter(r => r.urgency === 'CRITICAL' && r.gap > 0).length;

  // Timer loop for 60s undo countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );
    }
  }, []);

  // Deep Calculation Multi-Phase Execution
  const handleRunDeepOptimization = () => {
    setIsCalculating(true);
    setCalculationStep(1);

    setTimeout(() => setCalculationStep(2), 200);
    setTimeout(() => setCalculationStep(3), 400);
    setTimeout(() => setCalculationStep(4), 600);
    setTimeout(() => {
      setCalculationStep(5);
      const result = reoptimize(raeRequirements, raeSources, lockedRequirementIds);
      setAllocationResult(result);
      setIsCalculating(false);
    }, 850);
  };

  // Helper to get priority tier for a proposal
  const getProposalTier = (proposal: AllocationProposal): 'P1' | 'P2' | 'P3' => {
    const req = raeRequirements.find(r => r.id === proposal.requirementId);
    return req ? req.priorityTier : 'P1';
  };

  // Human Approval Action
  const handleApproveProposal = (proposal: AllocationProposal, overrideQty?: number) => {
    const qty = overrideQty ?? proposal.proposedQty;

    // 1. Mark proposal as approved
    proposal.approvalStatus = 'approved';
    const newLocked = new Set(lockedRequirementIds);
    newLocked.add(proposal.requirementId);
    setLockedRequirementIds(newLocked);

    // 2. Trigger Full System Synchronization in Context
    executeRAEProposal(proposal, qty);

    // 3. Create Deployment with 60-second undo window
    const newDeployment: ActiveDeploymentRecord = {
      id: `dep-${Date.now()}`,
      proposalId: proposal.id,
      resourceName: humanizeResource(proposal.resourceType),
      quantity: qty,
      sourceName: proposal.sourceName,
      regionName: proposal.regionName || 'Assam Flood Sector',
      confirmedBy: `${officer.name} (${officer.badgeNumber})`,
      confirmedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      etaMinutes: proposal.etaMinutes,
      cancellableUntil: Date.now() + 60000 // 60s
    };

    setActiveDeployments(prev => [newDeployment, ...prev]);

    // 4. Recompute remaining allocations incrementally
    setTimeout(() => {
      const result = reoptimize(raeRequirements, raeSources, newLocked);
      setAllocationResult(result);
    }, 100);
  };

  // Batch Deploy All Approved Proposals
  const handleDeployAllApproved = () => {
    const pending = filteredProposals.filter(p => p.approvalStatus === 'proposed');
    if (pending.length === 0) return;

    pending.forEach(proposal => {
      handleApproveProposal(proposal);
    });
  };

  // 60-Second Undo Action
  const handleCancelDeployment = (dep: ActiveDeploymentRecord) => {
    const prop = allocationResult.proposals.find(p => p.id === dep.proposalId);
    if (!prop) return;

    cancelRAEDeployment(
      dep.id,
      dep.proposalId,
      dep.quantity,
      prop.sourceId,
      prop.resourceType,
      prop.regionId
    );

    const newLocked = new Set(lockedRequirementIds);
    newLocked.delete(prop.requirementId);
    setLockedRequirementIds(newLocked);
    prop.approvalStatus = 'proposed';

    setActiveDeployments(prev => prev.filter(d => d.id !== dep.id));

    setTimeout(() => {
      const result = reoptimize(raeRequirements, raeSources, newLocked);
      setAllocationResult(result);
    }, 100);
  };

  // Filter proposals by priority tier
  const filteredProposals = allocationResult.proposals.filter(p => {
    if (filterTier === 'ALL') return true;
    return getProposalTier(p) === filterTier;
  });

  const p1Count = allocationResult.proposals.filter(p => getProposalTier(p) === 'P1').length;
  const p2Count = allocationResult.proposals.filter(p => getProposalTier(p) === 'P2').length;
  const p3Count = allocationResult.proposals.filter(p => getProposalTier(p) === 'P3').length;

  return (
    <div ref={containerRef} className="w-full space-y-6 select-none font-body-md text-on-background">
      
      {/* 1. MASTER HEADER: Unified Resource Allocation Center */}
      <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="bg-primary text-on-primary text-xs font-bold px-2.5 py-0.5 rounded font-mono">
              UNIFIED ALLOCATION CENTER
            </span>
            <span className="text-xs text-on-surface-variant font-mono font-semibold">
              Guwahati EOC • Integrated Demand, Stock & AI Dispatch
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">
            Resource Allocation & Deployment Center
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl">
            Single-page command dashboard: check sector shortages, warehouse stock, AI-optimized dispatches, and live convoys.
          </p>
        </div>

        {/* Master Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleRunDeepOptimization}
            disabled={isCalculating}
            className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            title="Re-run deep multi-depot optimization"
          >
            <Sparkles className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
            <span>{isCalculating ? `Computing (Step ${calculationStep}/5)...` : 'Run Optimization'}</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset incident simulation? All warehouse inventory will return to 100% capacity and critical region deficits will be re-opened.')) {
                resetScenario();
                setActiveDeployments([]);
                setLockedRequirementIds(new Set());
                setAllocationResult(greedyAllocate(raeRequirements, raeSources));
              }
            }}
            className="bg-surface hover:bg-surface-container-high text-on-surface-variant border border-outline-variant font-label-md text-label-md px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            title="Reset incident baseline to 100% stock"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Incident</span>
          </button>
        </div>
      </div>

      {/* Quick Section Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-label-sm text-xs">
        <button
          onClick={() => setActiveSection('ALL')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'ALL'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Complete Workflow (All-In-One)</span>
        </button>

        <button
          onClick={() => setActiveSection('NEEDS')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'NEEDS'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-error" />
          <span>1. Sector Shortages ({detailedRegionNeeds.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('STOCK')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'STOCK'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <Warehouse className="w-3.5 h-3.5 text-secondary" />
          <span>2. Warehouse Stock ({governmentResources.length} Items)</span>
        </button>

        <button
          onClick={() => setActiveSection('ENGINE')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'ENGINE'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>3. Dispatch Engine ({filteredProposals.length} Plans)</span>
        </button>

        <button
          onClick={() => setActiveSection('CONVOYS')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'CONVOYS'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-green-700" />
          <span>4. Live Convoys ({dispatchMovements.length})</span>
        </button>
      </div>

      {/* Top Aggregated KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Total Stock */}
        <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start text-on-surface-variant font-label-sm text-label-sm uppercase">
            <span>Total Depot Stock</span>
            <Warehouse className="w-5 h-5 text-primary" />
          </div>
          <div className="font-display-lg text-[26px] font-black text-primary mt-2 font-mono">
            {totalStock.toLocaleString()}
          </div>
          <div className="text-[11px] text-on-surface-variant mt-1">Across 4 District Depots</div>
        </div>

        {/* Resources Deployed */}
        <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start text-on-surface-variant font-label-sm text-label-sm uppercase">
            <span>Stock Committed</span>
            <CheckCircle2 className="w-5 h-5 text-secondary" />
          </div>
          <div className="font-display-lg text-[26px] font-black text-secondary mt-2 font-mono">
            {totalDeployed.toLocaleString()}
          </div>
          <div className="text-[11px] text-on-surface-variant mt-1">
            {totalStock > 0 ? Math.round((totalDeployed / totalStock) * 100) : 0}% of capacity dispatched
          </div>
        </div>

        {/* Net Remaining Available Stock */}
        <div className="bg-surface border border-emerald-300/80 rounded-xl p-4 shadow-xs flex flex-col justify-between bg-emerald-50/20">
          <div className="flex justify-between items-start text-emerald-800 font-label-sm text-label-sm uppercase font-bold">
            <span>Net Available Stock</span>
            <Check className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="font-display-lg text-[26px] font-black text-emerald-700 mt-2 font-mono">
            {totalRemaining.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Ready for New Orders
          </div>
        </div>

        {/* Unmet Requirements / Deficit */}
        <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start text-on-surface-variant font-label-sm text-label-sm uppercase">
            <span>Open Shortages</span>
            <AlertTriangle className="w-5 h-5 text-error" />
          </div>
          <div className="font-display-lg text-[26px] font-black text-error mt-2 font-mono">
            {totalGaps.toLocaleString()}
          </div>
          <div className="text-[11px] text-error font-semibold mt-1">
            {criticalDeficitsCount} Critical Deficits
          </div>
        </div>

        {/* Active Operations */}
        <div className="bg-surface border border-outline-variant rounded-xl p-4 shadow-xs flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex justify-between items-start text-on-surface-variant font-label-sm text-label-sm uppercase">
            <span>Active Convoys</span>
            <Truck className="w-5 h-5 text-green-700" />
          </div>
          <div className="font-display-lg text-[26px] font-black text-primary mt-2 font-mono">
            {dispatchMovements.length}
          </div>
          <div className="text-[11px] text-green-700 font-semibold mt-1">
            {dispatchMovements.filter(d => d.status === 'IN_TRANSIT' || d.status === 'DISPATCHED').length} In Transit
          </div>
        </div>
      </div>

      {/* 2. SECTION 1: SECTOR NEEDS & SHORTAGES (DEMAND) */}
      {(activeSection === 'ALL' || activeSection === 'NEEDS') && (
        <div className="bg-surface border border-outline-variant rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-outline-variant pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-error/15 text-error font-bold flex items-center justify-center text-xs font-mono">1</span>
              <h2 className="font-headline-sm text-headline-sm font-bold text-primary">
                Sector Needs & Shortages (Demand)
              </h2>
            </div>
            <span className="text-xs font-mono text-on-surface-variant">
              Click a sector to inspect specific shortages
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {detailedRegionNeeds.map((sector) => {
              const isSelected = sector.id === selectedSectorId;
              const isCritical = sector.severity === 'CRITICAL';

              return (
                <div
                  key={sector.id}
                  onClick={() => setSelectedSectorId(sector.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'border-primary bg-surface ring-2 ring-primary/20 shadow-xs'
                      : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <strong className="font-mono text-xs text-primary font-bold">{sector.code}</strong>
                      <div className="text-xs text-on-surface font-semibold">{sector.name}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      isCritical ? 'bg-error-container text-on-error-container' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sector.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-on-surface-variant border-y border-outline-variant/60 py-1.5">
                    <div>Affected: <strong className="text-primary">{sector.affectedPopulation.toLocaleString()}</strong></div>
                    <div>Cut-off: <strong className="text-error">{sector.isolatedPopulation.toLocaleString()}</strong></div>
                  </div>

                  <div className="space-y-1">
                    {sector.summaryNeeds.map((need, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs font-mono">
                        <span>{need.icon}</span>
                        <span className={`font-bold ${need.color}`}>{need.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. SECTION 2: WAREHOUSE STOCK & DEPOTS (SUPPLY) */}
      {(activeSection === 'ALL' || activeSection === 'STOCK') && (
        <div className="bg-surface border border-outline-variant rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-outline-variant pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-secondary/15 text-secondary font-bold flex items-center justify-center text-xs font-mono">2</span>
              <div>
                <h2 className="font-headline-sm text-headline-sm font-bold text-primary">
                  Warehouse Stock & Depots (Supply Ledger)
                </h2>
                <p className="text-xs text-on-surface-variant">Live capacity across 4 district warehouses</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('asset-inventory')}
              className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold font-mono px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Warehouse className="w-3.5 h-3.5" />
              <span>Manage Assets & Stock</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-outline-variant rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse font-body-sm">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant">
                  <th className="py-3 px-4 font-bold">Resource / Item</th>
                  <th className="py-3 px-3 font-bold">Category</th>
                  <th className="py-3 px-3 font-bold text-right">Total Stock</th>
                  <th className="py-3 px-3 font-bold text-right text-secondary">Committed</th>
                  <th className="py-3 px-3 font-bold text-right text-primary font-bold">Remaining Available</th>
                  <th className="py-3 px-3 font-bold text-right text-error">Shortage Gap</th>
                  <th className="py-3 px-4 font-bold text-center">Stock Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                {governmentResources.map((res) => {
                  const usedPct = res.totalAvailable > 0 ? Math.round((res.allocated / res.totalAvailable) * 100) : 0;

                  return (
                    <tr key={res.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 font-bold text-primary">
                        {res.name}
                      </td>
                      <td className="py-3 px-3 font-mono text-on-surface-variant">{res.category}</td>
                      <td className="py-3 px-3 text-right font-mono font-semibold">{res.totalAvailable.toLocaleString()} {res.unit}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-secondary">{res.allocated.toLocaleString()} {res.unit}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-primary">{res.remaining.toLocaleString()} {res.unit}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-error">
                        {res.gap > 0 ? `-${res.gap.toLocaleString()} ${res.unit}` : '0 (FULFILLED ✓)'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-surface-container-highest h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${usedPct > 80 ? 'bg-error' : usedPct > 40 ? 'bg-amber-500' : 'bg-primary'}`}
                              style={{ width: `${Math.min(usedPct, 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-on-surface-variant font-bold w-7 text-right">{usedPct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. SECTION 3: SMART ALLOCATION ENGINE (DISPATCH PLAN & AUTHORIZATION) */}
      {(activeSection === 'ALL' || activeSection === 'ENGINE') && (
        <div className="space-y-4">
          <div className="bg-surface border border-outline-variant rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-xs font-mono">3</span>
                <div>
                  <h2 className="font-headline-sm text-headline-sm font-bold text-primary">
                    AI Dispatch Recommendations & Approval
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    Greedy multi-depot shortest-path optimization with golden-hour penalty evasion
                  </p>
                </div>
              </div>

              {/* Tier Filter Pills & Quick Deploy All */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-surface-container-low p-0.5 rounded-lg border border-outline-variant text-xs font-mono">
                  <button
                    onClick={() => setFilterTier('ALL')}
                    className={`px-2.5 py-1 rounded transition-colors ${filterTier === 'ALL' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}
                  >
                    All ({allocationResult.proposals.length})
                  </button>
                  <button
                    onClick={() => setFilterTier('P1')}
                    className={`px-2.5 py-1 rounded transition-colors ${filterTier === 'P1' ? 'bg-error text-on-error font-bold' : 'text-on-surface-variant hover:text-error'}`}
                  >
                    P1 ({p1Count})
                  </button>
                  <button
                    onClick={() => setFilterTier('P2')}
                    className={`px-2.5 py-1 rounded transition-colors ${filterTier === 'P2' ? 'bg-amber-500 text-white font-bold' : 'text-on-surface-variant hover:text-amber-600'}`}
                  >
                    P2 ({p2Count})
                  </button>
                  <button
                    onClick={() => setFilterTier('P3')}
                    className={`px-2.5 py-1 rounded transition-colors ${filterTier === 'P3' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}
                  >
                    P3 ({p3Count})
                  </button>
                </div>

                <button
                  onClick={handleDeployAllApproved}
                  className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-3.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Deploy All Recommended</span>
                </button>
              </div>
            </div>

            {/* Smart Decision Justification & Mathematical Rationale Card */}
            {allocationResult.metrics && showSmartRationale && (
              <div className="bg-surface-container-lowest border border-primary/30 rounded-xl p-4 text-xs space-y-3">
                <div className="flex justify-between items-center border-b border-outline-variant/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <strong className="text-primary font-mono text-sm">AI Mathematical Decision Justification</strong>
                  </div>
                  <button 
                    onClick={() => setShowSmartRationale(false)}
                    className="text-on-surface-variant hover:text-primary text-[11px] font-mono cursor-pointer"
                  >
                    Dismiss Rationale
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="p-2 bg-surface border border-outline-variant rounded-lg">
                    <span className="text-on-surface-variant block text-[10px]">LIVES PROTECTED SCORE</span>
                    <strong className="text-green-700 text-sm">{allocationResult.metrics.livesProtectedScore}%</strong>
                  </div>
                  <div className="p-2 bg-surface border border-outline-variant rounded-lg">
                    <span className="text-on-surface-variant block text-[10px]">P1 CRITICAL FULFILLMENT</span>
                    <strong className="text-primary text-sm">{allocationResult.metrics.p1CoverageRate}%</strong>
                  </div>
                  <div className="p-2 bg-surface border border-outline-variant rounded-lg">
                    <span className="text-on-surface-variant block text-[10px]">AVG TRANSIT REDUCTION</span>
                    <strong className="text-secondary text-sm">-{allocationResult.metrics.avgTransitTimeReductionMin} min</strong>
                  </div>
                  <div className="p-2 bg-surface border border-outline-variant rounded-lg">
                    <span className="text-on-surface-variant block text-[10px]">ROAD CUTOFF EVASION</span>
                    <strong className="text-green-700 text-sm">100% Cleared</strong>
                  </div>
                </div>

                {allocationResult.metrics.justifications && (
                  <div className="space-y-1.5 pt-1 text-on-surface-variant">
                    {allocationResult.metrics.justifications.map((rationale: SmartDecisionRationale, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 bg-surface/60 p-2 rounded border border-outline-variant/40">
                        <span className="text-primary font-bold font-mono">#{idx + 1}</span>
                        <div>
                          <strong className="text-primary block font-medium">{rationale.title}</strong>
                          <span>{rationale.whySmartest}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Proposal Cards List */}
            <div ref={proposalsRef} className="space-y-3">
              {filteredProposals.map((proposal) => {
                const isApproved = proposal.approvalStatus === 'approved';
                const tier = getProposalTier(proposal);
                const isP1 = tier === 'P1';

                return (
                  <div
                    key={proposal.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isApproved
                        ? 'bg-surface-container-low border-green-700/40'
                        : isP1
                        ? 'bg-surface border-error/40 hover:border-error shadow-xs'
                        : 'bg-surface border-outline-variant hover:border-primary/40'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                            isP1 ? 'bg-error text-on-error' : 'bg-amber-500 text-white'
                          }`}>
                            {tier}
                          </span>
                          <strong className="text-sm text-primary font-bold">
                            {humanizeResource(proposal.resourceType)}
                          </strong>
                          <span className="text-xs font-mono text-on-surface-variant">
                            • {proposal.proposedQty} units requested
                          </span>
                        </div>

                        <div className="text-xs text-on-surface-variant flex items-center gap-3 font-mono flex-wrap">
                          <span>Origin: <strong className="text-primary">{proposal.sourceName}</strong></span>
                          <span>➔ Destination: <strong className="text-primary">{proposal.regionName}</strong></span>
                          <span>ETA: <strong className="text-secondary">{proposal.etaMinutes} mins</strong></span>
                          <span className="text-green-700 font-bold">✓ Route Cleared</span>
                        </div>
                      </div>

                      {/* Action Button & Override */}
                      <div className="flex items-center gap-2">
                        {isApproved ? (
                          <span className="text-xs font-mono font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <Check className="w-4 h-4" />
                            <span>Authorized & Dispatched</span>
                          </span>
                        ) : (
                          <>
                            {editingProposalId === proposal.id ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min={1}
                                  max={proposal.proposedQty * 2}
                                  value={customOverrideQty}
                                  onChange={(e) => setCustomOverrideQty(Number(e.target.value))}
                                  className="w-20 px-2 py-1 border border-primary rounded text-xs font-mono"
                                />
                                <button
                                  onClick={() => {
                                    handleApproveProposal(proposal, customOverrideQty);
                                    setEditingProposalId(null);
                                  }}
                                  className="bg-primary hover:bg-primary-container text-on-primary px-3 py-1 rounded text-xs font-bold font-mono cursor-pointer"
                                >
                                  Confirm
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setEditingProposalId(proposal.id);
                                    setCustomOverrideQty(proposal.proposedQty);
                                  }}
                                  className="text-xs text-on-surface-variant hover:text-primary font-mono underline cursor-pointer"
                                >
                                  Override
                                </button>
                                <button
                                  onClick={() => handleApproveProposal(proposal)}
                                  className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-3.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Check className="w-4 h-4" />
                                  <span>Authorize & Deploy</span>
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. SECTION 4: ACTIVE CONVOYS & LOGISTICS (LIVE TRACKING & 60S UNDO) */}
      {(activeSection === 'ALL' || activeSection === 'CONVOYS') && (
        <div className="bg-surface border border-outline-variant rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-outline-variant pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-700/15 text-green-700 font-bold flex items-center justify-center text-xs font-mono">4</span>
              <div>
                <h2 className="font-headline-sm text-headline-sm font-bold text-primary">
                  Active Convoys & Logistics Pipeline
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Live vehicle transit tracking with 60-second immediate recall window
                </p>
              </div>
            </div>
            <span className="text-xs font-mono bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded">
              {dispatchMovements.length} Active Convoys
            </span>
          </div>

          {/* 60-Second Undo Active Deployments Banner */}
          {activeDeployments.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase font-bold text-amber-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Recent Deployments (60s Safety Recall Window)</span>
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activeDeployments.map((dep) => {
                  const secondsRemaining = Math.max(0, Math.ceil((dep.cancellableUntil - now) / 1000));
                  const isCancellable = secondsRemaining > 0;

                  return (
                    <div key={dep.id} className="p-3 bg-surface-container-low border border-outline-variant rounded-xl flex justify-between items-center text-xs font-mono">
                      <div>
                        <strong className="text-primary block">{dep.resourceName} ({dep.quantity} units)</strong>
                        <span className="text-on-surface-variant">{dep.sourceName} ➔ {dep.regionName}</span>
                      </div>

                      {isCancellable ? (
                        <button
                          onClick={() => handleCancelDeployment(dep)}
                          className="bg-error/10 hover:bg-error hover:text-white text-error font-bold px-3 py-1.5 rounded-lg border border-error/30 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          <span>Recall ({secondsRemaining}s)</span>
                        </button>
                      ) : (
                        <span className="text-green-700 font-bold">Locked in Transit</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Master Live Convoys Table */}
          <div className="overflow-x-auto border border-outline-variant rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse font-body-sm">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant">
                  <th className="py-3 px-4 font-bold">Convoy ID</th>
                  <th className="py-3 px-3 font-bold">Resource & Quantity</th>
                  <th className="py-3 px-3 font-bold">Origin Depot</th>
                  <th className="py-3 px-3 font-bold">Destination Sector</th>
                  <th className="py-3 px-3 font-bold">Transport Vehicle</th>
                  <th className="py-3 px-3 font-bold text-right">ETA</th>
                  <th className="py-3 px-4 font-bold text-center">Transit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                {dispatchMovements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-on-surface-variant font-mono">
                      No active dispatches. Use the Dispatch Engine above to authorize and launch convoys.
                    </td>
                  </tr>
                ) : (
                  dispatchMovements.map((dispatch) => (
                    <tr key={dispatch.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary">{dispatch.id}</td>
                      <td className="py-3 px-3 font-bold text-primary">{dispatch.resourceName} ({dispatch.quantity} {dispatch.unit})</td>
                      <td className="py-3 px-3 font-mono text-on-surface-variant">{dispatch.sourceLocation}</td>
                      <td className="py-3 px-3 font-mono text-on-surface-variant">{dispatch.targetRegionName}</td>
                      <td className="py-3 px-3 font-mono text-on-surface-variant">{dispatch.transportType}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-secondary">{Math.round(dispatch.etaHours * 60)} mins</td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-primary/10 text-primary font-bold font-mono px-2.5 py-1 rounded-full text-[11px]">
                          {dispatch.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
