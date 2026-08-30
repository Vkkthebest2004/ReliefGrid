export interface DetailedRegionNeed {
  id: string;
  code: string;
  name: string;
  district: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  priorityLevel: 'P1' | 'P2' | 'P3' | 'P1 FULFILLED ✓' | 'P2 FULFILLED ✓' | 'P3 FULFILLED ✓';
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

export const INITIAL_DETAILED_REGIONS: DetailedRegionNeed[] = [
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
    priorityLevel: 'P1',
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
      { icon: 'sailing', text: '4 Rescue Teams', color: 'text-error' },
      { icon: 'water_drop', text: '8,000 L Water', color: 'text-error' },
      { icon: 'inventory_2', text: '500 Rations', color: 'text-amber-600' }
    ],
    resourceTable: [
      { resource: 'Rescue Teams', required: '6 teams', available: '2 teams', deficit: '-4 teams', priority: 'P1', timeToCritical: '< 3 Hours' },
      { resource: 'Medical Teams', required: '3 teams', available: '2 teams', deficit: '-1 team', priority: 'P1', timeToCritical: '< 5 Hours' },
      { resource: 'Safe Potable Water', required: '18,000 L/day', available: '10,000 L', deficit: '-8,000 L', priority: 'P1', timeToCritical: 'Exhausts in 08h 15m' },
      { resource: 'Meal Units (Rations)', required: '4,500 units', available: '4,000 units', deficit: '-500 units', priority: 'P2', timeToCritical: '< 14 Hours' },
      { resource: 'Generators (15kVA)', required: '4 units', available: '1 unit', deficit: '-3 units', priority: 'P3', timeToCritical: '< 18 Hours' }
    ],
    waterCountdown: {
      current: '10,000 L',
      required: '18,000 L',
      deficit: '8,000 L/day',
      exhaustionTime: '08h 15m',
      deadline: 'ACTION REQUIRED BEFORE 22:30 IST'
    },
    medicalWindow: {
      currentCapacity: '2 teams',
      demand: '3 teams',
      deficit: '1 team',
      responseWindow: '< 5 HOURS'
    },
    recommendedResponse: {
      priority: 'P1 — High Priority',
      primaryDeploys: [
        '4 search & rescue motorboats',
        '8,000 L potable water',
        '1 mobile clinic team'
      ],
      secondaryDeploys: [
        '500 food kits',
        '3 portable diesel generators'
      ],
      responseWindow: '< 8 Hours'
    }
  },
  {
    id: 'G-02',
    code: 'REGION G-02',
    name: 'Jalukbari & University Enclave',
    district: 'Guwahati West Circle (Kamrup Metro)',
    severity: 'HIGH',
    priorityLevel: 'P2',
    affectedPopulation: 5200,
    isolatedPopulation: 410,
    criticalMedicalCases: 42,
    roadAccessibilityPct: 65,
    communicationCoveragePct: 60,
    safeWaterCoveragePct: 70,
    criticalityDrivers: [
      'University residential quarters floodwaters receded; shelter stress elevated',
      'Temporary evacuees require bedding and food supplies',
      'Access road to NH-27 functional with minor waterlogging'
    ],
    summaryNeeds: [
      { icon: 'night_shelter', text: '400 Shelter Beds', color: 'text-amber-600' },
      { icon: 'water_drop', text: '4,500 L Water', color: 'text-amber-600' },
      { icon: 'bolt', text: '2 Generators', color: 'text-green-700' }
    ],
    resourceTable: [
      { resource: 'Shelter Spaces', required: '1,200 beds', available: '800 beds', deficit: '-400 beds', priority: 'P2', timeToCritical: '< 10 Hours' },
      { resource: 'Safe Potable Water', required: '14,500 L/day', available: '10,000 L', deficit: '-4,500 L', priority: 'P2', timeToCritical: 'Exhausts in 11h 00m' },
      { resource: 'Generators (15kVA)', required: '3 units', available: '1 unit', deficit: '-2 units', priority: 'P3', timeToCritical: '< 24 Hours' }
    ],
    waterCountdown: {
      current: '10,000 L',
      required: '14,500 L',
      deficit: '4,500 L/day',
      exhaustionTime: '11h 00m',
      deadline: 'STABILIZATION ACTION'
    },
    medicalWindow: {
      currentCapacity: '1 team',
      demand: '1 team',
      deficit: '0 teams',
      responseWindow: 'ADEQUATE'
    },
    recommendedResponse: {
      priority: 'P2 — Moderate Support',
      primaryDeploys: ['400 canvas camp beds', '4,500 L water tankers'],
      secondaryDeploys: ['2 diesel generators'],
      responseWindow: '< 12 Hours'
    }
  },
  {
    id: 'G-11',
    code: 'REGION G-11',
    name: 'Dispur Capital Complex & Super Market',
    district: 'Guwahati East Circle (Kamrup Metro)',
    severity: 'MODERATE',
    priorityLevel: 'P3',
    affectedPopulation: 3100,
    isolatedPopulation: 120,
    criticalMedicalCases: 15,
    roadAccessibilityPct: 88,
    communicationCoveragePct: 92,
    safeWaterCoveragePct: 82,
    criticalityDrivers: [
      'Institutional drainage backup near Super Market underpass',
      'Critical government data centers operating on backup power',
      'Relief requirements primarily secondary power & drainage pumps'
    ],
    summaryNeeds: [
      { icon: 'bolt', text: '2 Generators', color: 'text-amber-500' },
      { icon: 'local_shipping', text: '1 Water Tanker', color: 'text-green-700' }
    ],
    resourceTable: [
      { resource: 'Generators (15kVA)', required: '4 units', available: '2 units', deficit: '-2 units', priority: 'P3', timeToCritical: '< 18 Hours' },
      { resource: 'Safe Potable Water', required: '8,000 L/day', available: '6,000 L', deficit: '-2,000 L', priority: 'P3', timeToCritical: '< 20 Hours' }
    ],
    waterCountdown: {
      current: '6,000 L',
      required: '8,000 L',
      deficit: '2,000 L/day',
      exhaustionTime: '18h 30m',
      deadline: 'ROUTINE DISPATCH'
    },
    medicalWindow: {
      currentCapacity: '2 teams',
      demand: '2 teams',
      deficit: '0 teams',
      responseWindow: 'ADEQUATE'
    },
    recommendedResponse: {
      priority: 'P3 — Routine Logistics',
      primaryDeploys: ['2 mobile generators (15kVA)', '1 potable water tanker'],
      secondaryDeploys: ['De-silting pump unit'],
      responseWindow: '< 24 Hours'
    }
  }
];
