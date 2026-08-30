import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Trash2, 
  RotateCcw,
  Check
} from 'lucide-react';

export const OptimizationModal: React.FC = () => {
  const { 
    isOptimizationModalOpen, 
    setIsOptimizationModalOpen, 
    allocations, 
    approveAllAllocations, 
    approveSingleAllocation, 
    rejectAllocation
  } = useDisaster();

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const optimizationSteps = [
    'Analyzing 12 affected administrative zones & GIS coordinates...',
    'Evaluating multi-hazard severity index & vulnerability vectors...',
    'Checking regional depot inventories & available equipment...',
    'Evaluating road disruptions & bridge collapse detour delays...',
    'Calculating multi-criteria priority rankings...',
    'Synthesizing optimal human-in-the-loop dispatch plan...'
  ];

  const handleRunOptimization = () => {
    setIsOptimizing(true);
    setCurrentStepIndex(0);

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= optimizationSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => setIsOptimizing(false), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 450);
  };

  if (!isOptimizationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white border border-[#D9DEE5] rounded-md shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#D9DEE5] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#EEF2FF] border border-[#C7D2FE] rounded text-[#4F46E5]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-wider text-[#4F46E5] uppercase flex items-center gap-1.5">
                <span>DECISION SUPPORT SYSTEM</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">RELIEF GRID AI ENGINE</span>
              </div>
              <h2 className="text-lg font-bold text-[#0F2042] font-heading">
                Multi-Zone Resource Allocation & Deployment Optimizer
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunOptimization}
              disabled={isOptimizing}
              className="px-3 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'Optimizing...' : 'Run Optimization Algorithm'}</span>
            </button>

            <button
              onClick={() => setIsOptimizationModalOpen(false)}
              className="p-1.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Algorithmic Progress State if optimizing */}
          {isOptimizing && (
            <div className="p-5 bg-[#EEF2FF] border border-[#C7D2FE] rounded-md animate-pulse">
              <div className="flex items-center justify-between text-xs font-bold text-[#4F46E5] uppercase tracking-wider mb-2">
                <span>Optimization Engine Active</span>
                <span>Stage {currentStepIndex + 1} of {optimizationSteps.length}</span>
              </div>
              <div className="text-sm font-semibold text-[#0F2042]">
                {optimizationSteps[currentStepIndex]}
              </div>
              <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-[#4F46E5] h-full transition-all duration-300"
                  style={{ width: `${((currentStepIndex + 1) / optimizationSteps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Institutional Banner: Transparent System Recommendation */}
          <div className="bg-[#F8FAFC] border border-[#D9DEE5] rounded-md p-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="p-2 bg-blue-100 text-[#1E3A8A] rounded">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F2042] uppercase tracking-wide">
                    SYSTEM RECOMMENDATION — OPERATIONAL DIRECTIVE
                  </div>
                  <p className="text-xs text-gray-600 mt-1 max-w-3xl leading-relaxed">
                    Based on verified structural failure at NH-27 bridge and rising flood contours, the system prioritizes <strong>Zone 07 (Nandipur)</strong> and <strong>Zone 04 (Boragaon)</strong> for combined airborne & riverine search teams, potable water columns, and ALS trauma units.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="badge-decision">
                  Confidence 94.8%
                </span>
              </div>
            </div>

            {/* Resource Utilization Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-gray-700 mb-1">
                  <span>Rescue Teams Deployed</span>
                  <span className="font-mono">8 / 14 (57%)</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full" style={{ width: '57%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-gray-700 mb-1">
                  <span>Ambulances Active</span>
                  <span className="font-mono">23 / 32 (72%)</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full" style={{ width: '72%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-gray-700 mb-1">
                  <span>Potable Water Reserves</span>
                  <span className="font-mono">26,600 / 45,000 L (59%)</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: '59%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Allocation Plan Table */}
          <div>
            <div className="text-xs font-bold text-[#0F2042] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Proposed Allocation Matrix (Human-in-the-loop)</span>
              <span className="text-[11px] text-gray-500 font-normal">
                Review, adjust quantities, or approve
              </span>
            </div>

            <table className="gov-table">
              <thead>
                <tr>
                  <th>Target Zone</th>
                  <th className="num">Severity</th>
                  <th className="num">Affected Pop</th>
                  <th>Recommended Resource</th>
                  <th className="num">Quantity</th>
                  <th>Priority</th>
                  <th>Decision Rationale</th>
                  <th>Status</th>
                  <th className="num">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((item) => (
                  <tr key={item.id} className={item.status === 'APPROVED' ? 'bg-green-50/40' : ''}>
                    <td className="font-bold text-[#0F2042]">
                      {item.zoneName}
                    </td>
                    <td className="num font-bold text-red-600 font-mono">
                      {item.severityScore}
                    </td>
                    <td className="num font-mono text-gray-600">
                      {item.population.toLocaleString()}
                    </td>
                    <td className="font-semibold text-gray-800">
                      {item.resourceName}
                    </td>
                    <td className="num font-bold font-mono">
                      {item.quantity} {item.unit.split(' ')[0]}
                    </td>
                    <td>
                      <span className={item.priority === 'CRITICAL' ? 'badge-critical' : 'badge-high'}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="text-[11px] text-gray-600 max-w-xs truncate" title={item.reason}>
                      {item.reason}
                    </td>
                    <td>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.status === 'APPROVED' ? 'bg-green-100 text-green-800 border border-green-300' :
                        'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="num space-x-1.5">
                      {item.status !== 'APPROVED' ? (
                        <button
                          onClick={() => approveSingleAllocation(item.id)}
                          className="px-2 py-1 bg-[#1E3A8A] hover:bg-[#152e6f] text-white text-[10px] font-bold rounded cursor-pointer"
                          title="Approve and Dispatch this single line"
                        >
                          Approve
                        </button>
                      ) : (
                        <span className="text-[10px] text-green-700 font-bold flex items-center justify-end gap-1">
                          <Check className="w-3 h-3" /> Dispatched
                        </span>
                      )}
                      
                      <button
                        onClick={() => rejectAllocation(item.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remove from plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Modal Human Override & Dispatch Footer */}
        <div className="px-6 py-4 border-t border-[#D9DEE5] bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            <strong className="text-[#0F2042]">Human Authority Principle:</strong> AI provides optimization decision support; the District Officer executes formal dispatch orders.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsOptimizationModalOpen(false)}
              className="px-4 py-2 border border-[#D9DEE5] bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={approveAllAllocations}
              className="px-5 py-2 bg-[#1E3A8A] hover:bg-[#152e6f] text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-green-300" />
              <span>ACCEPT & DISPATCH COMPLETE PLAN</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
