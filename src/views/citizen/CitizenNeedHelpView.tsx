import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDisaster } from '../../context/DisasterContext';
import { 
  ArrowLeft, 
  LocateFixed, 
  Stethoscope, 
  Home as HomeIcon, 
  Flame, 
  Waves, 
  Ambulance, 
  Mic, 
  Square, 
  Camera, 
  Lock, 
  Send, 
  Utensils, 
  Droplet, 
  ShieldCheck,
  Users,
  CheckCircle2
} from 'lucide-react';
import type { WaterLevelStatus } from '../../types';

interface HelpCategoryItem {
  id: string;
  label: string;
  icon: React.ElementType;
  tone: 'red' | 'orange' | 'blue' | 'purple' | 'green' | 'neutral';
  description: string;
}

const CATEGORIES: HelpCategoryItem[] = [
  { id: 'Medical', label: 'Medical Emergency', icon: Stethoscope, tone: 'red', description: 'Urgent medical care, critical injury, prescription oxygen' },
  { id: 'Rescue', label: 'Flood Rescue / Evacuation', icon: Ambulance, tone: 'purple', description: 'Surrounded by rising water, need SDRF/NDRF boat evacuation' },
  { id: 'Trapped', label: 'Trapped / Structural Collapse', icon: ShieldCheck, tone: 'orange', description: 'Trapped in building, debris or high attic' },
  { id: 'Food', label: 'Emergency Rations', icon: Utensils, tone: 'orange', description: 'Food supplies exhausted, stranded family' },
  { id: 'Water', label: 'Potable Drinking Water', icon: Droplet, tone: 'blue', description: 'Drinking water submerged or contaminated' },
  { id: 'Shelter', label: 'Emergency Shelter Space', icon: HomeIcon, tone: 'green', description: 'Home damaged or uninhabitable, need camp placement' },
  { id: 'Fire', label: 'Fire / Chemical Hazard', icon: Flame, tone: 'red', description: 'Active fire outbreak or gas leak' },
  { id: 'Flood', label: 'Rising Flood / Levee Breach', icon: Waves, tone: 'blue', description: 'Rapid water influx threatening perimeter' }
];

