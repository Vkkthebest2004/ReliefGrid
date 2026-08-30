import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import type { NavigationTab } from '../types';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isSidebarOpen, 
    isSidebarCollapsed, 
    toggleSidebarCollapse, 
    closeSidebar,
    userRole,
    switchRoleDirectly,
    citizenSOSTickets
  } = useDisaster();

  // 🏛️ 1. Officer Navigation Items
  const officerNavItems: {
    id: NavigationTab;
    label: string;
    icon: string;
    badge?: string;
    filledOnActive?: boolean;
    relatedTabs?: NavigationTab[];
  }[] = [
    { id: 'command-center', label: 'Command Center', icon: 'dashboard', filledOnActive: true },
    { 
      id: 'asset-inventory', 
      label: 'Asset Inventory', 
      icon: 'inventory_2', 
      badge: 'LIVE', 
      filledOnActive: true, 
      relatedTabs: ['asset-inventory', 'resource-grid', 'resource-management'] 
    },
    { 
      id: 'allocation-planner', 
      label: 'Resource Allocation', 
      icon: 'hub', 
      badge: 'RADS', 
      filledOnActive: true, 
      relatedTabs: [
        'allocation-planner', 
        'region-assessment', 
        'logistics-tracker', 
        'resource-allocation-analysis', 
        'route-logistics'
      ] 
    },
    { id: 'live-map', label: 'Tactical GIS Map', icon: 'location_on', filledOnActive: true },
    { id: 'simulation-modeling', label: 'Hydrodynamic Sim', icon: 'water_drop', filledOnActive: true, relatedTabs: ['simulation-modeling', 'simulation-control'] },
    { id: 'incident-intelligence', label: 'Incident Triage', icon: 'campaign', filledOnActive: true },
    { id: 'severity-priority', label: 'Severity Priority', icon: 'priority_high', filledOnActive: true },
    { id: 'shelter-operations', label: 'Shelter Hubs', icon: 'night_shelter', filledOnActive: true },
    { id: 'response-operations', label: 'NDRF Response Ops', icon: 'local_shipping', filledOnActive: true },
    { id: 'reports-audit', label: 'Audit & SITREP', icon: 'verified', filledOnActive: true },
    { id: 'national-gateway', label: 'National Gateway', icon: 'public' }
  ];

  // 🏠 2. Shelter Coordinator Navigation Items
  const shelterNavItems: {
    id: NavigationTab;
    label: string;
    icon: string;
    badge?: string;
    filledOnActive?: boolean;
    relatedTabs?: NavigationTab[];
  }[] = [
    { id: 'shelter-dashboard', label: 'Shelter Dashboard', icon: 'dashboard', filledOnActive: true },
    { id: 'shelter-occupancy', label: 'Occupancy & Intake', icon: 'group', badge: 'LIVE', filledOnActive: true },
    { id: 'shelter-citizen-requests', label: 'Citizen Requests', icon: 'contact_emergency', badge: `${citizenSOSTickets.length}`, filledOnActive: true },
    { id: 'shelter-resources', label: 'Resource Inventory', icon: 'inventory_2', filledOnActive: true },
    { id: 'shelter-requests', label: 'DDMA Requisitions', icon: 'local_shipping', filledOnActive: true },
    { id: 'shelter-ngo-network', label: 'NGO Network', icon: 'corporate_fare', filledOnActive: true },
    { id: 'shelter-announcements', label: 'Camp Notices', icon: 'campaign', filledOnActive: true },
    { id: 'missing-persons', label: 'Missing Persons', icon: 'person_search', badge: 'REUNITE', filledOnActive: true },
    { id: 'shelter-settings', label: 'Facility Settings', icon: 'settings', filledOnActive: true }
  ];

  // 👤 3. Citizen Navigation Items
  const citizenNavItems: {
    id: NavigationTab;
    label: string;
    icon: string;
    badge?: string;
    filledOnActive?: boolean;
    relatedTabs?: NavigationTab[];
  }[] = [
    { id: 'citizen-home', label: 'Citizen Home', icon: 'home', filledOnActive: true },
    { id: 'citizen-need-help', label: 'Get Emergency SOS', icon: 'sos', badge: 'FAST', filledOnActive: true },
    { id: 'citizen-find-safety', label: 'Find Safety Map', icon: 'explore', filledOnActive: true },
    { id: 'missing-persons', label: 'Find Family', icon: 'person_search', badge: 'SYNC', filledOnActive: true },
    { id: 'citizen-report', label: 'Report Incident', icon: 'report_problem', filledOnActive: true },
    { id: 'citizen-requests', label: 'My Requests', icon: 'track_changes', badge: `${citizenSOSTickets.length}`, filledOnActive: true }
  ];

  const currentNavItems = 
    userRole === 'SHELTER_COORDINATOR' ? shelterNavItems :
    userRole === 'CITIZEN' ? citizenNavItems :
    officerNavItems;

  const roleLabel = 
    userRole === 'SHELTER_COORDINATOR' ? 'Shelter Coordinator' :
    userRole === 'CITIZEN' ? 'Citizen Access' :
    'Govt Emergency Officer';

  return (
    <>
      {/* Mobile Backdrop Overlay (Slide-out on click) */}
      {isSidebarOpen && (
        <div 
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Main Slide-In / Slide-Out SideNav Bar */}
      <nav 
        className={`fixed left-0 top-0 h-full flex flex-col py-4 z-50 bg-surface border-r border-outline-variant transition-all duration-300 ease-in-out select-none shadow-xl md:shadow-none ${
          isSidebarCollapsed ? 'w-[76px]' : 'w-[260px]'
        } ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header: Brand & Slide Toggle */}
        <div className={`px-4 mb-3 flex items-center justify-between transition-all duration-300 ${
          isSidebarCollapsed ? 'justify-center px-2' : ''
        }`}>
          {/* Brand Logo & Title */}
          <div 
            onClick={() => {
              if (userRole === 'OFFICER') setActiveTab('command-center');
              else if (userRole === 'SHELTER_COORDINATOR') setActiveTab('shelter-dashboard');
              else setActiveTab('citizen-home');
              closeSidebar();
            }}
            className={`flex items-center gap-3 cursor-pointer group overflow-hidden ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
            title="ReliefGrid Disaster Console"
          >
            <img 
              src="/national_emblem.svg" 
              alt="Government of India Emblem" 
              className="w-8 h-8 object-contain group-hover:scale-105 transition-transform shrink-0 drop-shadow-xs"
              onError={(e) => {
                e.currentTarget.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuDW_UicJWC9AYhtjef6Y4CPTw3vsl2DD6bTLRZEtcFcc5WYiAkuEssIlfxCze4919FRvel9c6Zo1rl9ginQ90YF2CKipkwHL7pOGUJlvSrieA7xouGHb9wlFSBUMrxFonsx4bbjexZujBEyoeVaBr0KCiRXvR1sk3FScO4LxfpiRtJDk-qSKwFtfpo9K9EjMPpj0lMi8knAowY--xCFuAxpdRlHW6L9CV7XL8Fhh2b9Y6ndnklu0D20BQ";
              }}
            />
            {!isSidebarCollapsed && (
              <div className="overflow-hidden whitespace-nowrap transition-opacity duration-200">
                <h1 className="font-headline-sm text-headline-sm font-black text-primary leading-tight">ReliefGrid</h1>
                <p className="font-label-sm text-[10px] text-on-surface-variant leading-tight">National & District Grid</p>
              </div>
            )}
          </div>

          {/* Desktop Slide Collapse / Expand Toggle Button */}
          <button
            onClick={toggleSidebarCollapse}
            className={`hidden md:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer shrink-0 ${
              isSidebarCollapsed ? 'mt-2' : ''
            }`}
            title={isSidebarCollapsed ? "Expand Menu" : "Collapse Menu"}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSidebarCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>

        {/* Active Role Clearance Strip */}
        {!isSidebarCollapsed && (
          <div className="mx-3 mb-3 p-2 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                userRole === 'OFFICER' ? 'bg-blue-500' :
                userRole === 'SHELTER_COORDINATOR' ? 'bg-purple-500' :
                'bg-amber-500 animate-pulse'
              }`} />
              <span className="text-[11px] font-bold text-primary truncate">
                {roleLabel}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('role-selection')}
              className="text-[10px] font-bold text-secondary hover:underline cursor-pointer"
            >
              Switch
            </button>
          </div>
        )}

        {/* Primary Navigation Links List */}
        <ul className="flex-1 space-y-1 px-2.5 overflow-y-auto overflow-x-hidden no-scrollbar">
          {currentNavItems.map((item) => {
            const isActive = activeTab === item.id || item.relatedTabs?.includes(activeTab);

            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    closeSidebar();
                  }}
                  className={`w-full flex items-center rounded-xl font-label-md text-xs transition-all duration-200 cursor-pointer group relative ${
                    isSidebarCollapsed 
                      ? 'justify-center p-2.5' 
                      : 'gap-3 px-3 py-2.5'
                  } ${
                    isActive
                      ? 'text-primary font-black bg-surface-container border-l-4 border-primary shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary font-medium'
                  }`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <span 
                    className="material-symbols-outlined text-[20px] shrink-0"
                    style={isActive && item.filledOnActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>

                  {!isSidebarCollapsed && (
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-left">
                      {item.label}
                    </span>
                  )}

                  {/* Badge */}
                  {!isSidebarCollapsed && item.badge && (
                    <span className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded shrink-0 ${
                      item.badge === 'FAST' || item.badge === 'RADS' ? 'bg-secondary/15 text-secondary' : 
                      'bg-error-container text-on-error-container'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {/* Tooltip Flyout when collapsed */}
                  {isSidebarCollapsed && (
                    <span className="absolute left-full ml-3 px-2.5 py-1 bg-surface-container-highest text-primary font-bold text-xs rounded-lg shadow-lg border border-outline-variant opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Bottom Fast Role Switcher & System Navigation */}
        <div className="mt-auto px-2.5 space-y-1 border-t border-outline-variant pt-2.5">
          {!isSidebarCollapsed ? (
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block px-2">
                Fast Role Switcher:
              </span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => switchRoleDirectly('OFFICER')}
                  className={`py-1 text-[10px] font-bold rounded border cursor-pointer ${
                    userRole === 'OFFICER' ? 'bg-blue-600 text-white border-blue-500' : 'bg-surface-container text-on-surface-variant border-outline-variant hover:text-primary'
                  }`}
                  title="Switch to Government Officer"
                >
                  🏛️ Officer
                </button>
                <button
                  onClick={() => switchRoleDirectly('SHELTER_COORDINATOR')}
                  className={`py-1 text-[10px] font-bold rounded border cursor-pointer ${
                    userRole === 'SHELTER_COORDINATOR' ? 'bg-purple-600 text-white border-purple-500' : 'bg-surface-container text-on-surface-variant border-outline-variant hover:text-primary'
                  }`}
                  title="Switch to Shelter Coordinator"
                >
                  🏠 Shelter
                </button>
                <button
                  onClick={() => switchRoleDirectly('CITIZEN')}
                  className={`py-1 text-[10px] font-bold rounded border cursor-pointer ${
                    userRole === 'CITIZEN' ? 'bg-amber-600 text-white border-amber-500' : 'bg-surface-container text-on-surface-variant border-outline-variant hover:text-primary'
                  }`}
                  title="Switch to Citizen"
                >
                  👤 Citizen
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('role-selection')}
              className="w-full flex items-center justify-center p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container"
              title="Change Access Role"
            >
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
            </button>
          )}

          {/* Sign Out / Exit Gateway */}
          <button
            onClick={() => {
              setActiveTab('role-selection');
              closeSidebar();
            }}
            className={`w-full flex items-center rounded-xl text-xs text-on-surface-variant hover:bg-surface-container-low hover:text-error transition-all duration-200 cursor-pointer group relative ${
              isSidebarCollapsed ? 'justify-center p-2' : 'gap-2 px-3 py-2'
            }`}
            title={isSidebarCollapsed ? "Sign Out" : undefined}
          >
            <span className="material-symbols-outlined text-[18px] shrink-0">logout</span>
            {!isSidebarCollapsed && <span className="font-semibold">Exit to Gateway</span>}
          </button>
        </div>
      </nav>
    </>
  );
};
