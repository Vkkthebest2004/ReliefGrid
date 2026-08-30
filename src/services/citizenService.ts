import type { 
  CitizenSOSTicket, 
  CitizenSupplyRequest, 
  MissingPersonRecord, 
  VolunteerRegistration, 
  WaterLevelStatus,
  SOSBeaconStatus,
  ShelterNode
} from '../types';
import { realtimeSync } from './realtimeSync';
import { shelterService } from './shelterService';

export const INITIAL_CITIZEN_SOS_TICKETS: CitizenSOSTicket[] = [
  {
    id: 'SOS-KAM-9812',
    citizenName: 'Pranab Jyoti Deka',
    phone: '+91 98641-90812',
    lat: 26.1582,
    lng: 91.6795,
    landmark: 'Near Pandu Old Ghat Temple, House #42',
    district: 'Kamrup Metropolitan',
    zoneId: 'Z-GHY-W-01',
    zoneName: 'Pandu / Maligaon Sector',
    trappedCount: 5,
    waterLevel: 'CHEST_LEVEL',
    hasInjured: true,
    hasInfants: true,
    hasElderly: true,
    medicalDescription: 'Elderly diabetic patient with respiratory distress; 6-month-old infant without dry formula',
    triagePriorityScore: 94,
    status: 'RESCUE_DISPATCHED',
    assignedUnit: 'NDRF 1st Bn - Boat Rescue Unit Bravo',
    assignedUnitPhone: '+91 94350-99112',
    etaMinutes: 12,
    createdAt: '2026-08-30T17:45:00Z',
    updatedAt: '2026-08-30T18:10:00Z',
    timeline: [
      {
        status: 'BEACON_ACTIVE',
        timestamp: '2026-08-30T17:45:00Z',
        note: 'High-priority distress beacon registered via Citizen Emergency Portal',
        updatedBy: 'Citizen System Portal'
      },
      {
        status: 'TRIAGE_VERIFIED',
        timestamp: '2026-08-30T17:50:00Z',
        note: 'DEOC AI triage calculated 94/100 severity due to chest-level flood + infant/elderly presence',
        updatedBy: 'DEOC Automated Triage Engine'
      },
      {
        status: 'RESCUE_DISPATCHED',
        timestamp: '2026-08-30T18:10:00Z',
        note: 'Assigned NDRF 1st Bn Boat Unit Bravo from Pandu staging ground with medical paramedic kit',
        updatedBy: 'Command Tactical Officer'
      }
    ]
  },
  {
    id: 'SOS-KAM-9814',
    citizenName: 'Minati Borthakur',
    phone: '+91 94350-66778',
    lat: 26.1912,
    lng: 91.7944,
    landmark: 'Refinery Gate 2, Noonmati Lowland Colony',
    district: 'Kamrup Metropolitan',
    zoneId: 'Z-GHY-E-03',
    zoneName: 'Noonmati / Chandmari Sector',
    trappedCount: 3,
    waterLevel: 'WAIST_LEVEL',
    hasInjured: false,
    hasInfants: false,
    hasElderly: true,
    medicalDescription: 'Bedridden senior citizen requiring stretcher evacuation',
    triagePriorityScore: 78,
    status: 'TRIAGE_VERIFIED',
    assignedUnit: 'SDRF Quick Response Squad 3',
    assignedUnitPhone: '+91 94351-22445',
    etaMinutes: 25,
    createdAt: '2026-08-30T18:05:00Z',
    updatedAt: '2026-08-30T18:12:00Z',
    timeline: [
      {
        status: 'BEACON_ACTIVE',
        timestamp: '2026-08-30T18:05:00Z',
        note: 'Distress call submitted for family trapped on 1st floor balcony',
        updatedBy: 'Citizen Web Portal'
      },
      {
        status: 'TRIAGE_VERIFIED',
        timestamp: '2026-08-30T18:12:00Z',
        note: 'Verified with SDRF field team; queue priority set to HIGH',
        updatedBy: 'DEOC Duty Officer'
      }
    ]
  },
  {
    id: 'SOS-KAM-9819',
    citizenName: 'Debabrata Das',
    phone: '+91 98644-33221',
    lat: 26.1780,
    lng: 91.7310,
    landmark: 'Near Bharalu Sluice Gate, Machkhowa',
    district: 'Kamrup Metropolitan',
    zoneId: 'Z-GHY-C-02',
    zoneName: 'Bharalumukh / Machkhowa Sector',
    trappedCount: 8,
    waterLevel: 'ROOF_LEVEL',
    hasInjured: true,
    hasInfants: true,
    hasElderly: false,
    medicalDescription: 'Deep lacerations on 2 adult victims from floating debris; active heavy rain',
    triagePriorityScore: 98,
    status: 'BEACON_ACTIVE',
    createdAt: '2026-08-30T18:35:00Z',
    updatedAt: '2026-08-30T18:35:00Z',
    timeline: [
      {
        status: 'BEACON_ACTIVE',
        timestamp: '2026-08-30T18:35:00Z',
        note: 'Critical roof-level SOS triggered. Water level rising 15cm/hour at sluice backflow point.',
        updatedBy: 'Citizen Emergency Beacon'
      }
    ]
  }
];

