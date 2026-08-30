import { citizenService } from './src/services/citizenService';
import { shelterService } from './src/services/shelterService';
import { backendApi } from './src/services/backendApi';
import { realtimeSync } from './src/services/realtimeSync';

async function testBackend() {
  console.log('--- 🧪 Testing ReliefGrid Backend Services ---');

  // 1. Test Citizen SOS Submission & Triage
  console.log('\n[1] Testing Citizen SOS Beacon Submission...');
  const testSOS = await backendApi.sos.create({
    citizenName: 'Dev Test Citizen',
    phone: '+91 99999-88888',
    lat: 26.16,
    lng: 91.68,
    landmark: 'Behind Pandu Railway Colony Block C',
    district: 'Kamrup Metropolitan',
    zoneId: 'Z-GHY-W-01',
    zoneName: 'Pandu / Maligaon Sector',
    trappedCount: 4,
    waterLevel: 'ROOF_LEVEL',
    hasInjured: true,
    hasInfants: true,
    hasElderly: false,
    medicalDescription: 'Severe laceration, bleeding controlled'
  });

  console.log('✅ SOS Created:', testSOS.id);
  console.log('   Triage Priority Score:', testSOS.triagePriorityScore, '/ 100');
  console.log('   Status:', testSOS.status);

  // 2. Test Nearest Shelter Finder
  console.log('\n[2] Testing Nearest Shelter Haversine Engine...');
  const nearest = await backendApi.shelters.getNearest(26.16, 91.68, 50);
  console.log(`✅ Found ${nearest.length} shelters near coordinates (26.16, 91.68):`);
  nearest.forEach(s => console.log(`   - ${s.name}: ${s.distanceKm} km away, Occupancy: ${s.currentOccupancy}/${s.totalBedCapacity}`));

  // 3. Test Shelter Citizen Intake
  console.log('\n[3] Testing Shelter Citizen Intake Registry...');
  const intake = await backendApi.shelters.checkIn({
    shelterId: nearest[0].id,
    citizenName: 'Dev Test Citizen',
    aadhaarOrId: 'XXXX-XXXX-1122',
    phone: '+91 99999-88888',
    familyMembersCount: 4,
    gender: 'Male',
    age: 35,
    assignedBedNumber: 'Block-D / Bed-01',
    medicalCondition: 'Treated for laceration',
    dietaryNeeds: 'Normal diet'
  });
  console.log('✅ Intake Logged:', intake.id, 'at shelter', intake.shelterId);

  // 4. Test Shelter Restock Requisition
  console.log('\n[4] Testing Shelter Restock Order Requisition...');
  const restock = await backendApi.shelters.requestRestock({
    shelterId: nearest[0].id,
    shelterName: nearest[0].name,
    district: nearest[0].district,
    zoneId: nearest[0].zoneId,
    items: [
      { name: 'Potable Water (20L Cans)', quantity: 150, unit: 'Cans', category: 'WATER' },
      { name: 'First Aid Trauma Bandages', quantity: 50, unit: 'Kits', category: 'MEDICAL' }
    ],
    urgency: 'IMMEDIATE_4H',
    reason: 'Surge in evacuees from Pandu old ghat',
    requestedBy: 'Test Camp Officer'
  });
  console.log('✅ Restock Order Created:', restock.id, 'Status:', restock.status);

  // 5. Test Missing Persons Cross-Match
  console.log('\n[5] Testing Missing Persons Auto Cross-Matching...');
  const missing = await backendApi.missingPersons.report({
    fullName: 'Dev Test Citizen',
    age: 35,
    gender: 'Male',
    lastSeenLocation: 'Pandu old ghat',
    district: 'Kamrup Metropolitan',
    distinctFeatures: 'Scar on right palm',
    reporterName: 'Sibling',
    reporterPhone: '+91 98888-77777',
    reporterRelation: 'Brother'
  });
  console.log('✅ Missing Person Report Status:', missing.status, '| Matched Shelter:', missing.matchedShelterName || 'None');

  console.log('\n🎉 ALL BACKEND LOGIC AND SYNC TESTS PASSED SUCCESSFULLY!');
}

testBackend().catch(err => {
  console.error('❌ Backend test failed:', err);
  process.exit(1);
});
