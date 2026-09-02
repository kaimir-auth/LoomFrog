import React from 'react';
import { LifecycleState } from '../../types/brandDna';
import { Check, ArrowRight, Sparkles, UserCheck, Shield, Flame, AlertCircle, MessageSquare } from 'lucide-react';

interface LifecycleStepperProps {
  currentState: LifecycleState;
  onAdvanceState: (newState: LifecycleState) => void;
  onOpenAiExtract?: () => void;
}

const LIFECYCLE_STAGES: Array<{
  state: LifecycleState;
  visualStep: number;
  label: string;
  sub: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    state: 'DRAFT',
    visualStep: 2,
    label: 'Draft',
    sub: 'Raw Guidelines',
    description: 'Raw brand guidelines, sample text, or unformatted notes.',
    icon: <Sparkles className="w-3.5 h-3.5" />
  },
  {
    state: 'AI_GENERATED',
    visualStep: 3,
    label: 'AI-Generated',
    sub: 'Structured Extract',
    description: 'AI model converted raw text into candidate voice & ruleset.',
    icon: <Sparkles className="w-3.5 h-3.5" />
  },
  {
    state: 'USER_REVIEW',
    visualStep: 4,
    label: 'User Review',
    sub: 'Human Tuning',
    description: 'Human checks rules, vocabulary, colors, and weights.',
    icon: <UserCheck className="w-3.5 h-3.5" />
  },
  {
    state: 'APPROVED',
    visualStep: 5,
    label: 'Approved',
    sub: 'Locked & Validated',
    description: 'Human approved profile, ready for activation.',
    icon: <Shield className="w-3.5 h-3.5" />
  },
  {
    state: 'ACTIVE',
    visualStep: 6,
    label: 'Active',
    sub: 'Live Benchmark',
    description: 'Live Brand DNA benchmark used across all audit checks.',
    icon: <Flame className="w-3.5 h-3.5" />
  }
];

