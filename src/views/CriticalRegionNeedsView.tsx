import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDisaster } from '../context/DisasterContext';
import { ImpactNeedsMap } from '../components/ImpactNeedsMap';

export interface DetailedRegionNeed {
  id: string;
  code: string;
  name: string;
  district: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  priorityLevel: 'P1' | 'P2' | 'P3';
  affectedPopulation: number;
  isolatedPopulation: number;
  criticalMedicalCases: number;
  roadAccessibilityPct: number;
  communicationCoveragePct: number;
  safeWaterCoveragePct: number;
  criticalityDrivers: string[];
  summaryNeeds: { icon: string; text: string; color: string }[];
  resourceTable: {
    resource: string;
    required: string;
    available: string;
    deficit: string;
    priority: 'P1' | 'P2' | 'P3';
    timeToCritical: string;
  }[];
  waterCountdown: {
    current: string;
    required: string;
    deficit: string;
    exhaustionTime: string;
    deadline: string;
  };
  medicalWindow: {
    currentCapacity: string;
    demand: string;
    deficit: string;
    responseWindow: string;
  };
  recommendedResponse: {
    priority: string;
    primaryDeploys: string[];
    secondaryDeploys: string[];
    responseWindow: string;
  };
}

export const DETAILED_REGIONS: DetailedRegionNeed[] = [
  {
    id: 'G-04',
    code: 'REGION G-04',
    name: 'North Guwahati',
    district: 'Guwahati West Circle (Kamrup Metro)',
    severity: 'CRITICAL',
    priorityLevel: 'P1',
    affectedPopulation: 8420,
    isolatedPopulation: 1510,
    criticalMedicalCases: 186,
    roadAccessibilityPct: 32,
    communicationCoveragePct: 18,
    safeWaterCoveragePct: 45,
    criticalityDrivers: [
      '1,510 residents completely isolated by riverine flood surge & hill runoff',
      '186 critical medical cases requiring urgent trauma triage & evacuation',
      '68% of road network inaccessible / submerged (Saraighat connector severed)',
      'Safe potable water coverage fallen below 45% (High waterborne risk)',
      'Cellular communication coverage collapsed below 20% (Towers submerged)',
      '2 local relief camps approaching 94% maximum shelter capacity'
    ],
    summaryNeeds: [
      { icon: 'sailing', text: '5 Rescue Teams', color: 'text-error' },
      { icon: 'medical_services', text: '3 Medical Teams', color: 'text-error' },
      { icon: 'water_drop', text: '15,220 L Water', color: 'text-error' }
    ],
    resourceTable: [
      { resource: 'Rescue Teams', required: '8 teams', available: '3 teams', deficit: '-5 teams', priority: 'P1', timeToCritical: '< 2 Hours' },
      { resource: 'Medical Teams', required: '4 teams', available: '1 team', deficit: '-3 teams', priority: 'P1', timeToCritical: '< 3 Hours' },
      { resource: 'Ambulances', required: '12 units', available: '5 units', deficit: '-7 units', priority: 'P1', timeToCritical: '< 3 Hours' },
      { resource: 'Safe Potable Water', required: '27,720 L/day', available: '12,500 L', deficit: '-15,220 L', priority: 'P1', timeToCritical: 'Exhausts in 05h 42m' },
      { resource: 'Meal Units (Rations)', required: '7,860 units', available: '4,500 units', deficit: '-3,360 units', priority: 'P2', timeToCritical: '< 8 Hours' },
      { resource: 'Shelter Spaces', required: '5,200 beds', available: '3,700 beds', deficit: '-1,500 beds', priority: 'P2', timeToCritical: 'Imminent Overflow' },
      { resource: 'Generators (15kVA)', required: '6 units', available: '2 units', deficit: '-4 units', priority: 'P3', timeToCritical: '< 12 Hours' }
    ],
    waterCountdown: {
      current: '12,500 L',
      required: '27,720 L',
      deficit: '15,220 L/day',
      exhaustionTime: '05h 42m',
      deadline: 'ACTION REQUIRED BEFORE 20:15 IST'
    },
    medicalWindow: {
      currentCapacity: '5 ambulances',
      demand: '12 ambulances',
      deficit: '7 units',
      responseWindow: '< 3 HOURS'
    },
    recommendedResponse: {
      priority: 'P1 — Immediate Intervention',
      primaryDeploys: [
        '5 additional search & rescue teams (SDRF Boats)',
        '3 specialist trauma medical teams',
        '7 Advanced Life Support ambulances',
        '15,220 L/day safe potable water tankers'
      ],
      secondaryDeploys: [
        '3,360 emergency meal ration kits',
        '1,500 expandable shelter canvas beds',
        '4 heavy 15kVA mobile diesel generators'
      ],
      responseWindow: '< 6 Hours'
    }
  },
  {
    id: 'G-07',
    code: 'REGION G-07',
    name: 'West Guwahati (Pandu Port)',
    district: 'Guwahati West Circle (Kamrup Metro)',
    severity: 'HIGH',
    priorityLevel: 'P2',
    affectedPopulation: 4820,
    isolatedPopulation: 620,
    criticalMedicalCases: 94,
    roadAccessibilityPct: 58,
    communicationCoveragePct: 42,
    safeWaterCoveragePct: 60,
    criticalityDrivers: [
      '620 riparian residents cut off near lower Pandu ghat embankment',
      'Pandu Port ferry terminal wharf inundated by 1.4m Brahmaputra surge',
      '42% of municipal road network impassable due to silt debris',
      'Local primary clinic running on depleted emergency antibiotics',
      'Pandu community hall shelter operating at 88% capacity'
    ],
    summaryNeeds: [
      { icon: 'inventory_2', text: '500 Rations', color: 'text-amber-600' },
      { icon: 'bolt', text: '5 Generators', color: 'text-amber-600' },
      { icon: 'water_drop', text: '8,000 L Water', color: 'text-error' }
    ],
    resourceTable: [
      { resource: 'Inflatable Rescue Boats', required: '6 boats', available: '3 boats', deficit: '-3 boats', priority: 'P1', timeToCritical: '< 4 Hours' },
      { resource: 'Safe Potable Water', required: '14,000 L/day', available: '6,000 L', deficit: '-8,000 L', priority: 'P1', timeToCritical: 'Exhausts in 08h 15m' },
      { resource: 'Food Ration Kits', required: '3,500 units', available: '3,000 units', deficit: '-500 units', priority: 'P2', timeToCritical: '< 10 Hours' },
      { resource: 'Generators (15kVA)', required: '8 units', available: '3 units', deficit: '-5 units', priority: 'P2', timeToCritical: '< 12 Hours' },
      { resource: 'Ambulances', required: '6 units', available: '4 units', deficit: '-2 units', priority: 'P2', timeToCritical: '< 6 Hours' }
    ],
    waterCountdown: {
      current: '6,000 L',
      required: '14,000 L',
      deficit: '8,000 L/day',
      exhaustionTime: '08h 15m',
      deadline: 'ACTION REQUIRED BEFORE 22:45 IST'
    },
    medicalWindow: {
      currentCapacity: '4 ambulances',
      demand: '6 ambulances',
      deficit: '2 units',
      responseWindow: '< 6 HOURS'
    },
    recommendedResponse: {
      priority: 'P2 — Priority High Response',
      primaryDeploys: [
        '3 SDRF motor inflatable rescue boats',
        '8,000 L drinking water bowsers',
        '500 family food ration kits'
      ],
      secondaryDeploys: [
        '5 dewatering generator sets for pumping stations',
        '2 4x4 offroad triage ambulances'
      ],
      responseWindow: '< 10 Hours'
    }
  },
  {
    id: 'G-02',
    code: 'REGION G-02',
    name: 'Jalukbari & University Ward',
    district: 'Guwahati North Circle (Kamrup Metro)',
    severity: 'HIGH',
    priorityLevel: 'P2',
    affectedPopulation: 3950,
    isolatedPopulation: 410,
    criticalMedicalCases: 48,
    roadAccessibilityPct: 65,
    communicationCoveragePct: 60,
    safeWaterCoveragePct: 72,
    criticalityDrivers: [
      '410 residents affected by Deepor Beel wetland backflow inundation',
      'University residential quarters experiencing ground floor flooding',
      'Makeshift relief camp established inside University Sports Complex',
      'Thermal blankets and chlorine purification tablets urgently required'
    ],
    summaryNeeds: [
      { icon: 'night_shelter', text: '400 Blankets', color: 'text-amber-600' },
      { icon: 'medical_services', text: '2 Ambulances', color: 'text-amber-600' },
      { icon: 'water_drop', text: '4,500 L Water', color: 'text-error' }
    ],
    resourceTable: [
      { resource: 'Safe Potable Water', required: '8,500 L/day', available: '4,000 L', deficit: '-4,500 L', priority: 'P1', timeToCritical: 'Exhausts in 11h 20m' },
      { resource: 'Thermal Blankets', required: '1,200 units', available: '800 units', deficit: '-400 units', priority: 'P2', timeToCritical: '< 14 Hours' },
      { resource: 'Ambulances', required: '4 units', available: '2 units', deficit: '-2 units', priority: 'P2', timeToCritical: '< 8 Hours' },
      { resource: 'Emergency Tents', required: '300 units', available: '150 units', deficit: '-150 units', priority: 'P3', timeToCritical: '< 16 Hours' }
    ],
    waterCountdown: {
      current: '4,000 L',
      required: '8,500 L',
      deficit: '4,500 L/day',
      exhaustionTime: '11h 20m',
      deadline: 'ACTION REQUIRED BEFORE 02:00 IST'
    },
    medicalWindow: {
      currentCapacity: '2 ambulances',
      demand: '4 ambulances',
      deficit: '2 units',
      responseWindow: '< 8 HOURS'
    },
    recommendedResponse: {
      priority: 'P2 — Priority High Response',
      primaryDeploys: [
        '4,500 L clean drinking water bowsers',
        '400 thermal blankets to University relief camp',
        '2 on-call emergency ambulances'
      ],
      secondaryDeploys: [
        '150 water-resistant tarpaulins and tents'
      ],
      responseWindow: '< 12 Hours'
    }
  },
  {
    id: 'G-11',
    code: 'REGION G-11',
    name: 'Dispur & Capital Complex',
    district: 'Guwahati East Circle (Kamrup Metro)',
    severity: 'MODERATE',
    priorityLevel: 'P3',
    affectedPopulation: 2600,
    isolatedPopulation: 120,
    criticalMedicalCases: 22,
    roadAccessibilityPct: 85,
    communicationCoveragePct: 82,
    safeWaterCoveragePct: 88,
    criticalityDrivers: [
      'Localized waterlogging along Supermarket & Secretariat arterial corridors',
      'Power feeder line trip in sub-station 4 requiring backup generator sets',
      'Minor water deficit in suburban rehabilitation centers'
    ],
    summaryNeeds: [
      { icon: 'bolt', text: '2 Generators', color: 'text-yellow-600' },
      { icon: 'water_drop', text: '2,000 L Water', color: 'text-yellow-600' }
    ],
    resourceTable: [
      { resource: 'Generators (15kVA)', required: '4 units', available: '2 units', deficit: '-2 units', priority: 'P3', timeToCritical: '< 18 Hours' },
      { resource: 'Safe Potable Water', required: '3,000 L/day', available: '1,000 L', deficit: '-2,000 L', priority: 'P3', timeToCritical: 'Exhausts in 14h 40m' },
      { resource: 'Meal Ration Kits', required: '1,500 units', available: '1,100 units', deficit: '-400 units', priority: 'P3', timeToCritical: '< 24 Hours' }
    ],
    waterCountdown: {
      current: '1,000 L',
      required: '3,000 L',
      deficit: '2,000 L/day',
      exhaustionTime: '14h 40m',
      deadline: 'ACTION REQUIRED BEFORE 05:15 IST'
    },
    medicalWindow: {
      currentCapacity: '3 ambulances',
      demand: '3 ambulances',
      deficit: '0 units',
      responseWindow: 'Adequate'
    },
    recommendedResponse: {
      priority: 'P3 — Moderate Scheduled Dispatch',
      primaryDeploys: [
        '2 mobile diesel generators for repeater stations',
        '2,000 L drinking water packs'
      ],
      secondaryDeploys: [
        '400 supplementary meal rations'
      ],
      responseWindow: '< 24 Hours'
    }
  }
];

