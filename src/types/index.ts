export type SeverityCategory = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type RoadStatus = 'ACCESSIBLE' | 'RESTRICTED' | 'BLOCKED';

export type ReportStatus = 'VERIFIED' | 'PENDING' | 'REJECTED' | 'CONFIRMATION_REQUESTED';

export type ReportSource = 
  | 'Field Officer'
  | 'Police Control Room'
  | 'District Hospital DEOC'
  | 'Citizen SOS / Helplines'
  | 'NGO Disaster Response'
  | 'Satellite & Sensor Telemetry';

export type ResourceCategory = 
  | 'SEARCH_AND_RESCUE'
  | 'MEDICAL'
  | 'RELIEF_COMMODITIES'
  | 'INFRASTRUCTURE';

export type OperationStatus = 
  | 'PLANNED'
  | 'DISPATCHED'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'ACTIVE'
  | 'COMPLETED';

export type DisasterType = 
  | 'Earthquake'
  | 'Flash Flood'
  | 'Cyclone'
  | 'Landslide'
  | 'Wildfire'
  | 'Chemical / Industrial'
  | 'Multi-Hazard Event';

export interface DisasterEvent {
  id: string;
  type: DisasterType;
  secondaryHazard: string;
  title: string;
  district: string;
  state: string;
  startedAt: string;
  intensity: 'Moderate' | 'Severe' | 'Critical';
  status: 'ACTIVE EMERGENCY' | 'CONTAINMENT' | 'STANDBY';
  description: string;
}

export interface Zone {
  id: string;
  code: string;
  name: string;
  blockName: string;
  lat: number;
  lng: number;
  coordinates: [number, number][]; // Polygon coords for GIS
  severityScore: number; // 0 - 100
  severityCategory: SeverityCategory;
  population: number;
  affectedPopulation: number;
  reportedCasualties: number;
  medicalUrgencyCases: number;
  infrastructureDamagePct: number;
  roadAccessStatus: RoadStatus;
  shelterCapacityPct: number;
  waterDeficitLiters: number;
  deteriorationTrend: 'RAPID' | 'STABLE' | 'IMPROVING' | 'CRITICAL_RISK';
  priorityRank: number;
  topNeeds: string[];
  lastUpdated: string;
  // Formula Components (Transparent Breakdown)
  populationImpactScore: number;
  infrastructureDamageScore: number;
  medicalUrgencyScore: number;
  accessibilityScore: number;
  disasterIntensityScore: number;
  timeCriticalityScore: number;
}

export interface IncidentReport {
  id: string;
  code: string;
  source: ReportSource;
  sourceReliabilityPct: number;
  zoneId: string;
  zoneName: string;
  timestamp: string;
  claim: string;
  details: string;
  reportedCasualties: number;
  reportedTrapped: number;
  confidenceScore: number; // 0 - 100
  status: ReportStatus;
  evidenceType: 'GPS_TAGGED_PHOTO' | 'RADIO_DISPATCH' | 'TELEMETRY' | 'VOICE_CALL' | 'FIELD_LOG';
  verifiedBy?: string;
  corroboratingCount: number;
  isContradictory?: boolean;
}

export interface ResourceItem {
  id: string;
  name: string;
  category: ResourceCategory;
  totalStock: number;
  available: number;
  deployed: number;
  inTransit: number;
  maintenance: number;
  unit: string;
  facilityId: string;
  facilityName: string;
}

export interface AllocationPlanItem {
  id: string;
  zoneId: string;
  zoneName: string;
  severityScore: number;
  population: number;
  resourceId: string;
  resourceName: string;
  category: ResourceCategory;
  quantity: number;
  unit: string;
  priority: SeverityCategory;
  reason: string;
  expectedImpact: 'High Impact' | 'Critical Stabilization' | 'Immediate Relief';
  status: 'RECOMMENDED' | 'APPROVED' | 'DISPATCHED' | 'ACTIVE' | 'COMPLETED';
  dispatchedAt?: string;
  etaMinutes?: number;
}

