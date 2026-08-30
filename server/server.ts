import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

// Active WebSocket Clients
const clients: Set<WebSocket> = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`[WebSocket] Client connected. Total active clients: ${clients.size}`);

  ws.send(JSON.stringify({
    type: 'SYSTEM_CONNECTED',
    message: 'Connected to ReliefGrid Live Synchronization Gateway',
    timestamp: new Date().toISOString()
  }));

  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message.toString());
      console.log(`[WebSocket] Incoming event: ${parsed.type}`);
      // Broadcast to all other clients
      broadcastEvent(parsed, ws);
    } catch (e) {
      console.error('[WebSocket] Failed to parse message', e);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[WebSocket] Client disconnected. Remaining: ${clients.size}`);
  });
});

function broadcastEvent(event: any, senderWs?: WebSocket) {
  const data = JSON.stringify(event);
  clients.forEach((client) => {
    if (client !== senderWs && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// In-Memory Database / Store
let sosTickets: any[] = [
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
    medicalDescription: 'Elderly diabetic patient with respiratory distress; 6-month-old infant',
    triagePriorityScore: 94,
    status: 'RESCUE_DISPATCHED',
    assignedUnit: 'NDRF 1st Bn - Boat Rescue Unit Bravo',
    assignedUnitPhone: '+91 94350-99112',
    etaMinutes: 12,
    createdAt: '2026-08-30T17:45:00Z',
    updatedAt: '2026-08-30T18:10:00Z',
    timeline: [
      { status: 'BEACON_ACTIVE', timestamp: '2026-08-30T17:45:00Z', note: 'Distress beacon activated', updatedBy: 'Citizen' },
      { status: 'TRIAGE_VERIFIED', timestamp: '2026-08-30T17:50:00Z', note: 'AI Triage calculated 94/100 severity', updatedBy: 'DEOC AI' },
      { status: 'RESCUE_DISPATCHED', timestamp: '2026-08-30T18:10:00Z', note: 'NDRF Boat Unit Bravo en-route', updatedBy: 'Tactical Command' }
    ]
  }
];

let shelters: any[] = [
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
    powerStatus: 'GENERATOR_BACKUP',
    generatorFuelHours: 18.5,
    waterReservesLiters: 14200,
    rationDaysRemaining: 2.8,
    status: 'NEAR_CAPACITY',
    pendingDeliveries: 2,
    inventory: [
      { id: 'INV-001', name: 'Ready-to-Eat Rations', category: 'RATIONS', quantity: 1850, unit: 'Packs', status: 'OPTIMAL' },
      { id: 'INV-002', name: 'Potable Drinking Water (20L)', category: 'WATER', quantity: 210, unit: 'Cans', status: 'LOW' }
    ]
  }
];

let intakeRegistry: any[] = [];
let restockOrders: any[] = [];
let missingPersons: any[] = [];
let volunteers: any[] = [];

// ==========================================
// 🚀 REST API ROUTES
// ==========================================

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'ReliefGrid Backend Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    connectedSockets: clients.size
  });
});

// 🚨 SOS BEACON ROUTES
app.get('/api/sos', (_req: Request, res: Response) => {
  res.json({ success: true, data: sosTickets });
});

app.get('/api/sos/:id', (req: Request, res: Response) => {
  const ticket = sosTickets.find(t => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ success: false, error: 'SOS Ticket not found' });
  res.json({ success: true, data: ticket });
});

app.post('/api/sos', (req: Request, res: Response) => {
  const body = req.body;
  const ticketId = `SOS-KAM-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  let priorityScore = 40;
  if (body.waterLevel === 'SUBMERGED') priorityScore += 40;
  else if (body.waterLevel === 'ROOF_LEVEL') priorityScore += 35;
  else if (body.waterLevel === 'CHEST_LEVEL') priorityScore += 25;
  else if (body.waterLevel === 'WAIST_LEVEL') priorityScore += 15;
  
  if (body.hasInjured) priorityScore += 30;
  if (body.hasInfants) priorityScore += 12;
  if (body.hasElderly) priorityScore += 10;
  priorityScore = Math.min(Math.max(priorityScore, 10), 100);

  const newTicket = {
    id: ticketId,
    ...body,
    triagePriorityScore: priorityScore,
    status: 'BEACON_ACTIVE',
    createdAt: now,
    updatedAt: now,
    timeline: [
      {
        status: 'BEACON_ACTIVE',
        timestamp: now,
        note: `SOS Beacon raised by citizen. Triage Priority: ${priorityScore}/100`,
        updatedBy: 'Citizen Portal'
      }
    ]
  };

  sosTickets.unshift(newTicket);

  // Broadcast event across WebSocket network
  const syncEvent = {
    id: `EVT-${Date.now()}`,
    type: 'SOS_BEACON_CREATED',
    source: 'CITIZEN',
    timestamp: now,
    payload: newTicket
  };
  broadcastEvent(syncEvent);

  res.status(201).json({ success: true, data: newTicket });
});

