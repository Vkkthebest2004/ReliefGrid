import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CheckCircle2, AlertCircle, X, ArrowRight } from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';

export const ToastNotification: React.FC = () => {
  const { globalToast, dismissToast, setActiveTab } = useDisaster();
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (globalToast && toastRef.current) {
      gsap.fromTo(
        toastRef.current,
        { y: -30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [globalToast]);

  if (!globalToast) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] max-w-md w-full px-4 select-none">
      <div
        ref={toastRef}
        className={`p-4 rounded-xl shadow-2xl border-2 flex items-start gap-3.5 backdrop-blur-md ${
          globalToast.type === 'success'
            ? 'bg-surface/95 border-green-500/60 text-primary'
            : globalToast.type === 'warning'
            ? 'bg-surface/95 border-amber-500/60 text-primary'
            : 'bg-surface/95 border-secondary/60 text-primary'
        }`}
      >
        <div className="mt-0.5 flex-shrink-0">
          {globalToast.type === 'success' ? (
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-primary">
              {globalToast.title}
            </h4>
            <span className="text-[10px] text-on-surface-variant font-mono">
              {globalToast.timestamp}
            </span>
          </div>

          <p className="text-xs text-on-surface-variant mt-1 leading-snug">
            {globalToast.message}
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-outline-variant/60">
            <button
              onClick={() => {
                setActiveTab('region-assessment');
                dismissToast();
              }}
              className="text-[11px] font-bold text-secondary hover:underline flex items-center gap-1 cursor-pointer font-mono"
            >
              <span>Inspect Region Needs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-outline-variant">•</span>
            <button
              onClick={() => {
                setActiveTab('resource-grid');
                dismissToast();
              }}
              className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer font-mono"
            >
              <span>View Depleted Depots</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <button
          onClick={dismissToast}
          className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors cursor-pointer"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
