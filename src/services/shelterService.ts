import type { 
  ShelterNode, 
  ShelterIntakeRecord, 
  ShelterRestockOrder, 
  ShelterStaffMember, 
  ShelterInventoryItem 
} from '../types';
import { realtimeSync } from './realtimeSync';

// Initial Mock Shelter Nodes across Guwahati/Assam Zones
export const INITIAL_SHELTER_NODES: ShelterNode[] = [
  {
    id: 'SH-GHY-001',
    code: 'SHELTER-PANDU-CENTRAL',
    name: 'Pandu Multi-Purpose Disaster Relief Camp #1',
    district: 'Kamrup Metropolitan',
    zoneId: 'Z-GHY-W-01',
    address: 'Pandu High School Complex, Railway Colony Road, West Guwahati',
    lat: 26.1625,
    lng: 91.6885,
    officerInCharge: 'Maj. Vikramjit Saikia (Retd. SDRF)',
    contactPhone: '+91 94350-88123',
    totalBedCapacity: 850,
    currentOccupancy: 742,
    occupancyBreakdown: {
      adultMen: 280,
      adultWomen: 310,
      children: 95,
      infants: 22,
      elderly: 35,
      injured: 18
    },
    powerStatus: 'GENERATOR_BACKUP',
    generatorFuelHours: 18.5,
    waterReservesLiters: 14200,
    rationDaysRemaining: 2.8,
    status: 'NEAR_CAPACITY',
    pendingDeliveries: 2,
    lastInspected: '2026-08-30T16:30:00Z',
    inventory: [
      {
        id: 'INV-001',
        name: 'Ready-to-Eat Emergency Rations (MRE Packs)',
        category: 'RATIONS',
        quantity: 1850,
        unit: 'Packs',
        minThreshold: 1200,
        status: 'OPTIMAL',
        lastRestocked: '2026-08-29T14:00:00Z'
      },
      {
        id: 'INV-002',
        name: 'Potable Drinking Water (20L Cans)',
        category: 'WATER',
        quantity: 210,
        unit: 'Cans',
        minThreshold: 350,
        status: 'LOW',
        lastRestocked: '2026-08-29T10:00:00Z'
      },
      {
        id: 'INV-003',
        name: 'Infant Nutrition & Milk Powder',
        category: 'RATIONS',
        quantity: 45,
        unit: 'Kits',
        minThreshold: 80,
        status: 'CRITICAL_DEFICIT',
        lastRestocked: '2026-08-28T18:00:00Z'
      },
      {
        id: 'INV-004',
        name: 'Emergency Trauma & First-Aid Kits',
        category: 'MEDICAL',
        quantity: 38,
        unit: 'Kits',
        minThreshold: 30,
        status: 'OPTIMAL',
        lastRestocked: '2026-08-30T08:00:00Z'
      },
      {
        id: 'INV-005',
        name: 'Thermal Blankets & Ground Mattresses',
        category: 'BEDDING',
        quantity: 620,
        unit: 'Units',
        minThreshold: 700,
        status: 'LOW',
        lastRestocked: '2026-08-28T12:00:00Z'
      },
      {
        id: 'INV-006',
        name: 'Chlorine Water Purification Tablets (Halazone)',
        category: 'WATER',
        quantity: 8500,
        unit: 'Tablets',
        minThreshold: 5000,
        status: 'OPTIMAL',
        lastRestocked: '2026-08-29T11:00:00Z'
      }
    ]
  },
  {
    id: 'SH-GHY-002',
    code: 'SHELTER-FANCY-INDOOR',
    name: 'Fancy Bazaar Indoor Stadium Emergency Shelter',
    district: 'Kamrup Metropolitan',
    zoneId: 'Z-GHY-C-02',
    address: 'Municipal Stadium Complex, Fancy Bazaar, Central Guwahati',
    lat: 26.1833,
    lng: 91.7392,
    officerInCharge: 'Dr. Ananya Baruah (DMHO Liaison)',
    contactPhone: '+91 94351-77442',
    totalBedCapacity: 1200,
    currentOccupancy: 610,
    occupancyBreakdown: {
      adultMen: 240,
      adultWomen: 260,
      children: 70,
      infants: 15,
      elderly: 25,
      injured: 8
    },
    powerStatus: 'GRID_ACTIVE',
    generatorFuelHours: 48.0,
    waterReservesLiters: 28500,
    rationDaysRemaining: 5.2,
    status: 'OPERATIONAL',
    pendingDeliveries: 1,
    lastInspected: '2026-08-30T18:00:00Z',
    inventory: [
      {
        id: 'INV-007',
        name: 'Ready-to-Eat Emergency Rations (MRE Packs)',
        category: 'RATIONS',
        quantity: 3200,
        unit: 'Packs',
        minThreshold: 1500,
        status: 'OPTIMAL',
        lastRestocked: '2026-08-30T12:00:00Z'
      },
      {
        id: 'INV-008',
        name: 'Potable Drinking Water (20L Cans)',
        category: 'WATER',
        quantity: 680,
        unit: 'Cans',
        minThreshold: 400,
        status: 'OPTIMAL',
        lastRestocked: '2026-08-30T12:00:00Z'
      },
      {
        id: 'INV-009',
        name: 'Anti-Venom & Water-Borne Disease Drug Packs',
        category: 'MEDICAL',
        quantity: 120,
        unit: 'Vials',
        minThreshold: 60,
        status: 'OPTIMAL',
        lastRestocked: '2026-08-30T09:00:00Z'
      }
    ]
  },
  {
    id: 'SH-GHY-003',
    code: 'SHELTER-NOONMATI-ACADEMY',
    name: 'Noonmati Higher Secondary Relief Enclave',
    district: 'Kamrup Metropolitan',
    zoneId: 'Z-GHY-E-03',
    address: 'Refinery Road, Noonmati, East Guwahati',
    lat: 26.1950,
    lng: 91.8021,
    officerInCharge: 'Insp. R. K. Boro (Civil Defense)',
    contactPhone: '+91 94353-22991',
    totalBedCapacity: 500,
    currentOccupancy: 485,
    occupancyBreakdown: {
      adultMen: 190,
      adultWomen: 205,
      children: 60,
      infants: 10,
      elderly: 20,
      injured: 12
    },
    powerStatus: 'GENERATOR_BACKUP',
    generatorFuelHours: 9.0,
    waterReservesLiters: 6200,
    rationDaysRemaining: 1.4,
    status: 'OVERCROWDED',
    pendingDeliveries: 3,
    lastInspected: '2026-08-30T15:00:00Z',
    inventory: [
      {
        id: 'INV-010',
        name: 'Ready-to-Eat Emergency Rations (MRE Packs)',
        category: 'RATIONS',
        quantity: 420,
        unit: 'Packs',
        minThreshold: 800,
        status: 'CRITICAL_DEFICIT',
        lastRestocked: '2026-08-28T10:00:00Z'
      },
      {
        id: 'INV-011',
        name: 'Potable Drinking Water (20L Cans)',
        category: 'WATER',
        quantity: 85,
        unit: 'Cans',
        minThreshold: 250,
        status: 'CRITICAL_DEFICIT',
        lastRestocked: '2026-08-28T10:00:00Z'
      }
    ]
  }
];

