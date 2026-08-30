import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDisaster } from '../context/DisasterContext';

interface StateDirectoryItem {
  id: string;
  name: string;
  code: string;
  operationsCount: number;
  status: 'ACTIVE' | 'NORMAL' | 'HIGH_ALERT';
  targetTab: 'official-portal' | 'command-center' | 'simulation-modeling';
  disasterDesc: string;
}

const ALL_STATES: StateDirectoryItem[] = [
  { id: 'assam', name: 'Assam', code: 'AS', operationsCount: 3, status: 'HIGH_ALERT', targetTab: 'official-portal', disasterDesc: 'Brahmaputra Flash Flood & Seismic Event' },
  { id: 'maharashtra', name: 'Maharashtra', code: 'MH', operationsCount: 1, status: 'NORMAL', targetTab: 'official-portal', disasterDesc: 'Monsoon Preparedness Protocol' },
  { id: 'kerala', name: 'Kerala', code: 'KL', operationsCount: 5, status: 'ACTIVE', targetTab: 'official-portal', disasterDesc: 'Highland Landslide Alert' },
  { id: 'odisha', name: 'Odisha', code: 'OD', operationsCount: 2, status: 'HIGH_ALERT', targetTab: 'simulation-modeling', disasterDesc: 'Bay of Bengal Cyclone Track' },
  { id: 'west-bengal', name: 'West Bengal', code: 'WB', operationsCount: 2, status: 'ACTIVE', targetTab: 'official-portal', disasterDesc: 'Sundarbans Tidal Inundation' },
  { id: 'gujarat', name: 'Gujarat', code: 'GJ', operationsCount: 0, status: 'NORMAL', targetTab: 'official-portal', disasterDesc: 'Coastal Surge Monitoring' },
  { id: 'tamil-nadu', name: 'Tamil Nadu', code: 'TN', operationsCount: 1, status: 'NORMAL', targetTab: 'official-portal', disasterDesc: 'Coromandel Weather Monitoring' },
  { id: 'uttarakhand', name: 'Uttarakhand', code: 'UK', operationsCount: 3, status: 'HIGH_ALERT', targetTab: 'official-portal', disasterDesc: 'Cloudburst & Glacial Outflow Alert' },
  { id: 'bihar', name: 'Bihar', code: 'BR', operationsCount: 2, status: 'ACTIVE', targetTab: 'official-portal', disasterDesc: 'Kosi Basin Flood Watch' },
  { id: 'himachal', name: 'Himachal Pradesh', code: 'HP', operationsCount: 1, status: 'NORMAL', targetTab: 'official-portal', disasterDesc: 'High Altitude Landslip Watch' },
];

