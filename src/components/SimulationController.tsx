import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { 
  SkipForward, 
  RotateCcw, 
  Sliders, 
  Sparkles
} from 'lucide-react';
import type { DisasterType } from '../types';

export const SimulationController: React.FC = () => {
  const { 
    simulationStep, 
    setSimulationStepDirect, 
    advanceSimulationStep, 
    resetSimulation, 
    triggerScenario,
    disasterEvent,
    recalculateOptimization
  } = useDisaster();

  const timelineSteps = [
    { label: 'T+00:00', title: 'Seismic Shock', desc: 'M6.4 Earthquake strikes Guwahati basin.' },
    { label: 'T+06:00', title: 'Damage Detection', desc: 'Initial telemetry & structural damage reports logged.' },
    { label: 'T+12:00', title: 'Torrential Rain', desc: 'Secondary Brahmaputra river level surge exceeds danger mark.' },
    { label: 'T+18:00', title: 'Peak Critical Surge', desc: 'NH-27 bridge collapse cuts off Nandipur. Multiple distress SOS.' },
    { label: 'T+24:00', title: 'Shelter Saturation', desc: 'Dispur and Jalukbari evacuation shelters reach 90% capacity.' },
    { label: 'T+36:00', title: 'Medical Surge', desc: 'Mass casualty trauma triage demand peaks across hospitals.' },
    { label: 'T+48:00', title: 'Relief Transition', desc: 'Emergency stabilization reached, long-term relief established.' }
  ];

  const disasterTypes: DisasterType[] = [
    'Multi-Hazard Event',
    'Earthquake',
    'Flash Flood',
    'Cyclone',
    'Landslide',
    'Wildfire',
    'Chemical / Industrial'
  ];

  return (
    <div className="bg-white border border-[#D9DEE5] rounded-md p-4 space-y-4 shadow-xs select-none">
      
      {/* Header with Scenario Select */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#D9DEE5] pb-3">
        <div>
          <div className="text-[10px] font-bold tracking-wider text-[#1E3A8A] uppercase flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>DISASTER SCENARIO & TIMELINE ENGINE</span>
          </div>
          <h3 className="text-sm font-bold text-[#0F2042] font-heading mt-0.5">
            Real-Time Operational Simulation Controller
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-600">Hazard Preset:</label>
          <select
            value={disasterEvent.type}
            onChange={(e) => triggerScenario(e.target.value as DisasterType, 'Critical')}
            className="px-2.5 py-1 text-xs font-semibold border border-[#D9DEE5] rounded bg-[#F8FAFC] text-[#0F2042] focus:outline-none focus:border-[#1E3A8A]"
          >
            {disasterTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <button
            onClick={resetSimulation}
            className="px-2.5 py-1 text-xs font-semibold border border-[#D9DEE5] bg-white hover:bg-gray-50 text-gray-700 rounded flex items-center gap-1 cursor-pointer"
            title="Reset to initial scenario"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Interactive Timeline Scrub Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-[#0F2042] uppercase tracking-wider">
            Simulation Timeline Progression (T+00 to T+48 Hours)
          </span>
          <span className="text-xs font-bold font-mono text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Active: {timelineSteps[simulationStep].label} — {timelineSteps[simulationStep].title}
          </span>
        </div>

        {/* Step Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {timelineSteps.map((step, idx) => {
            const isActive = simulationStep === idx;
            const isPassed = simulationStep > idx;

            return (
              <button
                key={step.label}
                onClick={() => setSimulationStepDirect(idx)}
                className={`p-2 rounded text-left transition-all cursor-pointer border ${
                  isActive 
                    ? 'bg-[#1E3A8A] text-white border-[#0F2042] shadow-sm ring-2 ring-blue-300' 
                    : isPassed
                    ? 'bg-[#EFF6FF] text-[#1E3A8A] border-[#BFDBFE] hover:bg-blue-100'
                    : 'bg-[#F8FAFC] text-gray-600 border-[#D9DEE5] hover:bg-gray-100'
                }`}
              >
                <div className="text-[10px] font-mono font-bold tracking-tight">
                  {step.label}
                </div>
                <div className={`text-xs font-bold truncate leading-tight mt-0.5 ${isActive ? 'text-white' : 'text-[#0F2042]'}`}>
                  {step.title}
                </div>
                <div className={`text-[9px] truncate mt-0.5 ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                  {step.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulation Playback & Dynamic Change Trigger Footer */}
      <div className="pt-3 border-t border-[#D9DEE5] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-gray-600">
          <strong>Interactive Demo Hint:</strong> Step through the timeline or click <em>Trigger Situation Surge</em> to demonstrate dynamic AI reallocation.
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={advanceSimulationStep}
            className="px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] rounded text-xs font-bold text-[#0F2042] flex items-center gap-1.5 cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>Advance Timeline Step (T+{((simulationStep + 1) * 6).toString().padStart(2, '0')})</span>
          </button>

          <button
            onClick={recalculateOptimization}
            className="px-3.5 py-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trigger Dynamic Reallocation</span>
          </button>
        </div>
      </div>

    </div>
  );
};