export const CriticalRegionNeedsView: React.FC = () => {
  const { setActiveTab, setSelectedRegion, regionAssessments, detailedRegionNeeds } = useDisaster();
  const [selectedRegionId, setSelectedRegionId] = useState<string>('G-04');
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);
  const [isAssessmentGenerated, setIsAssessmentGenerated] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatingPhase, setGeneratingPhase] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const regionDetailsRef = useRef<HTMLDivElement>(null);

  const activeRegion = detailedRegionNeeds.find(r => r.id === selectedRegionId) || detailedRegionNeeds[0];

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );
    }
  }, [isAssessmentGenerated]);

  useEffect(() => {
    if (regionDetailsRef.current) {
      gsap.fromTo(
        regionDetailsRef.current,
        { opacity: 0, x: 15 },
        { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [selectedRegionId]);

  const handleGenerateAssessment = () => {
    setIsGenerating(true);
    setGeneratingPhase(1);

    setTimeout(() => setGeneratingPhase(2), 200);
    setTimeout(() => setGeneratingPhase(3), 400);
    setTimeout(() => {
      setIsGenerating(false);
      setIsAssessmentGenerated(true);
    }, 600);
  };

  const handleReviewAllocation = () => {
    const matchedRegion = regionAssessments.find(r => r.code === `SEC-04` || r.id.includes('sector-4')) || regionAssessments[0];
    setSelectedRegion(matchedRegion);
    setActiveTab('allocation-planner');
  };

  // If assessment has not been requested yet, keep page in clean standby mode
  if (!isAssessmentGenerated) {
    return (
      <div ref={containerRef} className="w-full space-y-6 select-none font-body-md text-on-background">
        {/* Standby Header & Generator Card */}
        <div className="bg-surface border border-outline-variant rounded-2xl p-8 shadow-xs flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full font-mono">
              REGIONAL INTELLIGENCE
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-headline-lg text-headline-lg font-bold text-primary">
              Region Needs & Supply Shortages
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
              Check affected areas, isolated populations, and emergency supply shortages across Guwahati.
            </p>
          </div>

          {/* Staged Data Preview Pills */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-md font-mono text-xs">
            <div className="p-3.5 bg-surface-container-low border border-outline-variant rounded-xl">
              <div className="text-xl font-bold text-primary">12</div>
              <div className="text-on-surface-variant mt-0.5">Affected Sectors</div>
            </div>
            <div className="p-3.5 bg-surface-container-low border border-outline-variant rounded-xl">
              <div className="text-xl font-bold text-primary">42</div>
              <div className="text-on-surface-variant mt-0.5">Field Reports</div>
            </div>
            <div className="p-3.5 bg-surface-container-low border border-outline-variant rounded-xl">
              <div className="text-xl font-bold text-green-700">91%</div>
              <div className="text-on-surface-variant mt-0.5">Accuracy</div>
            </div>
          </div>

          {/* Interactive Generator Button / Progress */}
          {isGenerating ? (
            <div className="w-full max-w-md space-y-3 font-mono text-xs text-left bg-surface-container-lowest p-4 rounded-xl border border-primary">
              <div className="flex justify-between items-center text-primary font-bold">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <span>Loading region needs...</span>
                </span>
                <span>Step {generatingPhase}/3</span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-200 ease-out" 
                  style={{ width: `${(generatingPhase / 3) * 100}%` }}
                />
              </div>
              <div className="text-on-surface-variant text-[11px] space-y-0.5 pt-1">
                {generatingPhase >= 1 && <div>✓ Step 1: Loading field reports and water levels...</div>}
                {generatingPhase >= 2 && <div>✓ Step 2: Checking cut-off areas and population needs...</div>}
                {generatingPhase >= 3 && <div className="text-green-700 font-bold">✓ Step 3: Calculating supply shortages and urgent tasks...</div>}
              </div>
            </div>
          ) : (
            <button
              onClick={handleGenerateAssessment}
              className="bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg px-6 py-3.5 rounded-xl shadow-sm flex items-center gap-2.5 transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">bar_chart</span>
              <span>Show Region Needs</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full space-y-6 select-none font-body-md text-on-background">
      {/* 1. TOP: Disaster + Assessment Status Banner */}
      <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="bg-primary text-on-primary text-xs font-bold px-2.5 py-0.5 rounded font-mono">
              NEEDS ASSESSMENT
            </span>
            <span className="text-xs text-on-surface-variant font-mono font-semibold">
              Guwahati Floods • Updated at 14:32 IST
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">
            Region Needs & Supply Shortages
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Population impact, essential supplies needed, and current shortages by affected area.
          </p>
        </div>

        {/* Badges & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            onClick={() => setIsAssessmentGenerated(false)}
            className="bg-surface hover:bg-surface-container text-on-surface-variant border border-outline-variant text-xs font-bold font-mono px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            title="Hide assessment details"
          >
            <span className="material-symbols-outlined text-[16px]">visibility_off</span>
            <span>Hide</span>
          </button>

          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant">
            <div className="text-right">
              <div className="text-[10px] text-on-surface-variant uppercase font-bold">Accuracy</div>
              <div className="text-xs font-bold text-green-700 font-mono">91% Validated</div>
            </div>
            <button
              onClick={() => setShowEvidenceModal(true)}
              className="bg-primary hover:bg-primary-container text-on-primary text-[11px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              Evidence
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 2. LEFT: Critical Region List (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-label-lg text-label-lg font-bold text-primary uppercase font-mono tracking-wider">
              Affected Sectors
            </h2>
            <span className="text-xs font-mono text-on-surface-variant">Ranked by Urgency</span>
          </div>

          <div className="space-y-3">
            {detailedRegionNeeds.map((region) => {
              const isSelected = region.id === selectedRegionId;
              const isCritical = region.severity === 'CRITICAL';

              return (
                <div
                  key={region.id}
                  onClick={() => setSelectedRegionId(region.id)}
                  className={`p-4 border rounded-xl transition-all cursor-pointer flex flex-col gap-2.5 ${
                    isSelected 
                      ? 'border-primary bg-surface ring-2 ring-primary/25 shadow-md' 
                      : 'border-outline-variant bg-surface hover:bg-surface-container-low'
                  }`}
                >
                  {/* Top Card Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="font-mono text-xs text-primary font-bold">{region.code}</strong>
                        <span className="text-xs text-on-surface-variant font-medium">• {region.name}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      isCritical ? 'bg-error-container text-on-error-container' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {region.severity}
                    </span>
                  </div>

                  {/* Impact Summary */}
                  <div className="grid grid-cols-3 gap-1.5 py-1.5 border-y border-outline-variant/60 text-[11px] font-mono text-on-surface-variant">
                    <div>
                      <span className="text-primary font-bold">{region.affectedPopulation.toLocaleString()}</span> affected
                    </div>
                    <div>
                      <span className="text-error font-bold">{region.isolatedPopulation.toLocaleString()}</span> cut off
                    </div>
                    <div>
                      <span className="text-primary font-bold">{100 - region.roadAccessibilityPct}%</span> blocked
                    </div>
                  </div>

                  {/* Immediate Shortage Pills */}
                  <div className="space-y-1">
                    {region.summaryNeeds.map((need, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs font-mono">
                        <span className="material-symbols-outlined text-[13px] text-on-surface-variant shrink-0">{need.icon}</span>
                        <span className={`font-bold ${need.color}`}>{need.text} Shortage</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3-8. RIGHT: Comprehensive Region Needs Assessment Panel (8 cols) */}
        <div ref={regionDetailsRef} className="lg:col-span-8 flex flex-col gap-6">
          
          {/* 3. Selected Region Overview Card */}
          <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-outline-variant pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-primary text-on-primary text-xs font-bold px-2 py-0.5 rounded font-mono">
                    {activeRegion.code}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${
                    activeRegion.severity === 'CRITICAL' ? 'bg-error-container text-on-error-container' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {activeRegion.severity}
                  </span>
                </div>
                <h2 className="font-headline-md text-headline-md font-bold text-primary">
                  {activeRegion.code} — {activeRegion.name}
                </h2>
                <p className="text-xs text-on-surface-variant font-mono">{activeRegion.district}</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-on-surface-variant uppercase font-bold">Priority Status</span>
                <div className={`font-display-lg text-[22px] sm:text-[26px] font-black font-mono ${
                  activeRegion.priorityLevel.includes('FULFILLED') || activeRegion.severity === 'MODERATE'
                    ? 'text-green-700'
                    : 'text-error'
                }`}>
                  {activeRegion.priorityLevel.includes('FULFILLED')
                    ? activeRegion.priorityLevel
                    : `${activeRegion.priorityLevel} — IMMEDIATE`}
                </div>
              </div>
            </div>

            {/* 6 Situation Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs font-mono">
              <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg">
                <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Affected Pop</span>
                <strong className="font-headline-sm text-base font-bold text-primary block mt-1">
                  {activeRegion.affectedPopulation.toLocaleString()}
                </strong>
              </div>
              <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg">
                <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Cut Off Pop</span>
                <strong className="font-headline-sm text-base font-bold text-error block mt-1">
                  {activeRegion.isolatedPopulation.toLocaleString()}
                </strong>
              </div>
              <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg">
                <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Medical Cases</span>
                <strong className="font-headline-sm text-base font-bold text-error block mt-1">
                  {activeRegion.criticalMedicalCases}
                </strong>
              </div>
              <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg">
                <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Road Access</span>
                <strong className="font-headline-sm text-base font-bold text-amber-700 block mt-1">
                  {activeRegion.roadAccessibilityPct}%
                </strong>
              </div>
              <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg">
                <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Mobile Signal</span>
                <strong className="font-headline-sm text-base font-bold text-primary block mt-1">
                  {activeRegion.communicationCoveragePct}%
                </strong>
              </div>
              <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg">
                <span className="text-on-surface-variant block text-[10px] uppercase font-bold">Clean Water</span>
                <strong className={`font-headline-sm text-base font-bold block mt-1 ${
                  activeRegion.safeWaterCoveragePct >= 80 ? 'text-green-700' : 'text-error'
                }`}>
                  {activeRegion.safeWaterCoveragePct}%
                </strong>
              </div>
            </div>
          </div>

          {/* 4. "WHY CRITICAL?" Section */}
          <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-xs">
            <h3 className="font-label-lg text-label-lg font-bold text-primary flex items-center gap-2 mb-3 border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined text-error text-[20px]">report_problem</span>
              <span>Why is this area high priority?</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {activeRegion.criticalityDrivers.map((driver, i) => (
                <div key={i} className="p-2.5 bg-surface-container-lowest border border-outline-variant/80 rounded-lg flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-error mt-1.5 shrink-0 inline-block" />
                  <span className="text-on-surface leading-snug">{driver}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. RESOURCE GAP LEDGER */}
          <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-xs flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-outline-variant pb-2">
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">inventory</span>
                  <span>Supplies Needed & Shortages</span>
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Current supply shortages that need to be dispatched.
                </p>
              </div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                activeRegion.resourceTable.filter(r => r.priority === 'P1').every(r => r.deficit.includes('FULFILLED') || r.deficit.startsWith('0'))
                  ? 'bg-green-100 text-green-800'
                  : 'bg-error-container text-on-error-container'
              }`}>
                {activeRegion.resourceTable.filter(r => r.priority === 'P1').every(r => r.deficit.includes('FULFILLED') || r.deficit.startsWith('0'))
                  ? 'P1 SHORTAGES FULFILLED ✓'
                  : 'SHORTAGES DETECTED'}
              </span>
            </div>

            <div className="overflow-x-auto border border-outline-variant rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse font-body-sm">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant">
                    <th className="py-2.5 px-3 font-bold">Supply / Resource</th>
                    <th className="py-2.5 px-3 font-bold text-right">Required</th>
                    <th className="py-2.5 px-3 font-bold text-right text-secondary">Available</th>
                    <th className="py-2.5 px-3 font-bold text-right text-error">Shortage (Gap)</th>
                    <th className="py-2.5 px-2.5 font-bold text-center">Priority</th>
                    <th className="py-2.5 px-3 font-bold text-right">Urgency Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/60">
                  {activeRegion.resourceTable.map((item, idx) => {
                    const isFulfilled = item.deficit.includes('FULFILLED') || item.deficit.startsWith('0');
                    return (
                      <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-2.5 px-3 font-bold text-primary font-mono">{item.resource}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-on-surface">{item.required}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-secondary font-semibold">{item.available}</td>
                        <td className={`py-2.5 px-3 text-right font-mono font-bold ${
                          isFulfilled ? 'text-green-700 bg-green-50/40' : 'text-error bg-error-container/10'
                        }`}>
                          {item.deficit}
                        </td>
                        <td className="py-2.5 px-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            isFulfilled ? 'bg-green-700 text-white' : item.priority === 'P1' ? 'bg-error text-on-error' : item.priority === 'P2' ? 'bg-amber-500 text-white' : 'bg-yellow-500 text-black'
                          }`}>
                            {isFulfilled ? '✓ OK' : item.priority}
                          </span>
                        </td>
                        <td className={`py-2.5 px-3 text-right font-mono text-xs font-semibold ${
                          isFulfilled ? 'text-green-700' : 'text-on-surface-variant'
                        }`}>
                          {item.timeToCritical}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. Operational Warning Cards (Reactively styled based on fulfillment) */}
          {(() => {
            const isWaterResolved = 
              activeRegion.waterCountdown.deficit.includes('0') ||
              activeRegion.waterCountdown.deficit.includes('Covered') ||
              activeRegion.waterCountdown.exhaustionTime.includes('RESOLVED') ||
              activeRegion.waterCountdown.deadline.includes('SECURED');

            const isMedicalResolved = 
              activeRegion.medicalWindow.deficit.includes('0') ||
              activeRegion.medicalWindow.deficit.includes('FULFILLED') ||
              activeRegion.medicalWindow.responseWindow.includes('COVERED') ||
              activeRegion.medicalWindow.responseWindow.includes('ADEQUATE');

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Water Countdown Card */}
                <div className={`rounded-xl p-4 shadow-xs flex flex-col justify-between gap-3 transition-colors ${
                  isWaterResolved 
                    ? 'bg-surface border-2 border-green-600/40' 
                    : 'bg-surface border-2 border-error/40'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[22px] ${isWaterResolved ? 'text-green-700' : 'text-primary'}`}>water_drop</span>
                      <span className="font-label-md text-label-md font-bold text-primary">DRINKING WATER STATUS</span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isWaterResolved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-error-container text-on-error-container'
                    }`}>
                      {isWaterResolved ? 'SUPPLY SECURED' : 'CRITICAL DEFICIT'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Current Water Stock:</span>
                      <strong className="text-primary">{activeRegion.waterCountdown.current}</strong>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Daily Amount Needed:</span>
                      <strong className="text-primary">{activeRegion.waterCountdown.required}</strong>
                    </div>
                    <div className={`flex justify-between font-bold pt-1 border-t border-outline-variant ${
                      isWaterResolved ? 'text-green-700' : 'text-error'
                    }`}>
                      <span>Shortfall Gap:</span>
                      <span>{activeRegion.waterCountdown.deficit}</span>
                    </div>
                  </div>

                  <div className={`rounded-lg p-2.5 text-center transition-colors ${
                    isWaterResolved 
                      ? 'bg-green-50/80 border border-green-200' 
                      : 'bg-error-container/20 border border-error/30'
                  }`}>
                    <div className="text-[10px] text-on-surface-variant uppercase font-bold">
                      {isWaterResolved ? 'Status' : 'Estimated Time Left'}
                    </div>
                    <div className={`font-display-lg text-[22px] font-black font-mono ${
                      isWaterResolved ? 'text-green-700' : 'text-error'
                    }`}>
                      {activeRegion.waterCountdown.exhaustionTime}
                    </div>
                    <div className={`text-[10px] font-bold mt-0.5 font-mono flex items-center justify-center gap-1 ${
                      isWaterResolved ? 'text-green-700' : 'text-error'
                    }`}>
                      {isWaterResolved ? (
                        <>
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          <span>{activeRegion.waterCountdown.deadline}</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-error inline-block animate-pulse shrink-0" />
                          <span>{activeRegion.waterCountdown.deadline}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Medical Window Card */}
                <div className={`rounded-xl p-4 shadow-xs flex flex-col justify-between gap-3 transition-colors ${
                  isMedicalResolved 
                    ? 'bg-surface border-2 border-green-600/40' 
                    : 'bg-surface border-2 border-error/40'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[22px] ${isMedicalResolved ? 'text-green-700' : 'text-error'}`}>
                        {isMedicalResolved ? 'medical_services' : 'emergency'}
                      </span>
                      <span className="font-label-md text-label-md font-bold text-primary">MEDICAL TRIAGE & EVACUATION</span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isMedicalResolved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-error-container text-on-error-container'
                    }`}>
                      {isMedicalResolved ? 'COVERAGE SECURED' : 'EVACUATION WINDOW'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Capacity Available:</span>
                      <strong className="text-primary">{activeRegion.medicalWindow.currentCapacity}</strong>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Peak Demand:</span>
                      <strong className="text-primary">{activeRegion.medicalWindow.demand}</strong>
                    </div>
                    <div className={`flex justify-between font-bold pt-1 border-t border-outline-variant ${
                      isMedicalResolved ? 'text-green-700' : 'text-error'
                    }`}>
                      <span>Remaining Deficit:</span>
                      <span>{activeRegion.medicalWindow.deficit}</span>
                    </div>
                  </div>

                  <div className={`rounded-lg p-2.5 text-center transition-colors ${
                    isMedicalResolved 
                      ? 'bg-green-50/80 border border-green-200' 
                      : 'bg-error-container/20 border border-error/30'
                  }`}>
                    <div className="text-[10px] text-on-surface-variant uppercase font-bold">
                      {isMedicalResolved ? 'Deployment Status' : 'Safe Response Window'}
                    </div>
                    <div className={`font-display-lg text-[22px] font-black font-mono ${
                      isMedicalResolved ? 'text-green-700' : 'text-error'
                    }`}>
                      {activeRegion.medicalWindow.responseWindow}
                    </div>
                    <div className={`text-[10px] font-bold mt-0.5 font-mono flex items-center justify-center gap-1 ${
                      isMedicalResolved ? 'text-green-700' : 'text-error'
                    }`}>
                      {isMedicalResolved ? (
                        <>
                          <span className="material-symbols-outlined text-[14px]">verified</span>
                          <span>All critical trauma and medical teams active on-site</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-error inline-block animate-pulse shrink-0" />
                          <span>Urgent boat/airlift evacuation required</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 7 & 9. Bottom Split: Impact & Needs Map + Recommended Response Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* 9. Impact & Needs Guwahati Map (6 cols) */}
            <div className="lg:col-span-6 bg-surface border border-outline-variant rounded-xl p-4 shadow-xs flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <h4 className="font-label-md text-label-md font-bold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">explore</span>
                  <span>Sector Map (Guwahati)</span>
                </h4>
                <span className="text-[10px] font-mono bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                  Interactive Bounds
                </span>
              </div>

              <ImpactNeedsMap
                selectedRegionId={selectedRegionId}
                onSelectRegion={(id) => setSelectedRegionId(id)}
                height="280px"
              />

              {(() => {
                const waterItem = activeRegion.resourceTable.find(r => r.resource.toLowerCase().includes('water'));
                const isWaterCovered = waterItem?.deficit.includes('FULFILLED') || waterItem?.deficit.startsWith('0');
                return (
                  <div className="text-[11px] text-on-surface-variant font-mono flex flex-wrap justify-between items-center gap-1">
                    <span>Selected: <strong>{activeRegion.name}</strong></span>
                    <span className={isWaterCovered ? "text-green-700 font-bold" : "text-error font-bold"}>
                      {isWaterCovered ? '✓ Water: 0 Deficit (Covered)' : `Water Deficit: ${waterItem?.deficit || ''}`}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* 7. Recommended Response Box (6 cols) */}
            {(() => {
              const isAllFulfilled = activeRegion.resourceTable
                .filter(r => r.priority === 'P1')
                .every(r => r.deficit.includes('FULFILLED') || r.deficit.startsWith('0'));

              return (
                <div className={`bg-surface rounded-xl p-5 shadow-sm flex flex-col justify-between gap-3 transition-colors ${
                  isAllFulfilled ? 'border-2 border-green-600/50' : 'border-2 border-primary'
                }`}>
                  <div>
                    <div className="flex justify-between items-center border-b border-outline-variant pb-2 mb-2">
                      <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[18px]">smart_toy</span>
                        <span>Recommended Action Plan</span>
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isAllFulfilled ? 'bg-green-700 text-white' : 'bg-primary text-on-primary'
                      }`}>
                        {isAllFulfilled ? '✓ P1 DEMANDS COVERED' : activeRegion.recommendedResponse.priority}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] text-on-surface-variant font-mono uppercase font-bold block">
                          Immediate Priority Action:
                        </span>
                        <ul className="space-y-1 font-medium mt-1">
                          {activeRegion.recommendedResponse.primaryDeploys.map((dep, i) => {
                            const isItemFulfilled = 
                              (dep.toLowerCase().includes('water') && (activeRegion.waterCountdown.deficit.includes('0') || activeRegion.waterCountdown.deficit.includes('Covered'))) ||
                              (dep.toLowerCase().includes('medical') && (activeRegion.medicalWindow.deficit.includes('0') || activeRegion.medicalWindow.deficit.includes('FULFILLED')));
                            return (
                              <li key={i} className={`flex items-start gap-1.5 ${isItemFulfilled ? 'text-green-700 font-semibold' : 'text-primary'}`}>
                                <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5">
                                  {isItemFulfilled ? 'check_circle' : 'arrow_right'}
                                </span>
                                <span>{dep} {isItemFulfilled ? '(Dispatched ✓)' : ''}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-outline-variant/60">
                        <span className="text-[10px] text-on-surface-variant font-mono uppercase font-bold block">
                          Secondary Supplies:
                        </span>
                        <ul className="space-y-1 text-on-surface-variant mt-1">
                          {activeRegion.recommendedResponse.secondaryDeploys.map((dep, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5 text-outline">arrow_right</span>
                              <span>{dep}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handleReviewAllocation}
                    className={`w-full font-label-md text-label-md py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors mt-2 ${
                      isAllFulfilled 
                        ? 'bg-green-700 hover:bg-green-800 text-white' 
                        : 'bg-primary hover:bg-primary-container text-on-primary'
                    }`}
                  >
                    <span>{isAllFulfilled ? `REVIEW / DISPATCH MORE FOR ${activeRegion.code}` : `ALLOCATE SUPPLIES FOR ${activeRegion.code}`}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              );
            })()}
          </div>

          {/* 8. Assessment Reliability & Evidence Footer Banner */}
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-green-700 text-[22px]">verified</span>
              <div>
                <strong className="text-primary block font-mono">Data Accuracy: 91% Validated</strong>
                <span className="text-on-surface-variant">
                  Verified from 42 Field Reports, 18 Satellite Passes, 7 Relief Camp reports, and 12 Water Sensors.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowEvidenceModal(true)}
              className="bg-surface hover:bg-surface-container-high text-primary border border-outline-variant px-3.5 py-1.5 rounded text-xs font-bold font-mono transition-colors cursor-pointer self-start sm:self-auto"
            >
              [ View Field Evidence ]
            </button>
          </div>

        </div>
      </div>

      {/* Evidence Dossier Intelligence Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-outline-variant rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto font-body-sm">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">fact_check</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                  Multi-Source Intelligence Evidence Dossier
                </h3>
              </div>
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="text-on-surface-variant hover:text-primary text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Every critical requirement is algorithmically cross-verified across five independent ground and satellite telemetry channels to eliminate false reports.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg">
                <div className="flex justify-between font-bold text-primary font-mono mb-1">
                  <span>✓ Field Officer SITREP (DEOC-FO-14)</span>
                  <span className="text-green-700">14:15 IST • GPS: 26.195°N, 91.715°E</span>
                </div>
                <p className="text-on-surface-variant">
                  Confirmed 1,510 residents isolated in Sector North-4; water treatment pumping station flooded under 1.8m backflow. Immediate drinking water bowsers required.
                </p>
              </div>

              <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg">
                <div className="flex justify-between font-bold text-primary font-mono mb-1">
                  <span>✓ RISAT-1A SAR Satellite Flood Mask</span>
                  <span className="text-green-700">13:40 IST • ISRO NRSC Telemetry</span>
                </div>
                <p className="text-on-surface-variant">
                  Synthetic Aperture Radar (SAR) detected 68% road network submersion along Saraighat North Bank Approach. Route impedance calculated at +320%.
                </p>
              </div>

              <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg">
                <div className="flex justify-between font-bold text-primary font-mono mb-1">
                  <span>✓ Camp Warden Log (Camp #04 North Campus)</span>
                  <span className="text-green-700">14:22 IST • Official Log</span>
                </div>
                <p className="text-on-surface-variant">
                  Current headcount 3,700 displaced persons against design limit of 4,000. Daily potable water reserve depleted to 12,500 L. Exhaustion estimated within 5.7 hours.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant flex justify-end">
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="bg-primary text-on-primary px-5 py-2 rounded-lg text-xs font-bold cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
