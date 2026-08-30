import React, { useState } from 'react';
import { 
  ArrowLeft, 
  LifeBuoy, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Ambulance, 
  Plus
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';
import type { SOSBeaconStatus } from '../../types';

const STATUS_STEPS: Array<{ key: SOSBeaconStatus; label: string; description: string }> = [
  { key: 'BEACON_ACTIVE', label: 'Distress Beacon Transmitted', description: 'GPS coordinates and victim count received by central DEOC system.' },
  { key: 'TRIAGE_VERIFIED', label: 'AI Triage & Urgency Verified', description: 'Automated severity score generated; medical risk flagged.' },
  { key: 'RESCUE_DISPATCHED', label: 'Rescue Unit Assigned', description: 'NDRF / SDRF fast-response team tasked for ground deployment.' },
  { key: 'EN_ROUTE', label: 'Boat / Ambulance En-Route', description: 'Rescue crew navigating towards your GPS coordinates.' },
  { key: 'EVACUATED_TO_SHELTER', label: 'Evacuation Complete', description: 'Safely transported to designated relief camp.' }
];

function getStepIndex(status: SOSBeaconStatus): number {
  switch (status) {
    case 'BEACON_ACTIVE': return 0;
    case 'TRIAGE_VERIFIED': return 1;
    case 'RESCUE_DISPATCHED': return 2;
    case 'EN_ROUTE': return 3;
    case 'RESCUE_IN_PROGRESS': return 3;
    case 'EVACUATED_TO_SHELTER': return 4;
    case 'RESOLVED': return 4;
    default: return 0;
  }
}

export const CitizenRequestsView: React.FC = () => {
  const { 
    setActiveTab, 
    citizenSOSTickets
  } = useDisaster();

  const [selectedTicketId, setSelectedTicketId] = useState<string>(citizenSOSTickets[0]?.id || '');

  const activeTicket = citizenSOSTickets.find(t => t.id === selectedTicketId) || citizenSOSTickets[0];
  const activeStepIdx = activeTicket ? getStepIndex(activeTicket.status) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 font-body-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('citizen-home')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <button
          onClick={() => setActiveTab('citizen-need-help')}
          className="flex items-center gap-1.5 text-xs font-extrabold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 rounded-xl border border-amber-500/30 transition-all cursor-pointer shadow-md shadow-amber-500/10"
        >
          <Plus size={15} />
          <span>New Help Request</span>
        </button>
      </div>

      {/* Hero Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Citizen Emergency Dispatch Status
          </span>
          <h1 className="text-xl font-extrabold text-white mt-0.5">
            Active Rescue Tracking
          </h1>
          <p className="text-xs text-slate-400">
            Real-time status stream synchronized with District Disaster Management Authority.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Response Uplink</span>
          </span>
        </div>
      </div>

      {citizenSOSTickets.length === 0 ? (
        /* Empty State */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <LifeBuoy size={28} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Active Distress Beacons</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You do not have any open rescue requests at the moment. If you require emergency assistance, tap Get Help.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('citizen-need-help')}
            className="py-3 px-6 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 cursor-pointer"
          >
            Create Emergency SOS Request
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Ticket Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
              Your Requests ({citizenSOSTickets.length})
            </span>

            {citizenSOSTickets.map((ticket) => {
              const isSelected = ticket.id === activeTicket?.id;
              return (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-850 border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-amber-400">{ticket.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ticket.status === 'EN_ROUTE' ? 'bg-purple-950 text-purple-300' :
                      ticket.status === 'RESCUE_DISPATCHED' ? 'bg-blue-950 text-blue-300' :
                      'bg-red-950 text-red-300'
                    }`}>
                      {ticket.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white truncate">
                    {ticket.medicalDescription || `${ticket.trappedCount} People Trapped`}
                  </h4>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {ticket.landmark}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>Triage: {ticket.triagePriorityScore}/100</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Ticket Live Timeline */}
          {activeTicket && (
            <div className="lg:col-span-8 space-y-5">
              {/* Ticket Overview Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">SOS TICKET ID</span>
                    <h3 className="text-base font-black text-white">{activeTicket.id}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">Priority Score</span>
                    <strong className="text-xl font-mono text-red-400">{activeTicket.triagePriorityScore}/100</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block font-bold">Trapped Count</span>
                    <strong className="text-white text-sm">{activeTicket.trappedCount} People</strong>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block font-bold">Water Level</span>
                    <strong className="text-blue-400 text-sm font-semibold">{activeTicket.waterLevel.replace('_', ' ')}</strong>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block font-bold">Vulnerabilities</span>
                    <strong className="text-amber-400 text-sm font-semibold">
                      {[activeTicket.hasInjured && 'Medical', activeTicket.hasElderly && 'Elderly', activeTicket.hasInfants && 'Infant'].filter(Boolean).join(', ') || 'None'}
                    </strong>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin size={13} className="text-amber-400" />
                    <span>Landmark: <strong className="text-white">{activeTicket.landmark}</strong></span>
                  </div>
                  <div className="text-slate-400 pl-4 font-mono text-[11px]">
                    GPS: {activeTicket.lat.toFixed(5)}° N, {activeTicket.lng.toFixed(5)}° E • {activeTicket.zoneName}
                  </div>
                </div>

                {/* Assigned Rescue Unit (if dispatched) */}
                {activeTicket.assignedUnit && (
                  <div className="bg-gradient-to-r from-purple-950/60 to-slate-950 border border-purple-800/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                        <Ambulance size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                          Assigned Tactical Rescue Team
                        </span>
                        <h4 className="text-xs font-bold text-white">
                          {activeTicket.assignedUnit}
                        </h4>
                        <p className="text-[11px] text-emerald-400 font-bold">
                          Estimated Arrival: ~{activeTicket.etaMinutes || 12} minutes
                        </p>
                      </div>
                    </div>

                    {activeTicket.assignedUnitPhone && (
                      <a
                        href={`tel:${activeTicket.assignedUnitPhone}`}
                        className="py-2 px-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-purple-600/20"
                      >
                        <Phone size={13} />
                        <span>Call Team</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Step Progression Timeline */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Response Progression Pipeline
                </h4>

                <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                  {STATUS_STEPS.map((step, idx) => {
                    const isDone = idx <= activeStepIdx;
                    const isCurrent = idx === activeStepIdx;
                    return (
                      <div key={step.key} className="flex items-start gap-4 relative">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all z-10 ${
                          isDone 
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30' 
                            : 'bg-slate-950 border border-slate-800 text-slate-500'
                        }`}>
                          {isDone ? <CheckCircle2 size={15} /> : idx + 1}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h5 className={`text-xs font-bold ${isCurrent ? 'text-amber-400' : isDone ? 'text-white' : 'text-slate-500'}`}>
                              {step.label}
                            </h5>
                            {isCurrent && (
                              <span className="px-2 py-0.2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold animate-pulse">
                                Current Step
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
