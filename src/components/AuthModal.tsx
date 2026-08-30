import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { Shield, Lock, UserCheck, KeyRound, Building2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthenticated, login } = useDisaster();
  const [officialId, setOfficialId] = useState('AS-DDMA-7402');
  const [password, setPassword] = useState('••••••••••••');
  const [district, setDistrict] = useState('Guwahati (Kamrup Metro)');

  if (isAuthenticated) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(officialId, password);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#D9DEE5] rounded-md shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Institutional Top Header */}
        <div className="bg-[#0F2042] text-white p-6 text-center border-b-4 border-[#1E3A8A]">
          <div className="w-16 h-16 bg-white rounded-full mx-auto p-1.5 flex items-center justify-center shadow-md mb-3">
            <img src="/emblem.svg" alt="Official Emblem" className="w-12 h-12 object-contain" />
          </div>
          
          <div className="text-[10px] font-bold tracking-widest uppercase text-blue-200">
            GOVERNMENT OF ASSAM
          </div>
          <div className="text-xs font-semibold text-gray-300">
            DISTRICT DISASTER MANAGEMENT AUTHORITY
          </div>
          
          <h2 className="text-xl font-bold font-heading text-white tracking-wide mt-2">
            RELIEF GRID
          </h2>
          <div className="text-xs text-blue-100 font-medium">
            Emergency Response & Resource Command System
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0F2042] uppercase tracking-wider mb-1">
              Select Jurisdiction
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-[#D9DEE5] rounded bg-[#F8FAFC] text-[#0F2042] focus:outline-none focus:border-[#1E3A8A]"
              >
                <option value="Guwahati (Kamrup Metro)">Guwahati District (Kamrup Metropolitan)</option>
                <option value="Kamrup Rural">Kamrup Rural District</option>
                <option value="Cachar">Cachar District (Silchar)</option>
                <option value="Dibrugarh">Dibrugarh District</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2042] uppercase tracking-wider mb-1">
              Official Identification ID
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={officialId}
                onChange={(e) => setOfficialId(e.target.value)}
                placeholder="e.g. AS-DDMA-7402"
                required
                className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-[#D9DEE5] rounded bg-[#F8FAFC] text-[#0F2042] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2042] uppercase tracking-wider mb-1">
              Cryptographic Password / Token
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-[#D9DEE5] rounded bg-[#F8FAFC] text-[#0F2042] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1E3A8A] hover:bg-[#152e6f] text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>Authenticate & Access Command Console</span>
          </button>

          {/* Quick Demo Access Credentials */}
          <div className="pt-3 border-t border-[#D9DEE5] space-y-2">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">
              Authorized Demo Profiles (Quick Login)
            </div>
            
            <button
              type="button"
              onClick={() => login('AS-DDMA-7402', 'demo-pass')}
              className="w-full py-1.5 px-3 bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] rounded text-[11px] font-semibold text-[#0F2042] flex items-center justify-between cursor-pointer"
            >
              <span>District Emergency Response Officer (P. Bora)</span>
              <span className="text-[10px] text-blue-700 font-bold">Select →</span>
            </button>

            <button
              type="button"
              onClick={() => login('AS-DDMA-9104', 'demo-pass')}
              className="w-full py-1.5 px-3 bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] rounded text-[11px] font-semibold text-[#0F2042] flex items-center justify-between cursor-pointer"
            >
              <span>State Logistics Coordinator (S. Sharma)</span>
              <span className="text-[10px] text-blue-700 font-bold">Select →</span>
            </button>
          </div>
        </form>

        {/* Security Badge Footer */}
        <div className="bg-[#F8FAFC] px-6 py-3 border-t border-[#D9DEE5] text-center text-[10px] text-[#64748B] flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Secure Government Emergency Infrastructure • NIC / State EOC Protocol</span>
        </div>

      </div>
    </div>
  );
};