export const LifecycleStepper: React.FC<LifecycleStepperProps> = ({
  currentState,
  onAdvanceState,
  onOpenAiExtract
}) => {
  const currentStageIndex = LIFECYCLE_STAGES.findIndex((s) => s.state === currentState);

  const handleStageClick = (targetState: LifecycleState) => {
    // Enforcement rule: AI_GENERATED cannot silently skip directly to ACTIVE
    if ((currentState === 'AI_GENERATED' || currentState === 'DRAFT') && targetState === 'ACTIVE') {
      alert('Safety Constraint: AI-generated profiles must be reviewed and approved by a human before activation.');
      onAdvanceState('USER_REVIEW');
      return;
    }
    onAdvanceState(targetState);
  };

  const handleNext = () => {
    if (currentStageIndex < LIFECYCLE_STAGES.length - 1) {
      onAdvanceState(LIFECYCLE_STAGES[currentStageIndex + 1].state);
    }
  };

  const handlePrev = () => {
    if (currentStageIndex > 0) {
      onAdvanceState(LIFECYCLE_STAGES[currentStageIndex - 1].state);
    }
  };

  return (
    <div className="p-6 rounded-3xl neo-liquid-panel space-y-4 relative overflow-hidden">
      <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 via-teal-300/50 to-transparent pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-2">
            <span>Brand DNA Lifecycle Pipeline</span>
            <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              6 Visual Stages &bull; 5 State Pipeline
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Guaranteed human-in-the-loop: AI-generated profiles require human review and approval before becoming Active.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenAiExtract && (
            <button
              onClick={onOpenAiExtract}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-200 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 transition-all active:scale-95 cursor-pointer shadow-sm"
              title="Open conversational AI drafting interface"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Conversational AI Drafter</span>
            </button>
          )}

          {currentStageIndex > 0 && (
            <button
              onClick={handlePrev}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#02050f]/80 hover:bg-white/[0.08] border border-cyan-500/20 backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              Previous Stage
            </button>
          )}

          {currentState === 'USER_REVIEW' && (
            <button
              onClick={() => onAdvanceState('APPROVED')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-600/30 border border-teal-300/40 transition-all active:scale-95 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              Approve Profile
            </button>
          )}

          {currentState === 'APPROVED' && (
            <button
              onClick={() => onAdvanceState('ACTIVE')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 hover:from-teal-400 hover:to-cyan-400 shadow-lg shadow-cyan-500/30 border border-white/20 transition-all active:scale-95 cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5" />
              Set as Active
            </button>
          )}

          {currentState !== 'USER_REVIEW' && currentState !== 'APPROVED' && currentStageIndex < LIFECYCLE_STAGES.length - 1 && (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white neo-liquid-btn-primary shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Advance to {LIFECYCLE_STAGES[currentStageIndex + 1].label}
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Safety Notice if AI_GENERATED */}
      {currentState === 'AI_GENERATED' && (
        <div className="p-3.5 rounded-2xl bg-teal-500/15 border border-teal-500/35 text-xs text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 backdrop-blur-md shadow-[inset_1px_1px_3px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span>
              <strong className="text-teal-300">Review Required:</strong> This profile was extracted by AI. A human must review and approve it before it can become the Active audit benchmark.
            </span>
          </div>
          <button
            onClick={() => onAdvanceState('USER_REVIEW')}
            className="w-full sm:w-auto text-center px-3 py-1.5 rounded-xl bg-teal-500/25 hover:bg-teal-500/35 text-white font-bold border border-teal-500/45 text-[11px] whitespace-nowrap cursor-pointer transition-all shadow-sm shrink-0"
          >
            Start User Review &rarr;
          </button>
        </div>
      )}

      {/* 6-Step Visual Stepper Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
        {/* Step 1 (Visual Only): Describe Your Brand -> Launches AI Extraction Modal */}
        <div
          onClick={() => onOpenAiExtract && onOpenAiExtract()}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden backdrop-blur-xl group ${
            currentState === 'DRAFT' || currentState === 'AI_GENERATED'
              ? 'bg-gradient-to-br from-teal-500/20 via-cyan-500/15 to-[#02050f]/90 border-teal-400/50 shadow-[0_0_15px_rgba(20,184,166,0.25)]'
              : 'bg-[#02050f]/80 border-cyan-500/20 hover:border-cyan-400/50 hover:bg-cyan-950/20 text-slate-200'
          }`}
          title="Click to describe your brand in conversational language with Gemini"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-teal-500/30 to-cyan-500/30 text-teal-300 border border-teal-500/40">
              01
            </span>
            <div className="text-teal-300 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="font-bold text-xs text-white truncate font-lexend flex items-center gap-1">
            <span>Describe</span>
            <Sparkles className="w-3 h-3 text-cyan-300 inline shrink-0" />
          </div>
          <div className="text-[10px] text-teal-300/80 truncate">Conversational AI</div>
        </div>

        {/* Steps 2-6 (Visual): Mapped to existing 5 real LifecycleState data models */}
        {LIFECYCLE_STAGES.map((stage, idx) => {
          const isPassed = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;

          return (
            <div
              key={stage.state}
              onClick={() => handleStageClick(stage.state)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden backdrop-blur-xl ${
                isCurrent
                  ? 'bg-gradient-to-br from-cyan-500/25 via-teal-500/20 to-[#02050f]/90 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]'
                  : isPassed
                  ? 'bg-teal-500/10 border-teal-500/30 hover:border-teal-400/50 text-slate-200'
                  : 'bg-[#02050f]/80 border-cyan-500/10 opacity-60 hover:opacity-90 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.6)]'
              }`}
            >
              {/* Top Step Number & Icon */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isCurrent
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : isPassed
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'bg-white/[0.06] text-slate-400'
                }`}>
                  0{stage.visualStep}
                </span>

                <div className={isCurrent ? 'text-cyan-300' : isPassed ? 'text-teal-400' : 'text-slate-500'}>
                  {isPassed ? <Check className="w-3.5 h-3.5" /> : stage.icon}
                </div>
              </div>

              <div className="font-bold text-xs text-white truncate font-lexend">{stage.label}</div>
              <div className="text-[10px] text-slate-400 truncate">{stage.sub}</div>

              {isCurrent && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