export const INITIAL_INTAKE_REGISTRY: ShelterIntakeRecord[] = [
  {
    id: 'INT-8801',
    shelterId: 'SH-GHY-001',
    citizenName: 'Biren Kalita',
    aadhaarOrId: 'XXXX-XXXX-4912',
    phone: '+91 98640-11234',
    familyMembersCount: 4,
    gender: 'Male',
    age: 48,
    assignedBedNumber: 'Block-A / Bed-14',
    medicalCondition: 'Mild dehydration, minor leg abrasions',
    dietaryNeeds: 'Standard diabetic meal request',
    checkInTime: '2026-08-30T10:15:00Z',
    status: 'ACTIVE'
  },
  {
    id: 'INT-8802',
    shelterId: 'SH-GHY-001',
    citizenName: 'Runu Gogoi',
    aadhaarOrId: 'XXXX-XXXX-7301',
    phone: '+91 98642-55678',
    familyMembersCount: 3,
    gender: 'Female',
    age: 29,
    assignedBedNumber: 'Block-B / Bed-08',
    medicalCondition: 'Post-natal care, 4-month infant with mild fever',
    dietaryNeeds: 'Infant milk & high-nutrition porridge',
    checkInTime: '2026-08-30T11:40:00Z',
    status: 'ACTIVE'
  },
  {
    id: 'INT-8803',
    shelterId: 'SH-GHY-002',
    citizenName: 'Tapan Hazarika',
    aadhaarOrId: 'XXXX-XXXX-9122',
    phone: '+91 94350-99881',
    familyMembersCount: 2,
    gender: 'Male',
    age: 67,
    assignedBedNumber: 'Geriatric Ward / Bed-03',
    medicalCondition: 'Hypertension, lost prescription medicines during evacuation',
    dietaryNeeds: 'Low-sodium diet',
    checkInTime: '2026-08-30T09:20:00Z',
    status: 'ACTIVE'
  }
];

