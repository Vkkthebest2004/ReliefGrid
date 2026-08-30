import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import type { IncidentReport, ReportSource, ReportStatus } from '../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Plus, 
  Radio, 
  Camera, 
  PhoneCall, 
  Satellite, 
  Sparkles
} from 'lucide-react';

export const IncidentIntelligenceView: React.FC = () => {
  const { 
    reports, 
    verifyReport, 
    rejectReport, 
    requestConfirmation, 
    addReport, 
    zones 
  } = useDisaster();

  const [filterStatus, setFilterStatus] = useState<ReportStatus | 'ALL'>('ALL');
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(reports[0]);
  const [showNewReportModal, setShowNewReportModal] = useState(false);

  // New report form state
  const [newSource, setNewSource] = useState<ReportSource>('Field Officer');
  const [newZoneId, setNewZoneId] = useState('zone-07');
  const [newClaim, setNewClaim] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newCasualties, setNewCasualties] = useState(0);
  const [newTrapped, setNewTrapped] = useState(0);

  const filteredReports = reports.filter(r => filterStatus === 'ALL' || r.status === filterStatus);

  const getSourceIcon = (source: ReportSource) => {
    switch (source) {
      case 'Field Officer': return <Radio className="w-4 h-4 text-blue-600" />;
      case 'Police Control Room': return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
      case 'District Hospital DEOC': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'Satellite & Sensor Telemetry': return <Satellite className="w-4 h-4 text-purple-600" />;
      case 'Citizen SOS / Helplines': return <PhoneCall className="w-4 h-4 text-amber-600" />;
      default: return <Camera className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const targetZone = zones.find(z => z.id === newZoneId);
    const count = reports.length + 1;
    addReport({
      id: `rep-${Date.now()}`,
      code: `REP-2026-${count.toString().padStart(3, '0')}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      source: newSource,
      zoneId: newZoneId,
      zoneName: targetZone?.name || 'Guwahati Sector',
      claim: newClaim,
      details: newDetails,
      reportedCasualties: Number(newCasualties) || 0,
      reportedTrapped: Number(newTrapped) || 0,
      confidenceScore: newSource === 'Field Officer' || newSource === 'Police Control Room' ? 88 : 45,
      sourceReliabilityPct: newSource === 'Field Officer' ? 95 : 60,
      status: 'PENDING',
      evidenceType: newSource === 'Satellite & Sensor Telemetry' ? 'TELEMETRY' : newSource === 'Field Officer' ? 'FIELD_LOG' : 'VOICE_CALL',
      corroboratingCount: 1
    });
    setShowNewReportModal(false);
    setNewClaim('');
    setNewDetails('');
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* View Header */}
      <div className="bg-white border border-[#D9DEE5] rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="text-[10px] font-bold tracking-wider text-[#1E3A8A] uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>POST-DISASTER INFORMATION FOG MITIGATION ENGINE</span>
          </div>
          <h2 className="text-base font-bold text-[#0F2042] font-heading mt-0.5">
            Incident Intelligence & Multi-Source Verification Pipeline
          </h2>
          <p className="text-xs text-gray-500">
            Filters fragmented, contradictory, and unverified distress inputs into authenticated operational situation models.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewReportModal(true)}
            className="px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#152e6f] text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Incoming Incident</span>
          </button>
        </div>
      </div>

      {/* 3-Stage Information Pipeline Visualization Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-white border border-[#D9DEE5] rounded-md flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1E3A8A] flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">STAGE 01</div>
            <div className="text-xs font-bold text-[#0F2042]">Multi-Source Ingestion</div>
            <div className="text-[10px] text-gray-500">Field logs, Police, Citizen SOS, Sensors</div>
          </div>
        </div>

        <div className="p-3 bg-white border border-[#D9DEE5] rounded-md flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-[#4F46E5] flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">STAGE 02</div>
            <div className="text-xs font-bold text-[#0F2042]">Confidence Scoring & Triangulation</div>
            <div className="text-[10px] text-gray-500">Source reliability, GPS match, corroboration</div>
          </div>
        </div>

        <div className="p-3 bg-white border border-[#D9DEE5] rounded-md flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 text-[#16A34A] flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">STAGE 03</div>
            <div className="text-xs font-bold text-[#0F2042]">Verified Situation Model</div>
            <div className="text-[10px] text-gray-500">Feeds live severity index & asset allocator</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Reports List & Detailed Inspection / Action Panel */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        
        {/* Left Column: Filterable Reports List */}
        <div className="w-full lg:w-7/12 bg-white border border-[#D9DEE5] rounded-md p-4 space-y-3 shadow-xs">
          {/* Status Filter Tabs */}
          <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-2">
            <div className="flex items-center gap-1">
              {(['ALL', 'PENDING', 'VERIFIED', 'REJECTED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                    filterStatus === status 
                      ? 'bg-[#1E3A8A] text-white' 
                      : 'text-[#475569] hover:bg-gray-100'
                  }`}
                >
                  {status} ({status === 'ALL' ? reports.length : reports.filter(r => r.status === status).length})
                </button>
              ))}
            </div>

            <div className="text-[10px] text-gray-400 font-mono">
              Total {reports.length} Logs
            </div>
          </div>

          {/* Reports Items List */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredReports.map((report) => {
              const isSelected = selectedReport?.id === report.id;

              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`p-3 rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#EFF6FF] border-[#1E3A8A] shadow-xs'
                      : 'bg-[#F8FAFC] border-[#D9DEE5] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#0F2042]">
                      {getSourceIcon(report.source)}
                      <span>{report.source}</span>
                      <span className="text-gray-300">•</span>
                      <span className="font-mono text-gray-500">{report.code}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gray-400">{report.timestamp}</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${
                        report.status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                        report.status === 'REJECTED' ? 'bg-gray-200 text-gray-700 line-through' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-[#0F2042] leading-tight">
                    {report.claim}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
                    <span>Target: <strong className="text-gray-700">{report.zoneName}</strong></span>
                    <span className="flex items-center gap-1 font-mono font-semibold">
                      Confidence: 
                      <strong className={report.confidenceScore >= 80 ? 'text-green-700' : 'text-amber-700'}>
                        {report.confidenceScore}%
                      </strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Report Verification & Action Inspector */}
        <div className="w-full lg:w-5/12 bg-white border border-[#D9DEE5] rounded-md p-4 space-y-4 shadow-xs">
          {selectedReport ? (
            <>
              {/* Header */}
              <div className="border-b border-[#D9DEE5] pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase font-mono">
                      REPORT #{selectedReport.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedReport.status === 'VERIFIED' ? 'badge-stable' :
                      selectedReport.status === 'REJECTED' ? 'badge-info' :
                      'badge-warning'
                    }`}>
                      {selectedReport.status}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-gray-400">{selectedReport.timestamp}</span>
                </div>

                <h3 className="text-sm font-bold text-[#0F2042] font-heading mt-1 leading-snug">
                  {selectedReport.claim}
                </h3>
              </div>

              {/* Source & Confidence Matrix */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#F8FAFC] border border-[#D9DEE5] rounded">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">INGESTION SOURCE</div>
                  <div className="font-bold text-[#0F2042] mt-0.5">{selectedReport.source}</div>
                  <div className="text-[10px] text-gray-500">Reliability: {selectedReport.sourceReliabilityPct}%</div>
                </div>

                <div className="p-2.5 bg-[#F8FAFC] border border-[#D9DEE5] rounded">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">CONFIDENCE INDEX</div>
                  <div className="text-base font-black text-[#1E3A8A] font-mono mt-0.5">
                    {selectedReport.confidenceScore}%
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {selectedReport.corroboratingCount} Corroborating sources
                  </div>
                </div>
              </div>

              {/* Report Description & Evidence Details */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  FIELD EVIDENCE LOG & DETAILS
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#D9DEE5] rounded text-xs text-gray-700 leading-relaxed font-sans">
                  {selectedReport.details}
                </div>
                <div className="text-[10px] text-gray-400 font-mono">
                  Evidence Protocol: {selectedReport.evidenceType}
                  {selectedReport.verifiedBy && ` • Authenticated by ${selectedReport.verifiedBy}`}
                </div>
              </div>

              {/* Operational Impact on Severity */}
              <div className="p-3 bg-[#EEF2FF] border border-[#C7D2FE] rounded text-xs space-y-1">
                <div className="text-[10px] font-bold text-[#3730A3] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SITUATION MODEL IMPACT</span>
                </div>
                <div className="text-gray-700">
                  Target Zone: <strong>{selectedReport.zoneName}</strong>
                </div>
                <div className="text-[11px] text-gray-600">
                  Verifying this report confirms structural infrastructure collapse and directly escalates the severity index, triggering additional rescue boat allocations.
                </div>
              </div>

              {/* Officer Action Buttons (The Heart of Human Verification) */}
              <div className="pt-2 space-y-2 border-t border-[#D9DEE5]">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  OFFICER VERIFICATION ACTIONS
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => verifyReport(selectedReport.id)}
                    disabled={selectedReport.status === 'VERIFIED'}
                    className="py-2 px-3 bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>VERIFY REPORT</span>
                  </button>

                  <button
                    onClick={() => rejectReport(selectedReport.id)}
                    disabled={selectedReport.status === 'REJECTED'}
                    className="py-2 px-3 bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>REJECT (FALSE ALARM)</span>
                  </button>
                </div>

                <button
                  onClick={() => requestConfirmation(selectedReport.id)}
                  className="w-full py-1.5 px-3 bg-white hover:bg-gray-50 border border-[#D9DEE5] text-[#0F2042] text-xs font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <span>REQUEST FIELD PATROL CONFIRMATION</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-xs text-gray-400">
              Select an incident report from the left list to review claims and verify.
            </div>
          )}
        </div>
      </div>

      {/* Log Incoming Incident Modal */}
      {showNewReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D9DEE5] rounded-md shadow-xl max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-2">
              <h3 className="text-sm font-bold text-[#0F2042] font-heading">
                Log Incoming Field / Citizen Incident
              </h3>
              <button 
                onClick={() => setShowNewReportModal(false)} 
                className="text-gray-400 hover:text-gray-700 flex items-center justify-center p-1 rounded hover:bg-slate-100 cursor-pointer"
                title="Close modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Source Channel</label>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value as ReportSource)}
                  className="w-full p-2 border border-[#D9DEE5] rounded bg-[#F8FAFC]"
                >
                  <option value="Field Officer">Field Officer (Radio Log)</option>
                  <option value="Police Control Room">Police Control Room (PCR 112)</option>
                  <option value="District Hospital DEOC">District Hospital Emergency Wing</option>
                  <option value="Citizen SOS / Helplines">Citizen SOS Call</option>
                  <option value="NGO Disaster Response">NGO Ground Volunteer</option>
                  <option value="Satellite & Sensor Telemetry">Satellite / Water Telemetry</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Target Zone / Sector</label>
                <select
                  value={newZoneId}
                  onChange={(e) => setNewZoneId(e.target.value)}
                  className="w-full p-2 border border-[#D9DEE5] rounded bg-[#F8FAFC]"
                >
                  {zones.map(z => (
                    <option key={z.id} value={z.id}>{z.name} ({z.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Claim Summary</label>
                <input
                  type="text"
                  value={newClaim}
                  onChange={(e) => setNewClaim(e.target.value)}
                  placeholder="e.g. Flash flood breached embankment near ward 3"
                  required
                  className="w-full p-2 border border-[#D9DEE5] rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Detailed Field Description</label>
                <textarea
                  rows={3}
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="Include coordinates, damage extent, and immediate triage needs"
                  required
                  className="w-full p-2 border border-[#D9DEE5] rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Reported Casualties</label>
                  <input
                    type="number"
                    value={newCasualties}
                    onChange={(e) => setNewCasualties(Number(e.target.value))}
                    min="0"
                    className="w-full p-2 border border-[#D9DEE5] rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Estimated Trapped</label>
                  <input
                    type="number"
                    value={newTrapped}
                    onChange={(e) => setNewTrapped(Number(e.target.value))}
                    min="0"
                    className="w-full p-2 border border-[#D9DEE5] rounded"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowNewReportModal(false)}
                  className="px-3 py-1.5 border border-[#D9DEE5] rounded text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1E3A8A] text-white font-bold rounded hover:bg-[#152e6f]"
                >
                  Submit Incident for Triage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
