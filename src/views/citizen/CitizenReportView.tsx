import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Waves, 
  Flame, 
  Mountain, 
  Activity, 
  Building2, 
  Car, 
  MoreHorizontal, 
  LocateFixed, 
  Camera, 
  Mic, 
  Square, 
  Send, 
  CheckCircle2
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';
import type { IncidentReport } from '../../types';

const HAZARD_TYPES = [
  { id: 'Flood', label: 'Flash Flood / Inundation', icon: Waves, color: 'text-blue-400' },
  { id: 'Fire', label: 'Urban Fire / Gas Leak', icon: Flame, color: 'text-red-400' },
  { id: 'Landslide', label: 'Hill Landslide / Mudflow', icon: Mountain, color: 'text-amber-400' },
  { id: 'Earthquake', label: 'Tremors / Structural Crack', icon: Activity, color: 'text-purple-400' },
  { id: 'Building Collapse', label: 'Building / Bridge Collapse', icon: Building2, color: 'text-rose-400' },
  { id: 'Accident', label: 'Road / Convoy Blockage', icon: Car, color: 'text-yellow-400' },
  { id: 'Other', label: 'Other Public Hazard', icon: MoreHorizontal, color: 'text-slate-400' }
];

export const CitizenReportView: React.FC = () => {
  const { setActiveTab, addReport, citizenUser, zones } = useDisaster();

  const [step, setStep] = useState<number>(0);
  const [selectedHazard, setSelectedHazard] = useState<string>('Flood');
  const [loc, setLoc] = useState<{ lat: number; lng: number }>({ lat: 26.1625, lng: 91.6885 });
  const [locating, setLocating] = useState<boolean>(false);
  const [landmark, setLandmark] = useState<string>('Opposite Maligaon Flyover Pillar #14');
  const [description, setDescription] = useState<string>('Water overflowing embankment at 2 feet/hour. 4 shops flooded.');
  const [peopleAffected, setPeopleAffected] = useState<number>(15);
  const [photoName, setPhotoName] = useState<string | null>('flood_embankment_breach.jpg');
  const [voiceAttached, setVoiceAttached] = useState<boolean>(false);
  const [recording, setRecording] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLocate = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocating(false);
        },
        () => setLocating(false)
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
        setVoiceAttached(true);
      }, 2500);
    } else {
      setRecording(false);
      setVoiceAttached(true);
    }
  };

  const handleSubmitReport = () => {
    setIsSubmitting(true);
    const targetZone = zones[0] || { id: 'Z-GHY-W-01', name: 'Pandu / Maligaon Sector' };
    const code = `INC-CIT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReport: IncidentReport = {
      id: `rep-${Date.now()}`,
      code,
      source: 'Citizen SOS / Helplines',
      sourceReliabilityPct: 88,
      zoneId: targetZone.id,
      zoneName: targetZone.name,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST, Today',
      claim: `${selectedHazard} reported at ${landmark}`,
      details: `${description} (${peopleAffected} people impacted). Reported by ${citizenUser?.name || 'Citizen'}.`,
      reportedCasualties: 0,
      reportedTrapped: peopleAffected > 20 ? 5 : 0,
      confidenceScore: 78,
      status: 'VERIFIED',
      evidenceType: photoName ? 'GPS_TAGGED_PHOTO' : voiceAttached ? 'VOICE_CALL' : 'FIELD_LOG',
      corroboratingCount: 3
    };

    setTimeout(() => {
      addReport(newReport);
      setSubmittedCode(code);
      setIsSubmitting(false);
    }, 500);
  };

  if (submittedCode) {
    return (
      <div className="max-w-md mx-auto my-10 bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl font-body-md animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
          <CheckCircle2 size={36} />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Incident Transmitted to DDMA
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Report #{submittedCode}
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Your field report has been verified and relayed to the District Emergency Operations Center (DEOC). Responders will inspect the location shortly.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left text-xs space-y-1">
          <div className="text-slate-400">Hazard: <strong className="text-white">{selectedHazard}</strong></div>
          <div className="text-slate-400">Location: <strong className="text-white">{landmark}</strong></div>
          <div className="text-slate-400">Impacted: <strong className="text-white">{peopleAffected} people</strong></div>
          <div className="text-slate-400">Evidence: <strong className="text-emerald-400">GPS Tagged Photo Attached</strong></div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('citizen-home')}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/20"
          >
            Return to Citizen Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 font-body-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : setActiveTab('citizen-home')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{step === 0 ? 'Back to Home' : 'Previous Step'}</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-blue-950/60 px-3 py-1.5 rounded-full border border-blue-800/60">
          <span>Step {step + 1} of 4</span>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-4 gap-2">
        {['Hazard Type', 'Location', 'Details & Evidence', 'Review'].map((label, idx) => (
          <div key={label} className="space-y-1">
            <div className={`h-1.5 rounded-full transition-all ${
              idx <= step ? 'bg-amber-500' : 'bg-slate-800'
            }`} />
            <span className={`text-[10px] font-bold block truncate ${
              idx === step ? 'text-amber-400' : 'text-slate-500'
            }`}>
              {idx + 1}. {label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 0: Hazard Type */}
      {step === 0 && (
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h2 className="text-base font-extrabold text-white">What disaster or hazard are you reporting?</h2>
            <p className="text-xs text-slate-400 mt-1">Select the most accurate hazard category below.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HAZARD_TYPES.map((h) => {
              const Icon = h.icon;
              const isSelected = selectedHazard === h.id;
              return (
                <button
                  type="button"
                  key={h.id}
                  onClick={() => setSelectedHazard(h.id)}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 ${h.color}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-white">{h.label}</span>
                    <span className="text-[11px] text-slate-500">Tap to select</span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full py-3.5 mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/20"
          >
            Continue to Location →
          </button>
        </section>
      )}

      {/* Step 1: Location */}
      {step === 1 && (
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div>
            <h2 className="text-base font-extrabold text-white">Where is this happening?</h2>
            <p className="text-xs text-slate-400 mt-1">Capture precise GPS position and visual landmarks for emergency crews.</p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LocateFixed size={20} className="text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-white block">GPS Coordinates Captured</span>
                <span className="text-[11px] font-mono text-slate-400">{loc.lat.toFixed(5)}° N, {loc.lng.toFixed(5)}° E</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLocate}
              className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
            >
              {locating ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Visual Landmark / Road / Building Name
            </label>
            <input
              type="text"
              required
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Near Brahmaputra embankment gate #3, Maligaon"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Continue to Details →
            </button>
          </div>
        </section>
      )}

      {/* Step 2: Details & Evidence */}
      {step === 2 && (
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div>
            <h2 className="text-base font-extrabold text-white">Add Details & Evidence</h2>
            <p className="text-xs text-slate-400 mt-1">Photos and voice descriptions increase verification priority score.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Incident Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you witness? Any trapped persons or infrastructure damage?"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Estimated People Affected / Stranded
            </label>
            <input
              type="number"
              min={1}
              value={peopleAffected}
              onChange={(e) => setPeopleAffected(Number(e.target.value) || 1)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors font-mono"
            />
          </div>

          {/* Evidence Attachments */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-3 rounded-xl border text-left cursor-pointer flex items-center gap-3 ${
                recording
                  ? 'bg-red-950 border-red-500 text-red-300 animate-pulse'
                  : voiceAttached
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {recording ? <Square size={18} className="text-red-400" /> : <Mic size={18} className="text-amber-400" />}
              <div>
                <strong className="block text-xs text-white">{recording ? 'Recording…' : voiceAttached ? 'Voice Note ✓' : 'Add Voice'}</strong>
                <span className="text-[10px] text-slate-400">{voiceAttached ? 'Attached' : 'Tap to speak'}</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-3 rounded-xl border text-left cursor-pointer flex items-center gap-3 ${
                photoName
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Camera size={18} className="text-blue-400" />
              <div className="overflow-hidden">
                <strong className="block text-xs text-white truncate">{photoName ? 'Photo Attached ✓' : 'Add Photo'}</strong>
                <span className="text-[10px] text-slate-400">{photoName ? photoName : 'Camera upload'}</span>
              </div>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && setPhotoName(e.target.files[0].name)} />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Review Report →
            </button>
          </div>
        </section>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div>
            <h2 className="text-base font-extrabold text-white">Review & Transmit to Command Center</h2>
            <p className="text-xs text-slate-400 mt-1">Please confirm all incident details before official broadcast.</p>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Hazard Type:</span>
              <strong className="text-amber-400 font-bold">{selectedHazard}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Landmark:</span>
              <strong className="text-white font-medium">{landmark}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">GPS Coordinates:</span>
              <strong className="font-mono text-slate-300">{loc.lat.toFixed(4)}° N, {loc.lng.toFixed(4)}° E</strong>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">People Affected:</span>
              <strong className="text-white">{peopleAffected} people</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Attachments:</span>
              <strong className="text-emerald-400">{[photoName && 'Photo Evidence', voiceAttached && 'Voice Note'].filter(Boolean).join(' + ') || 'None'}</strong>
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmitReport}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send size={16} />
            <span>{isSubmitting ? 'Transmitting Field Report…' : 'TRANSMIT REPORT TO DEOC CONTROL'}</span>
          </button>
        </section>
      )}
    </div>
  );
};
