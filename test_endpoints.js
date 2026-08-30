// ReliefGrid Complete End-to-End API Integration Test Suite
const BASE_URL = 'http://localhost:5001';

async function runTests() {
  console.log('🧪 Starting ReliefGrid Multi-Role API & Real-time Integration Tests...\n');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message || err);
    }
  }

  // 1. Health Check
  await test('1. Health Check Endpoint (/health)', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'HEALTHY') throw new Error('Service status is not HEALTHY');
  });

  // 2. Citizen Registration
  await test('2. Citizen Auth Registration (/api/auth/register)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Pranab Jyoti Das',
        email: 'pranab.das@assam.in',
        phone: '+91 94350-99881',
        role: 'CITIZEN'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.user || !data.token) throw new Error('Invalid user or token in response');
  });

  // 3. Coordinator Login
  await test('3. Coordinator Auth Login (/api/auth/login)', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'saikia.sdrf@assam.gov.in' })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.user || data.user.role !== 'SHELTER_COORDINATOR') throw new Error('Invalid coordinator role');
  });

  // 4. Citizen SOS Beacon Creation
  let createdTicketId = '';
  await test('4. Citizen SOS Beacon Creation (/api/sos)', async () => {
    const res = await fetch(`${BASE_URL}/api/sos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        citizenName: 'Pranab Jyoti Das',
        phone: '+91 94350-99881',
        lat: 26.1582,
        lng: 91.6885,
        landmark: 'Near Maligaon Railway Gate #3, House 14',
        district: 'Kamrup Metropolitan',
        zoneId: 'Z-GHY-W-01',
        zoneName: 'Pandu / Maligaon',
        trappedCount: 4,
        waterLevel: 'CHEST_LEVEL',
        hasInjured: true,
        hasInfants: false,
        hasElderly: true,
        medicalDescription: 'Severe asthma and leg trauma. Water rising 10cm/hr.'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.data || !data.data.id) throw new Error('Failed to create ticket');
    createdTicketId = data.data.id;
    if (data.data.triagePriorityScore < 60) throw new Error('Expected high priority score for chest level + injured');
  });

  // 5. Government / Shelter Triage List
  await test('5. Central SOS Distress Triage List (/api/sos)', async () => {
    const res = await fetch(`${BASE_URL}/api/sos`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const found = data.data.find(t => t.id === createdTicketId);
    if (!found) throw new Error(`Created ticket ${createdTicketId} not found in central queue`);
  });

  // 6. Officer Dispatches Rescue Unit to Citizen SOS
  await test('6. Officer Dispatch Rescue Unit (/api/sos/:id PATCH)', async () => {
    const res = await fetch(`${BASE_URL}/api/sos/${createdTicketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'RESCUE_DISPATCHED',
        assignedUnit: 'NDRF 1st BN - Boat Alpha-03',
        assignedUnitPhone: '+91 94351-22334',
        etaMinutes: 12,
        note: 'Assigned zodiac inflatable boat unit from Pandu Ghat tactical staging area.',
        updatedBy: 'DEOC Tactical Commander'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.data.status !== 'RESCUE_DISPATCHED' || data.data.etaMinutes !== 12) {
      throw new Error('Ticket status or ETA not properly updated');
    }
  });

  // 7. List Shelters and Current Capacity
  await test('7. Shelter Directory & Live Occupancy (/api/shelters)', async () => {
    const res = await fetch(`${BASE_URL}/api/shelters`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.data) || data.data.length === 0) throw new Error('No shelters returned');
  });

  // 8. Shelter Coordinator Check-In Resident Intake
  await test('8. Shelter Resident Check-In & Auto Occupancy Count (/api/shelters/SH-GHY-001/checkin)', async () => {
    const initialRes = await fetch(`${BASE_URL}/api/shelters/SH-GHY-001`);
    const initialData = await initialRes.json();
    const initialOccupancy = initialData.data.currentOccupancy;

    const checkInRes = await fetch(`${BASE_URL}/api/shelters/SH-GHY-001/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        citizenName: 'Dhiren Boro',
        aadhaarOrId: 'XXXX-XXXX-8821',
        phone: '+91 98641-00992',
        familyMembersCount: 3,
        gender: 'Male',
        age: 42,
        assignedBedNumber: 'BED-743',
        medicalCondition: 'Mild dehydration',
        dietaryNeeds: 'Regular'
      })
    });
    if (!checkInRes.ok) throw new Error(`HTTP ${checkInRes.status}`);
    
    // Verify updated occupancy
    const updatedRes = await fetch(`${BASE_URL}/api/shelters/SH-GHY-001`);
    const updatedData = await updatedRes.json();
    if (updatedData.data.currentOccupancy !== initialOccupancy + 3) {
      throw new Error(`Occupancy did not increment by 3. Expected ${initialOccupancy + 3}, got ${updatedData.data.currentOccupancy}`);
    }
  });

  // 9. Shelter Outbound Requisition to DDMA
  await test('9. Outbound Shelter DDMA Supply Requisition (/api/shelters/SH-GHY-001/restock)', async () => {
    const res = await fetch(`${BASE_URL}/api/shelters/SH-GHY-001/restock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        district: 'Kamrup Metropolitan',
        zoneId: 'Z-GHY-W-01',
        items: [
          { name: 'Chlorine Water Purification Tablets', category: 'WATER', quantity: 10000, unit: 'tablets' }
        ],
        urgency: 'IMMEDIATE_4H',
        reason: 'Groundwater tank backflow contamination'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.data || !data.data.id) throw new Error('Failed to create restock order');
  });

  // 10. Citizen Safety Map Facilities
  await test('10. Citizen Verified Safety Map Hubs (/api/citizen/safety)', async () => {
    const res = await fetch(`${BASE_URL}/api/citizen/safety`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.shelters || data.shelters.length === 0) throw new Error('No safety facilities returned');
  });

  // 11. Citizen Emergency Broadcast Alerts
  await test('11. Citizen Emergency Broadcast Alerts (/api/citizen/alerts)', async () => {
    const res = await fetch(`${BASE_URL}/api/citizen/alerts`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('No alerts returned');
  });

  // 12. Cross-System Event Broadcast
  await test('12. Cross-System WebSocket Broadcast (/api/broadcast)', async () => {
    const res = await fetch(`${BASE_URL}/api/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'TEST-EVT-01',
        type: 'DISTRICT_ALERT_ISSUED',
        source: 'COMMAND_CENTER',
        timestamp: new Date().toISOString(),
        payload: { level: 'RED_ALERT', message: 'Heavy rainfall warning in effect' }
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('Broadcast failed');
  });

  console.log(`\n=======================================================`);
  console.log(` 🏁 Test Results: ${passed}/${total} Tests Passed (${Math.round((passed/total)*100)}%)`);
  console.log(`=======================================================\n`);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