app.patch('/api/sos/:id', (req: Request, res: Response) => {
  const ticket = sosTickets.find(t => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ success: false, error: 'SOS Ticket not found' });

  const { status, note, assignedUnit, assignedUnitPhone, etaMinutes } = req.body;
  const now = new Date().toISOString();

  if (status) ticket.status = status;
  if (assignedUnit) ticket.assignedUnit = assignedUnit;
  if (assignedUnitPhone) ticket.assignedUnitPhone = assignedUnitPhone;
  if (etaMinutes !== undefined) ticket.etaMinutes = etaMinutes;
  ticket.updatedAt = now;

  if (note) {
    ticket.timeline.unshift({
      status: ticket.status,
      timestamp: now,
      note,
      updatedBy: req.body.updatedBy || 'Duty Officer'
    });
  }

  const syncEvent = {
    id: `EVT-${Date.now()}`,
    type: 'SOS_BEACON_UPDATED',
    source: 'COMMAND_CENTER',
    timestamp: now,
    payload: ticket
  };
  broadcastEvent(syncEvent);

  res.json({ success: true, data: ticket });
});

// 🏥 RELIEF SHELTER ROUTES
app.get('/api/shelters', (_req: Request, res: Response) => {
  res.json({ success: true, data: shelters });
});

app.get('/api/shelters/:id', (req: Request, res: Response) => {
  const shelter = shelters.find(s => s.id === req.params.id);
  if (!shelter) return res.status(404).json({ success: false, error: 'Shelter not found' });
  
  const intake = intakeRegistry.filter(i => i.shelterId === req.params.id);
  const restock = restockOrders.filter(r => r.shelterId === req.params.id);

  res.json({ success: true, data: { ...shelter, intakeRegistry: intake, restockOrders: restock } });
});

app.post('/api/shelters/:id/checkin', (req: Request, res: Response) => {
  const shelter = shelters.find(s => s.id === req.params.id);
  if (!shelter) return res.status(404).json({ success: false, error: 'Shelter not found' });

  const record = {
    id: `INT-${Date.now().toString().slice(-4)}`,
    shelterId: shelter.id,
    ...req.body,
    checkInTime: new Date().toISOString(),
    status: 'ACTIVE'
  };

  intakeRegistry.unshift(record);
  shelter.currentOccupancy += (record.familyMembersCount || 1);

  const syncEvent = {
    id: `EVT-${Date.now()}`,
    type: 'SHELTER_INTAKE_LOGGED',
    source: 'SHELTER_NODE',
    timestamp: new Date().toISOString(),
    payload: { record, shelterId: shelter.id, updatedOccupancy: shelter.currentOccupancy }
  };
  broadcastEvent(syncEvent);

  res.status(201).json({ success: true, data: record });
});

app.post('/api/shelters/:id/restock', (req: Request, res: Response) => {
  const shelter = shelters.find(s => s.id === req.params.id);
  const order = {
    id: `RST-2026-${Date.now().toString().slice(-4)}`,
    shelterId: req.params.id,
    shelterName: shelter ? shelter.name : req.body.shelterName,
    ...req.body,
    status: 'PENDING_APPROVAL',
    createdAt: new Date().toISOString()
  };

  restockOrders.unshift(order);
  if (shelter) shelter.pendingDeliveries = (shelter.pendingDeliveries || 0) + 1;

  const syncEvent = {
    id: `EVT-${Date.now()}`,
    type: 'SHELTER_RESTOCK_REQUESTED',
    source: 'SHELTER_NODE',
    timestamp: new Date().toISOString(),
    payload: { order }
  };
  broadcastEvent(syncEvent);

  res.status(201).json({ success: true, data: order });
});

// 🔍 MISSING PERSONS ROUTES
app.get('/api/missing-persons', (req: Request, res: Response) => {
  const q = req.query.q as string;
  if (!q) return res.json({ success: true, data: missingPersons });
  const filtered = missingPersons.filter(m => 
    m.fullName.toLowerCase().includes(q.toLowerCase()) ||
    m.district.toLowerCase().includes(q.toLowerCase())
  );
  res.json({ success: true, data: filtered });
});

