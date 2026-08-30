import React from 'react';
import { DisasterProvider, useDisaster } from './context/DisasterContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { OptimizationModal } from './components/OptimizationModal';
import { ToastNotification } from './components/ToastNotification';
import { SimulationController } from './components/SimulationController';

// 🏛️ Gateway & Authentication Views
import { NationalGatewayView } from './views/NationalGatewayView';
import { OfficialGovernmentPortalView } from './views/OfficialGovernmentPortalView';
import { RoleSelectionView } from './views/RoleSelectionView';
import { SecureLoginView } from './views/SecureLoginView';
import { CitizenAuthView } from './views/CitizenAuthView';
import { ShelterAuthView } from './views/ShelterAuthView';

// 🏛️ Government Emergency Command Views
import { CommandCenterView } from './views/CommandCenterView';
import { ResourceGridView } from './views/ResourceGridView';
import { AllocationPlannerView } from './views/AllocationPlannerView';
import { AssetInventoryView } from './views/AssetInventoryView';
import { LogisticsTrackingView } from './views/LogisticsTrackingView';
import { RegionNeedsAssessmentView } from './views/RegionNeedsAssessmentView';
import { ResourceAllocationAnalysisView } from './views/ResourceAllocationAnalysisView';
import { SimulationModelingView } from './views/SimulationModelingView';
import { LiveMapView } from './views/LiveMapView';
import { IncidentIntelligenceView } from './views/IncidentIntelligenceView';
import { SeverityPriorityView } from './views/SeverityPriorityView';
import { RouteLogisticsView } from './views/RouteLogisticsView';
import { ShelterOperationsView } from './views/ShelterOperationsView';
import { ResponseOperationsView } from './views/ResponseOperationsView';
import { ReportsAuditView } from './views/ReportsAuditView';
import { MasterAnalyticsView } from './views/MasterAnalyticsView';

// 👤 Citizen & Victim Views
import { CitizenHomeView } from './views/citizen/CitizenHomeView';
import { CitizenNeedHelpView } from './views/citizen/CitizenNeedHelpView';
import { CitizenFindSafetyView } from './views/citizen/CitizenFindSafetyView';
import { CitizenReportView } from './views/citizen/CitizenReportView';
import { CitizenRequestsView } from './views/citizen/CitizenRequestsView';

// 🏠 Shelter Management Views
import { ShelterDashboardView } from './views/shelter/ShelterDashboardView';
import { ShelterOccupancyView } from './views/shelter/ShelterOccupancyView';
import { ShelterCitizenRequestsView } from './views/shelter/ShelterCitizenRequestsView';
import { ShelterResourceInventoryView } from './views/shelter/ShelterResourceInventoryView';
import { ShelterResourceRequestsView } from './views/shelter/ShelterResourceRequestsView';
import { ShelterNgoNetworkView } from './views/shelter/ShelterNgoNetworkView';
import { ShelterAnnouncementsView } from './views/shelter/ShelterAnnouncementsView';
import { ShelterSettingsView } from './views/shelter/ShelterSettingsView';
import { MissingPersonsRegistryView } from './views/MissingPersonsRegistryView';