export const INITIAL_SUPPLY_REQUESTS: CitizenSupplyRequest[] = [
  {
    id: 'REQ-2026-104',
    citizenName: 'Sunita Hazarika',
    phone: '+91 94350-55112',
    district: 'Kamrup Metropolitan',
    zoneId: 'Z-GHY-W-01',
    address: 'Adabari Tiniali, Lane 4, House 12',
    familyCount: 6,
    itemsRequested: [
      'Potable Water (20L Cans)',
      'Dry Ready Rations / Biscuits',
      'Infant Baby Food Powder',
      'Chlorine Purification Tablets'
    ],
    specialNeeds: 'Diabetic insulin storage requirement',
    priority: 'HIGH',
    status: 'IN_DELIVERY',
    createdAt: '2026-08-30T16:20:00Z'
  },
  {
    id: 'REQ-2026-105',
    citizenName: 'Gaurav Bora',
    phone: '+91 98640-77889',
    district: 'Kamrup Metropolitan',
    zoneId: 'Z-GHY-E-03',
    address: 'Bamunimaidam Industrial Estate, Staff Quarters',
    familyCount: 4,
    itemsRequested: [
      'Dry Food Packets',
      'Emergency Flashlight & Batteries',
      'First Aid Bandages'
    ],
    priority: 'MEDIUM',
    status: 'APPROVED',
    createdAt: '2026-08-30T17:10:00Z'
  }
];

export const INITIAL_MISSING_PERSONS: MissingPersonRecord[] = [
  {
    id: 'MIS-2026-041',
    fullName: 'Arunav Baruah',
    age: 14,
    gender: 'Male',
    lastSeenLocation: 'Near Maligaon Railway Overbridge during sudden flash inundation',
    district: 'Kamrup Metropolitan',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    distinctFeatures: 'Wearing navy blue school uniform shirt, black spectacles, scar on left eyebrow',
    reporterName: 'Kalyan Baruah (Father)',
    reporterPhone: '+91 94350-44991',
    reporterRelation: 'Father',
    status: 'AT_SHELTER',
    matchedShelterId: 'SH-GHY-001',
    matchedShelterName: 'Pandu Multi-Purpose Disaster Relief Camp #1',
    reportedAt: '2026-08-30T14:15:00Z',
    updatedAt: '2026-08-30T17:30:00Z'
  },
  {
    id: 'MIS-2026-042',
    fullName: 'Purnima Roy',
    age: 72,
    gender: 'Female',
    lastSeenLocation: 'Santipur Main Road walking towards Bharalumukh',
    district: 'Kamrup Metropolitan',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
    distinctFeatures: 'Wearing white Mekhela Chador with green border, walks with wooden walking stick',
    reporterName: 'Dhruba Roy (Son)',
    reporterPhone: '+91 98640-33445',
    reporterRelation: 'Son',
    status: 'MISSING',
    reportedAt: '2026-08-30T16:00:00Z',
    updatedAt: '2026-08-30T16:00:00Z'
  }
];

