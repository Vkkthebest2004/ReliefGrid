import React from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Navigation, 
  Hospital, 
  Home, 
  Droplet, 
  Utensils, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';

export interface SafetyFacility {
  id: string | number;
  name: string;
  type: 'Shelter' | 'Hospital' | 'Food' | 'Water' | 'Safe Zone';
  lat: number;
  lng: number;
  distance?: string;
  distanceKm?: number;
  address: string;
  phone?: string;
  emergencyPhone?: string;
  bedsTotal?: number;
  bedsAvailable?: number;
  waterLiters?: number;
  foodMeals?: number;
  powerStatus?: string;
  verified: boolean;
  openNow: boolean;
  capacityStatus: 'GOOD' | 'LIMITED' | 'NEAR_CAPACITY' | 'FULL';
  services: string[];
}

interface Props {
  facility: SafetyFacility;
  userLocation: { lat: number; lng: number } | null;
  onClose: () => void;
}

export const FacilityDetailsModal: React.FC<Props> = ({ facility, userLocation, onClose }) => {
  const getIcon = () => {
    switch (facility.type) {
      case 'Hospital': return Hospital;
      case 'Shelter': return Home;
      case 'Water': return Droplet;
      case 'Food': return Utensils;
      default: return ShieldCheck;
    }
  };

  const Icon = getIcon();

  const getDirectionsUrl = () => {
    const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : '';
    const dest = `${facility.lat},${facility.lng}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}${origin ? `&origin=${encodeURIComponent(origin)}` : ''}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in font-body-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 pr-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Icon size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold">
                {facility.type}
              </span>
              {facility.verified && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  <span>DDMA Verified</span>
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold">
                {facility.openNow ? 'Open 24/7' : 'Standard Hours'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {facility.name}
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin size={12} className="text-slate-500" />
              <span>{facility.address}</span>
            </p>
          </div>
        </div>

        {/* Capacity / Resource Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {facility.bedsAvailable !== undefined && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bed Availability</span>
              <div className="flex items-baseline gap-1 mt-1">
                <strong className="text-base text-emerald-400 font-mono font-black">{facility.bedsAvailable}</strong>
                <span className="text-[11px] text-slate-500">/ {facility.bedsTotal || 800}</span>
              </div>
            </div>
          )}

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
            <div className="mt-1">
              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                facility.capacityStatus === 'GOOD' ? 'bg-emerald-950 text-emerald-300' :
                facility.capacityStatus === 'LIMITED' ? 'bg-amber-950 text-amber-300' : 'bg-red-950 text-red-300'
              }`}>
                {facility.capacityStatus.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Distance</span>
            <div className="mt-1 font-mono text-sm font-bold text-white">
              {facility.distance || '1.2 km away'}
            </div>
          </div>
        </div>

        {/* Services & Facilities */}
        {facility.services && facility.services.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 block">Available Services & Assets</span>
            <div className="flex flex-wrap gap-1.5">
              {facility.services.map((svc, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200">
                  {svc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action CTAs */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {facility.phone ? (
            <a
              href={`tel:${facility.phone}`}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-700"
            >
              <Phone size={14} className="text-emerald-400" />
              <span>Call Facility</span>
            </a>
          ) : (
            <div className="py-3 px-4 rounded-xl bg-slate-950 text-slate-500 font-bold text-xs text-center border border-slate-800">
              No Phone Listed
            </div>
          )}

          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Navigation size={14} />
            <span>Open Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
};