export const INITIAL_RESTOCK_ORDERS: ShelterRestockOrder[] = [
  {
    id: 'RST-2026-019',
    shelterId: 'SH-GHY-001',
    shelterName: 'Pandu Multi-Purpose Disaster Relief Camp #1',
    district: 'Kamrup Metropolitan',
    zoneId: 'Z-GHY-W-01',
    items: [
      { name: 'Potable Drinking Water (20L Cans)', quantity: 300, unit: 'Cans', category: 'WATER' },
      { name: 'Infant Nutrition & Milk Powder', quantity: 100, unit: 'Kits', category: 'RATIONS' },
      { name: 'Thermal Blankets', quantity: 200, unit: 'Units', category: 'BEDDING' }
    ],
    urgency: 'IMMEDIATE_4H',
    reason: 'Water reserves dropping below 3 hours of safe supply with 742 evacuees',
    status: 'APPROVED',
    requestedBy: 'Maj. Vikramjit Saikia',
    createdAt: '2026-08-30T17:15:00Z',
    etaMinutes: 35
  },
  {
    id: 'RST-2026-020',
    shelterId: 'SH-GHY-003',
    shelterName: 'Noonmati Higher Secondary Relief Enclave',
    district: 'Kamrup Metropolitan',
    zoneId: 'Z-GHY-E-03',
    items: [
      { name: 'Ready-to-Eat Emergency Rations (MRE Packs)', quantity: 600, unit: 'Packs', category: 'RATIONS' },
      { name: 'Diesel Generator Fuel', quantity: 200, unit: 'Liters', category: 'POWER' }
    ],
    urgency: 'URGENT_12H',
    reason: 'Generator fuel running low with grid power disrupted in sector',
    status: 'PENDING_APPROVAL',
    requestedBy: 'Insp. R. K. Boro',
    createdAt: '2026-08-30T18:00:00Z'
  }
];

export const INITIAL_STAFF_ROSTER: ShelterStaffMember[] = [
  {
    id: 'STF-01',
    shelterId: 'SH-GHY-001',
    name: 'Dr. Manash Pratim Sarma',
    role: 'Doctor',
    phone: '+91 94350-11223',
    shift: 'Day (08:00 - 20:00)',
    status: 'ON_DUTY'
  },
  {
    id: 'STF-02',
    shelterId: 'SH-GHY-001',
    name: 'Sister Pratima Das',
    role: 'Nurse',
    phone: '+91 94350-44556',
    shift: 'Day (08:00 - 20:00)',
    status: 'ON_DUTY'
  },
  {
    id: 'STF-03',
    shelterId: 'SH-GHY-001',
    name: 'Havildar J. Gogoi (SDRF Unit 4)',
    role: 'SDRF Lead',
    phone: '+91 94350-77889',
    shift: 'Day (08:00 - 20:00)',
    status: 'DEPLOYED_FIELD'
  }
];

class ShelterService {
  private shelters: Map<string, ShelterNode> = new Map();
  private intakeRegistry: ShelterIntakeRecord[] = [];
  private restockOrders: ShelterRestockOrder[] = [];
  private staffRoster: ShelterStaffMember[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    INITIAL_SHELTER_NODES.forEach(s => this.shelters.set(s.id, JSON.parse(JSON.stringify(s))));
    this.intakeRegistry = JSON.parse(JSON.stringify(INITIAL_INTAKE_REGISTRY));
    this.restockOrders = JSON.parse(JSON.stringify(INITIAL_RESTOCK_ORDERS));
    this.staffRoster = JSON.parse(JSON.stringify(INITIAL_STAFF_ROSTER));
  }

  public getAllShelters(): ShelterNode[] {
    return Array.from(this.shelters.values());
  }

  public getShelterById(id: string): ShelterNode | undefined {
    return this.shelters.get(id);
  }

  public getIntakeRegistry(shelterId?: string): ShelterIntakeRecord[] {
    if (shelterId) {
      return this.intakeRegistry.filter(r => r.shelterId === shelterId);
    }
    return [...this.intakeRegistry];
  }

