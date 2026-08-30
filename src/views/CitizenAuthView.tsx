import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDisaster } from '../context/DisasterContext';
import { 
  Shield, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Radio, 
  ArrowLeft, 
  ArrowRight, 
  LifeBuoy
} from 'lucide-react';

export const CitizenAuthView: React.FC = () => {
  const { setActiveTab, loginAsCitizen } = useDisaster();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [name, setName] = useState('Rahul Kalita');
  const [email, setEmail] = useState('rahul.kalita@citizen.in');
  const [phone, setPhone] = useState('+91 98640-12345');
  const [password, setPassword] = useState('••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.92, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.4)' }
      );
    }
  }, []);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: mode === 'REGISTER' ? 15 : -15 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      loginAsCitizen(name, phone);
      setActiveTab('citizen-home');
      setIsSubmitting(false);
    }, 400);
  };

  const handleGuestAccess = () => {
    loginAsCitizen('Guest Citizen', '+91 90000-00000');
    setActiveTab('citizen-home');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative overflow-hidden font-body-md">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between z-10">
        <button
          onClick={() => setActiveTab('role-selection')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-800 transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Change Role</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          <Radio size={13} className="animate-pulse" />
          <span>Citizen Portal Access</span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-md mx-auto w-full my-auto py-8 z-10">
        <div 
          ref={cardRef}
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50 backdrop-blur-xl relative"
        >
          {/* Brand Icon & Heading */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
              <Shield size={28} />
            </div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              Public Emergency Services
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-1">
              {mode === 'LOGIN' ? 'Citizen Sign In' : 'Create Citizen Profile'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'LOGIN' 
                ? 'Sign in to access SOS rescue dispatch, track safety zones & help requests.' 
                : 'Register your contact number so response teams can locate and assist you.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setMode('LOGIN')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'LOGIN' 
                  ? 'bg-amber-500 text-slate-950 shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Existing Citizen
            </button>
            <button
              type="button"
              onClick={() => setMode('REGISTER')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'REGISTER' 
                  ? 'bg-amber-500 text-slate-950 shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              New Citizen Registration
            </button>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {mode === 'REGISTER' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mobile Number (For GPS & SMS Alerts)
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98XXX-XXXXX"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Passcode / Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating…' : mode === 'LOGIN' ? 'Sign In to Citizen Portal' : 'Register & Enter Portal'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Quick Bypass / SOS Emergency Access */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-3 text-center">
            <button
              type="button"
              onClick={handleGuestAccess}
              className="w-full py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 text-red-400 hover:text-red-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LifeBuoy size={14} className="text-red-400" />
              <span>Immediate Emergency Guest Access (Bypass Sign In)</span>
            </button>

            <p className="text-[11px] text-slate-500">
              No credentials required in extreme life-threatening emergencies.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto w-full text-center text-xs text-slate-600 py-2">
        <span>Guwahati Emergency Response Grid • Encrypted Session</span>
      </footer>
    </div>
  );
};
