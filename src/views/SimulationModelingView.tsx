import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDisaster } from '../context/DisasterContext';

export const SimulationModelingView: React.FC = () => {
  const { advanceSimulationStep } = useDisaster();

  // Interactive slider variables
  const [rainfall, setRainfall] = useState(45);
  const [riverLevel, setRiverLevel] = useState(2.4);
  const [windSpeed, setWindSpeed] = useState(65);
  const [timelineIndex, setTimelineIndex] = useState(1); // 0 = T-0, 1 = T+24, 2 = T+48, 3 = T+72
  const [isSimulating, setIsSimulating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const centerPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const displacedCountRef = useRef<HTMLDivElement>(null);

  const timelineSteps = [
    { label: 'T-0', text: 'T-0 (Initial Baseline)', hours: 0, surge: 0 },
    { label: 'T+24', text: 'T+24 Hours (Peak Surge)', hours: 24, surge: 100 },
    { label: 'T+48', text: 'T+48 Hours (Secondary Wave)', hours: 48, surge: 65 },
    { label: 'T+72', text: 'T+72 Hours (Relief Stabilization)', hours: 72, surge: 30 },
  ];

  // GSAP 3-Panel Entrance
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        [leftPanelRef.current, centerPanelRef.current, rightPanelRef.current],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, []);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      advanceSimulationStep();
    }, 700);
  };

  // Dynamic calculations based on slider values & timeline
  const currentStep = timelineSteps[timelineIndex];
  const dynamicDisplacedPop = Math.round(
    (38000 + rainfall * 120 + riverLevel * 2500) * (0.4 + (currentStep.surge / 100) * 0.6)
  );
  const dynamicHospitals = Math.max(1, Math.round((rainfall / 20) * (currentStep.surge / 100 + 0.3)));
  const dynamicSubstations = Math.max(3, Math.round((riverLevel * 3.5) * (currentStep.surge / 100 + 0.4)));
  const totalFacilities = dynamicHospitals + dynamicSubstations;
  const drainPercent = Math.min(95, Math.round(50 + (rainfall / 2) + (riverLevel * 8)));

  return (
    <div ref={containerRef} className="w-full space-y-gutter select-none font-body-md text-on-background">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-stack-md">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Simulation Module: Flood Scenario Alpha</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Predictive hydrodynamic forecasting and demographic risk modeling.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">{isSimulating ? 'sync' : 'play_arrow'}</span>
            {isSimulating ? 'Computing Vectors...' : 'Run Simulation'}
          </button>
        </div>
      </div>

      {/* 3-Panel Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Panel: Variables */}
        <div ref={leftPanelRef} className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col gap-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <h3 className="font-headline-sm text-headline-sm text-primary">Simulation Variables</h3>
              <span className="material-symbols-outlined text-secondary">tune</span>
            </div>

            {/* Rainfall Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <label className="font-label-md text-label-md text-on-surface-variant">Rainfall Intensity</label>
                <span className="font-label-sm text-label-sm text-on-surface bg-surface-container px-2 py-0.5 rounded">
                  {rainfall > 40 ? 'High' : 'Moderate'} ({rainfall}mm/h)
                </span>
              </div>
              <input 
                className="w-full h-1 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary" 
                max="100" 
                min="10" 
                type="range" 
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
              />
            </div>

            {/* River Level Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <label className="font-label-md text-label-md text-on-surface-variant">River Level Base</label>
                <span className="font-label-sm text-label-sm text-on-surface bg-surface-container px-2 py-0.5 rounded">
                  +{riverLevel.toFixed(1)}m
                </span>
              </div>
              <input 
                className="w-full h-1 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary" 
                max="5.0" 
                min="0.5" 
                step="0.1" 
                type="range" 
                value={riverLevel}
                onChange={(e) => setRiverLevel(Number(e.target.value))}
              />
            </div>

            {/* Wind Speed Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <label className="font-label-md text-label-md text-on-surface-variant">Wind Speed (Gusts)</label>
                <span className="font-label-sm text-label-sm text-on-surface bg-surface-container px-2 py-0.5 rounded">
                  {windSpeed} km/h
                </span>
              </div>
              <input 
                className="w-full h-1 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary" 
                max="120" 
                min="20" 
                type="range" 
                value={windSpeed}
                onChange={(e) => setWindSpeed(Number(e.target.value))}
              />
            </div>

            <button 
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="mt-2 w-full bg-primary text-on-primary font-label-md text-label-md py-2.5 rounded-lg hover:bg-primary-container transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSimulating ? 'sync' : 'auto_awesome'}
              </span>
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </button>
          </div>

          {/* AI Insights Small Card */}
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-secondary">smart_toy</span>
              <h4 className="font-label-md text-label-md text-secondary">AI Prediction Alert</h4>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
              Based on current variables, levee breach probability in Sector 4 has increased by 15%.
            </p>
            <a href="#" onClick={(e) => e.preventDefault()} className="font-label-sm text-label-sm text-secondary hover:underline inline-block font-semibold">
              View detailed risk matrix →
            </a>
          </div>
        </div>

        {/* Center Panel: Map & Timeline */}
        <div ref={centerPanelRef} className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-surface border border-outline-variant rounded-xl flex-1 relative overflow-hidden min-h-[400px] shadow-sm">
            {/* Top-down satellite style map */}
            <img 
              className="w-full h-full object-cover absolute inset-0 mix-blend-multiply opacity-90" 
              alt="Simulation flood map overlay" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBygrLn-XcosBef9h0WvGQEprEPJ4WDchAgRV1hQObSH8ODBrECjGUf_1WJ2TBWWGBjvLhrIhyFPSAhHc-AYdeDUFkzmhpy1LF8PK_ipGuxiSnAqA_xkSIPEq9W0T56sy86LrbceFXnHzyt08KEBf89_CnkRV_lclUJrZ0ta8XbOEC98I4vTgAj0k--HGxQHb3TUeLRwhpWLShe8aj5dSf4IljV1OfCZCoaz7C6KQgkrizitzarX2HT5w"
            />

            {/* Dynamic Hydrodynamic Water Overlay Vector */}
            <svg viewBox="0 0 600 400" className="w-full h-full absolute inset-0 z-0 pointer-events-none">
              <defs>
                <linearGradient id="floodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#1e40af" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Dynamic Inundation Polygon expanding with timeline & rainfall */}
              <path
                d={`M 80 120 Q 240 ${80 + (currentStep.surge * 0.4)} 360 ${160 + (currentStep.surge * 0.6)} T 560 ${220 + (currentStep.surge * 0.7)} L 560 380 Q 320 280 140 370 L 80 220 Z`}
                fill="url(#floodGrad)"
                stroke="#38bdf8"
                strokeWidth="2"
                className="transition-all duration-700"
              />

              {/* Critical Risk Levee Breach Marker */}
              <g transform="translate(320, 210)">
                <circle cx="0" cy="0" r="16" fill="#ba1a1a" fillOpacity="0.3" className="animate-ping" />
                <circle cx="0" cy="0" r="9" fill="#ba1a1a" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="-14" textAnchor="middle" fill="#ba1a1a" fontSize="10" fontWeight="bold">
                  Sector 4 Levee Breach
                </text>
              </g>
            </svg>

            {/* Map Overlays */}
            <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm border border-outline-variant rounded-lg p-2.5 flex flex-col gap-2 shadow-sm z-10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-error"></div>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">Critical Risk Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">Evacuation Route Active</span>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 bg-surface/90 backdrop-blur-sm border border-outline-variant rounded-lg px-3 py-2 shadow-sm z-10">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono font-bold">
                T+{currentStep.hours} Hours Projection
              </span>
            </div>
          </div>

          {/* Timeline Slider */}
          <div className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col gap-2 shrink-0 shadow-sm">
            <div className="flex justify-between items-center px-1 font-label-sm text-label-sm text-on-surface-variant font-mono">
              {timelineSteps.map((step, idx) => (
                <button
                  key={step.label}
                  onClick={() => setTimelineIndex(idx)}
                  className={`hover:text-primary transition-colors cursor-pointer font-bold ${
                    timelineIndex === idx ? 'text-secondary font-black' : ''
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>

            <div className="relative w-full h-6 flex items-center">
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={timelineIndex}
                onChange={(e) => setTimelineIndex(Number(e.target.value))}
                className="w-full h-1 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
              />
            </div>

            <div className="text-center mt-1">
              <span className="font-label-md text-label-md text-primary font-semibold">
                Current View: {currentStep.text}
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel: Impact */}
        <div ref={rightPanelRef} className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col gap-4 shadow-sm">
            <div className="border-b border-outline-variant pb-2">
              <h3 className="font-headline-sm text-headline-sm text-primary">Projected Impact</h3>
            </div>

            <div className="flex flex-col gap-3">
              {/* Populations Displaced */}
              <div className="p-3 border border-outline-variant rounded-lg bg-error-container/20">
                <div className="font-label-sm text-label-sm text-on-surface-variant mb-1">Populations Displaced</div>
                <div ref={displacedCountRef} className="font-headline-md text-headline-md text-error font-mono font-bold">
                  {dynamicDisplacedPop.toLocaleString()}
                </div>
              </div>

              {/* Critical Infrastructure At Risk */}
              <div className="p-3 border border-outline-variant rounded-lg bg-surface-container-lowest">
                <div className="font-label-sm text-label-sm text-on-surface-variant mb-1">Critical Infrastructure At Risk</div>
                <div className="font-headline-md text-headline-md text-primary font-mono font-bold">
                  {totalFacilities} Facilities
                </div>
                <div className="mt-2 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Hospitals</span>
                    <span className="font-label-sm text-label-sm bg-error-container text-on-error-container px-1.5 rounded font-mono font-bold">
                      {dynamicHospitals}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Power Substations</span>
                    <span className="font-label-sm text-label-sm bg-surface-container-high px-1.5 rounded font-mono font-bold">
                      {dynamicSubstations}
                    </span>
                  </div>
                </div>
              </div>

              {/* Resource Drain Est. */}
              <div className="p-3 border border-outline-variant rounded-lg bg-surface-container-lowest">
                <div className="font-label-sm text-label-sm text-on-surface-variant mb-1">Resource Drain Est.</div>
                <div className="font-headline-md text-headline-md text-primary font-bold">
                  {drainPercent > 80 ? 'Severe' : drainPercent > 60 ? 'High' : 'Moderate'}
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-2">
                  <div className="bg-secondary h-1.5 rounded-full transition-all duration-300" style={{ width: `${drainPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