  public getRestockOrders(shelterId?: string): ShelterRestockOrder[] {
    if (shelterId) {
      return this.restockOrders.filter(o => o.shelterId === shelterId);
    }
    return [...this.restockOrders];
  }

  public getStaffRoster(shelterId?: string): ShelterStaffMember[] {
    if (shelterId) {
      return this.staffRoster.filter(s => s.shelterId === shelterId);
    }
    return [...this.staffRoster];
  }

  public registerCitizenIntake(intakeData: Omit<ShelterIntakeRecord, 'id' | 'checkInTime' | 'status'>): ShelterIntakeRecord {
    const shelter = this.shelters.get(intakeData.shelterId);
    if (!shelter) {
      throw new Error(`Shelter ${intakeData.shelterId} not found`);
    }

    const record: ShelterIntakeRecord = {
      ...intakeData,
      id: `INT-${Date.now().toString().slice(-4)}`,
      checkInTime: new Date().toISOString(),
      status: 'ACTIVE'
    };

    this.intakeRegistry.unshift(record);

    // Update shelter counts
    shelter.currentOccupancy += record.familyMembersCount;
    if (record.gender === 'Male' && record.age >= 18) shelter.occupancyBreakdown.adultMen++;
    else if (record.gender === 'Female' && record.age >= 18) shelter.occupancyBreakdown.adultWomen++;
    else if (record.age < 2) shelter.occupancyBreakdown.infants++;
    else if (record.age < 18) shelter.occupancyBreakdown.children++;
    
    if (record.age >= 60) shelter.occupancyBreakdown.elderly++;
    if (record.medicalCondition && record.medicalCondition.trim().length > 0) shelter.occupancyBreakdown.injured++;

    // Update status
    const occPct = (shelter.currentOccupancy / shelter.totalBedCapacity) * 100;
    if (occPct >= 100) shelter.status = 'OVERCROWDED';
    else if (occPct >= 85) shelter.status = 'NEAR_CAPACITY';
    else shelter.status = 'OPERATIONAL';

    // Broadcast event
    realtimeSync.publish('SHELTER_INTAKE_LOGGED', 'SHELTER_NODE', {
      record,
      shelterId: shelter.id,
      updatedOccupancy: shelter.currentOccupancy,
      capacityPct: occPct
    });

    return record;
  }

  public requestRestock(orderData: Omit<ShelterRestockOrder, 'id' | 'createdAt' | 'status'>): ShelterRestockOrder {
    const shelter = this.shelters.get(orderData.shelterId);
    const order: ShelterRestockOrder = {
      ...orderData,
      id: `RST-2026-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: 'PENDING_APPROVAL'
    };

    this.restockOrders.unshift(order);

    if (shelter) {
      shelter.pendingDeliveries++;
    }

    // Broadcast event
    realtimeSync.publish('SHELTER_RESTOCK_REQUESTED', 'SHELTER_NODE', {
      order,
      shelterName: shelter ? shelter.name : order.shelterName
    });

    return order;
  }

  public updateRestockStatus(orderId: string, status: ShelterRestockOrder['status'], etaMinutes?: number): ShelterRestockOrder | undefined {
    const order = this.restockOrders.find(o => o.id === orderId);
    if (!order) return undefined;

    order.status = status;
    if (etaMinutes !== undefined) order.etaMinutes = etaMinutes;

    if (status === 'DELIVERED') {
      const shelter = this.shelters.get(order.shelterId);
      if (shelter && shelter.pendingDeliveries > 0) {
        shelter.pendingDeliveries--;
      }
    }

    realtimeSync.publish('RESOURCE_ALLOCATION_APPROVED', 'LOGISTICS_HUB', { order });
    return order;
  }

  public updateInventoryItem(shelterId: string, itemId: string, newQuantity: number): ShelterInventoryItem | undefined {
    const shelter = this.shelters.get(shelterId);
    if (!shelter) return undefined;

    const item = shelter.inventory.find(i => i.id === itemId);
    if (!item) return undefined;

    item.quantity = newQuantity;
    if (item.quantity <= item.minThreshold * 0.5) {
      item.status = 'CRITICAL_DEFICIT';
    } else if (item.quantity <= item.minThreshold) {
      item.status = 'LOW';
    } else {
      item.status = 'OPTIMAL';
    }

    realtimeSync.publish('SHELTER_INVENTORY_UPDATED', 'SHELTER_NODE', {
      shelterId,
      item
    });

    return item;
  }
}

// Global Singleton
export const shelterService = new ShelterService();
