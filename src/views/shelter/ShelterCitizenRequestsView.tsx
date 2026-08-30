import React, { useState } from 'react';
import { 
  ArrowLeft, 
  LifeBuoy, 
  Search, 
  Phone, 
  MapPin
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';
import type { CitizenSOSTicket, SOSBeaconStatus } from '../../types';

export const ShelterCitizenRequestsView: React.FC = () => {
  const { 
    citizenSOSTickets, 
    updateSOSTicket, 
    setActiveTab, 
    selectedShelterNode,
    shelterNodes 
  } = useDisaster();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<CitizenSOSTicket | null>(null);

  // Dispatch modal fields
  const [assignedUnit, setAssignedUnit] = useState('SDRF Inflatable Boat Unit 04');
  const [assignedPhone, setAssignedPhone] = useState('+91 94350-99122');
  const [etaMinutes, setEtaMinutes] = useState(15);
  const [dispatchNote, setDispatchNote] = useState('Dispatching crew to stranded rooftop location.');

  const shelter = selectedShelterNode || shelterNodes[0];

  const filteredTickets = citizenSOSTickets.filter((t) => {
    const matchQuery = t.citizenName.toLowerCase().includes(search.toLowerCase()) ||
      t.landmark.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchQuery && matchStatus;
  });

  const handleUpdateStatus = (ticketId: string, status: SOSBeaconStatus, note: string) => {
    updateSOSTicket(ticketId, status, note, assignedUnit, assignedPhone, etaMinutes);
    setSelectedTicket(null);
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

        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
          <LifeBuoy size={14} />
          <span>Sector Citizen Distress Triage</span>
        </div>
      </div>

      {/* Hero Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Field Operations Desk
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Citizen Help & Evacuation Requests
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Triage distress calls from flood-affected residents in <strong className="text-white">{shelter?.name}</strong> catchment area.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-red-950 text-red-300 text-xs font-bold border border-red-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span>{citizenSOSTickets.length} Active Distress Beacons</span>
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'BEACON_ACTIVE', 'TRIAGE_VERIFIED', 'RESCUE_DISPATCHED', 'EVACUATED_TO_SHELTER'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                filterStatus === st
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search victim name or landmark..."
            className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Request Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTickets.map((ticket) => {
          const isUrgent = ticket.triagePriorityScore >= 80;
          return (
            <div
              key={ticket.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{ticket.id}</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                      isUrgent ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-amber-950 text-amber-300'
                    }`}>
                      Triage: {ticket.triagePriorityScore}/100
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-white flex items-center justify-between">
                    <span>{ticket.citizenName} ({ticket.trappedCount} people)</span>
                    <span className="text-xs font-mono text-blue-400 font-normal">{ticket.waterLevel.replace('_', ' ')}</span>
                  </h3>
                  <p className="text-xs text-slate-400 flex items-start gap-1">
                    <MapPin size={13} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>{ticket.landmark} ({ticket.zoneName})</span>
                  </p>
                  {ticket.medicalDescription && (
                    <p className="text-xs text-red-300 bg-red-950/40 p-2 rounded-lg border border-red-900/40">
                      🚨 {ticket.medicalDescription}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <a
                  href={`tel:${ticket.phone}`}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                >
                  <Phone size={13} />
                  <span>Call {ticket.phone}</span>
                </a>

                <button
                  onClick={() => setSelectedTicket(ticket)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-purple-600/20"
                >
                  Update & Assign Rescue
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action / Dispatch Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Assign Rescue for #{selectedTicket.id}</h3>
                <p className="text-xs text-slate-400">{selectedTicket.citizenName} • {selectedTicket.trappedCount} stranded</p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Assigned Rescue Team / Boat</label>
                <input
                  type="text"
                  value={assignedUnit}
                  onChange={(e) => setAssignedUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Driver / Team Phone</label>
                  <input
                    type="tel"
                    value={assignedPhone}
                    onChange={(e) => setAssignedPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">ETA (Minutes)</label>
                  <input
                    type="number"
                    value={etaMinutes}
                    onChange={(e) => setEtaMinutes(Number(e.target.value) || 10)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Dispatch Note to Citizen</label>
                <textarea
                  rows={2}
                  value={dispatchNote}
                  onChange={(e) => setDispatchNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedTicket.id, 'RESCUE_DISPATCHED', dispatchNote)}
                  className="py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl cursor-pointer shadow-lg shadow-purple-600/30"
                >
                  Dispatch Rescue Unit
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedTicket.id, 'EVACUATED_TO_SHELTER', 'Evacuation verified. Safely checked into camp.')}
                  className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer shadow-lg shadow-emerald-600/30"
                >
                  Mark as Evacuated ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
