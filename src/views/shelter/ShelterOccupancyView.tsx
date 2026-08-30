import React, { useState } from 'react';
import { 
  Search, 
  ArrowLeft, 
  UserPlus, 
  UserCheck
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';

export const ShelterOccupancyView: React.FC = () => {
  const { 
    selectedShelterNode, 
    shelterNodes, 
    intakeRecords, 
    registerCitizenIntake, 
    setActiveTab 
  } = useDisaster();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for Check-in Modal
  const [citizenName, setCitizenName] = useState('');
  const [aadhaarOrId, setAadhaarOrId] = useState('');
  const [phone, setPhone] = useState('');
  const [familyMembersCount, setFamilyMembersCount] = useState<number>(1);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [age, setAge] = useState<number>(35);
  const [assignedBedNumber, setAssignedBedNumber] = useState(`BED-${Math.floor(100 + Math.random() * 900)}`);
  const [medicalCondition, setMedicalCondition] = useState('None');
  const [dietaryNeeds] = useState('Regular Meal');

  const shelter = selectedShelterNode || shelterNodes[0];

  if (!shelter) return <div className="p-8 text-center text-slate-400">Loading occupancy node…</div>;

  const occupied = shelter.currentOccupancy;
  const total = shelter.totalBedCapacity;
  const available = Math.max(0, total - occupied);
  const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;

  const handleRegisterIntake = (e: React.FormEvent) => {
    e.preventDefault();
    registerCitizenIntake({
      shelterId: shelter.id,
      citizenName,
      aadhaarOrId: aadhaarOrId || 'VERIFIED-TEMPORARY-ID',
      phone: phone || '+91 98640-00000',
      familyMembersCount,
      gender,
      age,
      assignedBedNumber,
      medicalCondition,
      dietaryNeeds
    });

    setIsModalOpen(false);
    // Reset form
    setCitizenName('');
    setAadhaarOrId('');
    setPhone('');
    setAssignedBedNumber(`BED-${Math.floor(100 + Math.random() * 900)}`);
  };

  const filteredRecords = intakeRecords.filter(r => 
    r.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.aadhaarOrId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.assignedBedNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 font-body-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('shelter-dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
        >
          <UserPlus size={15} />
          <span>Record New Citizen Intake</span>
        </button>
      </div>

      {/* Hero Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
            Real-Time Capacity Telemetry
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Occupancy & Intake Control
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Facility: <strong className="text-white">{shelter.name}</strong>
          </p>
        </div>

        {/* Capacity Bar & Utilization */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Total Utilization:</span>
            <strong className="text-white font-mono">{pct}% ({occupied}/{total})</strong>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                pct > 90 ? 'bg-red-500' : pct > 75 ? 'bg-amber-500' : 'bg-purple-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>0 Beds</span>
            <span className="text-emerald-400 font-bold">{available} Beds Free</span>
            <span>{total} Max</span>
          </div>
        </div>

        {/* Quick Stat Pill */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Intake Logs Today</span>
            <strong className="text-xl font-black text-white block font-mono">{intakeRecords.length} Residents</strong>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <UserCheck size={20} />
          </div>
        </div>
      </div>

      {/* Intake Registry Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-white">Registered Citizen Intake Registry</h3>
            <p className="text-xs text-slate-400">Search by citizen name, Aadhaar/ID, or bed number</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resident..."
              className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="pb-3">Resident Name</th>
                <th className="pb-3">ID / Aadhaar</th>
                <th className="pb-3">Assigned Bed</th>
                <th className="pb-3">Family Size</th>
                <th className="pb-3">Medical Status</th>
                <th className="pb-3">Check-In Timestamp</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 font-bold text-white">
                    {record.citizenName}
                    <span className="block text-[10px] text-slate-500 font-normal">{record.phone}</span>
                  </td>
                  <td className="py-3.5 font-mono text-slate-300">
                    {record.aadhaarOrId}
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-1 rounded bg-purple-950 text-purple-300 font-mono font-bold text-[11px] border border-purple-800">
                      {record.assignedBedNumber}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-300 font-mono">
                    {record.familyMembersCount} members
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      record.medicalCondition === 'None'
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}>
                      {record.medicalCondition}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-400 font-mono text-[11px]">
                    {record.checkInTime}
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold text-[10px] border border-emerald-800">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Check-In Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Record Citizen Intake</h3>
                <p className="text-xs text-slate-400">Assign bed and register demographic details</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterIntake} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Citizen Full Name</label>
                <input
                  type="text"
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="e.g. Biren Das"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Aadhaar / Ration Card #</label>
                  <input
                    type="text"
                    value={aadhaarOrId}
                    onChange={(e) => setAadhaarOrId(e.target.value)}
                    placeholder="XXXX-XXXX-XXXX"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98XXX-XXXXX"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Family Count</label>
                  <input
                    type="number"
                    min={1}
                    value={familyMembersCount}
                    onChange={(e) => setFamilyMembersCount(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value) || 30)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Assigned Bed Number</label>
                <input
                  type="text"
                  required
                  value={assignedBedNumber}
                  onChange={(e) => setAssignedBedNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Medical Condition / Allergies</label>
                <input
                  type="text"
                  value={medicalCondition}
                  onChange={(e) => setMedicalCondition(e.target.value)}
                  placeholder="e.g. Hypertension, Diabetic, Wound Dressing"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl cursor-pointer shadow-lg shadow-purple-600/30"
                >
                  Confirm & Check-In Resident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