export interface RouteLogistics {
  id: string;
  origin: string;
  destination: string;
  zoneId: string;
  roadName: string;
  status: RoadStatus;
  originalEtaMin: number;
  currentEtaMin: number;
  delayMin: number;
  blockageReason?: string;
  detourAvailable: boolean;
  detourRouteName?: string;
  pathPoints: [number, number][];
  detourPoints?: [number, number][];
}

export interface Shelter {
  id: string;
  name: string;
  locationName: string;
  zoneId: string;
  capacity: number;
  occupancy: number;
  waterPct: number;
  foodPct: number;
  medicalPct: number;
  powerPct: number;
  status: 'NORMAL' | 'NEAR_CAPACITY' | 'OVERFLOW_RISK';
  recommendedRerouteTo?: string;
  contactPerson: string;
  phone: string;
}

export interface OperationTask {
  id: string;
  code: string;
  title: string;
  zoneId: string;
  zoneName: string;
  operationType: 'SEARCH_AND_RESCUE' | 'MEDICAL_AIRLIFT' | 'WATER_SUPPLY' | 'COMMODITY_DROP' | 'ROAD_CLEARANCE';
  teamName: string;
  personnelCount: number;
  assignedVehicles: string;
  status: OperationStatus;
  startedAt: string;
  etaMinutes: number;
  progressPct: number;
}

export interface ActivityTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'CRITICAL' | 'RESOURCE' | 'ROUTE' | 'SHELTER' | 'VERIFICATION' | 'SYSTEM';
  zoneId?: string;
}

export interface SimulationScenario {
  id: string;
  disasterType: DisasterType;
  secondaryHazard: string;
  intensity: number; // 0 - 100
  populationExposure: 'Moderate' | 'High' | 'Extreme';
  infraDamagePct: number;
  roadDisruptionPct: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  officerName: string;
  actionType: 'VERIFICATION' | 'ALLOCATION_APPROVED' | 'DISPATCH_ISSUED' | 'ROUTE_OVERRIDE' | 'SIMULATION_TRIGGER';
  summary: string;
  ipAddress: string;
  terminal: string;
}

export type ExtendedResourceCategory = 
  | 'ESSENTIAL_SUPPLIES'
  | 'MEDICAL'
  | 'RESCUE'
  | 'INFRASTRUCTURE'
  | 'PERSONNEL'
  | 'HUMAN_RESOURCES'
  | 'SEARCH_AND_RESCUE'
  | 'RELIEF_COMMODITIES';

export interface ResourceLocationItem {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  quantity: number;
  status: 'OPERATIONAL' | 'LIMITED' | 'STANDBY';
  dispatchCapacity: 'HIGH' | 'MEDIUM' | 'RESTRICTED';
}

export interface GovernmentResource {
  id: string;
  name: string;
  category: ExtendedResourceCategory;
  unit: string;
  totalAvailable: number;
  allocated: number;
  remaining: number;
  required: number;
  gap: number;
  reserved: number;
  inTransit: number;
  delivered: number;
  status: 'AVAILABLE' | 'RESERVED' | 'IN_TRANSIT' | 'ALLOCATED' | 'DELIVERED' | 'DEPLETED';
  locations: ResourceLocationItem[];
  recommendedAction?: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'STABLE';
}

export interface RegionRequirementItem {
  resourceId: string;
  resourceName: string;
  category: ExtendedResourceCategory;
  requiredQuantity: number;
  allocatedQuantity: number;
  remainingQuantity: number;
  unit: string;
  priority?: SeverityCategory | string;
  timeToCritical?: string;
}

export interface RegionNeedsAssessment {
  id: string;
  code: string;
  name: string;
  district: string;
  severity: SeverityCategory;
  populationAffected: number;
  isolatedPopulation?: number;
  urgencyLevel?: string;
  roadAccessibility?: string;
  sheltersRequired: number;
  medicalRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  accessibility: 'ACCESSIBLE' | 'LIMITED' | 'CUT_OFF';
  priorityScore: number;
  lat: number;
  lng: number;
  requirements: RegionRequirementItem[];
}

