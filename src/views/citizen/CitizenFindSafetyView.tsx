import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Hospital, 
  Home as HomeIcon, 
  Droplet, 
  Utensils, 
  ShieldCheck, 
  Phone, 
  ChevronRight
} from 'lucide-react';
import { useDisaster } from '../../context/DisasterContext';
import { FacilityDetailsModal } from './FacilityDetailsModal';
import type { SafetyFacility } from './FacilityDetailsModal';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Initial verified safety facilities around Guwahati
const INITIAL_SAFETY_FACILITIES: SafetyFacility[] = [
  {
    id: 'SH-01',
    name: 'Pandu Multi-Purpose Relief Camp #1',
    type: 'Shelter',
    lat: 26.1625,
    lng: 91.6885,
    address: 'Pandu High School Complex, Railway Colony Road, West Guwahati',
    phone: '+91 94350-88123',
    emergencyPhone: '1077',
    bedsTotal: 850,
    bedsAvailable: 108,
    verified: true,
    openNow: true,
    capacityStatus: 'LIMITED',
    services: ['Hot Meals', 'Potable Water Tankers', 'Medical OPD', 'Women & Child Corner']
  },
  {
    id: 'HOSP-01',
    name: 'Guwahati Medical College & Hospital (GMCH)',
    type: 'Hospital',
    lat: 26.1558,
    lng: 91.7682,
    address: 'Narakasur Hilltop, Bhangagarh, Guwahati',
    phone: '+91 361-2529457',
    emergencyPhone: '108',
    bedsTotal: 1200,
    bedsAvailable: 240,
    verified: true,
    openNow: true,
    capacityStatus: 'GOOD',
    services: ['24/7 Trauma ICU', 'Blood Bank', 'Emergency Airlift Helipad', 'Ambulance Dispatch']
  },
  {
    id: 'SH-02',
    name: 'Chandmari Community Relief Center',
    type: 'Shelter',
    lat: 26.1885,
    lng: 91.7765,
    address: 'AEI Field Pavilion, Chandmari, Central Guwahati',
    phone: '+91 94350-77234',
    bedsTotal: 600,
    bedsAvailable: 290,
    verified: true,
    openNow: true,
    capacityStatus: 'GOOD',
    services: ['Dry Rations', 'Bedding', 'Power Backup Generator', 'Sanitation Kits']
  },
  {
    id: 'WATER-01',
    name: 'Jal Board Potable Water Distribution Depot',
    type: 'Water',
    lat: 26.1680,
    lng: 91.7020,
    address: 'Maligaon Chariali Water Works, NH-27',
    phone: '+91 361-2570012',
    waterLiters: 45000,
    verified: true,
    openNow: true,
    capacityStatus: 'GOOD',
    services: ['10,000L Mobile Tanker Refill', 'Chlorine Tablet Distribution', 'Jerrycan Distribution']
  },
  {
    id: 'FOOD-01',
    name: 'FCI Central Relief Ration Depot #4',
    type: 'Food',
    lat: 26.1420,
    lng: 91.7250,
    address: 'Beltola Central Warehouse Complex, South Guwahati',
    phone: '+91 94351-00234',
    foodMeals: 12000,
    verified: true,
    openNow: true,
    capacityStatus: 'GOOD',
    services: ['Rice & Dal Packets', 'Infant Milk Formula', 'Ready-to-Eat Meal Pouches']
  },
  {
    id: 'HOSP-02',
    name: 'Mahendra Mohan Choudhury Hospital (MMCH)',
    type: 'Hospital',
    lat: 26.1840,
    lng: 91.7450,
    address: 'Panbazar Riverfront, Guwahati',
    phone: '+91 361-2543997',
    bedsTotal: 450,
    bedsAvailable: 65,
    verified: true,
    openNow: true,
    capacityStatus: 'LIMITED',
    services: ['Casualty Ward', 'Emergency Dialysis', 'Tetanus & Snake Antivenom Stock']
  },
  {
    id: 'SAFE-01',
    name: 'Khanapara Elevated High Ground Safe Zone',
    type: 'Safe Zone',
    lat: 26.1265,
    lng: 91.8150,
    address: 'Veterinary College Ground, Khanapara',
    phone: '+91 94350-99441',
    verified: true,
    openNow: true,
    capacityStatus: 'GOOD',
    services: ['Helicopter Air-Drop Zone', 'SDRF Staging Base', 'Open Ground Evacuation Shelter']
  }
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const CitizenFindSafetyView: React.FC = () => {
  const { setActiveTab } = useDisaster();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Shelter' | 'Hospital' | 'Food' | 'Water' | 'Safe Zone'>('All');
  const [userLocation] = useState<{ lat: number; lng: number }>({ lat: 26.1582, lng: 91.6795 });
  const [selectedFacility, setSelectedFacility] = useState<SafetyFacility | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  // Compute distances
  const facilitiesWithDistance = useMemo(() => {
    return INITIAL_SAFETY_FACILITIES.map((f) => {
      const dist = calculateDistance(userLocation.lat, userLocation.lng, f.lat, f.lng);
      return {
        ...f,
        distanceKm: Math.round(dist * 10) / 10,
        distance: `${Math.round(dist * 10) / 10} km away`
      };
    }).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }, [userLocation]);

  // Filtered facilities
  const filteredFacilities = useMemo(() => {
    return facilitiesWithDistance.filter((f) => {
      const matchesFilter = activeFilter === 'All' || f.type === activeFilter;
      const matchesQuery = f.name.toLowerCase().includes(query.toLowerCase()) || f.address.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [facilitiesWithDistance, activeFilter, query]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 13,
      zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19
    }).addTo(map);

    // User location marker
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="width: 22px; height: 22px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 12px rgba(59, 130, 246, 0.8);">
          <div style="width: 100%; height: 100%; border-radius: 50%; background: #60a5fa; opacity: 0.6; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup('<strong>Your Current Position</strong><br/>Guwahati Metro Sector');

    const markersGroup = L.layerGroup().addTo(map);
    markersRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers on filter change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();

    filteredFacilities.forEach((facility) => {
      let color = '#a855f7'; // Shelter (purple)
      if (facility.type === 'Hospital') color = '#ef4444'; // Red
      if (facility.type === 'Water') color = '#3b82f6'; // Blue
      if (facility.type === 'Food') color = '#f97316'; // Orange
      if (facility.type === 'Safe Zone') color = '#10b981'; // Green

      const icon = L.divIcon({
        className: 'custom-facility-marker',
        html: `
          <div style="background: ${color}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); cursor: pointer;">
            <span style="font-size: 13px; font-weight: bold;">${facility.type.charAt(0)}</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([facility.lat, facility.lng], { icon })
        .addTo(markersRef.current!)
        .bindPopup(`
          <div style="font-family: sans-serif; min-width: 160px;">
            <strong style="color: #0f172a; font-size: 13px;">${facility.name}</strong><br/>
            <span style="color: #64748b; font-size: 11px;">${facility.type} • ${facility.distance}</span>
          </div>
        `);

      marker.on('click', () => {
        handleFocusFacility(facility);
      });
    });
  }, [filteredFacilities]);

  const handleFocusFacility = (facility: SafetyFacility) => {
    setSelectedFacility(facility);
    if (mapInstanceRef.current) {
      // Remove old route
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
        routePolylineRef.current = null;
      }

      // Draw safe evacuation polyline
      const midLat = (userLocation.lat + facility.lat) / 2 + 0.002;
      const midLng = (userLocation.lng + facility.lng) / 2;
      const routePoints: [number, number][] = [
        [userLocation.lat, userLocation.lng],
        [midLat, midLng],
        [facility.lat, facility.lng]
      ];

      const polyline = L.polyline(routePoints, {
        color: '#10b981',
        weight: 4,
        dashArray: '6, 8',
        opacity: 0.9
      }).addTo(mapInstanceRef.current);

      routePolylineRef.current = polyline;

      mapInstanceRef.current.flyTo([facility.lat, facility.lng], 14, { duration: 1 });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20 font-body-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('citizen-home')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/60">
          <ShieldCheck size={14} />
          <span>Verified Government Safe Zones</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search verified relief shelters, hospitals, food depots, potable water..."
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors shadow-lg"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {(['All', 'Shelter', 'Hospital', 'Food', 'Water', 'Safe Zone'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                activeFilter === filter
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive OpenStreetMap Map */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400">
          <span>Live Tactical GIS Map • Carto / OSM Standard</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {filteredFacilities.length} Facilities in Radius
          </span>
        </div>
        <div ref={mapContainerRef} className="h-72 sm:h-96 w-full rounded-xl z-0" />
      </div>

      {/* List of Facilities */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
            Nearby Facilities (Sorted by Distance)
          </h3>
          <span className="text-[11px] text-slate-500">Tap to inspect or navigate</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredFacilities.map((facility) => {
            let Icon = HomeIcon;
            let badgeBg = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            if (facility.type === 'Hospital') { Icon = Hospital; badgeBg = 'bg-red-500/10 text-red-400 border-red-500/20'; }
            if (facility.type === 'Water') { Icon = Droplet; badgeBg = 'bg-blue-500/10 text-blue-400 border-blue-500/20'; }
            if (facility.type === 'Food') { Icon = Utensils; badgeBg = 'bg-orange-500/10 text-orange-400 border-orange-500/20'; }
            if (facility.type === 'Safe Zone') { Icon = ShieldCheck; badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'; }

            return (
              <div
                key={facility.id}
                onClick={() => handleFocusFacility(facility)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all cursor-pointer flex flex-col justify-between shadow-xl group hover:scale-[1.01]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${badgeBg}`}>
                      <Icon size={12} />
                      <span>{facility.type}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {facility.distance}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {facility.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {facility.address}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    {facility.bedsAvailable !== undefined ? (
                      <span className="text-emerald-400 font-bold">
                        {facility.bedsAvailable} beds available
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">Verified Operational</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {facility.phone && (
                      <a
                        href={`tel:${facility.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Call"
                      >
                        <Phone size={13} />
                      </a>
                    )}
                    <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Details</span>
                      <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Facility Details Modal */}
      {selectedFacility && (
        <FacilityDetailsModal
          facility={selectedFacility}
          userLocation={userLocation}
          onClose={() => setSelectedFacility(null)}
        />
      )}
    </div>
  );
};
