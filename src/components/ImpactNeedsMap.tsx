import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface ImpactNeedsMapProps {
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
  height?: string;
}

interface MapRegion {
  id: string;
  name: string;
  code: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  lat: number;
  lng: number;
  affected: number;
  deficitWater: string;
  deficitRescue: string;
  bounds: [number, number][];
}

const GUWAHATI_REGIONS: MapRegion[] = [
  {
    id: 'G-04',
    name: 'North Guwahati',
    code: 'REGION G-04',
    severity: 'CRITICAL',
    lat: 26.195,
    lng: 91.715,
    affected: 8420,
    deficitWater: '-15,220 L',
    deficitRescue: '-5 Teams',
    bounds: [
      [26.210, 91.690],
      [26.210, 91.745],
      [26.180, 91.745],
      [26.180, 91.690]
    ]
  },
  {
    id: 'G-07',
    name: 'West Guwahati (Pandu)',
    code: 'REGION G-07',
    severity: 'HIGH',
    lat: 26.168,
    lng: 91.690,
    affected: 4820,
    deficitWater: '-8,000 L',
    deficitRescue: '-3 Teams',
    bounds: [
      [26.180, 91.670],
      [26.180, 91.710],
      [26.155, 91.710],
      [26.155, 91.670]
    ]
  },
  {
    id: 'G-02',
    name: 'Jalukbari & University',
    code: 'REGION G-02',
    severity: 'HIGH',
    lat: 26.145,
    lng: 91.660,
    affected: 3950,
    deficitWater: '-4,500 L',
    deficitRescue: '-2 Teams',
    bounds: [
      [26.160, 91.640],
      [26.160, 91.680],
      [26.130, 91.680],
      [26.130, 91.640]
    ]
  },
  {
    id: 'G-11',
    name: 'Dispur & Capital Complex',
    code: 'REGION G-11',
    severity: 'MODERATE',
    lat: 26.142,
    lng: 91.790,
    affected: 2600,
    deficitWater: '-2,000 L',
    deficitRescue: '-1 Team',
    bounds: [
      [26.155, 91.770],
      [26.155, 91.810],
      [26.128, 91.810],
      [26.128, 91.770]
    ]
  }
];

export const ImpactNeedsMap: React.FC<ImpactNeedsMapProps> = ({
  selectedRegionId,
  onSelectRegion,
  height = '360px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [26.175, 91.725],
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);
      layersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const layers = layersGroupRef.current;
    if (!map || !layers) return;

    layers.clearLayers();

    // 1. Draw Region Polygons
    GUWAHATI_REGIONS.forEach((reg) => {
      const isSelected = reg.id === selectedRegionId;
      const fillColor = reg.severity === 'CRITICAL' ? '#DC2626' : reg.severity === 'HIGH' ? '#EA580C' : '#CA8A04';

      const polygon = L.polygon(reg.bounds, {
        color: isSelected ? '#1E3A8A' : fillColor,
        weight: isSelected ? 3 : 1.5,
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.35 : 0.18,
        dashArray: isSelected ? undefined : '4, 4'
      });

      polygon.on('click', () => onSelectRegion(reg.id));
      layers.addLayer(polygon);

      // Marker Badge
      const markerHtml = `
        <div style="
          background: ${isSelected ? '#0F172A' : fillColor};
          color: #FFFFFF;
          padding: 3px 6px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 11px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          border: 1.5px solid #FFFFFF;
          cursor: pointer;
          transform: translate(-50%, -50%);
        ">
          ${reg.code}: ${reg.name}
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-region-icon',
        html: markerHtml,
        iconSize: [0, 0]
      });

      const marker = L.marker([reg.lat, reg.lng], { icon });
      marker.on('click', () => onSelectRegion(reg.id));
      layers.addLayer(marker);
    });

    // 2. Add Fixed Key Critical Infrastructure Icons
    // Gauhati Medical College Hospital (GMCH)
    const gmchHtml = `
      <div style="background: #2563EB; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 13px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);" title="Gauhati Medical College Hospital (GMCH)">
        <span class="material-symbols-outlined" style="font-size: 14px; line-height: 1;">local_hospital</span>
      </div>
    `;
    layers.addLayer(L.marker([26.155, 91.772], {
      icon: L.divIcon({ className: 'infra-icon', html: gmchHtml, iconSize: [24, 24] })
    }).bindPopup('<b>Gauhati Medical College (GMCH)</b><br/>Level 1 Trauma Triage Hub'));

    // Central Distribution Warehouse
    const whHtml = `
      <div style="background: #475569; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 13px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);" title="Guwahati Central Supply Depot">
        <span class="material-symbols-outlined" style="font-size: 14px; line-height: 1;">inventory_2</span>
      </div>
    `;
    layers.addLayer(L.marker([26.150, 91.740], {
      icon: L.divIcon({ className: 'infra-icon', html: whHtml, iconSize: [24, 24] })
    }).bindPopup('<b>Guwahati Central Supply Depot</b><br/>Primary Food & Water Rations Hub'));

    // Pandu SDRF Water Rescue Station
    const sdrfHtml = `
      <div style="background: #0284C7; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 13px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);" title="Pandu Port SDRF Water Station">
        <span class="material-symbols-outlined" style="font-size: 14px; line-height: 1;">sailing</span>
      </div>
    `;
    layers.addLayer(L.marker([26.168, 91.700], {
      icon: L.divIcon({ className: 'infra-icon', html: sdrfHtml, iconSize: [24, 24] })
    }).bindPopup('<b>Pandu SDRF Rescue Station</b><br/>Inflatable Rescue Boat Deploy Point'));

    // Submerged Bridge Checkpost Warning
    const warnHtml = `
      <div style="background: #DC2626; color: white; border-radius: 4px; padding: 2px 6px; font-size: 10px; font-weight: bold; border: 1px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 2px;" title="Saraighat Link Submerged">
        <span class="material-symbols-outlined" style="font-size: 12px; line-height: 1;">block</span>
        <span>BLOCKED</span>
      </div>
    `;
    layers.addLayer(L.marker([26.182, 91.685], {
      icon: L.divIcon({ className: 'infra-icon', html: warnHtml, iconSize: [0, 0] })
    }).bindPopup('<b>Saraighat Bridge Approach</b><br/>Submerged & Impassable'));

    // Pan to selected region
    const selected = GUWAHATI_REGIONS.find(r => r.id === selectedRegionId);
    if (selected) {
      map.flyTo([selected.lat, selected.lng], 12.5, { duration: 0.6 });
    }

  }, [selectedRegionId]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-outline-variant shadow-xs">
      <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />
      
      {/* Map Legend Overlay */}
      <div className="absolute bottom-2 left-2 bg-surface/90 backdrop-blur-xs border border-outline-variant rounded-lg p-2 z-10 text-[10px] font-mono flex flex-wrap items-center gap-2.5 text-on-surface">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600"></span>Critical</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span>High</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>Moderate</span>
        <span className="flex items-center gap-1 text-primary"><span className="material-symbols-outlined text-[13px]">local_hospital</span> Hospital</span>
        <span className="flex items-center gap-1 text-primary"><span className="material-symbols-outlined text-[13px]">inventory_2</span> Depot</span>
        <span className="flex items-center gap-1 text-primary"><span className="material-symbols-outlined text-[13px]">sailing</span> Boat Station</span>
      </div>
    </div>
  );
};
