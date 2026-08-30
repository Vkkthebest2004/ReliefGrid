import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import gsap from 'gsap';
import { useDisaster } from '../context/DisasterContext';

interface GisMapProps {
  height?: string;
  showControls?: boolean;
}

export const GisMap: React.FC<GisMapProps> = ({ height = '560px' }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const polygonsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const sheltersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routesLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const {
    zones,
    selectedZone,
    setSelectedZone,
    routes,
    shelters,
    setActiveTab,
  } = useDisaster();

  // Filter state for relief priority
  const [reliefFilter, setReliefFilter] = useState<'ALL' | 'CRITICAL' | 'MEDICAL' | 'WATER'>('ALL');
  const showPolygons = true;
  const showShelters = true;
  const showRoutes = true;

  // GSAP Initial entrance animation
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create Leaflet Map centered on Guwahati District
      const map = L.map(mapContainerRef.current, {
        center: [26.1480, 91.7250],
        zoom: 12,
        minZoom: 10,
        maxZoom: 18,
        zoomControl: false,
      });

      // OpenStreetMap Base Tile Layer
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });

      osmLayer.addTo(map);

      // Layer groups
      polygonsLayerGroupRef.current = L.layerGroup().addTo(map);
      routesLayerGroupRef.current = L.layerGroup().addTo(map);
      sheltersLayerGroupRef.current = L.layerGroup().addTo(map);
      markersLayerGroupRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render Polygons & Hazards
  useEffect(() => {
    const polyGroup = polygonsLayerGroupRef.current;
    if (!polyGroup) return;

    polyGroup.clearLayers();

    if (!showPolygons) return;

    zones.forEach((zone) => {
      const isSelected = selectedZone?.id === zone.id;
      const fillColor =
        zone.severityCategory === 'CRITICAL'
          ? '#dc2626'
          : zone.severityCategory === 'HIGH'
          ? '#ea580c'
          : zone.severityCategory === 'MODERATE'
          ? '#ca8a04'
          : '#16a34a';

      if (zone.coordinates && zone.coordinates.length > 0) {
        const polygon = L.polygon(zone.coordinates, {
          color: fillColor,
          weight: isSelected ? 3 : 1.5,
          opacity: 0.85,
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.35 : 0.18,
          dashArray: zone.severityCategory === 'CRITICAL' ? '4, 4' : undefined,
        });

        polygon.on('click', () => {
          setSelectedZone(zone);
        });

        polygon.addTo(polyGroup);
      }
    });
  }, [zones, selectedZone, showPolygons, setSelectedZone]);

  // Render Routes & Blockages
  useEffect(() => {
    const routesGroup = routesLayerGroupRef.current;
    if (!routesGroup) return;

    routesGroup.clearLayers();

    if (!showRoutes) return;

    routes.forEach((route) => {
      const isBlocked = route.status === 'BLOCKED';
      const lineColor = isBlocked ? '#dc2626' : '#115cb9';

      if (route.pathPoints && route.pathPoints.length > 1) {
        const polyline = L.polyline(route.pathPoints, {
          color: lineColor,
          weight: isBlocked ? 3.5 : 2.5,
          opacity: 0.8,
          dashArray: isBlocked ? '6, 6' : undefined,
        });

        polyline.bindTooltip(
          `<strong>${route.roadName}</strong><br/>Status: <span style="color:${lineColor}">${route.status}</span>`,
          { sticky: true }
        );

        polyline.addTo(routesGroup);

        if (isBlocked && route.pathPoints.length > 0) {
          const midIndex = Math.floor(route.pathPoints.length / 2);
          const midPoint = route.pathPoints[midIndex];

          const blockIcon = L.divIcon({
            className: 'custom-block-marker',
            html: `
              <div style="
                background: #dc2626;
                color: #ffffff;
                font-family: 'Public Sans', sans-serif;
                font-size: 10px;
                font-weight: 700;
                padding: 2px 6px;
                border-radius: 4px;
                border: 1px solid #ffffff;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                gap: 4px;
                white-space: nowrap;
              ">
                <span class="material-symbols-outlined" style="font-size: 13px; line-height: 1;">block</span>
                <span>${route.roadName} (BLOCKED)</span>
              </div>
            `,
            iconSize: [140, 24],
            iconAnchor: [70, 12],
          });

          L.marker(midPoint, { icon: blockIcon }).addTo(routesGroup);
        }
      }
    });
  }, [routes, showRoutes]);

  // Render Shelters
  useEffect(() => {
    const shelterGroup = sheltersLayerGroupRef.current;
    if (!shelterGroup) return;

    shelterGroup.clearLayers();

    if (!showShelters) return;

    shelters.forEach((shelter) => {
      const zone = zones.find((z) => z.id === shelter.zoneId);
      const shelterLat = zone ? zone.lat + 0.006 : 26.1400;
      const shelterLng = zone ? zone.lng + 0.006 : 91.7300;

      const occupancyPct = Math.round((shelter.occupancy / shelter.capacity) * 100);
      const isOverCapacity = occupancyPct >= 90;

      const shelterIcon = L.divIcon({
        className: 'custom-shelter-marker',
        html: `
          <div style="
            background: #002147;
            color: #ffffff;
            font-family: 'Public Sans', sans-serif;
            font-size: 10px;
            font-weight: 600;
            padding: 3px 6px;
            border-radius: 4px;
            border: 1.5px solid ${isOverCapacity ? '#ea580c' : '#aec7f6'};
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
          ">
            <span style="display: flex; align-items: center; gap: 3px;">
              <span class="material-symbols-outlined" style="font-size: 13px; line-height: 1;">night_shelter</span>
              <span>${shelter.name}</span>
            </span>
            <span style="
              background: ${isOverCapacity ? '#ea580c' : '#2d476f'};
              padding: 1px 4px;
              border-radius: 2px;
              font-size: 9px;
            ">${occupancyPct}%</span>
          </div>
        `,
        iconSize: [140, 24],
        iconAnchor: [70, 12],
      });

      const marker = L.marker([shelterLat, shelterLng], { icon: shelterIcon });
      marker.bindPopup(`
        <div style="font-family: 'Public Sans', sans-serif; font-size: 12px; min-width: 180px;">
          <h4 style="margin: 0 0 4px; font-weight: bold; color: #000a1e; display: flex; align-items: center; gap: 4px;">
            <span class="material-symbols-outlined" style="font-size: 15px; color: #002147;">night_shelter</span>
            <span>${shelter.name}</span>
          </h4>
          <p style="margin: 0 0 2px; color: #44474e;">Location: <strong>${shelter.locationName}</strong></p>
          <p style="margin: 0 0 2px; color: #44474e;">Occupancy: <strong>${shelter.occupancy} / ${shelter.capacity} (${occupancyPct}%)</strong></p>
          <p style="margin: 0 0 2px; color: #44474e;">Status: <strong style="color: ${isOverCapacity ? '#ea580c' : '#16a34a'}">${shelter.status}</strong></p>
          <p style="margin: 0; color: #44474e;">Phone: <strong>${shelter.phone}</strong></p>
        </div>
      `);
      marker.addTo(shelterGroup);
    });
  }, [shelters, zones, showShelters]);

  // Render Relief Priority Markers on OpenStreetMap with GSAP Stagger Entrance
  useEffect(() => {
    const markersGroup = markersLayerGroupRef.current;
    if (!markersGroup) return;

    markersGroup.clearLayers();

    // Filter zones based on selected relief filter
    const filteredZones = zones.filter((zone) => {
      if (reliefFilter === 'CRITICAL') return zone.severityCategory === 'CRITICAL';
      if (reliefFilter === 'MEDICAL') return zone.medicalUrgencyCases > 150;
      if (reliefFilter === 'WATER') return zone.waterDeficitLiters > 6000;
      return true;
    });

    // Sort by priority rank so highest priority places are prominent
    const sortedZones = [...filteredZones].sort((a, b) => a.priorityRank - b.priorityRank);

    sortedZones.forEach((zone) => {
      const isSelected = selectedZone?.id === zone.id;
      const isCritical = zone.severityCategory === 'CRITICAL';
      const isHigh = zone.severityCategory === 'HIGH';

      const themeColor = isCritical ? '#ba1a1a' : isHigh ? '#b97958' : '#115cb9';
      const pulseColor = isCritical ? 'rgba(186, 26, 26, 0.4)' : isHigh ? 'rgba(185, 121, 88, 0.4)' : 'rgba(17, 92, 185, 0.3)';

      const reliefNeedTag = zone.topNeeds && zone.topNeeds.length > 0 ? zone.topNeeds[0] : 'Relief Required';

      const customIcon = L.divIcon({
        className: 'custom-relief-pin',
        html: `
          <div style="
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transform: translate(-50%, -100%);
          ">
            <!-- Pulsing Beacon Effect for Critical Relief Targets -->
            ${
              isCritical
                ? `<div style="
                    position: absolute;
                    bottom: 0px;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: ${pulseColor};
                    animation: leaflet-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                    pointer-events: none;
                  "></div>`
                : ''
            }

            <!-- Relief Priority Card Tag -->
            <div style="
              background: #000a1e;
              color: #ffffff;
              border: 1.5px solid ${themeColor};
              border-radius: 6px;
              padding: 3px 8px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              font-family: 'Public Sans', sans-serif;
              display: flex;
              flex-direction: column;
              gap: 1px;
              white-space: nowrap;
              margin-bottom: 4px;
              transition: all 0.2s ease;
              ${isSelected ? 'transform: scale(1.08); border-color: #aec7f6; ring: 2px solid #aec7f6;' : ''}
            ">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                <span style="
                  background: ${themeColor};
                  color: #ffffff;
                  font-size: 9px;
                  font-weight: 800;
                  padding: 1px 4px;
                  border-radius: 3px;
                  letter-spacing: 0.05em;
                ">
                  #${zone.priorityRank} URGENT
                </span>
                <span style="font-size: 11px; font-weight: 700; color: #ffffff;">
                  ${zone.name}
                </span>
              </div>
              <div style="font-size: 9.5px; color: #aec7f6; display: flex; align-items: center; gap: 3px; margin-top: 1px;">
                <span class="material-symbols-outlined" style="font-size: 11px; line-height: 1;">warning</span>
                <span>${reliefNeedTag}</span>
              </div>
            </div>

            <!-- Marker Pin Tip -->
            <div style="
              width: 12px;
              height: 12px;
              background: ${themeColor};
              border: 2px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 2px 5px rgba(0,0,0,0.4);
            "></div>
          </div>
        `,
        iconSize: [160, 60],
        iconAnchor: [80, 50],
      });

      const marker = L.marker([zone.lat, zone.lng], { icon: customIcon, zIndexOffset: 100 - zone.priorityRank });

      // Interactive Click & Popup
      marker.on('click', () => {
        setSelectedZone(zone);
      });

      // Rich OpenStreetMap Popup
      const popupHtml = `
        <div style="font-family: 'Public Sans', sans-serif; font-size: 12px; min-width: 240px; padding: 2px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #c4c6cf; padding-bottom: 6px; margin-bottom: 8px;">
            <div>
              <div style="font-size: 13px; font-weight: bold; color: #000a1e;">${zone.name}</div>
              <div style="font-size: 10px; color: #74777f;">${zone.blockName} • ${zone.code}</div>
            </div>
            <span style="background: ${themeColor}; color: #ffffff; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 3px;">
              #${zone.priorityRank} PRIORITY
            </span>
          </div>

          <div style="background: #f4f3f7; border: 1px solid #c4c6cf; border-radius: 4px; padding: 6px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
              <span style="color: #44474e;">Relief Severity Score:</span>
              <strong style="color: ${themeColor}; font-size: 12px;">${zone.severityScore} / 100</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
              <span style="color: #44474e;">Affected Population:</span>
              <strong style="color: #000a1e;">${zone.affectedPopulation.toLocaleString()} people</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px;">
              <span style="color: #44474e;">Medical Urgency:</span>
              <strong style="color: #ba1a1a;">${zone.medicalUrgencyCases} cases</strong>
            </div>
          </div>

          <div style="margin-bottom: 8px;">
            <div style="font-size: 10px; font-weight: bold; color: #000a1e; text-transform: uppercase; margin-bottom: 3px;">
              Primary Relief Supplies Required:
            </div>
            <ul style="margin: 0; padding-left: 16px; font-size: 11px; color: #44474e;">
              ${zone.topNeeds.map((need) => `<li>${need}</li>`).join('')}
            </ul>
          </div>

            <button id="btn-dispatch-${zone.id}" style="
              flex: 1;
              background: #002147;
              color: #ffffff;
              border: none;
              border-radius: 4px;
              padding: 6px 8px;
              font-size: 11px;
              font-weight: 600;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 4px;
            ">
              <span class="material-symbols-outlined" style="font-size: 13px; line-height: 1;">hub</span>
              <span>Open Allocation</span>
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-dispatch-${zone.id}`);
        if (btn) {
          btn.onclick = () => {
            setSelectedZone(zone);
            setActiveTab('resource-allocation-analysis');
          };
        }
      });

      marker.addTo(markersGroup);
    });

    // Trigger GSAP Stagger Entrance for Leaflet Markers
    setTimeout(() => {
      const pins = document.querySelectorAll('.custom-relief-pin');
      if (pins.length > 0) {
        gsap.fromTo(
          pins,
          { scale: 0.3, opacity: 0, y: -18 },
          { scale: 1, opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'back.out(1.7)' }
        );
      }
    }, 50);
  }, [zones, selectedZone, reliefFilter, setSelectedZone, setActiveTab]);

  // Center on Selected Zone if changed
  useEffect(() => {
    if (selectedZone && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedZone.lat, selectedZone.lng], 13.5, {
        duration: 0.8,
      });
    }
  }, [selectedZone]);

  return (
    <div className="relative bg-surface border border-outline-variant rounded-xl overflow-hidden select-none flex flex-col shadow-sm font-body-md" style={{ height }}>
      
      {/* Top Map Header & Controls Bar */}
      <div 
        ref={headerRef}
        className="bg-surface/95 border-b border-outline-variant px-4 py-2.5 flex flex-wrap items-center justify-between z-[400] backdrop-blur-sm gap-2"
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            OPENSTREETMAP TACTICAL GIS — RELIEF PRIORITY MATRIX
          </span>
          <span className="text-[11px] text-on-surface-variant font-mono hidden md:inline">
            Guwahati District (Kamrup Metro) • 26.14°N, 91.73°E
          </span>
        </div>

        {/* Priority Filter Tabs */}
        <div className="flex items-center gap-1 bg-surface-container rounded-lg p-0.5 border border-outline-variant">
          <button
            onClick={() => setReliefFilter('ALL')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded cursor-pointer transition-colors ${
              reliefFilter === 'ALL'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            All Places ({zones.length})
          </button>
          <button
            onClick={() => setReliefFilter('CRITICAL')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded cursor-pointer transition-colors flex items-center gap-1 ${
              reliefFilter === 'CRITICAL'
                ? 'bg-[#ba1a1a] text-white shadow-xs'
                : 'text-[#ba1a1a] hover:bg-error-container/20'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">emergency</span>
            <span>Most Required ({zones.filter((z) => z.severityCategory === 'CRITICAL').length})</span>
          </button>
          <button
            onClick={() => setReliefFilter('MEDICAL')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded cursor-pointer transition-colors flex items-center gap-1 ${
              reliefFilter === 'MEDICAL'
                ? 'bg-secondary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">medical_services</span>
            <span>High Medical</span>
          </button>
          <button
            onClick={() => setReliefFilter('WATER')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded cursor-pointer transition-colors flex items-center gap-1 ${
              reliefFilter === 'WATER'
                ? 'bg-primary-container text-on-primary-container shadow-xs'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">water_drop</span>
            <span>Water Deficit</span>
          </button>
        </div>
      </div>

      {/* Main Leaflet Map Container */}
      <div className="flex-1 w-full relative z-0">
        <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '400px' }} />
      </div>
    </div>
  );
};
