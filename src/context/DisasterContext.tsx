import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { 
  DisasterEvent, 
  Zone, 
  IncidentReport, 
  ResourceItem, 
  AllocationPlanItem, 
  RouteLogistics, 
  RoadStatus,
  Shelter, 
  OperationTask, 
  ActivityTimelineEvent,
  AuditLogEntry,
  NavigationTab,
  DisasterType,
  GovernmentResource,
  RegionNeedsAssessment,
  ResourceDispatchMovement,
  CitizenSOSTicket,
  CitizenSupplyRequest,
  MissingPersonRecord,
  VolunteerRegistration,
  ShelterNode,
  ShelterIntakeRecord,
  ShelterRestockOrder,
  WaterLevelStatus,
  SOSBeaconStatus,
  RealtimeSyncEvent,
  UserRole,
  CitizenUser,
  ShelterCoordinatorUser
} from '../types';
import { citizenService } from '../services/citizenService';
import { shelterService } from '../services/shelterService';
import { realtimeSync } from '../services/realtimeSync';
import {
  INITIAL_DISASTER_EVENT,
  INITIAL_ZONES,
  INITIAL_REPORTS,
  INITIAL_RESOURCES,
  INITIAL_ALLOCATIONS,
  INITIAL_ROUTES,
  INITIAL_SHELTERS,
  INITIAL_OPERATIONS,
  INITIAL_TIMELINE,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';
import {
  INITIAL_GOVERNMENT_RESOURCES,
  INITIAL_REGION_ASSESSMENTS,
  INITIAL_DISPATCH_MOVEMENTS
} from '../data/governmentResourceData';
import {
  INITIAL_DETAILED_REGIONS,
  type DetailedRegionNeed
} from '../data/detailedRegionsData';
import {
  INITIAL_RAE_REQUIREMENTS,
  INITIAL_RAE_SOURCES,
  humanizeResource,
  type Requirement,
  type SupplySource,
  type AllocationProposal
} from '../services/allocationEngine';

export interface OfficerProfile {
  name: string;
  role: string;
  department: string;
  badgeNumber: string;
  jurisdiction: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  timestamp: string;
}

interface DisasterContextType {
  disasterEvent: DisasterEvent;
  setDisasterEvent: (evt: DisasterEvent) => void;
  zones: Zone[];
  selectedZone: Zone | null;
  setSelectedZone: (zone: Zone | null) => void;
  reports: IncidentReport[];
  verifyReport: (id: string) => void;
  rejectReport: (id: string) => void;
  requestConfirmation: (id: string) => void;
  addReport: (report: IncidentReport) => void;
  resources: ResourceItem[];
  allocations: AllocationPlanItem[];
  approveAllAllocations: () => void;
  approveSingleAllocation: (id: string) => void;
  modifyAllocationQuantity: (id: string, newQty: number) => void;
  rejectAllocation: (id: string) => void;
  routes: RouteLogistics[];
  toggleRouteBlockage: (routeId: string) => void;
  shelters: Shelter[];
  operations: OperationTask[];
  timeline: ActivityTimelineEvent[];
  auditLogs: AuditLogEntry[];
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  selectRole: (role: UserRole) => void;
  login: (officerId?: string, pass?: string) => void;
  loginAsOfficer: (officerId?: string, pass?: string) => void;
  loginAsShelterCoordinator: (shelterId?: string, coordinatorName?: string) => void;
  loginAsCitizen: (name?: string, phone?: string) => void;
  citizenUser: CitizenUser | null;
  shelterCoordinator: ShelterCoordinatorUser | null;
  switchRoleDirectly: (role: UserRole) => void;
  logout: () => void;
  officer: OfficerProfile;
  simulationStep: number;
  simulationPlaying: boolean;
  setSimulationPlaying: (playing: boolean) => void;
  advanceSimulationStep: () => void;
  setSimulationStepDirect: (step: number) => void;
  resetSimulation: () => void;
  triggerScenario: (type: DisasterType, intensity: 'Moderate' | 'Severe' | 'Critical') => void;
  isOptimizationModalOpen: boolean;
  setIsOptimizationModalOpen: (open: boolean) => void;
  situationChangeDetected: boolean;
  dismissSituationChangeAlert: () => void;
  recalculateOptimization: () => void;
  notifications: ActivityTimelineEvent[];
  clearNotifications: () => void;

  // ReliEd Grid Government Resource Management Module
  governmentResources: GovernmentResource[];
  regionAssessments: RegionNeedsAssessment[];
  dispatchMovements: ResourceDispatchMovement[];
  selectedRegion: RegionNeedsAssessment | null;
  setSelectedRegion: (region: RegionNeedsAssessment | null) => void;
  selectedGovernmentResource: GovernmentResource | null;
  setSelectedGovernmentResource: (res: GovernmentResource | null) => void;
  allocateGovernmentResource: (
    targetRegionId: string, 
    resourceId: string, 
    quantity: number, 
    sourceLocations: { locationId: string; quantity: number }[], 
    transportType: ResourceDispatchMovement['transportType'], 
    etaHours: number
  ) => void;
  updateDispatchStatus: (dispatchId: string, newStatus: ResourceDispatchMovement['status']) => void;

  // Real-Time Reactive RAE State & Full-System Synchronization
  detailedRegionNeeds: DetailedRegionNeed[];
  setDetailedRegionNeeds: React.Dispatch<React.SetStateAction<DetailedRegionNeed[]>>;
  raeRequirements: Requirement[];
  raeSources: SupplySource[];
  globalToast: ToastMessage | null;
  dismissToast: () => void;
  executeRAEProposal: (proposal: AllocationProposal, overrideQty?: number) => void;
  cancelRAEDeployment: (depId: string, proposalId: string, qty: number, sourceId: string, resourceType: string, regionId: string) => void;
  
  addGovernmentResource: (resource: Omit<GovernmentResource, 'id' | 'allocated' | 'remaining' | 'gap' | 'reserved' | 'inTransit' | 'delivered' | 'status'> & { initialLocationName?: string }) => void;
  removeGovernmentResource: (resourceId: string) => void;

  // 🚨 Citizen SOS & Distress Subsystem
  citizenSOSTickets: CitizenSOSTicket[];
  submitCitizenSOS: (params: {
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
  }) => CitizenSOSTicket;
  updateSOSTicket: (
    id: string,
    status: SOSBeaconStatus,
    note: string,
    assignedUnit?: string,
    assignedUnitPhone?: string,
    etaMinutes?: number
  ) => void;
  citizenSupplyRequests: CitizenSupplyRequest[];
  submitSupplyRequest: (params: Omit<CitizenSupplyRequest, 'id' | 'createdAt' | 'status'>) => void;
  missingPersons: MissingPersonRecord[];
  reportMissingPerson: (params: Omit<MissingPersonRecord, 'id' | 'reportedAt' | 'updatedAt' | 'status'>) => MissingPersonRecord;
  searchMissingPersons: (query: string) => MissingPersonRecord[];
  volunteers: VolunteerRegistration[];
  registerVolunteer: (params: Omit<VolunteerRegistration, 'id' | 'registeredAt' | 'status'>) => VolunteerRegistration;

  // 🏥 Relief Centre & Shelter Node Subsystem
  shelterNodes: ShelterNode[];
  selectedShelterNode: ShelterNode | null;
  setSelectedShelterNode: (shelter: ShelterNode | null) => void;
  intakeRecords: ShelterIntakeRecord[];
  registerCitizenIntake: (data: Omit<ShelterIntakeRecord, 'id' | 'checkInTime' | 'status'>) => ShelterIntakeRecord;
  restockOrders: ShelterRestockOrder[];
  requestShelterRestock: (data: Omit<ShelterRestockOrder, 'id' | 'createdAt' | 'status'>) => ShelterRestockOrder;
  updateRestockOrderStatus: (orderId: string, status: ShelterRestockOrder['status'], etaMinutes?: number) => void;
  updateShelterInventoryItem: (shelterId: string, itemId: string, newQty: number) => void;
  findNearestShelters: (lat: number, lng: number, maxKm?: number) => Array<ShelterNode & { distanceKm: number }>;

  // Slide-in / Slide-out Sidebar State
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  closeSidebar: () => void;
  resetScenario: () => void;
}

const DisasterContext = createContext<DisasterContextType | undefined>(undefined);

export const DisasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [disasterEvent, setDisasterEvent] = useState<DisasterEvent>(INITIAL_DISASTER_EVENT);
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(INITIAL_ZONES[0]);
  const [reports, setReports] = useState<IncidentReport[]>(INITIAL_REPORTS);
  const [resources] = useState<ResourceItem[]>(INITIAL_RESOURCES);
  const [allocations, setAllocations] = useState<AllocationPlanItem[]>(INITIAL_ALLOCATIONS);
  const [routes, setRoutes] = useState<RouteLogistics[]>(INITIAL_ROUTES);
  const [shelters] = useState<Shelter[]>(INITIAL_SHELTERS);
  const [operations] = useState<OperationTask[]>(INITIAL_OPERATIONS);
  const [timeline, setTimeline] = useState<ActivityTimelineEvent[]>(INITIAL_TIMELINE);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  
  // Government Resource Management Core State
  const [governmentResources, setGovernmentResources] = useState<GovernmentResource[]>(INITIAL_GOVERNMENT_RESOURCES);
  const [regionAssessments, setRegionAssessments] = useState<RegionNeedsAssessment[]>(INITIAL_REGION_ASSESSMENTS);
  const [dispatchMovements, setDispatchMovements] = useState<ResourceDispatchMovement[]>(INITIAL_DISPATCH_MOVEMENTS);
  const [selectedRegion, setSelectedRegion] = useState<RegionNeedsAssessment | null>(INITIAL_REGION_ASSESSMENTS[0]);
  const [selectedGovernmentResource, setSelectedGovernmentResource] = useState<GovernmentResource | null>(INITIAL_GOVERNMENT_RESOURCES[0]);
  
  // Reactive Needs Assessment & RAE Engine state
  const [detailedRegionNeeds, setDetailedRegionNeeds] = useState<DetailedRegionNeed[]>(INITIAL_DETAILED_REGIONS);
  // Navigation & Active Tab (Initial Landing on Access Gateway)
  const [activeTab, setActiveTab] = useState<NavigationTab>('role-selection');
  const [raeRequirements, setRaeRequirements] = useState<Requirement[]>(INITIAL_RAE_REQUIREMENTS);
  const [raeSources, setRaeSources] = useState<SupplySource[]>(INITIAL_RAE_SOURCES);
  const [globalToast, setGlobalToast] = useState<ToastMessage | null>(null);

  // Slide-in / Slide-out Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // 🚨 Citizen SOS, Supply Requests, Missing Persons & Volunteer States
  const [citizenSOSTickets, setCitizenSOSTickets] = useState<CitizenSOSTicket[]>(() => citizenService.getSOSTickets());
  const [citizenSupplyRequests, setCitizenSupplyRequests] = useState<CitizenSupplyRequest[]>(() => citizenService.getSupplyRequests());
  const [missingPersons, setMissingPersons] = useState<MissingPersonRecord[]>(() => citizenService.searchMissingPersons(''));
  const [volunteers, setVolunteers] = useState<VolunteerRegistration[]>(() => citizenService.getVolunteers());

  // 🏥 Relief Centre & Shelter Node Operations States
  const [shelterNodes, setShelterNodes] = useState<ShelterNode[]>(() => shelterService.getAllShelters());
  const [selectedShelterNode, setSelectedShelterNode] = useState<ShelterNode | null>(() => shelterService.getAllShelters()[0] || null);
  const [intakeRecords, setIntakeRecords] = useState<ShelterIntakeRecord[]>(() => shelterService.getIntakeRegistry());
  const [restockOrders, setRestockOrders] = useState<ShelterRestockOrder[]>(() => shelterService.getRestockOrders());

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const toggleSidebarCollapse = () => setIsSidebarCollapsed(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Auth state (Default false until session initialized on Access Gateway)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [citizenUser, setCitizenUser] = useState<CitizenUser | null>({
    id: 'CIT-GHY-091',
    name: 'Rahul Kalita',
    email: 'rahul.kalita@citizen.in',
    phone: '+91 98640-12345',
    status: 'SAFE',
    role: 'CITIZEN',
    createdAt: new Date().toISOString()
  });
  const [shelterCoordinator, setShelterCoordinator] = useState<ShelterCoordinatorUser | null>({
    id: 'COORD-001',
    name: 'Maj. Vikramjit Saikia',
    email: 'saikia.sdrf@assam.gov.in',
    phone: '+91 94350-88123',
    badgeNumber: 'SDRF-SC-4409',
    shelterId: 'SH-GHY-001',
    shelterName: 'Pandu Multi-Purpose Disaster Relief Camp #1',
    zoneId: 'Z-GHY-W-01',
    role: 'SHELTER_COORDINATOR'
  });
  const [officer] = useState<OfficerProfile>({
    name: 'P. Bora',
    role: 'District Emergency Response Officer',
    department: 'District Disaster Management Authority (DDMA)',
    badgeNumber: 'DDMA-AS-7402',
    jurisdiction: 'Guwahati (Kamrup Metro) District'
  });

  // Simulation & Optimization states
  const [simulationStep, setSimulationStep] = useState<number>(3);
  const [simulationPlaying, setSimulationPlaying] = useState<boolean>(false);
  const [isOptimizationModalOpen, setIsOptimizationModalOpen] = useState<boolean>(false);
  const [situationChangeDetected, setSituationChangeDetected] = useState<boolean>(false);

  const dismissToast = () => setGlobalToast(null);

  // Helper to append audit log
  const logAudit = (actionType: AuditLogEntry['actionType'], summary: string) => {
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST, 30 Aug 2026',
      officerName: `${officer.name} (${officer.role})`,
      actionType,
      summary,
      ipAddress: '10.142.8.24 (DEOC Internal Secure LAN)',
      terminal: 'CON-DEOC-01'
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Helper to add timeline event
  const addTimelineEvent = (title: string, description: string, type: ActivityTimelineEvent['type'], zoneId?: string) => {
    const newEvent: ActivityTimelineEvent = {
      id: `tl-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      title,
      description,
      type,
      zoneId
    };
    setTimeline(prev => [newEvent, ...prev]);
  };

  // Verify Incident Report
  const verifyReport = (reportId: string) => {
    setReports(prevReports => prevReports.map(rep => {
      if (rep.id === reportId) {
        return {
          ...rep,
          status: 'VERIFIED',
          confidenceScore: Math.min(100, rep.confidenceScore + 18),
          verifiedBy: `${officer.name} (${officer.role})`
        };
      }
      return rep;
    }));

    const targetReport = reports.find(r => r.id === reportId);
    if (targetReport) {
      logAudit('VERIFICATION', `Verified Report #${targetReport.code} for ${targetReport.zoneName}: "${targetReport.claim}"`);
      addTimelineEvent(`Incident Verified: ${targetReport.code}`, `Validated by ${officer.name} with field confidence ${targetReport.confidenceScore + 18}%`, 'VERIFICATION', targetReport.zoneId);
    }
  };

  const rejectReport = (reportId: string) => {
    setReports(prevReports => prevReports.map(rep => {
      if (rep.id === reportId) {
        return {
          ...rep,
          status: 'REJECTED',
          verifiedBy: `${officer.name} (${officer.role})`
        };
      }
      return rep;
    }));
    logAudit('VERIFICATION', `Rejected Incident Report #${reportId}`);
  };

  const requestConfirmation = (reportId: string) => {
    setReports(prevReports => prevReports.map(rep => {
      if (rep.id === reportId) {
        return {
          ...rep,
          status: 'CONFIRMATION_REQUESTED'
        };
      }
      return rep;
    }));
    logAudit('VERIFICATION', `Requested field officer re-confirmation for Report #${reportId}`);
  };

  const addReport = (report: IncidentReport) => {
    setReports(prev => [report, ...prev]);
    logAudit('VERIFICATION', `New Field SOS Report submitted from ${report.zoneName}: "${report.claim}"`);
    addTimelineEvent(`New SOS Reported: ${report.code}`, `Origin: ${report.source} • Status: ${report.status}`, 'CRITICAL', report.zoneId);
  };

  const approveAllAllocations = () => {
    setAllocations(prev => prev.map(a => ({ ...a, status: 'APPROVED' })));
    logAudit('ALLOCATION_APPROVED', `Batch approved all ${allocations.length} optimization dispatch vectors.`);
    addTimelineEvent(`Batch Dispatched: ${allocations.length} Resource Vectors`, `Authorized by Incident Commander for Immediate Transit`, 'RESOURCE');
  };

  const approveSingleAllocation = (id: string) => {
    setAllocations(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a));
    const item = allocations.find(a => a.id === id);
    if (item) {
      logAudit('ALLOCATION_APPROVED', `Approved dispatch of ${item.quantity} ${item.unit} of ${item.resourceName} to ${item.zoneName}`);
      addTimelineEvent(`Resource Dispatched: ${item.resourceName}`, `${item.quantity} ${item.unit} assigned to ${item.zoneName}`, 'RESOURCE', item.zoneId);
    }
  };

  const modifyAllocationQuantity = (id: string, newQty: number) => {
    setAllocations(prev => prev.map(a => a.id === id ? { ...a, quantity: newQty } : a));
    logAudit('ALLOCATION_APPROVED', `Modified dispatch quantity for plan item #${id} to ${newQty}`);
  };

  const rejectAllocation = (id: string) => {
    setAllocations(prev => prev.filter(a => a.id !== id));
    logAudit('ALLOCATION_APPROVED', `Rejected resource allocation plan item #${id}`);
  };

  const toggleRouteBlockage = (routeId: string) => {
    setRoutes(prev => prev.map(r => {
      if (r.id === routeId) {
        const nextStatus: RoadStatus = r.status === 'BLOCKED' ? 'ACCESSIBLE' : 'BLOCKED';
        return {
          ...r,
          status: nextStatus,
          speedKmh: nextStatus === 'BLOCKED' ? 0 : 45,
          delayMinutes: nextStatus === 'BLOCKED' ? 999 : 0
        };
      }
      return r;
    }));

    const targetRoute = routes.find(r => r.id === routeId);
    if (targetRoute) {
      const newStatus = targetRoute.status === 'BLOCKED' ? 'ACCESSIBLE' : 'BLOCKED';
      logAudit('ROUTE_OVERRIDE', `Changed corridor ${targetRoute.roadName} status to ${newStatus}`);
      addTimelineEvent(`Route Status Updated: ${targetRoute.roadName}`, `Corridor is now ${newStatus}. Transit times recalculated.`, 'ROUTE');
      setSituationChangeDetected(true);
    }
  };

  const advanceSimulationStep = () => {
    setSimulationStep(prev => (prev < 4 ? prev + 1 : 0));
  };

  const setSimulationStepDirect = (step: number) => {
    setSimulationStep(step);
  };

  const resetSimulation = () => {
    setSimulationStep(0);
    setSimulationPlaying(false);
  };

  const triggerScenario = (_type: DisasterType, _intensity: 'Moderate' | 'Severe' | 'Critical') => {
    setSituationChangeDetected(true);
  };

  const recalculateOptimization = () => {
    setSituationChangeDetected(false);
    setIsOptimizationModalOpen(true);
  };

  const allocateGovernmentResource = (
    targetRegionId: string, 
    resourceId: string, 
    quantity: number, 
    sourceLocations: { locationId: string; quantity: number }[], 
    transportType: ResourceDispatchMovement['transportType'], 
    etaHours: number
  ) => {
    setGovernmentResources(prev => prev.map(res => {
      if (res.id !== resourceId) return res;
      const newAllocated = res.allocated + quantity;
      const newRemaining = Math.max(0, res.totalAvailable - newAllocated);
      const newGap = Math.max(0, res.required - newAllocated);
      const updatedLocations = res.locations.map(loc => {
        const sourceMatch = sourceLocations.find(s => s.locationId === loc.id);
        if (!sourceMatch) return loc;
        return {
          ...loc,
          quantity: Math.max(0, loc.quantity - sourceMatch.quantity)
        };
      });
      return {
        ...res,
        allocated: newAllocated,
        remaining: newRemaining,
        gap: newGap,
        inTransit: res.inTransit + quantity,
        locations: updatedLocations
      };
    }));

    setRegionAssessments(prev => prev.map(reg => {
      if (reg.id !== targetRegionId) return reg;
      const updatedReqs = reg.requirements.map(req => {
        if (req.resourceId !== resourceId) return req;
        const newAlloc = req.allocatedQuantity + quantity;
        return {
          ...req,
          allocatedQuantity: newAlloc,
          remainingQuantity: Math.max(0, req.requiredQuantity - newAlloc)
        };
      });
      return {
        ...reg,
        requirements: updatedReqs
      };
    }));

    const targetReg = regionAssessments.find(r => r.id === targetRegionId);
    const targetRes = governmentResources.find(r => r.id === resourceId);
    const primarySource = sourceLocations.map(s => {
      const loc = targetRes?.locations.find(l => l.id === s.locationId);
      return loc ? `${loc.name} (${s.quantity} ${targetRes?.unit || ''})` : s.locationId;
    }).join(', ');

    const newMovement: ResourceDispatchMovement = {
      id: `dispatch-${Date.now()}`,
      resourceId,
      resourceName: targetRes?.name || 'Emergency Resource',
      quantity,
      unit: targetRes?.unit || 'units',
      sourceLocation: primarySource || 'Guwahati Central Distribution Depot',
      targetRegionId,
      targetRegionName: targetReg?.name || 'Sector 4 - Downtown Hub',
      transportType,
      status: 'DISPATCHED',
      etaHours,
      dispatchedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      approvedBy: `${officer.name} (${officer.badgeNumber})`,
      progressPct: 15
    };

    setDispatchMovements(prev => [newMovement, ...prev]);
    logAudit('ALLOCATION_APPROVED', `Authorized dispatch of ${quantity} ${targetRes?.unit || 'units'} of ${targetRes?.name} to ${targetReg?.name} via ${transportType}. ETA: ${etaHours}h.`);
    addTimelineEvent(`Dispatched: ${quantity} ${targetRes?.unit} of ${targetRes?.name}`, `Allocated from ${primarySource} to ${targetReg?.name} (${transportType})`, 'RESOURCE');
  };

  const updateDispatchStatus = (dispatchId: string, newStatus: ResourceDispatchMovement['status']) => {
    setDispatchMovements(prev => prev.map(d => {
      if (d.id !== dispatchId) return d;
      let progress = d.progressPct;
      if (newStatus === 'DISPATCHED') progress = 25;
      if (newStatus === 'IN_TRANSIT') progress = 65;
      if (newStatus === 'ARRIVED') progress = 90;
      if (newStatus === 'DELIVERED') progress = 100;
      return {
        ...d,
        status: newStatus,
        progressPct: progress
      };
    }));
  };

  // -------------------------------------------------------------------------
  // Unified End-to-End Real-Time RAE Allocation Execution Engine
  // -------------------------------------------------------------------------
  const executeRAEProposal = (proposal: AllocationProposal, overrideQty?: number) => {
    const qty = overrideQty ?? proposal.proposedQty;

    // 1. Deplete RAE Supply Source
    setRaeSources(prev => prev.map(s => {
      if (s.id !== proposal.sourceId) return s;
      return {
        ...s,
        inventory: s.inventory.map(item => {
          if (item.resourceType !== proposal.resourceType) return item;
          const newQty = Math.max(0, item.quantity - qty);
          return {
            ...item,
            quantity: newQty,
            status: newQty === 0 ? 'reserved' : item.status
          };
        })
      };
    }));

    // 2. Deplete Government Resources Master Ledger & Depots
    setGovernmentResources(prev => prev.map(res => {
      const isMatch = 
        (proposal.resourceType === 'rescue_team' && res.category === 'RESCUE') ||
        (proposal.resourceType === 'medical_team' && res.category === 'MEDICAL') ||
        (proposal.resourceType === 'water_liters_per_day' && (res.id === 'res-drinking-water' || res.name.toLowerCase().includes('water'))) ||
        (proposal.resourceType === 'meal_unit' && (res.id === 'res-food-kits' || res.name.toLowerCase().includes('food') || res.name.toLowerCase().includes('meal'))) ||
        (proposal.resourceType === 'shelter_space' && (res.id === 'res-tents' || res.name.toLowerCase().includes('tent') || res.name.toLowerCase().includes('blanket'))) ||
        (proposal.resourceType === 'generator' && (res.id === 'res-generators' || res.name.toLowerCase().includes('generator')));
      
      if (!isMatch) return res;

      const newAllocated = res.allocated + qty;
      const newRemaining = Math.max(0, res.totalAvailable - newAllocated);
      const newInTransit = res.inTransit + qty;
      const newGap = Math.max(0, res.required - newAllocated);

      const updatedLocations = res.locations.map((loc, idx) => {
        if (idx === 0 || loc.name.toLowerCase().includes(proposal.sourceName.toLowerCase().split(' ')[0])) {
          const depletedQty = Math.max(0, loc.quantity - qty);
          return {
            ...loc,
            quantity: depletedQty,
            status: (depletedQty === 0 ? 'DEPLETED' : loc.status) as any
          };
        }
        return loc;
      });

      return {
        ...res,
        allocated: newAllocated,
        remaining: newRemaining,
        inTransit: newInTransit,
        gap: newGap,
        locations: updatedLocations,
        status: newRemaining === 0 ? 'DEPLETED' : 'AVAILABLE'
      };
    }));

    // 3. Fulfill Detailed Region Needs & Update Countdown Warnings
    setDetailedRegionNeeds(prev => prev.map(reg => {
      const isTarget = reg.id === proposal.regionId || 
                       reg.name.toLowerCase().includes(proposal.regionName?.toLowerCase() || '') ||
                       (proposal.regionId === 'region-g04' && reg.id === 'G-04') ||
                       (proposal.regionId === 'region-g07' && reg.id === 'G-07') ||
                       (proposal.regionId === 'region-g02' && reg.id === 'G-02') ||
                       (proposal.regionId === 'region-g11' && reg.id === 'G-11');

      if (!isTarget) return reg;

      const updatedResourceTable = reg.resourceTable.map(row => {
        const isResourceMatch = 
          (proposal.resourceType === 'rescue_team' && row.resource.toLowerCase().includes('rescue')) ||
          (proposal.resourceType === 'medical_team' && row.resource.toLowerCase().includes('medical')) ||
          (proposal.resourceType === 'water_liters_per_day' && row.resource.toLowerCase().includes('water')) ||
          (proposal.resourceType === 'meal_unit' && row.resource.toLowerCase().includes('meal')) ||
          (proposal.resourceType === 'shelter_space' && row.resource.toLowerCase().includes('shelter')) ||
          (proposal.resourceType === 'generator' && row.resource.toLowerCase().includes('generator'));

        if (!isResourceMatch) return row;

        const reqNum = parseInt(row.required.replace(/[^0-9]/g, '')) || 1;
        const curAvail = parseInt(row.available.replace(/[^0-9]/g, '')) || 0;
        const newAvail = curAvail + qty;
        const unitStr = row.required.replace(/[0-9,\s]/g, '');

        if (newAvail >= reqNum) {
          return {
            ...row,
            available: `${newAvail.toLocaleString()} ${unitStr}`,
            deficit: `0 (FULFILLED ✓)`,
            timeToCritical: `✓ Demand Fulfilled`
          };
        } else {
          const remainingDeficit = reqNum - newAvail;
          return {
            ...row,
            available: `${newAvail.toLocaleString()} ${unitStr}`,
            deficit: `-${remainingDeficit.toLocaleString()} ${unitStr}`,
            timeToCritical: `Deficit reduced (${newAvail}/${reqNum})`
          };
        }
      });

      let updatedWater = { ...reg.waterCountdown };
      if (proposal.resourceType === 'water_liters_per_day') {
        const curWater = parseInt(reg.waterCountdown.current.replace(/[^0-9]/g, '')) || 12500;
        const newWater = curWater + qty;
        const reqWater = parseInt(reg.waterCountdown.required.replace(/[^0-9]/g, '')) || 27720;
        if (newWater >= reqWater) {
          updatedWater = {
            current: `${newWater.toLocaleString()} L`,
            required: reg.waterCountdown.required,
            deficit: `0 L/day (Fully Covered)`,
            exhaustionTime: `RESOLVED ✓`,
            deadline: `✓ SAFE POTABLE WATER SECURED`
          };
        } else {
          updatedWater = {
            ...reg.waterCountdown,
            current: `${newWater.toLocaleString()} L`,
            deficit: `${(reqWater - newWater).toLocaleString()} L/day`
          };
        }
      }

      let updatedMedical = { ...reg.medicalWindow };
      if (proposal.resourceType === 'medical_team') {
        updatedMedical = {
          currentCapacity: `Covered (+${qty} teams)`,
          demand: reg.medicalWindow.demand,
          deficit: `0 units (FULFILLED ✓)`,
          responseWindow: `✓ DEPLOYED & COVERED`
        };
      }

      const allCriticalFulfilled = updatedResourceTable
        .filter(r => r.priority === 'P1')
        .every(r => r.deficit.includes('FULFILLED') || r.deficit.startsWith('0'));

      // Dynamically update sector summary badges
      const updatedSummaryNeeds = reg.summaryNeeds.map(need => {
        if (proposal.resourceType === 'rescue_team' && (need.text.toLowerCase().includes('rescue') || need.text.toLowerCase().includes('boat'))) {
          return { icon: 'sailing', text: `✓ ${qty} Rescue Teams Dispatched`, color: 'text-green-700 font-bold' };
        }
        if (proposal.resourceType === 'meal_unit' && (need.text.toLowerCase().includes('food') || need.text.toLowerCase().includes('meal'))) {
          return { icon: 'inventory_2', text: `✓ ${qty.toLocaleString()} Food Kits Dispatched`, color: 'text-green-700 font-bold' };
        }
        if (proposal.resourceType === 'water_liters_per_day' && need.text.toLowerCase().includes('water')) {
          return { icon: 'water_drop', text: `✓ ${qty.toLocaleString()}L Water Dispatched`, color: 'text-green-700 font-bold' };
        }
        if (proposal.resourceType === 'medical_team' && (need.text.toLowerCase().includes('medical') || need.text.toLowerCase().includes('medic'))) {
          return { icon: 'medical_services', text: `✓ ${qty} Medical Teams Dispatched`, color: 'text-green-700 font-bold' };
        }
        return need;
      });

      return {
        ...reg,
        resourceTable: updatedResourceTable,
        summaryNeeds: updatedSummaryNeeds,
        waterCountdown: updatedWater,
        medicalWindow: updatedMedical,
        priorityLevel: allCriticalFulfilled ? ('P1 FULFILLED ✓' as any) : reg.priorityLevel,
        severity: allCriticalFulfilled ? 'MODERATE' : reg.severity
      };
    }));

    // 4. Update RAE Requirements Available Quantity
    setRaeRequirements(prev => prev.map(req => {
      if (req.id !== proposal.requirementId) return req;
      return {
        ...req,
        availableQty: req.availableQty + qty
      };
    }));

    // 5. Update Command Center GIS Zones
    setZones(prev => prev.map(z => {
      if (z.id === 'zone-07' && proposal.resourceType === 'water_liters_per_day') {
        return {
          ...z,
          waterDeficitLiters: Math.max(0, z.waterDeficitLiters - qty),
          severityScore: Math.max(30, z.severityScore - 25)
        };
      }
      return z;
    }));

    // 6. Spawn Live Logistics Dispatch Movement
    const newDispatch: ResourceDispatchMovement = {
      id: `disp-rae-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      resourceId: proposal.resourceType,
      resourceName: `${qty} ${humanizeResource(proposal.resourceType)}`,
      quantity: qty,
      unit: 'units',
      sourceLocation: proposal.sourceName,
      targetRegionId: proposal.regionId,
      targetRegionName: proposal.regionName || 'Guwahati Flood Sector',
      transportType: proposal.resourceType === 'rescue_team' ? 'SDRF Inflatable Boat' : 'All-Terrain Truck',
      status: 'IN_TRANSIT',
      etaHours: Math.max(0.5, Math.round((proposal.etaMinutes / 60) * 10) / 10),
      dispatchedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      approvedBy: `${officer.name} (${officer.badgeNumber})`,
      progressPct: 35
    };
    setDispatchMovements(prev => [newDispatch, ...prev]);

    // 7. Global Toast Notification
    setGlobalToast({
      id: Date.now().toString(),
      title: 'ALLOCATION AUTHORIZED & DISPATCHED',
      message: `Dispatched ${qty} ${humanizeResource(proposal.resourceType)} from ${proposal.sourceName} to ${proposal.regionName || 'Target Region'}. Live depot inventory depleted and region deficit updated.`,
      type: 'success',
      timestamp: 'Just now'
    });

    // 8. Audit & Timeline
    logAudit('ALLOCATION_APPROVED', `Authorized deployment of ${qty} ${humanizeResource(proposal.resourceType)} from ${proposal.sourceName} to ${proposal.regionName}.`);
    addTimelineEvent(`Dispatched: ${qty} ${humanizeResource(proposal.resourceType)}`, `Sourced from ${proposal.sourceName} to ${proposal.regionName}`, 'RESOURCE');
  };

  // -------------------------------------------------------------------------
  // 60-Second Undo Deployment Action
  // -------------------------------------------------------------------------
  const cancelRAEDeployment = (
    depId: string, 
    _proposalId: string, 
    qty: number, 
    sourceId: string, 
    resourceType: string, 
    regionId: string
  ) => {
    // 1. Restore Source Inventory
    setRaeSources(prev => prev.map(s => {
      if (s.id !== sourceId) return s;
      return {
        ...s,
        inventory: s.inventory.map(item => {
          if (item.resourceType !== resourceType) return item;
          return {
            ...item,
            quantity: item.quantity + qty,
            status: 'free'
          };
        })
      };
    }));

    // 2. Restore Government Resources
    setGovernmentResources(prev => prev.map(res => {
      const isMatch = 
        (resourceType === 'rescue_team' && res.category === 'RESCUE') ||
        (resourceType === 'medical_team' && res.category === 'MEDICAL') ||
        (resourceType === 'water_liters_per_day' && (res.id === 'res-drinking-water' || res.name.toLowerCase().includes('water')));
      
      if (!isMatch) return res;

      return {
        ...res,
        allocated: Math.max(0, res.allocated - qty),
        remaining: res.remaining + qty,
        inTransit: Math.max(0, res.inTransit - qty)
      };
    }));

    // 3. Remove Dispatch Movement
    setDispatchMovements(prev => prev.filter(d => d.id !== depId));

    // 4. Restore Detailed Region Needs
    setDetailedRegionNeeds(prev => prev.map(reg => {
      if (reg.id !== regionId && !reg.name.toLowerCase().includes(regionId.toLowerCase())) return reg;
      const updatedTable = reg.resourceTable.map(row => {
        if (resourceType === 'rescue_team' && row.resource.toLowerCase().includes('rescue')) {
          const curAvail = parseInt(row.available.replace(/[^0-9]/g, '')) || 8;
          const restored = Math.max(3, curAvail - qty);
          return {
            ...row,
            available: `${restored} teams`,
            deficit: `-${8 - restored} teams`,
            timeToCritical: '< 2 Hours'
          };
        }
        return row;
      });
      return {
        ...reg,
        resourceTable: updatedTable,
        priorityLevel: 'P1'
      };
    }));

    // 5. Toast Notification
    setGlobalToast({
      id: Date.now().toString(),
      title: 'DEPLOYMENT CANCELLED',
      message: `Deployment cancelled within safety window. ${qty} ${humanizeResource(resourceType)} restored to source depot.`,
      type: 'warning',
      timestamp: 'Just now'
    });

    logAudit('ALLOCATION_APPROVED', `Cancelled deployment #${depId} within 60s safety window.`);
  };

  const resetScenario = () => {
    setDetailedRegionNeeds(INITIAL_DETAILED_REGIONS);
    setGovernmentResources(INITIAL_GOVERNMENT_RESOURCES);
    setRaeRequirements(INITIAL_RAE_REQUIREMENTS);
    setRaeSources(INITIAL_RAE_SOURCES);
    setDispatchMovements([]);
    setZones(INITIAL_ZONES);
    setAllocations(INITIAL_ALLOCATIONS);
    setGlobalToast({
      id: Date.now().toString(),
      title: 'INCIDENT SIMULATION RESET',
      message: 'Restored 100% capacity to all regional depots. All critical zone requirements re-opened for new decision run.',
      type: 'info',
      timestamp: 'Just now'
    });
    logAudit('ALLOCATION_APPROVED', 'Reset incident scenario to fresh unallocated state.');
  };

  const dismissSituationChangeAlert = () => setSituationChangeDetected(false);
  const clearNotifications = () => setTimeline([]);

  const selectRole = (role: UserRole) => {
    setUserRole(role);
  };

  const login = (officerId?: string) => {
    setIsAuthenticated(true);
    setUserRole('OFFICER');
    logAudit('VERIFICATION', `Officer authenticated: ${officerId || officer.badgeNumber}`);
    resetScenario();
  };

  const loginAsOfficer = (officerId?: string) => {
    setIsAuthenticated(true);
    setUserRole('OFFICER');
    logAudit('VERIFICATION', `Officer session started for ID: ${officerId || officer.badgeNumber}`);
  };

  const loginAsShelterCoordinator = (shelterId?: string, coordinatorName?: string) => {
    setIsAuthenticated(true);
    setUserRole('SHELTER_COORDINATOR');
    const target = shelterNodes.find(s => s.id === shelterId) || shelterNodes[0];
    if (target) setSelectedShelterNode(target);
    if (coordinatorName) {
      setShelterCoordinator(prev => prev ? { 
        ...prev, 
        name: coordinatorName, 
        shelterId: target?.id || prev.shelterId, 
        shelterName: target?.name || prev.shelterName,
        zoneId: target?.zoneId || prev.zoneId 
      } : prev);
    }
  };

  const loginAsCitizen = (name?: string, phone?: string) => {
    setIsAuthenticated(true);
    setUserRole('CITIZEN');
    if (name || phone) {
      setCitizenUser(prev => ({
        id: prev?.id || `CIT-${Date.now().toString().slice(-4)}`,
        name: name || prev?.name || 'Citizen User',
        email: prev?.email || 'citizen@reliefgrid.in',
        phone: phone || prev?.phone || '+91 98640-12345',
        status: 'SAFE',
        role: 'CITIZEN',
        createdAt: prev?.createdAt || new Date().toISOString()
      }));
    }
  };

  const switchRoleDirectly = (role: UserRole) => {
    setUserRole(role);
    if (role === 'OFFICER') {
      setActiveTab('command-center');
    } else if (role === 'SHELTER_COORDINATOR') {
      setActiveTab('shelter-dashboard');
    } else {
      setActiveTab('citizen-home');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setActiveTab('role-selection');
    resetScenario();
  };

  // -------------------------------------------------------------------------
  // Manual Asset Management: Add and Remove Inventory
  // -------------------------------------------------------------------------
  const addGovernmentResource = (
    newRes: Omit<GovernmentResource, 'id' | 'allocated' | 'remaining' | 'gap' | 'reserved' | 'inTransit' | 'delivered' | 'status'> & { initialLocationName?: string }
  ) => {
    const id = `res-custom-${Date.now()}`;
    const locationName = newRes.initialLocationName || 'Guwahati Central Warehouse';
    const resource: GovernmentResource = {
      ...newRes,
      id,
      allocated: 0,
      remaining: newRes.totalAvailable,
      required: newRes.required || 0,
      gap: newRes.required || 0,
      reserved: 0,
      inTransit: 0,
      delivered: 0,
      status: 'AVAILABLE',
      urgency: newRes.urgency || 'HIGH',
      locations: newRes.locations?.length ? newRes.locations : [
        {
          id: `loc-${Date.now()}`,
          name: locationName,
          district: 'Kamrup Metro',
          lat: 26.155,
          lng: 91.745,
          quantity: newRes.totalAvailable,
          status: 'OPERATIONAL',
          dispatchCapacity: 'HIGH'
        }
      ]
    };

    setGovernmentResources(prev => [resource, ...prev]);

    setGlobalToast({
      id: Date.now().toString(),
      title: 'Resource Asset Added',
      message: `Successfully added ${resource.totalAvailable.toLocaleString()} ${resource.unit} of ${resource.name} to ${locationName}.`,
      type: 'success',
      timestamp: 'Just now'
    });
  };

  const removeGovernmentResource = (resourceId: string) => {
    const target = governmentResources.find(r => r.id === resourceId);
    setGovernmentResources(prev => prev.filter(r => r.id !== resourceId));

    if (target) {
      setGlobalToast({
        id: Date.now().toString(),
        title: 'Resource Asset Removed',
        message: `Removed ${target.name} from inventory ledger.`,
        type: 'info',
        timestamp: 'Just now'
      });
    }
  };

  // 🚨 Citizen SOS Action Handlers
  const submitCitizenSOS = useCallback((params: {
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
  }): CitizenSOSTicket => {
    const ticket = citizenService.submitSOSBeacon(params);
    setCitizenSOSTickets(citizenService.getSOSTickets());
    
    // Automatically add an Incident Report to the Common Operating Picture
    const newReport: IncidentReport = {
      id: `rep-sos-${ticket.id}`,
      code: ticket.id,
      source: 'Citizen SOS / Helplines',
      sourceReliabilityPct: 95,
      zoneId: ticket.zoneId,
      zoneName: ticket.zoneName,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST, 30 Aug',
      claim: `EMERGENCY SOS: ${ticket.trappedCount} person(s) trapped at ${ticket.waterLevel.replace('_', ' ')}. ${ticket.hasInjured ? 'Injured reported.' : ''}`,
      details: `${ticket.landmark}. Contact: ${ticket.citizenName} (${ticket.phone}). ${ticket.medicalDescription || ''}`,
      reportedCasualties: ticket.hasInjured ? 1 : 0,
      reportedTrapped: ticket.trappedCount,
      confidenceScore: 92,
      status: 'VERIFIED',
      evidenceType: 'GPS_TAGGED_PHOTO',
      corroboratingCount: 1,
      verifiedBy: 'Automated AI Triage'
    };

    setReports(prev => [newReport, ...prev]);

    // Update target zone severity
    setZones(prevZones => prevZones.map(z => {
      if (z.id === ticket.zoneId) {
        return {
          ...z,
          medicalUrgencyCases: z.medicalUrgencyCases + (ticket.hasInjured ? 1 : 0),
          affectedPopulation: z.affectedPopulation + ticket.trappedCount,
          severityScore: Math.min(100, z.severityScore + 3)
        };
      }
      return z;
    }));

    setGlobalToast({
      id: `toast-${Date.now()}`,
      title: `🚨 Emergency SOS Beacon: ${ticket.id}`,
      message: `${ticket.citizenName} reported ${ticket.trappedCount} trapped at ${ticket.landmark} (${ticket.zoneName})`,
      type: 'warning',
      timestamp: 'Just now'
    });

    logAudit('VERIFICATION', `Auto-triaged Emergency SOS Beacon #${ticket.id} (${ticket.zoneName}) with Score ${ticket.triagePriorityScore}/100`);
    addTimelineEvent(`Citizen SOS Beacon: ${ticket.id}`, `${ticket.trappedCount} trapped at ${ticket.landmark}. Priority: ${ticket.triagePriorityScore}/100`, 'CRITICAL', ticket.zoneId);

    return ticket;
  }, [officer]);

  const updateSOSTicket = useCallback((
    id: string,
    status: SOSBeaconStatus,
    note: string,
    assignedUnit?: string,
    assignedUnitPhone?: string,
    etaMinutes?: number
  ) => {
    const updated = citizenService.updateSOSTicketStatus(id, status, note, assignedUnit, assignedUnitPhone, etaMinutes, officer.name);
    if (updated) {
      setCitizenSOSTickets(citizenService.getSOSTickets());
      addTimelineEvent(`SOS Status Updated: ${id}`, `Status changed to ${status}. Assigned: ${assignedUnit || 'N/A'}`, 'CRITICAL', updated.zoneId);
      logAudit('DISPATCH_ISSUED', `Updated SOS Ticket #${id} to ${status}. Unit: ${assignedUnit || 'N/A'}`);
      setGlobalToast({
        id: `toast-${Date.now()}`,
        title: `SOS Ticket #${id} Updated`,
        message: `Status: ${status} | Assigned: ${assignedUnit || 'Team'}`,
        type: 'success',
        timestamp: 'Just now'
      });
    }
  }, [officer]);

  const submitSupplyRequest = useCallback((params: Omit<CitizenSupplyRequest, 'id' | 'createdAt' | 'status'>) => {
    citizenService.submitSupplyRequest(params);
    setCitizenSupplyRequests(citizenService.getSupplyRequests());
    setGlobalToast({
      id: `toast-${Date.now()}`,
      title: '📦 Supply Requisition Submitted',
      message: `Request logged for ${params.citizenName} (${params.familyCount} members) in ${params.district}`,
      type: 'info',
      timestamp: 'Just now'
    });
  }, []);

  const reportMissingPerson = useCallback((params: Omit<MissingPersonRecord, 'id' | 'reportedAt' | 'updatedAt' | 'status'>): MissingPersonRecord => {
    const record = citizenService.reportMissingPerson(params);
    setMissingPersons(citizenService.searchMissingPersons(''));
    setGlobalToast({
      id: `toast-${Date.now()}`,
      title: '🔍 Missing Person Case Filed',
      message: `${record.fullName} (Age ${record.age}) reported from ${record.district}. Registry cross-check initiated.`,
      type: record.status === 'AT_SHELTER' ? 'success' : 'warning',
      timestamp: 'Just now'
    });
    return record;
  }, []);

  const searchMissingPersons = useCallback((query: string): MissingPersonRecord[] => {
    return citizenService.searchMissingPersons(query);
  }, []);

  const registerVolunteer = useCallback((params: Omit<VolunteerRegistration, 'id' | 'registeredAt' | 'status'>): VolunteerRegistration => {
    const vol = citizenService.registerVolunteer(params);
    setVolunteers(citizenService.getVolunteers());
    setGlobalToast({
      id: `toast-${Date.now()}`,
      title: '🤝 Volunteer Registered',
      message: `Thank you ${vol.fullName}! Enrolled for ${vol.district} relief operations.`,
      type: 'success',
      timestamp: 'Just now'
    });
    return vol;
  }, []);

  // 🏥 Shelter Operations Handlers
  const registerCitizenIntake = useCallback((data: Omit<ShelterIntakeRecord, 'id' | 'checkInTime' | 'status'>): ShelterIntakeRecord => {
    const record = shelterService.registerCitizenIntake(data);
    setIntakeRecords(shelterService.getIntakeRegistry());
    setShelterNodes(shelterService.getAllShelters());
    
    // Auto cross-match with missing persons
    const missing = citizenService.searchMissingPersons(data.citizenName);
    if (missing.length > 0) {
      missing.forEach(m => {
        m.status = 'AT_SHELTER';
        m.matchedShelterId = data.shelterId;
      });
      setMissingPersons(citizenService.searchMissingPersons(''));
    }

    setGlobalToast({
      id: `toast-${Date.now()}`,
      title: '🏥 Shelter Intake Logged',
      message: `${record.citizenName} (+${record.familyMembersCount - 1} family members) registered at bed ${record.assignedBedNumber}`,
      type: 'success',
      timestamp: 'Just now'
    });

    return record;
  }, []);

  const requestShelterRestock = useCallback((data: Omit<ShelterRestockOrder, 'id' | 'createdAt' | 'status'>): ShelterRestockOrder => {
    const order = shelterService.requestRestock(data);
    setRestockOrders(shelterService.getRestockOrders());
    setShelterNodes(shelterService.getAllShelters());

    setGlobalToast({
      id: `toast-${Date.now()}`,
      title: `🏥 Restock Order #${order.id}`,
      message: `${order.shelterName} requested ${order.items.length} critical commodity lines (${order.urgency})`,
      type: 'warning',
      timestamp: 'Just now'
    });

    logAudit('ALLOCATION_APPROVED', `Shelter Requisition #${order.id} submitted for ${order.shelterName}`);
    addTimelineEvent(`Shelter Restock Requested: ${order.id}`, `${order.shelterName}: ${order.reason}`, 'SHELTER', order.zoneId);

    return order;
  }, [officer]);

  const updateRestockOrderStatus = useCallback((orderId: string, status: ShelterRestockOrder['status'], etaMinutes?: number) => {
    shelterService.updateRestockStatus(orderId, status, etaMinutes);
    setRestockOrders(shelterService.getRestockOrders());
    setShelterNodes(shelterService.getAllShelters());
  }, []);

  const updateShelterInventoryItem = useCallback((shelterId: string, itemId: string, newQty: number) => {
    shelterService.updateInventoryItem(shelterId, itemId, newQty);
    setShelterNodes(shelterService.getAllShelters());
  }, []);

  const findNearestShelters = useCallback((lat: number, lng: number, maxKm?: number) => {
    return citizenService.findNearestShelters(lat, lng, maxKm);
  }, []);

  // ⚡ Real-Time Cross-Dashboard Sync Subscription
  useEffect(() => {
    const unsubscribe = realtimeSync.subscribe('*', (event: RealtimeSyncEvent) => {
      if (event.type === 'SOS_BEACON_CREATED' || event.type === 'SOS_BEACON_UPDATED') {
        setCitizenSOSTickets(citizenService.getSOSTickets());
      } else if (event.type === 'SHELTER_INTAKE_LOGGED' || event.type === 'SHELTER_INVENTORY_UPDATED') {
        setShelterNodes(shelterService.getAllShelters());
        setIntakeRecords(shelterService.getIntakeRegistry());
      } else if (event.type === 'SHELTER_RESTOCK_REQUESTED') {
        setRestockOrders(shelterService.getRestockOrders());
      } else if (event.type === 'MISSING_PERSON_REPORTED' || event.type === 'MISSING_PERSON_LOCATED') {
        setMissingPersons(citizenService.searchMissingPersons(''));
      } else if (event.type === 'VOLUNTEER_REGISTERED') {
        setVolunteers(citizenService.getVolunteers());
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <DisasterContext.Provider
      value={{
        disasterEvent,
        setDisasterEvent,
        zones,
        selectedZone,
        setSelectedZone,
        reports,
        verifyReport,
        rejectReport,
        requestConfirmation,
        addReport,
        resources,
        allocations,
        approveAllAllocations,
        approveSingleAllocation,
        modifyAllocationQuantity,
        rejectAllocation,
        routes,
        toggleRouteBlockage,
        shelters,
        operations,
        timeline,
        auditLogs,
        activeTab,
        setActiveTab,
        isAuthenticated,
        userRole,
        selectRole,
        login,
        loginAsOfficer,
        loginAsShelterCoordinator,
        loginAsCitizen,
        citizenUser,
        shelterCoordinator,
        switchRoleDirectly,
        logout,
        officer,
        simulationStep,
        simulationPlaying,
        setSimulationPlaying,
        advanceSimulationStep,
        setSimulationStepDirect,
        resetSimulation,
        triggerScenario,
        isOptimizationModalOpen,
        setIsOptimizationModalOpen,
        situationChangeDetected,
        dismissSituationChangeAlert,
        recalculateOptimization,
        notifications: timeline.slice(0, 8),
        clearNotifications,

        // Government Resource Management Core
        governmentResources,
        regionAssessments,
        dispatchMovements,
        selectedRegion,
        setSelectedRegion,
        selectedGovernmentResource,
        setSelectedGovernmentResource,
        allocateGovernmentResource,
        updateDispatchStatus,
        addGovernmentResource,
        removeGovernmentResource,

        // Real-Time Reactive RAE & Detailed Region State
        detailedRegionNeeds,
        setDetailedRegionNeeds,
        raeRequirements,
        raeSources,
        globalToast,
        dismissToast,
        executeRAEProposal,
        cancelRAEDeployment,
        resetScenario,

        // 🚨 Citizen SOS & Distress Subsystem
        citizenSOSTickets,
        submitCitizenSOS,
        updateSOSTicket,
        citizenSupplyRequests,
        submitSupplyRequest,
        missingPersons,
        reportMissingPerson,
        searchMissingPersons,
        volunteers,
        registerVolunteer,

        // 🏥 Relief Centre & Shelter Node Subsystem
        shelterNodes,
        selectedShelterNode,
        setSelectedShelterNode,
        intakeRecords,
        registerCitizenIntake,
        restockOrders,
        requestShelterRestock,
        updateRestockOrderStatus,
        updateShelterInventoryItem,
        findNearestShelters,

        // Slide-in / Slide-out Sidebar State
        isSidebarOpen,
        isSidebarCollapsed,
        toggleSidebar,
        toggleSidebarCollapse,
        closeSidebar
      }}
    >
      {children}
    </DisasterContext.Provider>
  );
};

export const useDisaster = () => {
  const context = useContext(DisasterContext);
  if (!context) {
    throw new Error('useDisaster must be used within a DisasterProvider');
  }
  return context;
};
