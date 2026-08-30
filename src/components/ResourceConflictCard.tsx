import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, Split, ArrowUpCircle } from 'lucide-react';
import type { ConflictRecord, ContenderDetail } from '../services/allocationEngine';

interface ResourceConflictCardProps {
  conflict: ConflictRecord;
  onAcceptSuggestion?: (conflict: ConflictRecord) => void;
  onSubmitManualSplit?: (conflict: ConflictRecord, splits: { [requirementId: string]: number }) => void;
  onEscalate?: (conflict: ConflictRecord) => void;
}

function ResourceIcon({ resourceType }: { resourceType: string }) {
  const map: Record<string, string> = {
    rescue_team: 'sailing',
    medical_team: 'medical_services',
    water_liters_per_day: 'water_drop',
    meal_unit: 'inventory_2',
    shelter_space: 'night_shelter',
    generator: 'bolt',
  };
  return <span className="material-symbols-outlined text-[16px] text-primary">{map[resourceType] ?? 'category'}</span>;
}

interface ContenderRowProps {
  contender: ContenderDetail;
  splitQty: number;
  onChangeSplit: (qty: number) => void;
  maxAvailable: number;
}

function ContenderRow({ contender, splitQty, onChangeSplit, maxAvailable }: ContenderRowProps) {
  const covered = Math.min(splitQty, contender.needed);
  const stillShort = Math.max(contender.needed - covered, 0);

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-outline-variant/60">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs text-primary font-mono">
            {contender.regionName}
          </span>
          <span className="font-mono text-[10px] font-bold text-error bg-error-container/40 border border-error/30 rounded px-1.5 py-0.2">
            {contender.priorityTier}
          </span>
        </div>
        <div className="text-[11px] text-on-surface-variant font-mono mt-0.5">
          needs {contender.needed.toLocaleString()} · {contender.isolatedPopulation.toLocaleString()} isolated · {contender.decayLabel}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={maxAvailable}
          value={splitQty}
          onChange={(e) => onChangeSplit(Number(e.target.value))}
          aria-label={`Units allocated to ${contender.regionName}`}
          className="w-16 bg-surface-container-lowest border border-outline-variant rounded font-mono text-xs text-right p-1 font-bold text-primary focus:outline-none focus:border-secondary"
        />
        <span
          className={`font-mono text-[11px] font-bold w-20 text-right ${
            stillShort > 0 ? 'text-error' : 'text-green-700'
          }`}
        >
          {stillShort > 0 ? `-${stillShort} short` : 'fully met'}
        </span>
      </div>
    </div>
  );
}

export const ResourceConflictCard: React.FC<ResourceConflictCardProps> = ({
  conflict,
  onAcceptSuggestion,
  onSubmitManualSplit,
  onEscalate,
}) => {
  const [mode, setMode] = useState<'suggested' | 'manual'>('suggested');
  const [splits, setSplits] = useState<{ [reqId: string]: number }>(() =>
    Object.fromEntries(conflict.contenders.map((c) => [c.requirementId, c.proposedShare]))
  );

  const totalAssigned = Object.values(splits).reduce((a, b) => a + b, 0);
  const overAllocated = totalAssigned > conflict.totalSupply;

  const setSplit = (requirementId: string, qty: number) =>
    setSplits((prev) => ({ ...prev, [requirementId]: Math.max(0, qty) }));

  return (
    <div
      role="alert"
      className="max-w-xl w-full bg-surface border-2 border-error/50 rounded-xl overflow-hidden shadow-lg font-body-md select-none"
    >
      {/* Alert Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-error-container/30 border-b border-error/30">
        <AlertTriangle className="w-4 h-4 text-error flex-shrink-0" />
        <span className="font-bold text-xs text-error font-mono tracking-wider">
          RESOURCE CONFLICT DETECTED
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-xs font-mono font-bold text-primary">
          <ResourceIcon resourceType={conflict.resourceType} />
          <span>{conflict.sourceName}</span>
        </span>
      </div>

      {/* Contenders List */}
      <div className="px-4 py-2">
        <div className="font-mono text-[11px] text-on-surface-variant py-2">
          <strong>{conflict.totalSupply}</strong> units available · {mode === 'manual' ? 'Editing custom split' : 'Engine-suggested equal priority split'}
        </div>
        {conflict.contenders.map((c) => (
          <ContenderRow
            key={c.requirementId}
            contender={c}
            splitQty={mode === 'manual' ? splits[c.requirementId] ?? c.proposedShare : c.proposedShare}
            onChangeSplit={(qty) => {
              setMode('manual');
              setSplit(c.requirementId, qty);
            }}
            maxAvailable={conflict.totalSupply}
          />
        ))}

        {overAllocated && (
          <div className="text-xs text-error font-bold font-mono pt-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">warning</span>
            <span>Total assigned ({totalAssigned}) exceeds available capacity ({conflict.totalSupply}).</span>
          </div>
        )}
      </div>

      {/* Suggested Extra Source Banner */}
      {conflict.suggestedExtraSource && (
        <div className="mx-4 my-2 p-2.5 bg-secondary/10 border border-secondary/30 rounded-lg text-xs text-secondary flex items-center gap-2 font-mono">
          <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            Engine suggestion: request <strong>{conflict.suggestedExtraSource.qty}</strong> more from{' '}
            <strong>{conflict.suggestedExtraSource.name}</strong> ({conflict.suggestedExtraSource.etaLabel})
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 p-4 flex-wrap border-t border-outline-variant/60 bg-surface-container-lowest">
        <button
          onClick={() => onAcceptSuggestion?.(conflict)}
          disabled={mode === 'manual'}
          className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
            mode === 'manual'
              ? 'bg-surface-container text-on-surface-variant opacity-60 cursor-not-allowed'
              : 'bg-primary hover:bg-primary-container text-on-primary'
          }`}
        >
          Accept Suggestion
        </button>

        <button
          onClick={() => onSubmitManualSplit?.(conflict, splits)}
          disabled={overAllocated}
          className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs border border-outline-variant transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            overAllocated
              ? 'bg-surface-container text-on-surface-variant opacity-60 cursor-not-allowed'
              : 'bg-surface hover:bg-surface-container text-primary'
          }`}
        >
          <Split className="w-3.5 h-3.5" />
          <span>{mode === 'manual' ? 'Submit Manual Split' : 'Edit Split Manually'}</span>
        </button>

        <button
          onClick={() => onEscalate?.(conflict)}
          className="w-full py-2 px-3 rounded-lg font-semibold text-xs border border-outline-variant hover:bg-surface-container text-on-surface-variant flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
        >
          <ArrowUpCircle className="w-3.5 h-3.5 text-secondary" />
          <span>Escalate to State Disaster Reserve</span>
        </button>
      </div>
    </div>
  );
};
