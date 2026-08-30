import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Megaphone, 
  Plus, 
  AlertTriangle, 
  Volume2
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';

interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: 'CRITICAL' | 'IMPORTANT' | 'ROUTINE';
  timestamp: string;
  author: string;
  channel: 'LOUDSPEAKER_PA' | 'SMS_BROADCAST' | 'CAMP_NOTICE';
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ANN-01',
    title: 'Boiled Drinking Water Distribution at Pavilion Gate #2',
    message: 'Fresh tanker delivery from Jal Board arrived. Please collect potable drinking water and chlorine tablets between 10:00 AM and 1:00 PM.',
    priority: 'IMPORTANT',
    timestamp: 'Today, 09:30 AM',
    author: 'Camp Commander (SDRF)',
    channel: 'LOUDSPEAKER_PA'
  },
  {
    id: 'ANN-02',
    title: 'Medical Health Camp & Pediatric Vaccination Drive',
    message: 'Doctors from GMCH are conducting free OPD check-ups and tetanus shots in School Block A from 11:00 AM.',
    priority: 'ROUTINE',
    timestamp: 'Today, 08:45 AM',
    author: 'Dr. Tarun Kalita (Medical Officer)',
    channel: 'CAMP_NOTICE'
  },
  {
    id: 'ANN-03',
    title: 'Weather Warning: Heavy Rainfall Expected at 3:00 PM',
    message: 'NDMA satellite radar forecasts 60mm/hr precipitation. All residents are advised to remain within elevated shelter pavilions.',
    priority: 'CRITICAL',
    timestamp: 'Today, 07:15 AM',
    author: 'DDMA DEOC Control',
    channel: 'SMS_BROADCAST'
  }
];

export const ShelterAnnouncementsView: React.FC = () => {
  const { setActiveTab, selectedShelterNode, shelterNodes } = useDisaster();

  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal form states
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'CRITICAL' | 'IMPORTANT' | 'ROUTINE'>('IMPORTANT');
  const [channel, setChannel] = useState<'LOUDSPEAKER_PA' | 'SMS_BROADCAST' | 'CAMP_NOTICE'>('LOUDSPEAKER_PA');

  const shelter = selectedShelterNode || shelterNodes[0];

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnn: Announcement = {
      id: `ANN-${Date.now().toString().slice(-4)}`,
      title,
      message,
      priority,
      timestamp: 'Just now',
      author: shelter?.officerInCharge || 'Shelter In-Charge',
      channel
    };
    setAnnouncements([newAnn, ...announcements]);
    setIsModalOpen(false);
    setTitle('');
    setMessage('');
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

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
        >
          <Plus size={15} />
          <span>Broadcast Public Notice</span>
        </button>
      </div>

      {/* Hero Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
            Resident Public Address & Alert System
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            Camp Announcements & Advisories
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Broadcast emergency alerts, meal schedules, and medical advisories for <strong className="text-white">{shelter?.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-2">
            <Volume2 size={15} className="text-purple-400" />
            <span>PA System Online</span>
          </span>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => {
          const isCrit = ann.priority === 'CRITICAL';
          const isImp = ann.priority === 'IMPORTANT';
          return (
            <div
              key={ann.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-xl space-y-3 transition-all ${
                isCrit ? 'border-red-800/80 bg-gradient-to-r from-red-950/30 to-slate-900' :
                isImp ? 'border-amber-800/80 bg-gradient-to-r from-amber-950/20 to-slate-900' :
                'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isCrit ? 'bg-red-950 text-red-300 border border-red-800' :
                    isImp ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {ann.priority}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Channel: {ann.channel.replace(/_/g, ' ')}</span>
                </div>
                <span className="text-xs font-mono text-slate-400">{ann.timestamp}</span>
              </div>

              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {isCrit && <AlertTriangle size={18} className="text-red-400" />}
                <span>{ann.title}</span>
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {ann.message}
              </p>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Issued by: <strong className="text-slate-300">{ann.author}</strong></span>
                <span className="text-purple-400 font-bold">Relayed to {shelter?.currentOccupancy || 742} Residents</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Broadcast Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">Broadcast Camp Notice</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Boiled water distribution in Block B"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="CRITICAL">Critical Emergency</option>
                    <option value="IMPORTANT">Important Advisory</option>
                    <option value="ROUTINE">Routine Schedule</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Broadcast Medium</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="LOUDSPEAKER_PA">Camp Loudspeaker PA</option>
                    <option value="SMS_BROADCAST">Sector SMS Broadcast</option>
                    <option value="CAMP_NOTICE">Notice Board</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Notice Message Text</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type official message text clearly..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl cursor-pointer shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
                >
                  <Megaphone size={14} />
                  <span>Transmit Broadcast Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