export interface ResourceDispatchMovement {
  id: string;
  resourceId: string;
  resourceName: string;
  quantity: number;
  unit: string;
  sourceLocation: string;
  targetRegionId: string;
  targetRegionName: string;
  transportType: 'All-Terrain Truck' | 'IAF Helicopter' | 'SDRF Inflatable Boat' | 'Emergency Ambulance' | 'Heavy Freight Logistics';
  status: 'ALLOCATED' | 'DISPATCHED' | 'IN_TRANSIT' | 'ARRIVED' | 'DELIVERED';
  etaHours: number;
  dispatchedAt: string;
  approvedBy: string;
  progressPct: number;
}

export type NavigationTab = 
  | 'national-gateway'
  | 'official-portal'
  | 'secure-login'
  | 'command-center'
  | 'resource-grid'
  | 'allocation-planner'
  | 'asset-inventory'
  | 'logistics-tracker'
  | 'region-assessment'
  | 'resource-allocation-analysis'
  | 'simulation-modeling'
  | 'live-map'
  | 'incident-intelligence'
  | 'severity-priority'
  | 'resource-management'
  | 'route-logistics'
  | 'shelter-operations'
  | 'response-operations'
  | 'simulation-control'
  | 'reports-audit'
  | 'citizen-portal'
  | 'citizen-sos'
  | 'shelter-node-operations';

// ==========================================
// 🚨 CITIZEN & VICTIM SOS DISTRESS TYPES
// ==========================================

export type WaterLevelStatus = 'KNEE_LEVEL' | 'WAIST_LEVEL' | 'CHEST_LEVEL' | 'ROOF_LEVEL' | 'SUBMERGED';

export type SOSBeaconStatus = 
  | 'BEACON_ACTIVE'
  | 'TRIAGE_VERIFIED'
  | 'RESCUE_DISPATCHED'
  | 'EN_ROUTE'
  | 'RESCUE_IN_PROGRESS'
  | 'EVACUATED_TO_SHELTER'
  | 'RESOLVED';