export const INITIAL_VOLUNTEERS: VolunteerRegistration[] = [
  {
    id: 'VOL-9901',
    fullName: 'Jitu Medhi',
    phone: '+91 94350-22119',
    email: 'jitu.medhi@gmail.com',
    district: 'Kamrup Metropolitan',
    skills: ['Boat Navigation', 'First Aid / Paramedic'],
    bloodGroup: 'O+',
    availability: 'Full-Time',
    assignedCenterId: 'SH-GHY-001',
    assignedCenterName: 'Pandu Relief Camp #1',
    status: 'ACTIVE_ON_DUTY',
    registeredAt: '2026-08-29T10:00:00Z'
  },
  {
    id: 'VOL-9902',
    fullName: 'Dr. Reetuparna Goswami',
    phone: '+91 98640-88771',
    email: 'reetu.goswami@med.assam.gov.in',
    district: 'Kamrup Metropolitan',
    skills: ['First Aid / Paramedic', 'Counseling & Social Work'],
    bloodGroup: 'B+',
    availability: 'On-Call',
    assignedCenterId: 'SH-GHY-002',
    assignedCenterName: 'Fancy Bazaar Indoor Shelter',
    status: 'VERIFIED',
    registeredAt: '2026-08-29T14:30:00Z'
  }
];

class CitizenService {
  private sosTickets: Map<string, CitizenSOSTicket> = new Map();
  private supplyRequests: CitizenSupplyRequest[] = [];
  private missingPersons: MissingPersonRecord[] = [];
  private volunteers: VolunteerRegistration[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    INITIAL_CITIZEN_SOS_TICKETS.forEach(t => this.sosTickets.set(t.id, JSON.parse(JSON.stringify(t))));
    this.supplyRequests = JSON.parse(JSON.stringify(INITIAL_SUPPLY_REQUESTS));
    this.missingPersons = JSON.parse(JSON.stringify(INITIAL_MISSING_PERSONS));
    this.volunteers = JSON.parse(JSON.stringify(INITIAL_VOLUNTEERS));
  }

  /**
   * Multi-Factor Triage Priority Algorithm for SOS calls
   * Formula: WaterLevelWeight + MedicalWeight + VulnerabilityWeight + TrappedCountWeight
   */
  public calculateTriageScore(params: {
    waterLevel: WaterLevelStatus;
    hasInjured: boolean;
    hasInfants: boolean;
    hasElderly: boolean;
    trappedCount: number;
  }): number {
    let score = 0;

    // Water level weight
    switch (params.waterLevel) {
      case 'SUBMERGED': score += 40; break;
      case 'ROOF_LEVEL': score += 35; break;
      case 'CHEST_LEVEL': score += 25; break;
      case 'WAIST_LEVEL': score += 15; break;
      case 'KNEE_LEVEL': score += 5; break;
    }

    // Medical urgency
    if (params.hasInjured) score += 30;

    // Vulnerable trapped members
    if (params.hasInfants) score += 12;
    if (params.hasElderly) score += 10;

    // Trapped density (up to 15 points)
    score += Math.min(params.trappedCount * 3, 15);

    return Math.min(Math.max(score, 10), 100);
  }