const AppContent: React.FC = () => {
  const { activeTab, isSidebarCollapsed } = useDisaster();

  const renderActiveView = () => {
    switch (activeTab) {
      // 🏛️ Official & Operations Views
      case 'national-gateway':
        return <NationalGatewayView />;
      case 'official-portal':
        return <OfficialGovernmentPortalView />;
      case 'role-selection':
        return <RoleSelectionView />;
      case 'secure-login':
        return <SecureLoginView />;
      case 'citizen-auth':
        return <CitizenAuthView />;
      case 'shelter-auth':
        return <ShelterAuthView />;
      case 'command-center':
        return <CommandCenterView />;
      case 'resource-grid':
        return <ResourceGridView />;
      case 'allocation-planner':
        return <AllocationPlannerView />;
      case 'asset-inventory':
        return <AssetInventoryView />;
      case 'logistics-tracker':
        return <LogisticsTrackingView />;
      case 'region-assessment':
        return <RegionNeedsAssessmentView />;
      case 'resource-allocation-analysis':
        return <ResourceAllocationAnalysisView />;
      case 'simulation-modeling':
        return <SimulationModelingView />;
      case 'live-map':
        return <LiveMapView />;
      case 'incident-intelligence':
        return <IncidentIntelligenceView />;
      case 'severity-priority':
        return <SeverityPriorityView />;
      case 'resource-management':
        return <ResourceGridView />;
      case 'route-logistics':
        return <RouteLogisticsView />;
      case 'shelter-operations':
        return <ShelterOperationsView />;
      case 'response-operations':
        return <ResponseOperationsView />;
      case 'simulation-control':
        return (
          <div className="space-y-4">
            <SimulationController />
            <CommandCenterView />
          </div>
        );
      case 'reports-audit':
        return <ReportsAuditView />;
      case 'master-analytics':
        return <MasterAnalyticsView />;

      // 👤 Citizen Views
      case 'citizen-portal':
      case 'citizen-home':
        return <CitizenHomeView />;
      case 'citizen-sos':
      case 'citizen-need-help':
        return <CitizenNeedHelpView />;
      case 'citizen-find-safety':
        return <CitizenFindSafetyView />;
      case 'citizen-report':
        return <CitizenReportView />;
      case 'citizen-requests':
        return <CitizenRequestsView />;

      // 🏠 Shelter Views
      case 'shelter-node-operations':
      case 'shelter-dashboard':
        return <ShelterDashboardView />;
      case 'shelter-occupancy':
        return <ShelterOccupancyView />;
      case 'shelter-citizen-requests':
        return <ShelterCitizenRequestsView />;
      case 'shelter-resources':
        return <ShelterResourceInventoryView />;
      case 'shelter-requests':
        return <ShelterResourceRequestsView />;
      case 'shelter-ngo-network':
        return <ShelterNgoNetworkView />;
      case 'shelter-announcements':
        return <ShelterAnnouncementsView />;
      case 'shelter-settings':
        return <ShelterSettingsView />;

      // 🔍 Cross-System Missing Persons & Family Welfare
      case 'missing-persons':
        return <MissingPersonsRegistryView />;

      default:
        return <NationalGatewayView />;
    }
  };

  // Full-screen Standalone Gateways & Auth Screens
  if (activeTab === 'national-gateway') {
    return (
      <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md">
        <NationalGatewayView />
      </div>
    );
  }

  if (activeTab === 'official-portal') {
    return (
      <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md">
        <OfficialGovernmentPortalView />
      </div>
    );
  }

  if (activeTab === 'role-selection') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-body-md">
        <RoleSelectionView />
      </div>
    );
  }

  if (activeTab === 'secure-login') {
    return (
      <div className="min-h-screen bg-surface text-on-surface flex flex-col font-body-md">
        <SecureLoginView />
      </div>
    );
  }

  if (activeTab === 'citizen-auth') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-body-md">
        <CitizenAuthView />
      </div>
    );
  }

  if (activeTab === 'shelter-auth') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-body-md">
        <ShelterAuthView />
      </div>
    );
  }

  // Authenticated Operations Shell Layout (SideNav 260px/76px + Sticky TopNav + Canvas)
  return (
    <div className="min-h-screen bg-background text-on-background font-body-md flex flex-col">
      {/* SideNav Bar (Slide-in / Slide-out) */}
      <Sidebar />

      {/* Main Right Area: TopNav Header & Scrollable Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out min-h-screen ${
        isSidebarCollapsed ? 'md:ml-[76px]' : 'md:ml-[260px]'
      }`}>
        <Header />

        <main className="flex-1 p-container-padding max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Overlays & Modals */}
      <ToastNotification />
      <AuthModal />
      <OptimizationModal />
    </div>
  );
};

export default function App() {
  return (
    <DisasterProvider>
      <AppContent />
    </DisasterProvider>
  );
}