app.post('/api/missing-persons', (req: Request, res: Response) => {
  const now = new Date().toISOString();
  const record = {
    id: `MIS-2026-${Math.floor(100 + Math.random() * 900)}`,
    ...req.body,
    status: 'MISSING',
    reportedAt: now,
    updatedAt: now
  };

  missingPersons.unshift(record);

  const syncEvent = {
    id: `EVT-${Date.now()}`,
    type: 'MISSING_PERSON_REPORTED',
    source: 'CITIZEN',
    timestamp: now,
    payload: record
  };
  broadcastEvent(syncEvent);

  res.status(201).json({ success: true, data: record });
});

// 🤝 VOLUNTEERS ROUTES
app.get('/api/volunteers', (_req: Request, res: Response) => {
  res.json({ success: true, data: volunteers });
});

app.post('/api/volunteers', (req: Request, res: Response) => {
  const vol = {
    id: `VOL-${Math.floor(1000 + Math.random() * 9000)}`,
    ...req.body,
    status: 'VERIFIED',
    registeredAt: new Date().toISOString()
  };

  volunteers.unshift(vol);

  const syncEvent = {
    id: `EVT-${Date.now()}`,
    type: 'VOLUNTEER_REGISTERED',
    source: 'CITIZEN',
    timestamp: new Date().toISOString(),
    payload: vol
  };
  broadcastEvent(syncEvent);

  res.status(201).json({ success: true, data: vol });
});

// 🔐 CITIZEN & COORDINATOR AUTH ROUTES
let users: any[] = [
  {
    id: 'USR-001',
    name: 'Rahul Kalita',
    email: 'rahul.kalita@citizen.in',
    phone: '+91 98640-12345',
    role: 'CITIZEN',
    status: 'SAFE'
  },
  {
    id: 'USR-002',
    name: 'Maj. Vikramjit Saikia',
    email: 'saikia.sdrf@assam.gov.in',
    phone: '+91 94350-88123',
    role: 'SHELTER_COORDINATOR',
    shelterId: 'SH-GHY-001'
  }
];

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, role = 'CITIZEN' } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
  const user = {
    id: `USR-${Date.now().toString().slice(-4)}`,
    name,
    email,
    phone: phone || '',
    role,
    status: 'SAFE',
    createdAt: new Date().toISOString()
  };
  users.unshift(user);
  res.status(201).json({ token: `jwt-token-${user.id}`, user });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body || {};
  const user = users.find(u => u.email?.toLowerCase() === email?.toLowerCase()) || users[0];
  res.json({ token: `jwt-token-${user.id}`, user });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  res.json({ user: users[0] });
});

// 👤 CITIZEN STATUS & SAFETY ROUTES
app.post('/api/citizen/status', (req: Request, res: Response) => {
  const { status, citizenId } = req.body;
  const user = users.find(u => u.id === citizenId) || users[0];
  if (user) user.status = status;
  res.json({ success: true, status: user?.status || status });
});

app.get('/api/citizen/alerts', (_req: Request, res: Response) => {
  res.json([
    {
      id: 'ALERT-GHY-01',
      title: 'Brahmaputra Rising — Evacuate Low-lying Pandu & Maligaon Sectors',
      message: 'High schools and designated shelter camps #1, #2, #4 are operational with dry rations.',
      severity: 'HIGH',
      createdAt: new Date().toISOString()
    }
  ]);
});

app.get('/api/citizen/safety', (_req: Request, res: Response) => {
  res.json({
    shelters: shelters.map(s => ({
      id: s.id,
      name: s.name,
      type: 'Shelter',
      lat: s.lat,
      lng: s.lng,
      address: s.address,
      phone: s.contactPhone,
      availableCapacity: s.totalBedCapacity - s.currentOccupancy,
      capacityStatus: s.currentOccupancy >= s.totalBedCapacity ? 'FULL' : 'GOOD',
      verified: true,
      openNow: true
    }))
  });
});

// ⚡ GENERIC REAL-TIME BROADCAST ENDPOINT
app.post('/api/broadcast', (req: Request, res: Response) => {
  const event = req.body;
  broadcastEvent(event);
  res.json({ success: true, broadcastedTo: clients.size });
});

// Start Server
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` 🇮🇳 ReliefGrid National Backend & Real-time Sync API   `);
  console.log(` HTTP Server: http://localhost:${PORT}                 `);
  console.log(` WebSocket:   ws://localhost:${PORT}/ws               `);
  console.log(`=======================================================`);
});
