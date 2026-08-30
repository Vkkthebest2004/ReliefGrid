import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    officer, 
    userRole,
    citizenUser,
    shelterCoordinator,
    notifications, 
    situationChangeDetected, 
    recalculateOptimization,
    dismissSituationChangeAlert,
    logout,
    resetScenario,
    toggleSidebar,
    toggleSidebarCollapse,
    isSidebarCollapsed
  } = useDisaster();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'national-gateway':
        return { section: 'National Command', page: 'State & UT Directory' };
      case 'official-portal':
        return { section: 'State Operations', page: 'ASDMA Portal' };
      case 'role-selection':
        return { section: 'Gateway Access', page: 'Role Clearance Selection' };
      case 'command-center':
        return { section: 'Emergency Operations', page: 'Command Center COP' };
      case 'resource-grid':
        return { section: 'Government Resources', page: 'Availability & Warehouse Grid' };
      case 'asset-inventory':
        return { section: 'Institutional Assets', page: 'Resource Stock & Inventory' };
      case 'allocation-planner':
        return { section: 'Resource Allocation', page: 'Multi-Depot Dispatch Engine' };
      case 'logistics-tracker':
        return { section: 'Logistics Operations', page: 'Supply Convoy Movement' };
      case 'region-assessment':
        return { section: 'Regional Intelligence', page: 'Critical Needs & Priority Queue' };
      case 'resource-allocation-analysis':
        return { section: 'Decision Support', page: 'Resource Allocation DSS' };
      case 'simulation-modeling':
        return { section: 'Simulation Module', page: 'Hydrodynamic Inundation' };
      case 'live-map':
        return { section: 'GIS Operations', page: 'Live Tactical Map' };
      case 'incident-intelligence':
        return { section: 'Intelligence', page: 'Verification & Fog Filter' };
      case 'severity-priority':
        return { section: 'Analytics', page: 'Severity & Priority Matrix' };
      case 'route-logistics':
        return { section: 'Logistics', page: 'Route & Detour Management' };
      case 'shelter-operations':
        return { section: 'Field Ops', page: 'Relief Shelters' };
      case 'reports-audit':
        return { section: 'Auditing', page: 'Situation Reports & SITREP' };
      // 🏠 Shelter Tabs
      case 'shelter-dashboard':
        return { section: 'Shelter Hub', page: 'Operations Overview' };
      case 'shelter-occupancy':
        return { section: 'Shelter Hub', page: 'Occupancy & Intake Registry' };
      case 'shelter-citizen-requests':
        return { section: 'Shelter Hub', page: 'Citizen Distress Triage' };
      case 'shelter-resources':
        return { section: 'Shelter Logistics', page: 'Commodity Inventory' };
      case 'shelter-requests':
        return { section: 'Shelter Logistics', page: 'DDMA Requisitions' };
      case 'shelter-ngo-network':
        return { section: 'Civil Society', page: 'NGO & Volunteer Network' };
      case 'shelter-announcements':
        return { section: 'Public Address', page: 'Camp Notices & Alerts' };
      case 'shelter-settings':
        return { section: 'Facility Setup', page: 'Parameters & Contacts' };
      // 👤 Citizen Tabs
      case 'citizen-home':
        return { section: 'Citizen Portal', page: 'Emergency Home' };
      case 'citizen-need-help':
        return { section: 'Citizen Portal', page: 'Emergency SOS Beacon' };
      case 'citizen-find-safety':
        return { section: 'Citizen Portal', page: 'Verified Safety Map' };
      case 'citizen-report':
        return { section: 'Citizen Portal', page: 'Report Hazard Incident' };
      case 'citizen-requests':
        return { section: 'Citizen Portal', page: 'My Rescue Requests' };
      case 'missing-persons':
        return { section: 'Welfare & Family', page: 'Missing Persons & Shelter Locator' };
      default:
        return { section: 'Operations', page: 'ReliefGrid Platform' };
    }
  };

  const breadcrumb = getBreadcrumb();

  return (
    <>
      {/* Top Header Mobile */}
      <header className="flex md:hidden justify-between items-center w-full px-container-padding h-16 z-30 bg-surface border-b border-outline-variant fixed top-0 left-0 transition-colors duration-200 ease-in-out select-none">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSidebar} 
            className="material-symbols-outlined text-primary cursor-pointer p-1.5 hover:bg-surface-container rounded-lg flex items-center justify-center"
            title="Open Slide Navigation Menu"
          >
            menu
          </button>
          <span className="font-headline-md text-headline-md font-bold text-primary">Relief Grid</span>
        </div>
        <div className="flex items-center gap-4 text-primary">
          <span 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="material-symbols-outlined cursor-pointer hover:bg-surface-container-low rounded-full p-1"
          >
            notifications
          </span>
          <span 
            onClick={() => setShowUserMenu(!showUserMenu)} 
            className="material-symbols-outlined cursor-pointer hover:bg-surface-container-low rounded-full p-1"
          >
            account_circle
          </span>
        </div>
      </header>

      {/* Top Header Desktop */}
      <header className="hidden md:flex justify-between items-center w-full px-container-padding h-16 z-30 bg-surface border-b border-outline-variant transition-colors duration-200 ease-in-out sticky top-0 select-none">
        {/* Left: Breadcrumbs & Slide Toggle & State Switcher */}
        <div className="flex items-center gap-3 text-on-surface-variant font-label-md text-label-md">
          {/* Slide Collapse / Expand Toggle Button */}
          <button
            onClick={toggleSidebarCollapse}
            className="flex items-center justify-center p-1.5 rounded-lg hover:bg-surface-container-high text-primary transition-colors cursor-pointer border border-outline-variant/60 hover:border-primary/40 shadow-2xs"
            title={isSidebarCollapsed ? "Expand Menu (Slide Out)" : "Collapse Menu (Slide In)"}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isSidebarCollapsed ? 'menu_open' : 'menu'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('national-gateway')}
            className="flex items-center gap-1 text-xs font-bold bg-surface-container hover:bg-surface-container-high px-2.5 py-1 rounded border border-outline-variant text-primary transition-colors cursor-pointer"
            title="Switch to National Command Gateway"
          >
            <span className="material-symbols-outlined text-[16px]">public</span>
            <span>National</span>
          </button>

          <span className="text-outline-variant">|</span>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
            <span className="text-primary font-bold">{breadcrumb.section}</span> 
            <span>/</span> 
            <span>{breadcrumb.page}</span>
          </div>
        </div>

        {/* Right: Actions & User Info */}
        <div className="flex items-center gap-2 text-primary relative">
          {/* Reset Scenario Button */}
          <button
            onClick={() => {
              if (confirm('Reset incident simulation? All warehouse inventory will return to 100% capacity and critical region deficits will be re-opened.')) {
                resetScenario();
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold font-mono text-on-surface-variant hover:text-primary bg-surface-container hover:bg-surface-container-high rounded border border-outline-variant transition-colors cursor-pointer"
            title="Reset Incident Scenario & Depot Stocks"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span className="hidden lg:inline">Reset Incident</span>
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="material-symbols-outlined cursor-pointer hover:bg-surface-container-low rounded-full p-2 transition-colors duration-200 ease-in-out text-[22px] flex items-center justify-center relative"
              title="Operational Alerts"
            >
              notifications
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface"></span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-surface border border-outline-variant rounded-xl shadow-lg p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant mb-2">
                  <span className="font-label-md text-label-md text-primary font-bold">Operational Alerts</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">{notifications.length} Active</span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded bg-surface-container-low border border-outline-variant/60 text-xs">
                      <div className="flex justify-between font-bold text-on-surface">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-on-surface-variant font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-on-surface-variant text-[11px] mt-0.5">{n.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <button 
            onClick={() => setActiveTab('reports-audit')}
            className="material-symbols-outlined cursor-pointer hover:bg-surface-container-low rounded-full p-2 transition-colors duration-200 ease-in-out text-[22px]"
            title="Help & System Documentation"
          >
            help
          </button>

          {/* Account Profile Button */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:bg-surface-container-low rounded-full py-1 px-2 transition-colors duration-200 ease-in-out cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                userRole === 'OFFICER' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' :
                userRole === 'SHELTER_COORDINATOR' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' :
                'bg-amber-600/20 text-amber-400 border border-amber-500/30'
              }`}>
                {userRole === 'OFFICER' ? 'GO' : userRole === 'SHELTER_COORDINATOR' ? 'SC' : 'CZ'}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-primary leading-tight">
                  {userRole === 'OFFICER' ? officer.role : userRole === 'SHELTER_COORDINATOR' ? 'Camp Coordinator' : 'Citizen'}
                </span>
                <span className="text-[10px] text-on-surface-variant font-mono leading-tight">
                  {userRole === 'OFFICER' ? officer.name : userRole === 'SHELTER_COORDINATOR' ? (shelterCoordinator?.name || 'Maj. Saikia') : (citizenUser?.name || 'Rahul Kalita')}
                </span>
              </div>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-surface border border-outline-variant rounded-xl shadow-lg py-2 z-50 animate-in fade-in">
                <div className="px-4 py-2 border-b border-outline-variant">
                  <div className="text-xs font-bold text-primary">
                    {userRole === 'OFFICER' ? officer.name : userRole === 'SHELTER_COORDINATOR' ? (shelterCoordinator?.name || 'Maj. Vikramjit Saikia') : (citizenUser?.name || 'Rahul Kalita')}
                  </div>
                  <div className="text-[11px] text-on-surface-variant font-mono">
                    {userRole === 'OFFICER' ? officer.badgeNumber : userRole === 'SHELTER_COORDINATOR' ? (shelterCoordinator?.badgeNumber || 'SDRF-SC-4409') : (citizenUser?.phone || '+91 98640-12345')}
                  </div>
                  <div className="text-[10px] text-secondary font-bold mt-1">
                    Role: {userRole === 'OFFICER' ? '🏛️ Govt Officer' : userRole === 'SHELTER_COORDINATOR' ? '🏠 Shelter Coordinator' : '👤 Citizen'}
                  </div>
                </div>

                <div className="p-2 border-b border-outline-variant space-y-1">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider block px-2">
                    Switch Active Portal:
                  </span>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setActiveTab('role-selection');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-secondary hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    ⇄ Open Role Selection Gateway
                  </button>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-error hover:bg-error-container/20 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Exit Session & Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Critical Situation Change Banner */}
      {situationChangeDetected && (
        <div className="bg-[#FFF7ED] border-b border-[#FED7AA] px-4 py-2 flex items-center justify-between gap-4 animate-pulse select-none z-20">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#EA580C] text-[20px]">warning</span>
            <div className="text-xs text-[#9A3412]">
              <strong className="font-bold uppercase tracking-wide">SITUATION CHANGE DETECTED:</strong> New severe flood surge & NH-27 bridge disruption recorded. Existing resource allocation is no longer optimal.
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                recalculateOptimization();
                setActiveTab('resource-allocation-analysis');
              }}
              className="px-3 py-1 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>RECALCULATE ALLOCATION</span>
            </button>
            <button
              onClick={dismissSituationChangeAlert}
              className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
};
