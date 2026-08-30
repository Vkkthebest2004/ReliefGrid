import React from 'react';
import { DisasterProvider, useDisaster } from './context/DisasterContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { OptimizationModal } from './components/OptimizationModal';

import { NationalGatewayView } from './views/NationalGatewayView';
import { OfficialGovernmentPortalView } from './views/OfficialGovernmentPortalView';
import { SecureLoginView } from './views/SecureLoginView';
import { ResourceGridView } from './views/ResourceGridView';
import { AllocationPlannerView } from './views/AllocationPlannerView';
import { AssetInventoryView } from './views/AssetInventoryView';
import { LogisticsTrackingView } from './views/LogisticsTrackingView';
import { RegionNeedsAssessmentView } from './views/RegionNeedsAssessmentView';
import { ResourceAllocationAnalysisView } from './views/ResourceAllocationAnalysisView';
import { SimulationModelingView } from './views/SimulationModelingView';
import { CommandCenterView } from './views/CommandCenterView';
import { LiveMapView } from './views/LiveMapView';
import { IncidentIntelligenceView } from './views/IncidentIntelligenceView';
import { SeverityPriorityView } from './views/SeverityPriorityView';
import { RouteLogisticsView } from './views/RouteLogisticsView';
import { ShelterOperationsView } from './views/ShelterOperationsView';
import { ResponseOperationsView } from './views/ResponseOperationsView';
import { ReportsAuditView } from './views/ReportsAuditView';
import { ToastNotification } from './components/ToastNotification';
import { SimulationController } from './components/SimulationController';

const AppContent: React.FC = () => {
  const { activeTab, isSidebarCollapsed } = useDisaster();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'national-gateway':
        return <NationalGatewayView />;
      case 'official-portal':
        return <OfficialGovernmentPortalView />;
      case 'secure-login':
        return <SecureLoginView />;
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
      case 'command-center':
        return <CommandCenterView />;
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
      default:
        return <NationalGatewayView />;
    }
  };

  // Full-screen Standalone National Gateway Starting Page
  if (activeTab === 'national-gateway') {
    return (
      <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md">
        <NationalGatewayView />
      </div>
    );
  }

  // Full-screen Standalone Landing Portal
  if (activeTab === 'official-portal') {
    return (
      <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md">
        <OfficialGovernmentPortalView />
      </div>
    );
  }

  // Full-screen Standalone Secure Officer Login
  if (activeTab === 'secure-login') {
    return (
      <div className="min-h-screen bg-surface text-on-surface flex flex-col font-body-md">
        <SecureLoginView />
      </div>
    );
  }

  // Authenticated Emergency Operations Shell Layout (SideNav 260px/76px + Sticky TopNav + Canvas)
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
