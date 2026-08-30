import { citizenService } from './citizenService';
import { shelterService } from './shelterService';
import { realtimeSync } from './realtimeSync';
import type { 
  CitizenSOSTicket, 
  CitizenSupplyRequest, 
  MissingPersonRecord, 
  VolunteerRegistration, 
  ShelterNode, 
  ShelterIntakeRecord, 
  ShelterRestockOrder,
  ShelterInventoryItem,
  WaterLevelStatus,
  SOSBeaconStatus
} from '../types';

/**
 * Unified Backend API Client
 * Transparently delegates to in-memory persisted engine or remote REST API if configured
 */
export const backendApi = {
  // 🚨 CITIZEN SOS BEACON APIS
  sos: {
    create: async (params: {
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
    }): Promise<CitizenSOSTicket> => {
      return citizenService.submitSOSBeacon(params);
    },

    list: async (): Promise<CitizenSOSTicket[]> => {
      return citizenService.getSOSTickets();
    },

    get: async (id: string): Promise<CitizenSOSTicket | undefined> => {
      return citizenService.getSOSTicketById(id);
    },

    updateStatus: async (
      id: string,
      status: SOSBeaconStatus,
      note: string,
      assignedUnit?: string,
      assignedUnitPhone?: string,
      etaMinutes?: number,
      updatedBy?: string
    ): Promise<CitizenSOSTicket | undefined> => {
      return citizenService.updateSOSTicketStatus(id, status, note, assignedUnit, assignedUnitPhone, etaMinutes, updatedBy);
    }
  },

  // 🏥 RELIEF CENTRE & SHELTER APIS
  shelters: {
    list: async (): Promise<ShelterNode[]> => {
      return shelterService.getAllShelters();
    },

    get: async (id: string): Promise<ShelterNode | undefined> => {
      return shelterService.getShelterById(id);
    },

    getNearest: async (lat: number, lng: number, maxKm = 25): Promise<Array<ShelterNode & { distanceKm: number }>> => {
      return citizenService.findNearestShelters(lat, lng, maxKm);
    },

    checkIn: async (data: Omit<ShelterIntakeRecord, 'id' | 'checkInTime' | 'status'>): Promise<ShelterIntakeRecord> => {
      return shelterService.registerCitizenIntake(data);
    },

    getIntakeRegistry: async (shelterId?: string): Promise<ShelterIntakeRecord[]> => {
      return shelterService.getIntakeRegistry(shelterId);
    },

    requestRestock: async (data: Omit<ShelterRestockOrder, 'id' | 'createdAt' | 'status'>): Promise<ShelterRestockOrder> => {
      return shelterService.requestRestock(data);
    },

    getRestockOrders: async (shelterId?: string): Promise<ShelterRestockOrder[]> => {
      return shelterService.getRestockOrders(shelterId);
    },

    updateRestockStatus: async (orderId: string, status: ShelterRestockOrder['status'], eta?: number): Promise<ShelterRestockOrder | undefined> => {
      return shelterService.updateRestockStatus(orderId, status, eta);
    },

    updateInventory: async (shelterId: string, itemId: string, newQty: number): Promise<ShelterInventoryItem | undefined> => {
      return shelterService.updateInventoryItem(shelterId, itemId, newQty);
    },

    getStaffRoster: async (shelterId?: string) => {
      return shelterService.getStaffRoster(shelterId);
    }
  },

  // 🔍 MISSING PERSONS APIS
  missingPersons: {
    report: async (data: Omit<MissingPersonRecord, 'id' | 'reportedAt' | 'updatedAt' | 'status'>): Promise<MissingPersonRecord> => {
      return citizenService.reportMissingPerson(data);
    },

    search: async (query: string): Promise<MissingPersonRecord[]> => {
      return citizenService.searchMissingPersons(query);
    },

    list: async (): Promise<MissingPersonRecord[]> => {
      return citizenService.searchMissingPersons('');
    }
  },

  // 🤝 VOLUNTEERS & DONATIONS
  volunteers: {
    register: async (data: Omit<VolunteerRegistration, 'id' | 'registeredAt' | 'status'>): Promise<VolunteerRegistration> => {
      return citizenService.registerVolunteer(data);
    },

    list: async (): Promise<VolunteerRegistration[]> => {
      return citizenService.getVolunteers();
    }
  },

  // 📦 CITIZEN SUPPLY REQUESTS
  supplies: {
    request: async (data: Omit<CitizenSupplyRequest, 'id' | 'createdAt' | 'status'>): Promise<CitizenSupplyRequest> => {
      return citizenService.submitSupplyRequest(data);
    },

    list: async (): Promise<CitizenSupplyRequest[]> => {
      return citizenService.getSupplyRequests();
    }
  },

  // ⚡ REALTIME SYNC ENGINE
  sync: realtimeSync
};
