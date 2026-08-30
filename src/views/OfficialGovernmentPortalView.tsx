import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDisaster } from '../context/DisasterContext';

export const OfficialGovernmentPortalView: React.FC = () => {
  const { setActiveTab, login } = useDisaster();
  const [officialId, setOfficialId] = useState('AS-DDMA-7402');
  const [passcode, setPasscode] = useState('••••••••••••');

  const heroTextRef = useRef<HTMLDivElement>(null);
  const loginCardRef = useRef<HTMLDivElement>(null);
  const capabilitiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (heroTextRef.current && loginCardRef.current) {
      tl.fromTo(
        heroTextRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6 },
        '-=0.2'
      ).fromTo(
        loginCardRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6 },
        '-=0.4'
      );
    }

    if (capabilitiesRef.current) {
      const cards = capabilitiesRef.current.children;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.3, ease: 'power2.out' }
      );
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(officialId, passcode);
    setActiveTab('command-center');
  };

  return (
    <div className="w-full min-h-screen bg-background text-on-background font-body-md antialiased overflow-x-hidden select-none flex flex-col">
      {/* Institutional Header */}
      <header className="bg-surface text-primary border-b border-outline-variant py-4 px-container-padding z-50 sticky top-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <img 
              alt="National Emblem of India" 
              className="h-16 w-16 object-contain" 
              src="/national_emblem.svg"
              onError={(e) => {
                e.currentTarget.src = "https://lh3.googleusercontent.com/aida/AEtjO1WJEgcCRobad9zQitsK9lMkXVmE8B0yL2v-zEsxtNilN1-fO2kzBoxgstWiSaCogkJjkR-qMdDC7pREWbfbFDEIOqnYUFyCWM6KQ60NLqbGyPAFo5_FtXHde2Q9vhQixdqkuKizPdOtLZhwngkiZrARkd-wpkLmMoV6MMan3u2KGSGFA_WofJ7CDnhHHx-WBy8DsAmYGd_Zo-8ZOCSUTM5f_5EBbhlmJ1HtgkJ5miDmLB-yUvV0s3wpSW8W";
              }}
            />
            <div className="flex flex-col">
              <span className="font-headline-md font-bold text-primary leading-tight">Government of Assam</span>
              <span className="font-body-sm text-primary uppercase tracking-wide">District Administration</span>
              <span className="font-body-md text-primary font-semibold">Guwahati District</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('national-gateway')}
              className="bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>National Gateway</span>
            </button>
            <img 
              alt="ASDMA Logo" 
              className="h-14 w-auto object-contain" 
              src="/asdma_logo.svg"
              onError={(e) => {
                e.currentTarget.src = "https://lh3.googleusercontent.com/aida/AEtjO1Xf9YPRRpl5x8z2zwEJtzenq2wl8eoaAJrNkS59KIY4ptbr4VzuGa1jBLPDL2J6Ew3fDkFrohfwn00jWK4q1Nyub25o2n0fpHPJsD8BIqjBwU7qBfBadbFdKeFlA78MIEBecaKFLRRoJXdmB_RimDGBcTKeBAFWz7X0O-kMReo9dcfAq_tzu9_1242jWhNBwJTjJjnR7dVf3yJ0XTANfvQVjYHC4gbiT_EDz6sOgfZRvQmFQzLKAcYTOg";
              }}
            />
            <img 
              alt="NDMA Logo" 
              className="h-14 w-auto object-contain" 
              src="/ndma_logo.svg"
              onError={(e) => {
                e.currentTarget.src = "https://lh3.googleusercontent.com/aida/AEtjO1VLUE0NusIYQCflmSSSmzWTDCbD-A6CxAn2ja7YI2ndk4Kw1d7nGQDumibrt_EhPGV5jhgQRNMwbZF87FUvhA0sM25_pyZfzaYqGnon2v-RsuRZEc76-tEdrsqsKKNOCviWkyhJu2kf0i48ckQpVjVEJPvJ361k1zTszbcEisDRPA4J8ZCWK0mbNs-N6dr780qyoOgjcIYGxGpTGefTD1L537x49mdL8ji6tIzMs1LwLHV9pXTBluNQ-Lqr";
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="w-full flex-1">
        {/* Hero Section */}
        <section className="relative w-full bg-surface-container-lowest border-b border-outline-variant py-16">
          <div className="relative z-10 w-full max-w-7xl mx-auto px-container-padding flex flex-col md:flex-row items-center gap-12">
            {/* Hero Content */}
            <div ref={heroTextRef} className="flex-1 flex flex-col items-start max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary-container text-on-primary-container text-xs font-bold px-2.5 py-1 rounded font-mono">
                  SECURE DEOC PORTAL
                </span>
                <span className="text-xs text-on-surface-variant font-mono">• AS-DDMA NODE 01</span>
              </div>
              <h1 className="font-display-lg text-primary mb-4 leading-tight">
                Integrated Disaster<br/>
                Management System
              </h1>
              <p className="font-body-lg text-on-surface-variant mb-8 max-w-xl">
                A centralized, data-driven command platform for real-time crisis monitoring, resource allocation, and multi-agency coordination during critical events.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    login(officialId, passcode);
                    setActiveTab('command-center');
                  }} 
                  className="bg-primary text-on-primary font-label-md py-3 px-6 rounded hover:bg-primary-container transition-colors flex justify-center items-center gap-2 cursor-pointer shadow-sm" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">dashboard</span>
                  <span>View Dashboard</span>
                </button>
                <button 
                  onClick={() => setActiveTab('reports-audit')} 
                  className="bg-surface border border-outline text-primary font-label-md py-3 px-6 rounded hover:bg-surface-container-low transition-colors flex justify-center items-center gap-2 cursor-pointer shadow-sm" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">campaign</span>
                  <span>Public Advisories</span>
                </button>
              </div>
            </div>

            {/* Login Card (Prominent position) */}
            <div ref={loginCardRef} className="flex-1 w-full max-w-md ml-auto">
              <div className="bg-surface border border-outline rounded-xl p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-outline pb-2 mb-4">
                  <h2 className="font-headline-sm text-primary font-bold">Portal Access Gateway</h2>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900">Step 2 / 3</span>
                </div>

                <p className="font-body-sm text-on-surface-variant mb-5">
                  Select your assigned governance tier or authenticate with official credentials.
                </p>

                {/* Primary Button: 3-Role Selection Gateway */}
                <button
                  type="button"
                  onClick={() => setActiveTab('role-selection')}
                  className="w-full py-3 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-md mb-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    <span>Enter Unified Role Selection Gateway</span>
                  </div>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant"></div></div>
                  <span className="relative bg-surface px-2 text-[11px] font-semibold text-on-surface-variant">OR DIRECT OFFICER AUTH</span>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  <div>
                    <label className="block font-label-md text-primary mb-1 font-semibold text-xs">Officer ID</label>
                    <input 
                      value={officialId}
                      onChange={(e) => setOfficialId(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline rounded-lg focus:border-primary focus:ring-1 focus:ring-primary px-3 py-2 font-body-md transition-colors text-on-surface font-mono text-xs" 
                      placeholder="Enter credentials" 
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-primary mb-1 font-semibold text-xs">Passcode / OTP</label>
                    <input 
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline rounded-lg focus:border-primary focus:ring-1 focus:ring-primary px-3 py-2 font-body-md transition-colors text-on-surface text-xs" 
                      placeholder="••••••••" 
                      type="password"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold text-xs py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 cursor-pointer border border-outline"
                  >
                    <span>Authenticate as Officer</span>
                    <span className="material-symbols-outlined text-[16px]">login</span>
                  </button>
                </form>

                <div className="mt-4 pt-3 border-t border-outline-variant flex items-center justify-between text-on-surface-variant text-[11px]">
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('citizen-auth')} 
                    className="text-amber-700 hover:underline font-bold cursor-pointer"
                  >
                    🚨 Citizen SOS Access
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('shelter-auth')} 
                    className="text-purple-700 hover:underline font-bold cursor-pointer"
                  >
                    🏠 Shelter Node Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-container-padding">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-primary mb-4 font-bold">Portal Capabilities</h2>
              <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
                Comprehensive tools designed to support critical decision-making and rapid deployment during localized emergencies.
              </p>
            </div>
            <div ref={capabilitiesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* GIS Intelligence */}
              <div 
                onClick={() => {
                  login(officialId, passcode);
                  setActiveTab('live-map');
                }}
                className="bg-surface border border-outline rounded-xl p-6 hover:shadow-md transition-all cursor-pointer hover:border-primary group"
              >
                <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-lg mb-4 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-2xl">map</span>
                </div>
                <h3 className="font-headline-sm text-primary mb-2 font-bold group-hover:text-primary transition-colors">GIS Intelligence</h3>
                <p className="font-body-sm text-on-surface-variant">Real-time spatial analysis overlaying infrastructure, demographic data, and threat vectors on topographic maps.</p>
              </div>

              {/* Resource Allocation */}
              <div 
                onClick={() => {
                  login(officialId, passcode);
                  setActiveTab('resource-allocation-analysis');
                }}
                className="bg-surface border border-outline rounded-xl p-6 hover:shadow-md transition-all cursor-pointer hover:border-primary group"
              >
                <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-lg mb-4 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-2xl">inventory_2</span>
                </div>
                <h3 className="font-headline-sm text-primary mb-2 font-bold group-hover:text-primary transition-colors">Resource Allocation</h3>
                <p className="font-body-sm text-on-surface-variant">Live tracking of deployable assets, emergency vehicles, and supply chain logistics across affected zones.</p>
              </div>

              {/* Predictive Modeling */}
              <div 
                onClick={() => {
                  login(officialId, passcode);
                  setActiveTab('simulation-modeling');
                }}
                className="bg-surface border border-outline rounded-xl p-6 hover:shadow-md transition-all cursor-pointer hover:border-primary group"
              >
                <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-lg mb-4 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-2xl">analytics</span>
                </div>
                <h3 className="font-headline-sm text-primary mb-2 font-bold group-hover:text-primary transition-colors">Predictive Modeling</h3>
                <p className="font-body-sm text-on-surface-variant">Algorithmic risk assessment forecasting incident spread and optimizing evacuation route planning.</p>
              </div>

              {/* Communication */}
              <div 
                onClick={() => {
                  login(officialId, passcode);
                  setActiveTab('incident-intelligence');
                }}
                className="bg-surface border border-outline rounded-xl p-6 hover:shadow-md transition-all cursor-pointer hover:border-primary group"
              >
                <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-lg mb-4 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-2xl">satellite_alt</span>
                </div>
                <h3 className="font-headline-sm text-primary mb-2 font-bold group-hover:text-primary transition-colors">Multi-Agency Comms</h3>
                <p className="font-body-sm text-on-surface-variant">Encrypted, interoperable channels connecting state administration, local responders, and federal agencies.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-outline pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-container-padding">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary text-2xl" data-weight="fill">shield</span>
                <span className="font-headline-sm font-bold text-primary">Relief Grid</span>
              </div>
              <p className="font-body-sm text-on-surface-variant max-w-sm mb-6">
                Official disaster management portal for Guwahati District Administration. Secure, reliable, and built for resilience.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container rounded-sm border border-outline flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">account_balance</span>
                </div>
                <div className="w-12 h-12 bg-surface-container rounded-sm border border-outline flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">local_police</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-label-md text-primary mb-4 uppercase tracking-wider font-bold">Resources</h4>
              <ul className="space-y-3 font-body-sm text-on-surface-variant">
                <li><a className="hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveTab('reports-audit')}>Documentation</a></li>
                <li><a className="hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveTab('incident-intelligence')}>API Access</a></li>
                <li><a className="hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveTab('simulation-modeling')}>Training Modules</a></li>
                <li><a className="hover:text-primary transition-colors cursor-pointer" onClick={() => { login(officialId, passcode); setActiveTab('command-center'); }}>System Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-label-md text-primary mb-4 uppercase tracking-wider font-bold">Support</h4>
              <ul className="space-y-3 font-body-sm text-on-surface-variant">
                <li><a className="hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveTab('incident-intelligence')}>IT Helpdesk</a></li>
                <li><a className="hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveTab('incident-intelligence')}>Report Incident</a></li>
                <li><a className="hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveTab('reports-audit')}>Privacy Policy</a></li>
                <li><a className="hover:text-primary transition-colors cursor-pointer" onClick={() => setActiveTab('reports-audit')}>Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-outline pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-body-sm text-on-surface-variant">
            <p>© 2026 Relief Grid Operations. All rights reserved.</p>
            <p>Guwahati District Administration</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