export interface SOSTimelineEntry {
  status: SOSBeaconStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface CitizenSOSTicket {
  id: string;
  citizenName: string;
  phone: string;
  lat: number;
  lng: number;
  landmark: string;
  district: string;
  zoneId: string;
  zoneName: string;
  trappedCount: number;
  waterLevel: WaterLevelStatus;
  hasInjured: boolean;
  hasInfants: boolean;
  hasElderly: boolean;
  medicalDescription?: string;
  triagePriorityScore: number; // 0 - 100
  status: SOSBeaconStatus;
  assignedUnit?: string;
  assignedUnitPhone?: string;
  etaMinutes?: number;
  createdAt: string;
  updatedAt: string;
  timeline: SOSTimelineEntry[];
}

export interface CitizenSupplyRequest {
  id: string;
  citizenName: string;
  phone: string;
  district: string;
  zoneId: string;
  address: string;
  familyCount: number;
  itemsRequested: string[];
  specialNeeds?: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'REQUESTED' | 'APPROVED' | 'IN_DELIVERY' | 'FULFILLED';
  createdAt: string;
}

export interface MissingPersonRecord {
  id: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastSeenLocation: string;
  district: string;
  photoUrl?: string;
  distinctFeatures: string;
  reporterName: string;
  reporterPhone: string;
  reporterRelation: string;
  status: 'MISSING' | 'LOCATED_SAFE' | 'IN_HOSPITAL' | 'AT_SHELTER';
  matchedShelterId?: string;
  matchedShelterName?: string;
  reportedAt: string;
  updatedAt: string;
}

export interface VolunteerRegistration {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  district: string;
  skills: string[];
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  availability: 'Full-Time' | 'Night-Shift' | 'On-Call';
  assignedCenterId?: string;
  assignedCenterName?: string;
  status: 'REGISTERED' | 'VERIFIED' | 'ACTIVE_ON_DUTY';
  registeredAt: string;
}

// ==========================================
// 🏥 RELIEF CENTRE & SHELTER NODE TYPES
// ==========================================

export interface ShelterInventoryItem {
  id: string;
  name: string;
  category: 'RATIONS' | 'WATER' | 'MEDICAL' | 'BEDDING' | 'HYGIENE' | 'POWER';
  quantity: number;
  unit: string;
  minThreshold: number;
  status: 'OPTIMAL' | 'LOW' | 'CRITICAL_DEFICIT';
  lastRestocked: string;
}

export interface ShelterIntakeRecord {
  id: string;
  shelterId: string;
  citizenName: string;
  aadhaarOrId: string;
  phone: string;
  familyMembersCount: number;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  assignedBedNumber: string;
  medicalCondition: string;
  dietaryNeeds: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'ACTIVE' | 'TRANSFERRED' | 'DISCHARGED';
}

export interface ShelterRestockOrder {
  id: string;
  shelterId: string;
  shelterName: string;
  district: string;
  zoneId: string;
  items: Array<{ name: string; quantity: number; unit: string; category: string }>;
  urgency: 'IMMEDIATE_4H' | 'URGENT_12H' | 'ROUTINE_24H';
  reason: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'DISPATCHED' | 'DELIVERED' | 'REJECTED';
  requestedBy: string;
  createdAt: string;
  etaMinutes?: number;
}

export interface ShelterStaffMember {
  id: string;
  shelterId: string;
  name: string;
  role: 'Camp Commander' | 'Doctor' | 'Nurse' | 'Logistics Officer' | 'Security / Police' | 'SDRF Lead';
  phone: string;
  shift: 'Day (08:00 - 20:00)' | 'Night (20:00 - 08:00)';
  status: 'ON_DUTY' | 'RESTING' | 'DEPLOYED_FIELD';
}

export interface ShelterNode {
  id: string;
  name: string;
  code: string;
  district: string;
  zoneId: string;
  address: string;
  lat: number;
  lng: number;
  officerInCharge: string;
  contactPhone: string;
  totalBedCapacity: number;
  currentOccupancy: number;
  occupancyBreakdown: {
    adultMen: number;
    adultWomen: number;
    children: number;
    infants: number;
    elderly: number;
    injured: number;
  };
  powerStatus: 'GRID_ACTIVE' | 'GENERATOR_BACKUP' | 'OUTAGE_CRITICAL';
  generatorFuelHours: number;
  waterReservesLiters: number;
  rationDaysRemaining: number;
  status: 'OPERATIONAL' | 'NEAR_CAPACITY' | 'OVERCROWDED' | 'EVACUATING' | 'ISOLATED';
  inventory: ShelterInventoryItem[];
  pendingDeliveries: number;
  lastInspected: string;
}

// ==========================================
// ⚡ REAL-TIME EVENT BUS & SYNC TYPES
// ==========================================

export type RealtimeEventType = 
  | 'SOS_BEACON_CREATED'
  | 'SOS_BEACON_UPDATED'
  | 'SHELTER_INTAKE_LOGGED'
  | 'SHELTER_RESTOCK_REQUESTED'
  | 'SHELTER_INVENTORY_UPDATED'
  | 'RESOURCE_ALLOCATION_APPROVED'
  | 'CONVOY_DISPATCHED'
  | 'ROAD_STATUS_CHANGED'
  | 'MISSING_PERSON_REPORTED'
  | 'MISSING_PERSON_LOCATED'
  | 'VOLUNTEER_REGISTERED'
  | 'SIMULATION_ADVANCED'
  | 'INCIDENT_VERIFIED'
  | 'SYSTEM_STATE_RESET';

export interface RealtimeSyncEvent<T = any> {
  id: string;
  type: RealtimeEventType;
  source: 'CITIZEN' | 'SHELTER_NODE' | 'COMMAND_CENTER' | 'LOGISTICS_HUB' | 'SIMULATION_ENGINE';
  timestamp: string;
  payload: T;
}


