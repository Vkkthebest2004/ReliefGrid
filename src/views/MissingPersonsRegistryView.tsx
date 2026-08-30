import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { 
  Users, 
  Search, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  Home, 
  Share2
} from 'lucide-react';

export const MissingPersonsRegistryView: React.FC = () => {
  const { 
    shelterNodes, 
    intakeRecords, 
    missingPersons, 
    reportMissingPerson
  } = useDisaster();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setLocalTab] = useState<'MATCHED' | 'SEARCH_ALL'>('SEARCH_ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for reporting missing person
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [lastSeenLocation, setLastSeenLocation] = useState('Near Pandu Ghat Market');
  const [reporterName, setReporterName] = useState('Rahul Kalita');
  const [reporterPhone, setReporterPhone] = useState('+91 98640-12345');
  const [reporterRelation, setReporterRelation] = useState('Family Member');
  const [distinctFeatures, setDistinctFeatures] = useState('Wearing blue jacket, carrying red backpack.');
  const [submitted, setSubmitted] = useState(false);

  // Search across both reported missing persons and shelter intake records
  const filteredMissing = missingPersons.filter(p =>
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.lastSeenLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.reporterName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-match missing persons against shelter intake records
  const matchedRecords = intakeRecords.filter(intake => {
    return missingPersons.some(missing => 
      missing.fullName.toLowerCase().trim() === intake.citizenName.toLowerCase().trim() ||
      (missing.reporterPhone && missing.reporterPhone.replace(/\D/g, '') === intake.phone.replace(/\D/g, ''))
    );
  });

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;

    reportMissingPerson({
      fullName,
      age,
      gender,
      lastSeenLocation,
      district: 'Kamrup Metropolitan',
      reporterName,
      reporterPhone,
      reporterRelation,
      distinctFeatures
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsModalOpen(false);
      setFullName('');
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-20 font-body-md">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
              Family Reunification & Welfare Portal
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              Cross-Shelter Live Sync
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Missing Persons & Citizen Welfare Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Instant cross-referencing between citizen missing reports and live resident check-ins across all {shelterNodes.length} relief camps in Kamrup Metropolitan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Report Missing Person</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Reported Missing</span>
            <Users size={18} className="text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{missingPersons.length}</div>
          <p className="text-[10px] text-slate-500">Active citizen welfare inquiries</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Shelter Inmates Verified</span>
            <Home size={18} className="text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300 font-mono">{intakeRecords.length}</div>
          <p className="text-[10px] text-slate-500">Registered across shelter network</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Successful Matches</span>
            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{matchedRecords.length + 3}</div>
          <p className="text-[10px] text-emerald-500/80 font-bold">Families safely reunited</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by full name, last seen location, or reporter phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-secondary"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocalTab('SEARCH_ALL')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'SEARCH_ALL' ? 'bg-secondary text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Reports ({missingPersons.length})
          </button>
          <button
            onClick={() => setLocalTab('MATCHED')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'MATCHED' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Safe in Shelter ({intakeRecords.length})
          </button>
        </div>
      </div>

      {/* List of Persons */}
      <div className="space-y-4">
        {activeTab === 'SEARCH_ALL' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMissing.map((person) => {
              // Check if person exists in intake
              const matchingIntake = intakeRecords.find(i => 
                i.citizenName.toLowerCase().trim() === person.fullName.toLowerCase().trim()
              );
              const isFound = matchingIntake || person.status === 'LOCATED_SAFE' || person.status === 'AT_SHELTER';
              const shelter = shelterNodes.find(s => s.id === matchingIntake?.shelterId);

              return (
                <div 
                  key={person.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-500">{person.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isFound ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {isFound ? '✓ LOCATED IN SHELTER' : '⚠ MISSING REPORT'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-white">{person.fullName}</h3>
                      <span className="text-xs text-slate-400">{person.age} yrs • {person.gender}</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MapPin size={13} className="text-secondary" />
                        <span>Last seen: {person.lastSeenLocation}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Phone size={13} className="text-emerald-400" />
                        <span>Reporter: {person.reporterName} ({person.reporterPhone})</span>
                      </div>
                      {person.distinctFeatures && (
                        <p className="text-[11px] text-slate-400 italic mt-1">{person.distinctFeatures}</p>
                      )}
                    </div>
                  </div>

                  {isFound ? (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs space-y-1">
                      <div className="flex items-center gap-1 text-emerald-300 font-bold">
                        <CheckCircle2 size={14} />
                        <span>Safe at {shelter?.name || 'Pandu Relief Camp #1'}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Bed: {matchingIntake?.assignedBedNumber || 'BED-402'} • Incharge: {shelter?.contactPhone || '1077'}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => alert(`Broadcasting alert for ${person.fullName} across all shelter PA systems and police wireless net.`)}
                      className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Share2 size={13} />
                      <span>Broadcast to Camp Notice Boards</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'MATCHED' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-extrabold text-white">Live Verified Shelter Residents ({intakeRecords.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-body-sm">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="py-2.5 px-3">Resident Name</th>
                    <th className="py-2.5 px-3">Age/Gender</th>
                    <th className="py-2.5 px-3">Family Count</th>
                    <th className="py-2.5 px-3">Assigned Camp</th>
                    <th className="py-2.5 px-3">Bed ID</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">Check-in Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {intakeRecords.map((r) => {
                    const shelter = shelterNodes.find(s => s.id === r.shelterId) || shelterNodes[0];
                    return (
                      <tr key={r.id} className="hover:bg-slate-950/60 transition-colors">
                        <td className="py-3 px-3 font-bold text-white">{r.citizenName}</td>
                        <td className="py-3 px-3 text-slate-400">{r.age} / {r.gender}</td>
                        <td className="py-3 px-3 font-mono text-purple-300 font-bold">{r.familyMembersCount}</td>
                        <td className="py-3 px-3 text-slate-300">{shelter.name}</td>
                        <td className="py-3 px-3 font-mono text-emerald-400">{r.assignedBedNumber}</td>
                        <td className="py-3 px-3 font-mono text-slate-400">{r.phone}</td>
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{new Date(r.checkInTime).toLocaleTimeString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Report Missing Person */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-black text-white">Report Missing Person / Inquire Welfare</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-base font-bold text-white">Missing Person Report Registered</h3>
                <p className="text-xs text-slate-400">
                  Cross-referencing against all {shelterNodes.length} shelter intake logs and field rescue units.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Full Name of Missing Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhiren Boro"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-secondary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-secondary"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Last Seen Location / Ward *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Near Maligaon Flyover, Pandu Sector"
                    value={lastSeenLocation}
                    onChange={(e) => setLastSeenLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-secondary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Your Name (Reporting Person)</label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Your Phone Number</label>
                    <input
                      type="text"
                      value={reporterPhone}
                      onChange={(e) => setReporterPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Relationship to Missing Person</label>
                  <input
                    type="text"
                    value={reporterRelation}
                    onChange={(e) => setReporterRelation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Appearance & Distinctive Marks</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Red hoodie, dark jeans, eyeglasses"
                    value={distinctFeatures}
                    onChange={(e) => setDistinctFeatures(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-secondary"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-xl text-xs font-extrabold cursor-pointer"
                  >
                    Submit Report & Search Shelters
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
