import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import type { UserRole } from '../types';

export const RoleSelectionView: React.FC = () => {
  const { 
    setActiveTab, 
    loginAsOfficer, 
    loginAsShelterCoordinator, 
    loginAsCitizen,
    shelterNodes
  } = useDisaster();

  const [selectedRole, setSelectedRole] = useState<UserRole>('OFFICER');
  
  // Officer state
  const [badgeId, setBadgeId] = useState('OP-7402');
  const [passcode, setPasscode] = useState('849201');

  // Shelter state
  const [selectedShelterId, setSelectedShelterId] = useState('SH-GHY-001');

  // Citizen state
  const [citizenName, setCitizenName] = useState('Rahul Kalita');
  const [citizenPhone, setCitizenPhone] = useState('+91 98640-12345');

  const handleInitializeSession = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (selectedRole === 'OFFICER') {
      loginAsOfficer(badgeId || 'OP-7402');
      setActiveTab('command-center');
    } else if (selectedRole === 'SHELTER_COORDINATOR') {
      const shelter = shelterNodes.find(s => s.id === selectedShelterId) || shelterNodes[0];
      loginAsShelterCoordinator(selectedShelterId, shelter?.officerInCharge || 'Maj. Vikramjit Saikia');
      setActiveTab('shelter-dashboard');
    } else {
      loginAsCitizen(citizenName || 'Citizen User', citizenPhone || '+91 98640-12345');
      setActiveTab('citizen-home');
    }
  };

  const handleFastSOS = () => {
    loginAsCitizen('Emergency Guest', '+91 98640-SOS01');
    setActiveTab('citizen-need-help');
  };

  return (
    <div className="bg-[#f7f9fb] text-[#0F172A] min-h-screen flex flex-col font-['Inter',sans-serif] select-none">
      {/* TopAppBar */}
      <header className="bg-white w-full top-0 sticky border-b border-[#E2E8F0] shadow-xs flex items-center justify-between px-4 sm:px-8 py-3.5 max-w-full z-50">
        <div 
          onClick={() => setActiveTab('official-portal')}
          className="flex items-center space-x-3 cursor-pointer hover:bg-[#f2f4f6] transition-colors rounded-[4px] p-1 active:scale-95 duration-150"
        >
          <span 
            className="material-symbols-outlined text-[#004ac6] text-3xl" 
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            grid_view
          </span>
          <h1 className="font-['Outfit',sans-serif] text-2xl font-extrabold tracking-tighter text-[#0F172A]">
            RELIEFGRID OPS
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setActiveTab('national-gateway')}
            className="text-xs font-bold text-[#475569] hover:text-[#004ac6] px-2.5 py-1 rounded-[4px] border border-[#E2E8F0] bg-white cursor-pointer"
          >
            States Directory
          </button>
          <span 
            onClick={handleFastSOS}
            title="Emergency SOS"
            className="material-symbols-outlined text-[#DC2626] cursor-pointer hover:bg-[#ffdad6] transition-colors rounded-full p-2 active:scale-95 duration-150"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            emergency
          </span>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 space-y-6 sm:space-y-8 my-auto">
        {/* Auth Container */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-start">
          
          {/* Left Side: Role Selection & Info */}
          <div className="col-span-1 md:col-span-7 flex flex-col space-y-4">
            <div className="mb-2">
              <h2 className="font-['Outfit',sans-serif] text-3xl font-extrabold text-[#0F172A] mb-1 tracking-wide">
                ACCESS GATEWAY
              </h2>
              <p className="text-sm sm:text-base text-[#475569]">
                Select your operational clearance level to proceed into the system.
              </p>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Role 1: Government Officer */}
              <button 
                type="button"
                onClick={() => {
                  setSelectedRole('OFFICER');
                  setBadgeId('OP-7402');
                }}
                className={`bg-white border shadow-xs rounded-[4px] p-4 flex flex-col items-start transition-all text-left cursor-pointer ${
                  selectedRole === 'OFFICER'
                    ? 'border-[#004ac6] ring-1 ring-[#004ac6] bg-[#f7f9fb]'
                    : 'border-[#E2E8F0] hover:border-[#004ac6]'
                }`}
              >
                <span 
                  className="material-symbols-outlined text-[#004ac6] mb-2 text-2xl" 
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_police
                </span>
                <span className="font-['JetBrains_Mono',monospace] text-xs text-[#0F172A] font-semibold uppercase mb-1">
                  Level 1
                </span>
                <span className="text-sm font-semibold text-[#0F172A] leading-tight">
                  Government<br/>Officer
                </span>
              </button>

              {/* Role 2: Shelter Coordinator */}
              <button 
                type="button"
                onClick={() => {
                  setSelectedRole('SHELTER_COORDINATOR');
                  setBadgeId('SDRF-SC-4409');
                }}
                className={`bg-white border shadow-xs rounded-[4px] p-4 flex flex-col items-start transition-all text-left cursor-pointer ${
                  selectedRole === 'SHELTER_COORDINATOR'
                    ? 'border-[#004ac6] ring-1 ring-[#004ac6] bg-[#f7f9fb]'
                    : 'border-[#E2E8F0] hover:border-[#004ac6]'
                }`}
              >
                <span 
                  className="material-symbols-outlined text-[#006780] mb-2 text-2xl" 
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  home_work
                </span>
                <span className="font-['JetBrains_Mono',monospace] text-xs text-[#0F172A] font-semibold uppercase mb-1">
                  Level 2
                </span>
                <span className="text-sm font-semibold text-[#0F172A] leading-tight">
                  Shelter<br/>Coordinator
                </span>
              </button>

              {/* Role 3: Citizen & Victim */}
              <button 
                type="button"
                onClick={() => {
                  setSelectedRole('CITIZEN');
                  setBadgeId('CIT-9840');
                }}
                className={`bg-white border shadow-xs rounded-[4px] p-4 flex flex-col items-start transition-all text-left cursor-pointer ${
                  selectedRole === 'CITIZEN'
                    ? 'border-[#004ac6] ring-1 ring-[#004ac6] bg-[#f7f9fb]'
                    : 'border-[#E2E8F0] hover:border-[#004ac6]'
                }`}
              >
                <span 
                  className="material-symbols-outlined text-[#D97706] mb-2 text-2xl" 
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  person
                </span>
                <span className="font-['JetBrains_Mono',monospace] text-xs text-[#0F172A] font-semibold uppercase mb-1">
                  Level 3
                </span>
                <span className="text-sm font-semibold text-[#0F172A] leading-tight">
                  Citizen &amp;<br/>Victim
                </span>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
              <p className="font-['JetBrains_Mono',monospace] text-[11px] text-[#475569] uppercase tracking-wider font-semibold">
                Secure Protocol Enforced. Activity Monitored.
              </p>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="col-span-1 md:col-span-5 bg-white border border-[#E2E8F0] shadow-xs rounded-[4px] p-6 sm:p-8 flex flex-col space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#004ac6]"></div>
            
            <div className="flex items-center space-x-2 mb-1">
              <span className="material-symbols-outlined text-[#0F172A] text-xl">lock</span>
              <h3 className="text-base font-semibold text-[#0F172A]">
                Secure Authentication
              </h3>
            </div>

            <form onSubmit={handleInitializeSession} className="flex flex-col space-y-4 w-full">
              {/* Dynamic Field 1 */}
              {selectedRole === 'OFFICER' && (
                <div className="flex flex-col space-y-1">
                  <label className="font-['JetBrains_Mono',monospace] text-[11px] text-[#475569] uppercase font-semibold">
                    Badge ID / Facility Code
                  </label>
                  <input 
                    type="text"
                    required
                    value={badgeId}
                    onChange={(e) => setBadgeId(e.target.value)}
                    className="w-full bg-[#f7f9fb] border border-[#E2E8F0] rounded-[4px] px-3.5 py-2 font-['JetBrains_Mono',monospace] text-sm text-[#0F172A] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] shadow-inner" 
                    placeholder="OP-0000" 
                  />
                </div>
              )}

              {selectedRole === 'SHELTER_COORDINATOR' && (
                <>
                  <div className="flex flex-col space-y-1">
                    <label className="font-['JetBrains_Mono',monospace] text-[11px] text-[#475569] uppercase font-semibold">
                      Assigned Relief Camp
                    </label>
                    <select
                      value={selectedShelterId}
                      onChange={(e) => setSelectedShelterId(e.target.value)}
                      className="w-full bg-[#f7f9fb] border border-[#E2E8F0] rounded-[4px] px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
                    >
                      {shelterNodes.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.totalBedCapacity - s.currentOccupancy} free)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-['JetBrains_Mono',monospace] text-[11px] text-[#475569] uppercase font-semibold">
                      Coordinator Badge ID
                    </label>
                    <input 
                      type="text"
                      required
                      value={badgeId}
                      onChange={(e) => setBadgeId(e.target.value)}
                      className="w-full bg-[#f7f9fb] border border-[#E2E8F0] rounded-[4px] px-3.5 py-2 font-['JetBrains_Mono',monospace] text-sm text-[#0F172A] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] shadow-inner" 
                      placeholder="SDRF-SC-4409" 
                    />
                  </div>
                </>
              )}

              {selectedRole === 'CITIZEN' && (
                <>
                  <div className="flex flex-col space-y-1">
                    <label className="font-['JetBrains_Mono',monospace] text-[11px] text-[#475569] uppercase font-semibold">
                      Your Full Name
                    </label>
                    <input 
                      type="text"
                      required
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      className="w-full bg-[#f7f9fb] border border-[#E2E8F0] rounded-[4px] px-3.5 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] shadow-inner" 
                      placeholder="Full Name" 
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="font-['JetBrains_Mono',monospace] text-[11px] text-[#475569] uppercase font-semibold">
                      Mobile Phone Number
                    </label>
                    <input 
                      type="tel"
                      required
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      className="w-full bg-[#f7f9fb] border border-[#E2E8F0] rounded-[4px] px-3.5 py-2 font-['JetBrains_Mono',monospace] text-sm text-[#0F172A] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] shadow-inner" 
                      placeholder="+91 98640-XXXXX" 
                    />
                  </div>
                </>
              )}

              {/* Dynamic Field 2: Numeric Passcode */}
              {selectedRole !== 'CITIZEN' && (
                <div className="flex flex-col space-y-1">
                  <label className="font-['JetBrains_Mono',monospace] text-[11px] text-[#475569] uppercase font-semibold">
                    Numeric Passcode
                  </label>
                  <input 
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full bg-[#f7f9fb] border border-[#E2E8F0] rounded-[4px] px-3.5 py-2 font-['JetBrains_Mono',monospace] text-sm text-[#0F172A] focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] shadow-inner tracking-widest" 
                    placeholder="••••••" 
                  />
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full bg-[#004ac6] hover:bg-[#2563eb] text-white font-['JetBrains_Mono',monospace] text-xs uppercase font-bold py-3 rounded-[4px] transition-colors mt-2 shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Initialize Session</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#E2E8F0]"></div>
              <span className="flex-shrink-0 mx-2 text-[#475569] font-['JetBrains_Mono',monospace] text-xs font-semibold">
                OR
              </span>
              <div className="flex-grow border-t border-[#E2E8F0]"></div>
            </div>

            {/* Fast SOS Access Button */}
            <button 
              type="button"
              onClick={handleFastSOS}
              className="w-full bg-[#DC2626] hover:bg-[#ba1a1a] text-white font-['JetBrains_Mono',monospace] text-xs uppercase font-bold py-3 rounded-[4px] transition-colors shadow-xs flex items-center justify-center space-x-2 cursor-pointer animate-pulse"
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
              <span>Fast SOS Guest Access</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full border-t border-[#E2E8F0] bg-white py-3 px-4 text-center text-xs text-[#475569] font-['JetBrains_Mono',monospace]">
        <span>RELIEFGRID DEFENSE-GRADE DISASTER MANAGEMENT SYSTEM • ASDMA DEOC NODE</span>
      </footer>
    </div>
  );
};
