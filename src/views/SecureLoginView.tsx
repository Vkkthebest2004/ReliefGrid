import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDisaster } from '../context/DisasterContext';

export const SecureLoginView: React.FC = () => {
  const { login, setActiveTab } = useDisaster();
  const [authMethod, setAuthMethod] = useState<'OTP' | 'PASSWORD'>('OTP');
  const [officerId, setOfficerId] = useState('AS-DDMA-7402');
  const [otpCode, setOtpCode] = useState('849201');
  const [password, setPassword] = useState('••••••••••••');

  const cardRef = useRef<HTMLElement>(null);
  const inputGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.92, opacity: 0, y: 25 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)' }
      );
    }
  }, []);

  useEffect(() => {
    if (inputGroupRef.current) {
      gsap.fromTo(
        inputGroupRef.current,
        { opacity: 0, x: authMethod === 'OTP' ? -10 : 10 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [authMethod]);

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    login(officerId, authMethod === 'OTP' ? otpCode : password);
    setActiveTab('command-center');
  };

  return (
    <div className="w-full min-h-[85vh] bg-surface text-on-surface font-body-md flex flex-col items-center justify-center p-gutter select-none">
      <div className="w-full max-w-md mb-3 flex items-center justify-between">
        <button
          onClick={() => setActiveTab('role-selection')}
          className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Role Selection</span>
        </button>
        <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Level 1 Clearance</span>
      </div>

      <main ref={cardRef} className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-stack-lg flex flex-col gap-stack-lg relative overflow-hidden">
        {/* Header / Branding */}
        <header className="flex flex-col items-center text-center gap-stack-sm">
          <div className="w-20 h-20 mb-stack-sm flex items-center justify-center">
            <img 
              className="w-full h-full object-contain drop-shadow-xs" 
              alt="National Emblem of India" 
              src="/national_emblem.svg"
              onError={(e) => {
                e.currentTarget.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuDW_UicJWC9AYhtjef6Y4CPTw3vsl2DD6bTLRZEtcFcc5WYiAkuEssIlfxCze4919FRvel9c6Zo1rl9ginQ90YF2CKipkwHL7pOGUJlvSrieA7xouGHb9wlFSBUMrxFonsx4bbjexZujBEyoeVaBr0KCiRXvR1sk3FScO4LxfpiRtJDk-qSKwFtfpo9K9EjMPpj0lMi8knAowY--xCFuAxpdRlHW6L9CV7XL8Fhh2b9Y6ndnklu0D20BQ";
              }}
            />
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Relief Grid</h1>
          <h2 className="font-headline-sm text-headline-sm text-on-surface-variant">Guwahati District</h2>
          <p className="font-label-sm text-label-sm text-error mt-base uppercase tracking-wider">Authorized Personnel Only</p>
        </header>

        {/* Login Form */}
        <form onSubmit={handleAuthenticate} className="flex flex-col gap-stack-md w-full">
          {/* Officer ID */}
          <div className="flex flex-col gap-base">
            <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="officer-id">Officer ID</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]" data-icon="badge">badge</span>
              <input 
                className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors font-body-md text-on-surface text-sm" 
                id="officer-id" 
                name="officer-id" 
                placeholder="Enter your ID" 
                required 
                type="text"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
              />
            </div>
          </div>

          {/* Authentication Method Toggle */}
          <div className="flex flex-col gap-base">
            <label className="font-label-md text-label-md text-on-surface-variant">Authentication Method</label>
            <div className="flex rounded border border-outline-variant overflow-hidden">
              <button 
                className={`flex-1 py-2 font-label-md text-label-md transition-colors cursor-pointer ${
                  authMethod === 'OTP'
                    ? 'bg-surface-container text-primary border-r border-outline-variant font-bold'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                }`} 
                type="button"
                onClick={() => setAuthMethod('OTP')}
              >
                OTP (SMS)
              </button>
              <button 
                className={`flex-1 py-2 font-label-md text-label-md transition-colors cursor-pointer ${
                  authMethod === 'PASSWORD'
                    ? 'bg-surface-container text-primary font-bold'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                }`} 
                type="button"
                onClick={() => setAuthMethod('PASSWORD')}
              >
                Secure Password
              </button>
            </div>
          </div>

          {/* Dynamic OTP vs Password Input with GSAP Ref */}
          <div ref={inputGroupRef}>
            {authMethod === 'OTP' ? (
              <div className="flex flex-col gap-base">
                <label className="font-label-md text-label-md text-on-surface-variant flex justify-between" htmlFor="otp">
                  One-Time Password
                  <button type="button" className="text-secondary hover:underline font-label-sm text-label-sm cursor-pointer">Request OTP</button>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]" data-icon="dialpad">dialpad</span>
                  <input 
                    className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors font-body-md text-on-surface tracking-widest text-sm font-mono" 
                    id="otp" 
                    maxLength={6} 
                    name="otp" 
                    placeholder="••••••" 
                    required 
                    type="password"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-base">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">
                  Security Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]" data-icon="lock">lock</span>
                  <input 
                    className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors font-body-md text-on-surface text-sm" 
                    id="password" 
                    name="password" 
                    placeholder="Enter passcode" 
                    required 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            className="mt-stack-sm w-full py-3 bg-primary text-on-primary font-label-md text-label-md rounded flex items-center justify-center gap-2 hover:bg-on-primary-fixed-variant transition-colors cursor-pointer shadow-xs" 
            type="submit"
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="lock" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            Authenticate & Access
          </button>
        </form>

        {/* Footer / Notices */}
        <footer className="mt-stack-md text-center flex flex-col gap-stack-sm pt-stack-md border-t border-outline-variant">
          <p className="font-label-sm text-label-sm text-on-surface-variant">Government of Assam • Disaster Management Authority</p>
          <div className="flex justify-center gap-gutter font-label-sm text-label-sm text-secondary">
            <a className="hover:underline cursor-pointer" onClick={() => setActiveTab('command-center')}>System Status</a>
            <a className="hover:underline cursor-pointer" onClick={() => setActiveTab('reports-audit')}>Help Desk</a>
          </div>
          <p className="font-body-sm text-body-sm text-outline mt-base text-[10px]">
            Unauthorized access to this system is strictly prohibited and subject to prosecution under applicable cyber laws.
          </p>
        </footer>

        {/* Decorative Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
      </main>
    </div>
  );
};
