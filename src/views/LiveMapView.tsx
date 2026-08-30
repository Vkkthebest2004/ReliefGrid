import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { GisMap } from '../components/GisMap';
import { ZoneDrawer } from '../components/ZoneDrawer';

export const LiveMapView: React.FC = () => {
  const { selectedZone } = useDisaster();

  return (
    <div className="space-y-4">
      {/* Main Map & Optional Zone Drawer */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <div className="flex-1 w-full">
          <GisMap height="680px" />
        </div>

        {selectedZone && (
          <ZoneDrawer />
        )}
      </div>
    </div>
  );
};
