import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Save, 
  CheckCircle2, 
  ShieldCheck
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';

export const ShelterSettingsView: React.FC = () => {
  const { selectedShelterNode, shelterNodes, setActiveTab } = useDisaster();

  const shelter = selectedShelterNode || shelterNodes[0];

  const [name, setName] = useState(shelter?.name || 'Pandu Relief Camp #1');
  const [address, setAddress] = useState(shelter?.address || 'Pandu High School Complex, Railway Colony Road');
  const [officer, setOfficer] = useState(shelter?.officerInCharge || 'Maj. Vikramjit Saikia (Retd. SDRF)');
  const [phone, setPhone] = useState(shelter?.contactPhone || '+91 94350-88123');
  const [capacity, setCapacity] = useState(shelter?.totalBedCapacity || 850);
  const [waterCapacity, setWaterCapacity] = useState(shelter?.waterReservesLiters || 25000);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 font-body-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('shelter-dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
          <Settings size={14} />
          <span>Facility Operational Configuration</span>
        </div>
      </div>

      {/* Hero Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
          Facility Master Registry
        </span>
        <h1 className="text-2xl font-black text-white mt-1">
          Shelter Settings & Parameters
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure maximum bed capacity, generator parameters, and emergency contact details for official DEOC integration.
        </p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 text-xs">
        <div>
          <label className="block text-slate-300 font-bold mb-1">Official Facility Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">Physical Address & Access Route</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Camp Commander / Officer-in-Charge</label>
            <input
              type="text"
              required
              value={officer}
              onChange={(e) => setOfficer(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Emergency Operations Desk Phone</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Maximum Authorized Bed Capacity</label>
            <input
              type="number"
              min={50}
              required
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value) || 50)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Water Storage Capacity (Liters)</label>
            <input
              type="number"
              min={1000}
              required
              value={waterCapacity}
              onChange={(e) => setWaterCapacity(Number(e.target.value) || 1000)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-slate-400 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Synchronized with ASDMA District Node Registry</span>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2 cursor-pointer"
          >
            {saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
            <span>{saved ? 'Parameters Saved ✓' : 'Save Facility Parameters'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
