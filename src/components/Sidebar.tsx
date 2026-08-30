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
    closeSidebar 
  } = useDisaster();

  const navItems: {
    id: NavigationTab;
    label: string;
    icon: string;
    badge?: string;
    filledOnActive?: boolean;
    relatedTabs?: NavigationTab[];
  }[] = [
    { id: 'national-gateway', label: 'National Gateway', icon: 'public' },
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
      badge: 'UNIFIED', 
      filledOnActive: true, 
      relatedTabs: [
        'allocation-planner', 
        'region-assessment', 
        'logistics-tracker', 
        'resource-allocation-analysis', 
        'route-logistics'
      ] 
    },
    { id: 'simulation-modeling', label: 'Simulation Alpha', icon: 'water_drop', filledOnActive: true, relatedTabs: ['simulation-modeling', 'simulation-control'] },
    { id: 'live-map', label: 'Tactical Map', icon: 'location_on', filledOnActive: true },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay (Slide-out on click) */}
      {isSidebarOpen && (
        <div 
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Main Slide-In / Slide-Out SideNav Bar */}
      <nav 
        className={`fixed left-0 top-0 h-full flex flex-col py-5 z-50 bg-surface border-r border-outline-variant transition-all duration-300 ease-in-out select-none shadow-md md:shadow-none ${
          // Width & Collapse State
          isSidebarCollapsed ? 'w-[76px]' : 'w-[260px]'
        } ${
          // Mobile Slide-In / Slide-Out Transform
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header: Brand & Slide Toggle */}
        <div className={`px-4 mb-5 flex items-center justify-between transition-all duration-300 ${
          isSidebarCollapsed ? 'justify-center px-2' : ''
        }`}>
          {/* Brand Logo & Title */}
          <div 
            onClick={() => {
              setActiveTab('national-gateway');
              closeSidebar();
            }}
            className={`flex items-center gap-3 cursor-pointer group overflow-hidden ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
            title="Go to Relief Grid National Command"
          >
            <img 
              src="/national_emblem.svg" 
              alt="Government of India Emblem" 
              className="w-9 h-9 object-contain group-hover:scale-105 transition-transform shrink-0 drop-shadow-xs"
              onError={(e) => {
                e.currentTarget.src = "https://lh3.googleusercontent.com/aida/AEtjO1WJEgcCRobad9zQitsK9lMkXVmE8B0yL2v-zEsxtNilN1-fO2kzBoxgstWiSaCogkJjkR-qMdDC7pREWbfbFDEIOqnYUFyCWM6KQ60NLqbGyPAFo5_FtXHde2Q9vhQixdqkuKizPdOtLZhwngkiZrARkd-wpkLmMoV6MMan3u2KGSGFA_WofJ7CDnhHHx-WBy8DsAmYGd_Zo-8ZOCSUTM5f_5EBbhlmJ1HtgkJ5miDmLB-yUvV0s3wpSW8W";
              }}
            />
            {!isSidebarCollapsed && (
              <div className="overflow-hidden whitespace-nowrap transition-opacity duration-200">
                <h1 className="font-headline-sm text-headline-sm font-bold text-primary leading-tight">Relief Grid</h1>
                <p className="font-label-sm text-label-sm text-on-surface-variant leading-tight">Guwahati District EOC</p>
              </div>
            )}
          </div>

          {/* Desktop Slide Collapse / Expand Toggle Button */}
          <button
            onClick={toggleSidebarCollapse}
            className={`hidden md:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer shrink-0 ${
              isSidebarCollapsed ? 'mt-2' : ''
            }`}
            title={isSidebarCollapsed ? "Expand Menu (Slide Out)" : "Collapse Menu (Slide In)"}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSidebarCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={closeSidebar}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
            title="Close menu"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Primary Navigation Links List */}
        <ul className="flex-1 space-y-1 px-2.5 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = activeTab === item.id || item.relatedTabs?.includes(activeTab);

            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    closeSidebar();
                  }}
                  className={`w-full flex items-center rounded-xl font-label-md text-label-md transition-all duration-200 cursor-pointer group relative ${
                    isSidebarCollapsed 
                      ? 'justify-center p-2.5' 
                      : 'gap-3 px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'text-primary font-bold bg-surface-container border-l-4 border-primary shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <span 
                    className="material-symbols-outlined text-[21px] shrink-0"
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
                      item.badge === 'AI' ? 'bg-secondary/15 text-secondary' : 'bg-error-container text-on-error-container'
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

        {/* Bottom SideNav Links */}
        <div className="mt-auto px-2.5 space-y-1 border-t border-outline-variant pt-3">
          {/* Settings */}
          <button
            onClick={() => {
              setActiveTab('secure-login');
              closeSidebar();
            }}
            className={`w-full flex items-center rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all duration-200 cursor-pointer group relative ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2.5'
            }`}
            title={isSidebarCollapsed ? "Settings" : undefined}
          >
            <span className="material-symbols-outlined text-[21px] shrink-0">settings</span>
            {!isSidebarCollapsed && <span>Settings</span>}
            {isSidebarCollapsed && (
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-surface-container-highest text-primary font-bold text-xs rounded-lg shadow-lg border border-outline-variant opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                Settings
              </span>
            )}
          </button>

          {/* Support */}
          <button
            onClick={() => {
              setActiveTab('reports-audit');
              closeSidebar();
            }}
            className={`w-full flex items-center rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all duration-200 cursor-pointer group relative ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2.5'
            }`}
            title={isSidebarCollapsed ? "Support & Audit" : undefined}
          >
            <span className="material-symbols-outlined text-[21px] shrink-0">contact_support</span>
            {!isSidebarCollapsed && <span>Support</span>}
            {isSidebarCollapsed && (
              <span className="absolute left-full ml-3 px-2.5 py-1 bg-surface-container-highest text-primary font-bold text-xs rounded-lg shadow-lg border border-outline-variant opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                Support & SITREP
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