  public submitSOSBeacon(params: {
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
  }): CitizenSOSTicket {
    const priorityScore = this.calculateTriageScore(params);
    const now = new Date().toISOString();
    const ticketId = `SOS-KAM-${Math.floor(1000 + Math.random() * 9000)}`;

    const ticket: CitizenSOSTicket = {
      id: ticketId,
      ...params,
      triagePriorityScore: priorityScore,
      status: 'BEACON_ACTIVE',
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          status: 'BEACON_ACTIVE',
          timestamp: now,
          note: `High-priority distress beacon registered with Triage Score ${priorityScore}/100.`,
          updatedBy: 'Citizen Emergency Portal'
        }
      ]
    };

    this.sosTickets.set(ticket.id, ticket);

    // Broadcast across all connected dashboards
    realtimeSync.publish('SOS_BEACON_CREATED', 'CITIZEN', ticket);

    return ticket;
  }

  public getSOSTickets(): CitizenSOSTicket[] {
    return Array.from(this.sosTickets.values()).sort((a, b) => {
      // Sort by active status first, then by priority score desc
      if (a.status !== 'RESOLVED' && b.status === 'RESOLVED') return -1;
      if (a.status === 'RESOLVED' && b.status !== 'RESOLVED') return 1;
      return b.triagePriorityScore - a.triagePriorityScore;
    });
  }

  public getSOSTicketById(id: string): CitizenSOSTicket | undefined {
    return this.sosTickets.get(id);
  }

  public updateSOSTicketStatus(
    id: string, 
    status: SOSBeaconStatus, 
    note: string, 
    assignedUnit?: string, 
    assignedUnitPhone?: string, 
    etaMinutes?: number,
    updatedBy: string = 'EOC Dispatch Officer'
  ): CitizenSOSTicket | undefined {
    const ticket = this.sosTickets.get(id);
    if (!ticket) return undefined;

    const now = new Date().toISOString();
    ticket.status = status;
    ticket.updatedAt = now;
    if (assignedUnit) ticket.assignedUnit = assignedUnit;
    if (assignedUnitPhone) ticket.assignedUnitPhone = assignedUnitPhone;
    if (etaMinutes !== undefined) ticket.etaMinutes = etaMinutes;

    ticket.timeline.unshift({
      status,
      timestamp: now,
      note,
      updatedBy
    });

    realtimeSync.publish('SOS_BEACON_UPDATED', 'COMMAND_CENTER', ticket);
    return ticket;
  }

  public submitSupplyRequest(params: Omit<CitizenSupplyRequest, 'id' | 'createdAt' | 'status'>): CitizenSupplyRequest {
    const req: CitizenSupplyRequest = {
      ...params,
      id: `REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: 'REQUESTED',
      createdAt: new Date().toISOString()
    };

    this.supplyRequests.unshift(req);
    return req;
  }

  public getSupplyRequests(): CitizenSupplyRequest[] {
    return [...this.supplyRequests];
  }

  public reportMissingPerson(params: Omit<MissingPersonRecord, 'id' | 'reportedAt' | 'updatedAt' | 'status'>): MissingPersonRecord {
    const now = new Date().toISOString();
    const record: MissingPersonRecord = {
      ...params,
      id: `MIS-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: 'MISSING',
      reportedAt: now,
      updatedAt: now
    };

    // Auto-check against shelter intake registries
    const matchedShelter = this.findMatchingShelterByName(record.fullName);
    if (matchedShelter) {
      record.status = 'AT_SHELTER';
      record.matchedShelterId = matchedShelter.shelterId;
      record.matchedShelterName = matchedShelter.shelterName;
    }

    this.missingPersons.unshift(record);
    realtimeSync.publish('MISSING_PERSON_REPORTED', 'CITIZEN', record);
    return record;
  }

  public searchMissingPersons(query: string): MissingPersonRecord[] {
    if (!query || query.trim() === '') return this.missingPersons;
    const q = query.toLowerCase().trim();
    return this.missingPersons.filter(m => 
      m.fullName.toLowerCase().includes(q) ||
      m.district.toLowerCase().includes(q) ||
      m.distinctFeatures.toLowerCase().includes(q) ||
      m.reporterName.toLowerCase().includes(q)
    );
  }

  public findMatchingShelterByName(name: string): { shelterId: string; shelterName: string } | null {
    const intakeRecords = shelterService.getIntakeRegistry();
    const cleanName = name.toLowerCase().trim();
    
    const found = intakeRecords.find(r => 
      r.citizenName.toLowerCase().includes(cleanName) ||
      cleanName.includes(r.citizenName.toLowerCase())
    );

    if (found) {
      const shelter = shelterService.getShelterById(found.shelterId);
      return {
        shelterId: found.shelterId,
        shelterName: shelter ? shelter.name : 'Registered Disaster Relief Enclave'
      };
    }

    return null;
  }

  public registerVolunteer(params: Omit<VolunteerRegistration, 'id' | 'registeredAt' | 'status'>): VolunteerRegistration {
    const vol: VolunteerRegistration = {
      ...params,
      id: `VOL-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'VERIFIED',
      registeredAt: new Date().toISOString()
    };

    this.volunteers.unshift(vol);
    realtimeSync.publish('VOLUNTEER_REGISTERED', 'CITIZEN', vol);
    return vol;
  }

  public getVolunteers(): VolunteerRegistration[] {
    return [...this.volunteers];
  }

  /**
   * Calculate nearest shelters by coordinates using Haversine formula
   */
  public findNearestShelters(lat: number, lng: number, maxDistanceKm: number = 25): Array<ShelterNode & { distanceKm: number }> {
    const shelters = shelterService.getAllShelters();
    
    const toRad = (val: number) => (val * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    const withDist = shelters.map(s => {
      const dLat = toRad(s.lat - lat);
      const dLon = toRad(s.lng - lng);
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat)) * Math.cos(toRad(s.lat)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceKm = Math.round(R * c * 10) / 10;

      return {
        ...s,
        distanceKm
      };
    });

    return withDist
      .filter(s => s.distanceKm <= maxDistanceKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }
}

// Global Singleton
export const citizenService = new CitizenService();