export const NationalGatewayView: React.FC = () => {
  const { setActiveTab } = useDisaster();
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSizeScale, setFontSizeScale] = useState<'normal' | 'small' | 'large'>('normal');

  const bannerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const directoryCardRef = useRef<HTMLDivElement>(null);
  const statusColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (bannerRef.current) {
      tl.fromTo(bannerRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.35 });
    }

    if (heroRef.current) {
      tl.fromTo(heroRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.15');
    }

    if (directoryCardRef.current && statusColRef.current) {
      tl.fromTo(
        [directoryCardRef.current, statusColRef.current],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.12 },
        '-=0.25'
      );
    }
  }, []);

  const filteredStates = ALL_STATES.filter((state) =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    state.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    state.disasterDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStateClick = (state: StateDirectoryItem) => {
    setActiveTab(state.targetTab);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredStates.length > 0) {
      handleStateClick(filteredStates[0]);
    }
  };

  const getScaleClass = () => {
    if (fontSizeScale === 'small') return 'text-[92%]';
    if (fontSizeScale === 'large') return 'text-[108%]';
    return '';
  };

  return (
    <div className={`bg-background text-on-background font-body-md antialiased min-h-screen flex flex-col select-none ${getScaleClass()}`}>
      {/* Government Header Banner */}
      <div 
        ref={bannerRef}
        className="bg-surface-container-highest border-b border-outline-variant py-2 px-container-padding flex justify-between items-center text-label-sm text-on-surface-variant"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>gavel</span>
          <span>Government of India • Ministry of Home Affairs</span>
        </div>
        <div className="flex gap-4 items-center">
          <a className="hover:text-primary transition-colors cursor-pointer" onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}>Skip to Main Content</a>
          <div className="flex items-center border border-outline-variant rounded bg-surface px-1 gap-1">
            <button 
              onClick={() => setFontSizeScale('small')} 
              className={`px-1.5 py-0.5 text-xs hover:text-primary transition-colors cursor-pointer ${fontSizeScale === 'small' ? 'font-bold text-primary bg-surface-container' : ''}`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button 
              onClick={() => setFontSizeScale('normal')} 
              className={`px-1.5 py-0.5 text-xs hover:text-primary transition-colors cursor-pointer ${fontSizeScale === 'normal' ? 'font-bold text-primary bg-surface-container' : ''}`}
              title="Normal Font Size"
            >
              A
            </button>
            <button 
              onClick={() => setFontSizeScale('large')} 
              className={`px-1.5 py-0.5 text-xs hover:text-primary transition-colors cursor-pointer ${fontSizeScale === 'large' ? 'font-bold text-primary bg-surface-container' : ''}`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header with Government Logos */}
      <header className="bg-surface flex justify-between items-center w-full px-container-padding h-16 z-50 docked full-width top-0 border-b border-outline-variant flat no-shadows transition-colors duration-200 ease-in-out">
        <div className="flex items-center gap-3">
          {/* National Emblem of India */}
          <img 
            alt="National Emblem of India" 
            className="h-11 w-11 object-contain drop-shadow-xs" 
            src="/national_emblem.svg"
            onError={(e) => {
              // Fallback to Google CDN
              e.currentTarget.src = "https://lh3.googleusercontent.com/aida/AEtjO1WJEgcCRobad9zQitsK9lMkXVmE8B0yL2v-zEsxtNilN1-fO2kzBoxgstWiSaCogkJjkR-qMdDC7pREWbfbFDEIOqnYUFyCWM6KQ60NLqbGyPAFo5_FtXHde2Q9vhQixdqkuKizPdOtLZhwngkiZrARkd-wpkLmMoV6MMan3u2KGSGFA_WofJ7CDnhHHx-WBy8DsAmYGd_Zo-8ZOCSUTM5f_5EBbhlmJ1HtgkJ5miDmLB-yUvV0s3wpSW8W";
            }}
          />
          <div className="h-8 w-px bg-outline-variant mx-1"></div>
          
          {/* NDMA Official Logo */}
          <img 
            alt="NDMA Logo" 
            className="h-11 w-11 object-contain drop-shadow-xs" 
            src="/ndma_logo.svg"
            onError={(e) => {
              // Fallback to Google CDN
              e.currentTarget.src = "https://lh3.googleusercontent.com/aida/AEtjO1VLUE0NusIYQCflmSSSmzWTDCbD-A6CxAn2ja7YI2ndk4Kw1d7nGQDumibrt_EhPGV5jhgQRNMwbZF87FUvhA0sM25_pyZfzaYqGnon2v-RsuRZEc76-tEdrsqsKKNOCviWkyhJu2kf0i48ckQpVjVEJPvJ361k1zTszbcEisDRPA4J8ZCWK0mbNs-N6dr780qyoOgjcIYGxGpTGefTD1L537x49mdL8ji6tIzMs1LwLHV9pXTBluNQ-Lqr";
            }}
          />

          <div className="ml-2 flex flex-col">
            <span className="font-headline-sm text-headline-sm font-bold text-primary leading-tight">Relief Grid</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">National Disaster Management Infrastructure</span>
          </div>
        </div>

        {/* Search bar and Header Actions */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-8 py-2 border border-outline-variant rounded bg-surface-container-lowest text-body-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary w-72 text-on-surface" 
              placeholder="Search states, disasters or UTs..." 
              type="text"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary flex items-center justify-center cursor-pointer"
                title="Clear search"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          <button 
            aria-label="Operational Notifications" 
            onClick={() => setActiveTab('command-center')}
            className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors duration-200 ease-in-out cursor-pointer relative"
            title="Operational Alerts"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
          </button>
          
          <button 
            aria-label="Help Documentation" 
            onClick={() => setActiveTab('reports-audit')}
            className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors duration-200 ease-in-out cursor-pointer"
            title="SOP & Standard Guidelines"
          >
            <span className="material-symbols-outlined">help</span>
          </button>
          
          <button 
            aria-label="Authorized Officer Login" 
            onClick={() => setActiveTab('secure-login')}
            className="flex items-center gap-1.5 bg-primary-container text-on-primary-container px-3 py-1.5 rounded hover:bg-primary transition-colors cursor-pointer text-xs font-bold"
            title="Authorized Officer Portal"
          >
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span className="hidden sm:inline">Officer Login</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section ref={heroRef} className="bg-surface-container-low py-12 px-container-padding text-center border-b border-outline-variant">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display-lg text-display-lg text-primary mb-4 leading-tight">Relief Grid: National Command</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Select your State or Union Territory to access the localized command center, resource grid, and situation reports.
            </p>
          </div>
        </section>

        {/* 12-Col Bento Layout */}
        <div className="max-w-[1200px] w-full mx-auto px-container-padding py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
          {/* Left Column: State Selection & Search */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* State Selection Card (Bento Style) */}
            <div ref={directoryCardRef} className="bg-surface border border-outline-variant rounded-lg p-6 flex flex-col gap-4 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-outline-variant pb-3 gap-2">
                <h2 className="font-headline-sm text-headline-sm text-primary">State & UT Directory</h2>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant font-mono">
                  <span>Showing <strong>{filteredStates.length}</strong> of {ALL_STATES.length} Regions</span>
                </div>
              </div>
              
              {/* Filter Search Input */}
              <div className="relative w-full max-w-md mb-2">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-8 py-3 border border-outline-variant rounded bg-surface-container-lowest text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-on-surface" 
                  placeholder="Filter by State name or disaster type (e.g. Assam, Flood)..." 
                  type="text"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary flex items-center justify-center cursor-pointer"
                    title="Clear search"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>

              {/* State Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {filteredStates.map((state) => (
                  <div
                    key={state.id}
                    onClick={() => handleStateClick(state)}
                    className="flex items-center p-4 border border-outline-variant rounded hover:border-secondary hover:bg-surface-container-low transition-colors group cursor-pointer"
                  >
                    <div className="h-12 w-12 bg-surface-container rounded-full flex items-center justify-center mr-4 text-primary group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors shrink-0 font-bold font-mono">
                      {state.code}
                    </div>
                    <div className="flex flex-col flex-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-label-md text-label-md text-primary font-bold">{state.name}</span>
                        {state.status === 'HIGH_ALERT' && (
                          <span className="bg-error-container text-on-error-container text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                            HIGH ALERT
                          </span>
                        )}
                        {state.status === 'ACTIVE' && (
                          <span className="bg-[#659dfe]/20 text-[#003370] text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Active Operations: <strong>{state.operationsCount}</strong>
                      </span>
                      <span className="text-[11px] text-gray-500 truncate mt-0.5">
                        {state.disasterDesc}
                      </span>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-outline group-hover:text-secondary group-hover:translate-x-1 transition-transform">
                      chevron_right
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Status & Info */}
          <div ref={statusColRef} className="lg:col-span-4 flex flex-col gap-6">
            {/* National Status Card */}
            <div className="bg-surface border border-outline-variant rounded-lg p-6 shadow-xs">
              <h3 className="font-headline-sm text-headline-sm text-primary border-b border-outline-variant pb-2 mb-4">
                National System Status
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-body-md text-on-surface-variant">Central Servers</span>
                  <span className="inline-flex items-center px-2 py-1 bg-surface-container text-primary font-label-sm rounded font-semibold">
                    <span className="material-symbols-outlined text-[16px] mr-1 text-green-600">check_circle</span>
                    Operational
                  </span>
                </div>
                <div className="w-full h-px bg-outline-variant"></div>
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-body-md text-on-surface-variant">Communication Grid</span>
                  <span className="inline-flex items-center px-2 py-1 bg-surface-container text-primary font-label-sm rounded font-semibold">
                    <span className="material-symbols-outlined text-[16px] mr-1 text-green-600">check_circle</span>
                    Operational
                  </span>
                </div>
                <div className="w-full h-px bg-outline-variant"></div>
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-body-md text-on-surface-variant">Resource Tracking</span>
                  <span className="inline-flex items-center px-2 py-1 bg-surface-container-high text-primary font-label-sm rounded font-semibold">
                    <span className="material-symbols-outlined text-[16px] mr-1 text-yellow-600">warning</span>
                    Degraded
                  </span>
                </div>
              </div>
            </div>

            {/* Active Alerts */}
            <div className="bg-surface border border-outline-variant rounded-lg p-6 shadow-xs">
              <h3 className="font-headline-sm text-headline-sm text-primary border-b border-outline-variant pb-2 mb-4">
                National Alerts
              </h3>
              <div className="flex flex-col gap-3">
                {/* Flood Alert - Assam */}
                <div 
                  onClick={() => setActiveTab('official-portal')}
                  className="p-3 border-l-4 border-[#F59E0B] bg-[#FEF3C7] rounded-r flex flex-col gap-1 cursor-pointer hover:brightness-95 transition-all shadow-xs"
                  title="Click to access Assam Disaster Management Portal"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#92400E]" style={{ fontSize: '18px' }}>water_drop</span>
                      <span className="font-label-md text-label-md text-[#92400E] font-bold">Flood Alert - Assam</span>
                    </div>
                    <span className="text-[10px] font-bold bg-[#92400E]/10 text-[#92400E] px-1.5 py-0.5 rounded">OPEN →</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-[#92400E] opacity-90">
                    Brahmaputra river levels crossing danger mark. Guwahati Metropolitan Area in high alert.
                  </span>
                </div>

                {/* Cyclone Warning */}
                <div 
                  onClick={() => setActiveTab('simulation-modeling')}
                  className="p-3 border-l-4 border-error bg-error-container rounded-r flex flex-col gap-1 cursor-pointer hover:brightness-95 transition-all shadow-xs"
                  title="Click to view Cyclone Simulation"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-on-error-container" style={{ fontSize: '18px' }}>campaign</span>
                      <span className="font-label-md text-label-md text-on-error-container font-bold">Cyclone Warning - East Coast</span>
                    </div>
                    <span className="text-[10px] font-bold bg-error/20 text-on-error-container px-1.5 py-0.5 rounded">SIMULATE →</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-error-container opacity-90">
                    Evacuation protocols initiated for coastal districts.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Official Government Footer */}
      <footer className="bg-surface-container-highest border-t border-outline-variant py-8 px-container-padding mt-auto">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <img 
              alt="National Emblem of India" 
              className="h-12 w-12 object-contain grayscale opacity-80" 
              src="/national_emblem.svg"
              onError={(e) => {
                e.currentTarget.src = "https://lh3.googleusercontent.com/aida/AEtjO1WJEgcCRobad9zQitsK9lMkXVmE8B0yL2v-zEsxtNilN1-fO2kzBoxgstWiSaCogkJjkR-qMdDC7pREWbfbFDEIOqnYUFyCWM6KQ60NLqbGyPAFo5_FtXHde2Q9vhQixdqkuKizPdOtLZhwngkiZrARkd-wpkLmMoV6MMan3u2KGSGFA_WofJ7CDnhHHx-WBy8DsAmYGd_Zo-8ZOCSUTM5f_5EBbhlmJ1HtgkJ5miDmLB-yUvV0s3wpSW8W";
              }}
            />
            <div className="flex flex-col text-on-surface-variant">
              <span className="font-label-md text-label-md font-bold">Government of India</span>
              <span className="font-body-sm text-body-sm">National Disaster Management Authority</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <a className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer" onClick={() => setActiveTab('reports-audit')}>About Us</a>
            <a className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer" onClick={() => setActiveTab('incident-intelligence')}>Contact</a>
            <a className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer" onClick={() => setActiveTab('reports-audit')}>Privacy Policy</a>
            <a className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer" onClick={() => setActiveTab('reports-audit')}>Terms of Service</a>
            <a className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer" onClick={() => setActiveTab('reports-audit')}>Central Guidelines</a>
          </div>
        </div>
        <div className="text-center mt-8 font-body-sm text-body-sm text-on-surface-variant">
          © 2026 Relief Grid. Designed for Institutional Resilience.
        </div>
      </footer>
    </div>
  );
};