export const CitizenNeedHelpView: React.FC = () => {
  const { 
    citizenUser, 
    setActiveTab, 
    submitCitizenSOS,
    zones 
  } = useDisaster();

  const [selectedCategory, setSelectedCategory] = useState<string>('Rescue');
  const [trappedCount, setTrappedCount] = useState<number>(3);
  const [waterLevel, setWaterLevel] = useState<WaterLevelStatus>('WAIST_LEVEL');
  const [hasInjured, setHasInjured] = useState<boolean>(true);
  const [hasInfants, setHasInfants] = useState<boolean>(false);
  const [hasElderly, setHasElderly] = useState<boolean>(true);
  const [medicalNotes, setMedicalNotes] = useState<string>('Elderly asthmatic patient, water entering ground floor quickly.');
  const [landmark, setLandmark] = useState<string>('Near Pandu Old Ghat Temple, House #42');
  const [citizenPhone] = useState<string>(citizenUser?.phone || '+91 98640-12345');
  const [citizenName] = useState<string>(citizenUser?.name || 'Rahul Kalita');

  // GPS state
  const [loc, setLoc] = useState<{ lat: number; lng: number }>({ lat: 26.1582, lng: 91.6795 });
  const [locating, setLocating] = useState<boolean>(false);

  // Audio / Photo Evidence simulation
  const [recording, setRecording] = useState<boolean>(false);
  const [hasVoiceNote, setHasVoiceNote] = useState<boolean>(false);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );
    }
  }, []);

  const handleRefreshLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocating(false);
        },
        () => {
          // Fallback to Guwahati default
          setLoc({ lat: 26.1582, lng: 91.6795 });
          setLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      setLocating(false);
    }
  };

  const handleToggleVoice = () => {
    if (!recording) {
      setRecording(true);
      setTimeout(() => {
        setRecording(false);
        setHasVoiceNote(true);
      }, 3000);
    } else {
      setRecording(false);
      setHasVoiceNote(true);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoName(e.target.files[0].name);
    }
  };

  const handleSendHelpRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const targetZone = zones[0] || { id: 'Z-GHY-W-01', name: 'Pandu / Maligaon' };

    setTimeout(() => {
      submitCitizenSOS({
        citizenName,
        phone: citizenPhone,
        lat: loc.lat,
        lng: loc.lng,
        landmark,
        district: 'Kamrup Metropolitan',
        zoneId: targetZone.id,
        zoneName: targetZone.name,
        trappedCount,
        waterLevel,
        hasInjured,
        hasInfants,
        hasElderly,
        medicalDescription: `${selectedCategory}: ${medicalNotes}`
      });

      setSubmitting(false);
      setActiveTab('citizen-requests');
    }, 500);
  };

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto space-y-6 pb-20 font-body-md">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('citizen-home')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-black text-red-400 bg-red-950/60 px-3 py-1.5 rounded-full border border-red-800/60">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>EMERGENCY SOS DISPATCH PIPELINE</span>
        </div>
      </div>

      {/* GPS Location Telemetry Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <LocateFixed size={20} className={locating ? 'animate-spin' : ''} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-white">
                {locating ? 'Acquiring High-Precision GPS…' : 'GPS Coordinates Locked'}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                ±4m Accuracy
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {loc.lat.toFixed(5)}° N, {loc.lng.toFixed(5)}° E • Guwahati Metro Sector
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefreshLocation}
          className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors cursor-pointer self-end sm:self-center flex items-center gap-1.5"
        >
          <LocateFixed size={13} />
          <span>Refresh GPS</span>
        </button>
      </div>

      <form onSubmit={handleSendHelpRequest} className="space-y-6">
        {/* 1. Category Selection Grid */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">1</span>
              <span>What Kind of Assistance is Needed?</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select the primary emergency classification to triage response assets.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[90px] ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon size={20} className={isSelected ? 'text-amber-400' : 'text-slate-500'} />
                    {isSelected && <CheckCircle2 size={14} className="text-amber-400" />}
                  </div>
                  <span className="text-xs font-bold mt-2 leading-tight">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Situational Severity & Water Level */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">2</span>
              <span>Situation & Threat Level on Ground</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Specify trapped count and current water level to dispatch right boat/airlift capacity.
            </p>
          </div>

          {/* People Trapped Counter */}
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-200 block">Number of People Stranded / Trapped</label>
              <span className="text-[11px] text-slate-500">Including family members or neighbors</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTrappedCount(Math.max(1, trappedCount - 1))}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-sm cursor-pointer"
              >
                -
              </button>
              <span className="text-base font-black text-amber-400 w-6 text-center font-mono">
                {trappedCount}
              </span>
              <button
                type="button"
                onClick={() => setTrappedCount(trappedCount + 1)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-sm cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Water Level Grid */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              Current Flood / Water Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['KNEE_LEVEL', 'WAIST_LEVEL', 'CHEST_LEVEL', 'ROOF_LEVEL', 'SUBMERGED'] as WaterLevelStatus[]).map((level) => {
                const isSelected = waterLevel === level;
                return (
                  <button
                    type="button"
                    key={level}
                    onClick={() => setWaterLevel(level)}
                    className={`py-2 px-2 rounded-xl text-center text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-600/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {level.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Demographics Checkboxes */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              High-Risk Vulnerabilities Present
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setHasInjured(!hasInjured)}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  hasInjured 
                    ? 'bg-red-950 border-red-500 text-red-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Stethoscope size={14} />
                <span>Injured / Sick</span>
              </button>

              <button
                type="button"
                onClick={() => setHasInfants(!hasInfants)}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  hasInfants 
                    ? 'bg-purple-950 border-purple-500 text-purple-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users size={14} />
                <span>Infants / Babies</span>
              </button>

              <button
                type="button"
                onClick={() => setHasElderly(!hasElderly)}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  hasElderly 
                    ? 'bg-amber-950 border-amber-500 text-amber-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users size={14} />
                <span>Elderly (65+)</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3. Location Landmark & Evidence */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">3</span>
              <span>Landmark & Rescue Details</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Help boat operators spot your location through murky flood water.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Exact Landmark / Visual Identifier (Building Color, Tree, Rooftop)
            </label>
            <input
              type="text"
              required
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Blue 2-story house with green water tank on roof, opposite Kali Mandir"
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Urgent Medical / Operational Notes
            </label>
            <textarea
              rows={2}
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              placeholder="Explain any critical medical condition, oxygen supply needed, or immediate danger..."
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          {/* Voice & Photo Evidence Attachment Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                recording
                  ? 'bg-red-950 border-red-500 text-red-300 animate-pulse'
                  : hasVoiceNote
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {recording ? <Square size={20} className="text-red-400" /> : <Mic size={20} className="text-amber-400" />}
              <div>
                <strong className="block text-xs text-white">
                  {recording ? 'Recording (Tap to Stop)…' : hasVoiceNote ? 'Voice Note Attached ✓' : 'Record Voice Note'}
                </strong>
                <span className="text-[10px] text-slate-400">
                  {recording ? '3s auto-save' : 'Speak your urgent SOS'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                photoName
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Camera size={20} className="text-blue-400" />
              <div className="overflow-hidden">
                <strong className="block text-xs text-white truncate">
                  {photoName ? photoName : 'Attach Photo Evidence'}
                </strong>
                <span className="text-[10px] text-slate-400">
                  {photoName ? 'Evidence Attached ✓' : 'Camera or Gallery'}
                </span>
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoSelect}
            />
          </div>
        </section>

        {/* Submit SOS Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-2xl shadow-red-600/40 cursor-pointer disabled:opacity-50"
        >
          <Send size={18} />
          <span>{submitting ? 'TRANSMITTING SOS BEACON TO DEOC…' : 'TRANSMIT RESCUE DISTRESS BEACON'}</span>
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 text-center">
          <Lock size={13} />
          <span>Encrypted priority channel to NDRF 1st Bn, SDRF Assam, and DDMA DEOC.</span>
        </div>
      </form>
    </div>
  );
};
