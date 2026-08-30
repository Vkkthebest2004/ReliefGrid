import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { 
  FileCheck2, 
  Printer, 
  Lock
} from 'lucide-react';

export const ReportsAuditView: React.FC = () => {
  const { 
    disasterEvent, 
    officer, 
    zones, 
    auditLogs 
  } = useDisaster();

  const [activeTab, setActiveTab] = useState<'SITREP' | 'AUDIT_LOG'>('SITREP');

  const criticalZones = zones.filter(z => z.severityCategory === 'CRITICAL');
  const totalAffected = zones.reduce((sum, z) => sum + z.affectedPopulation, 0);
  const totalCasualties = zones.reduce((sum, z) => sum + z.reportedCasualties, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Header */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs no-print">
        <div>
          <div className="text-[10px] font-bold tracking-wider text-[#1E3A8A] uppercase flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>EXECUTIVE BRIEFINGS & STATUTORY AUDIT LOGS</span>
          </div>
          <h2 className="text-base font-bold text-[#0F2042] font-heading mt-0.5">
            Situation Report (SITREP) & Decision Audit Trail
          </h2>
          <p className="text-xs text-gray-500">
            Formal institutional situation reports formatted for District Magistrate (DM) and State Disaster Management Authority review.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('SITREP')}
            className={`px-3 py-1.5 text-xs font-bold rounded cursor-pointer ${
              activeTab === 'SITREP' ? 'bg-[#1E3A8A] text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            SITREP Document
          </button>
          
          <button
            onClick={() => setActiveTab('AUDIT_LOG')}
            className={`px-3 py-1.5 text-xs font-bold rounded cursor-pointer ${
              activeTab === 'AUDIT_LOG' ? 'bg-[#1E3A8A] text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Audit Log ({auditLogs.length})
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-[#0F2042] hover:bg-[#1A365D] text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer ml-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official SITREP</span>
          </button>
        </div>
      </div>

      {/* 1. Official Government SITREP View */}
      {activeTab === 'SITREP' && (
        <div className="bg-white border border-[#D9DEE5] rounded-md p-8 max-w-4xl mx-auto space-y-6 text-[#1E293B] shadow-sm print:border-none print:shadow-none">
          
          {/* Institutional Official Letterhead Header */}
          <div className="text-center border-b-2 border-[#0F2042] pb-4 space-y-1">
            <div className="w-14 h-14 mx-auto mb-1">
              <img src="/emblem.svg" alt="Official Emblem" className="w-full h-full object-contain" />
            </div>
            <div className="text-xs font-bold tracking-widest uppercase text-[#0F2042]">
              GOVERNMENT OF ASSAM • DISTRICT DISASTER MANAGEMENT AUTHORITY
            </div>
            <div className="text-[11px] font-semibold text-gray-600">
              OFFICE OF THE DEPUTY COMMISSIONER & DISTRICT MAGISTRATE, GUWAHATI
            </div>
            <h1 className="text-lg font-black text-[#0F2042] font-heading tracking-wide uppercase mt-2">
              DISASTER SITUATION REPORT (SITREP-04)
            </h1>
            <div className="text-xs font-mono text-gray-500">
              Reference: DDMA/GHY/EMG/2026/0830 • Issued: 14:15 IST, 30 August 2026
            </div>
          </div>

          {/* Incident Summary Matrix */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F2042] border-b border-gray-200 pb-1">
              1. EXECUTIVE INCIDENT OVERVIEW
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-[#F8FAFC] border border-gray-200 rounded">
                <div className="text-[10px] text-gray-500 font-semibold uppercase">Incident ID</div>
                <div className="font-bold font-mono text-[#0F2042]">{disasterEvent.id}</div>
              </div>
              <div className="p-2 bg-[#F8FAFC] border border-gray-200 rounded">
                <div className="text-[10px] text-gray-500 font-semibold uppercase">Primary Hazard</div>
                <div className="font-bold text-[#DC2626]">{disasterEvent.type}</div>
              </div>
              <div className="p-2 bg-[#F8FAFC] border border-gray-200 rounded">
                <div className="text-[10px] text-gray-500 font-semibold uppercase">Affected Population</div>
                <div className="font-bold font-mono text-[#0F2042]">{totalAffected.toLocaleString()}</div>
              </div>
              <div className="p-2 bg-[#F8FAFC] border border-gray-200 rounded">
                <div className="text-[10px] text-gray-500 font-semibold uppercase">Logged Casualties</div>
                <div className="font-bold font-mono text-red-600">{totalCasualties} Fatalities / Triage</div>
              </div>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed mt-2">
              A major M6.4 seismic tremor at 08:42 IST triggered widespread embankment instability along the Brahmaputra northern bank. Subsequent flash flooding inundated four key administrative sectors: <strong>Nandipur (Zone 07)</strong>, <strong>Boragaon (Zone 04)</strong>, <strong>North Guwahati (Zone 02)</strong>, and <strong>Jalukbari (Zone 01)</strong>. Structural failure at NH-27 bridge span #3 has necessitated amphibious and air rescue vectors.
            </p>
          </div>

          {/* Critical Sectors Ranking Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F2042] border-b border-gray-200 pb-1">
              2. SECTOR-WISE DAMAGE & RESOURCE DEFICIT APPRAISAL
            </h3>
            <table className="gov-table text-xs">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Revenue Sector</th>
                  <th className="num">Severity Index</th>
                  <th className="num">Affected Pop</th>
                  <th>Road Status</th>
                  <th className="num">Water Deficit</th>
                  <th>Top Priority Requirement</th>
                </tr>
              </thead>
              <tbody>
                {criticalZones.map((z) => (
                  <tr key={z.id}>
                    <td className="font-bold font-mono">#{z.priorityRank}</td>
                    <td className="font-bold">{z.name}</td>
                    <td className="num font-bold text-red-600 font-mono">{z.severityScore}/100</td>
                    <td className="num font-mono">{z.affectedPopulation.toLocaleString()}</td>
                    <td><span className="badge-critical">{z.roadAccessStatus}</span></td>
                    <td className="num font-mono font-bold text-red-600">{z.waterDeficitLiters.toLocaleString()} L</td>
                    <td className="font-semibold">{z.topNeeds[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dispatched Deployments Matrix */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F2042] border-b border-gray-200 pb-1">
              3. ASSET DISPATCH & RESOURCE MOBILIZATION
            </h3>
            <div className="text-xs text-gray-700 space-y-1">
              <div>• <strong>Search & Rescue:</strong> 8 NDRF/SDRF Columns deployed (360 personnel) equipped with inflatable motorized boats and hydraulic cutters.</div>
              <div>• <strong>Medical Emergency:</strong> 23 Advanced Life Support (ALS) ambulances and 9 surgical triage units deployed to GMCH and Field Base.</div>
              <div>• <strong>Commodity Relief:</strong> 26,600 Liters potable water and 10,400 dry ration kits dispatched via Palasbari bypass detour.</div>
            </div>
          </div>

          {/* Official Signatures Block */}
          <div className="pt-8 border-t border-gray-300 flex justify-between items-end text-xs">
            <div>
              <div className="font-bold text-[#0F2042]">{officer.name}</div>
              <div className="text-gray-600">{officer.role}</div>
              <div className="text-gray-500 text-[10px]">District Disaster Management Authority, Guwahati</div>
            </div>

            <div className="text-right">
              <div className="w-32 border-b border-gray-400 mb-1 mx-auto" />
              <div className="font-bold text-[#0F2042]">Deputy Commissioner & DM</div>
              <div className="text-gray-500 text-[10px]">Kamrup Metropolitan District, Assam</div>
            </div>
          </div>

        </div>
      )}

      {/* 2. Statutory Audit Log View */}
      {activeTab === 'AUDIT_LOG' && (
        <div className="gov-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-2">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#1E3A8A]" />
              <h3 className="text-xs font-bold text-[#0F2042] uppercase tracking-wider">
                Immutable Decision Audit Trail & Authentication Records
              </h3>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              Tamper-evident logs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Authorizing Officer</th>
                  <th>Action Type</th>
                  <th>Operational Action Summary</th>
                  <th>Terminal & IP Address</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="font-mono text-xs text-gray-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="font-bold text-[#0F2042] text-xs">
                      {log.officerName}
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.actionType === 'ALLOCATION_APPROVED' ? 'bg-blue-100 text-blue-800' :
                        log.actionType === 'VERIFICATION' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.actionType}
                      </span>
                    </td>
                    <td className="text-xs text-gray-700 font-medium max-w-md">
                      {log.summary}
                    </td>
                    <td className="text-[11px] font-mono text-gray-400">
                      {log.terminal} ({log.ipAddress})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
