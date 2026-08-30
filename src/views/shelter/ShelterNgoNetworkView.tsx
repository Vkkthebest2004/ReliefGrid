import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Phone, 
  CheckCircle2, 
  Send, 
  MessageSquare
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';

interface NgoRecord {
  id: string;
  name: string;
  type: string;
  status: 'ACTIVE' | 'STANDBY' | 'DEPLOYED';
  location: string;
  contactPerson: string;
  phone: string;
  volunteersCount: number;
  capabilities: string[];
  assignedSectors: string[];
}

const INITIAL_NGOS: NgoRecord[] = [
  {
    id: 'NGO-01',
    name: 'Indian Red Cross Society (Assam State Branch)',
    type: 'Humanitarian & First Aid',
    status: 'ACTIVE',
    location: 'Guwahati Panbazar Office',
    contactPerson: 'Dr. Mukul Goswami',
    phone: '+91 94350-11223',
    volunteersCount: 45,
    capabilities: ['First Aid & Medical OPD', 'Water Purification Tablets', 'Blood Bank Reserves', 'Hygiene Kits'],
    assignedSectors: ['Pandu', 'Maligaon', 'Jalukbari']
  },
  {
    id: 'NGO-02',
    name: 'Oxfam India Flood Relief Response',
    type: 'WASH & Food Security',
    status: 'ACTIVE',
    location: 'Six Mile Warehouse, Guwahati',
    contactPerson: 'Anjali Sharma',
    phone: '+91 98640-55441',
    volunteersCount: 30,
    capabilities: ['Community Mobile Kitchens', 'Water Tanker Deployment', 'Temporary Sanitation Units'],
    assignedSectors: ['Beltola', 'Chandmari', 'Khanapara']
  },
  {
    id: 'NGO-03',
    name: 'Khalsa Aid International (Assam Mission)',
    type: 'Disaster Relief & Langar',
    status: 'ACTIVE',
    location: 'Maligaon Gurudwara Relief Base',
    contactPerson: 'Gurpreet Singh',
    phone: '+91 94351-99882',
    volunteersCount: 60,
    capabilities: ['Hot Meals (10,000/day)', 'Dry Ration Packets', 'Drinking Water Sachets', 'Inflatable Boats'],
    assignedSectors: ['Pandu Sector', 'Railway Colony', 'Bharalumukh']
  },
  {
    id: 'NGO-04',
    name: 'Doctors For You — Rapid Medical Unit',
    type: 'Emergency Medical & Trauma',
    status: 'ACTIVE',
    location: 'GMCH Campus Base',
    contactPerson: 'Dr. Tarun Kalita',
    phone: '+91 98642-77119',
    volunteersCount: 22,
    capabilities: ['Mobile Medical Van', 'Tetanus & Snake Antivenom', 'Pediatric Care', 'Mental Health Support'],
    assignedSectors: ['Dispur', 'Ulubari', 'Fancy Bazar']
  }
];

export const ShelterNgoNetworkView: React.FC = () => {
  const { setActiveTab } = useDisaster();

  const [ngos] = useState<NgoRecord[]>(INITIAL_NGOS);
  const [search, setSearch] = useState('');
  const [selectedNgo, setSelectedNgo] = useState<NgoRecord | null>(null);
  const [taskNote, setTaskNote] = useState('');
  const [taskSector, setTaskSector] = useState('Pandu Relief Camp #1');
  const [taskSent, setTaskSent] = useState(false);

  const filteredNgos = ngos.filter(n =>
    n.name.toLowerCase().includes(search.toLowerCase()) ||
    n.capabilities.some(c => c.toLowerCase().includes(search.toLowerCase())) ||
    n.assignedSectors.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    setTaskSent(true);
    setTimeout(() => {
      setTaskSent(false);
      setSelectedNgo(null);
      setTaskNote('');
    }, 1500);
  };

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

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/60">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{ngos.length} Verified NGOs Operating in Metro Zone</span>
        </div>
      </div>

      {/* Hero Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
            Inter-Agency Civil Society Hub
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Active NGO & Volunteer Network
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Coordinate cooked meals, medical triage, and field evacuations with registered humanitarian organizations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Field Volunteers</span>
            <strong className="text-sm font-mono text-purple-400">157 Active on Duty</strong>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by NGO name, capability, or assigned sector..."
          className="w-full pl-8 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* NGO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNgos.map((ngo) => (
          <div
            key={ngo.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  {ngo.status}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {ngo.volunteersCount} Active Volunteers
                </span>
              </div>

              <h3 className="text-base font-bold text-white">
                {ngo.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {ngo.type} • Contact: <strong className="text-slate-200">{ngo.contactPerson}</strong>
              </p>

              {/* Capabilities */}
              <div className="mt-3 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Operational Capabilities:</span>
                <div className="flex flex-wrap gap-1.5">
                  {ngo.capabilities.map((cap, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 text-[11px] border border-slate-800">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <a
                href={`tel:${ngo.phone}`}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <Phone size={13} />
                <span>Call {ngo.phone}</span>
              </a>

              <button
                onClick={() => setSelectedNgo(ngo)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-purple-600/20 flex items-center gap-1.5"
              >
                <MessageSquare size={13} />
                <span>Assign Task</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Task Assignment Modal */}
      {selectedNgo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Assign Task to {selectedNgo.name}</h3>
                <p className="text-xs text-slate-400">Coordinator: {selectedNgo.contactPerson} ({selectedNgo.phone})</p>
              </div>
              <button
                onClick={() => setSelectedNgo(null)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {taskSent ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Task Dispatched to {selectedNgo.name}!</h4>
                <p className="text-xs text-slate-400">Team notified via SMS and DDMA coordination network.</p>
              </div>
            ) : (
              <form onSubmit={handleAssignTask} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target Sector / Camp</label>
                  <input
                    type="text"
                    required
                    value={taskSector}
                    onChange={(e) => setTaskSector(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Task Description & Requirements</label>
                  <textarea
                    rows={3}
                    required
                    value={taskNote}
                    onChange={(e) => setTaskNote(e.target.value)}
                    placeholder="e.g. Requesting deployment of 500 hot meal packets and 1 mobile medical unit to Pandu Camp Block B by 12:00 PM."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl cursor-pointer shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
                  >
                    <Send size={14} />
                    <span>Dispatch Coordination Task</span>
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
