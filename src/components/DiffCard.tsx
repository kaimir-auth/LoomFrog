import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { Check, Sparkles, AlertTriangle, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { SeverityLevel } from '../types/brandDna';
import { BorderGlow, GlowColor } from './BorderGlow';

interface DiffCardProps {
  ruleId: string;
  severity: SeverityLevel;
  confidence: number;
  evidenceQuote: string;
  findingSummary: string;
  suggestedRewrite: string;
  onApplyRewrite: (original: string, replacement: string) => void;
}

export const DiffCard: React.FC<DiffCardProps> = ({
  ruleId,
  severity,
  confidence,
  evidenceQuote,
  findingSummary,
  suggestedRewrite,
  onApplyRewrite
}) => {
  const [isApplied, setIsApplied] = useState(false);

  const getSeverityBadge = () => {
    switch (severity) {
      case 'CRITICAL':
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-400" />,
          label: 'CRITICAL',
          classes: 'bg-rose-950/60 border-rose-500/50 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
        };
      case 'HIGH':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
          label: 'HIGH',
          classes: 'bg-rose-950/40 border-rose-500/40 text-rose-300'
        };
      case 'MEDIUM':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          label: 'MEDIUM',
          classes: 'bg-amber-950/40 border-amber-500/40 text-amber-300'
        };
      default:
        return {
          icon: <Info className="w-3.5 h-3.5 text-cyan-400" />,
          label: 'LOW',
          classes: 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
        };
    }
  };

  const badge = getSeverityBadge();

  // Sanitize all untrusted AI outputs with DOMPurify
  const sanitizedEvidence = DOMPurify.sanitize(evidenceQuote);
  const sanitizedSummary = DOMPurify.sanitize(findingSummary);
  const sanitizedRewrite = DOMPurify.sanitize(suggestedRewrite);

  const handleApply = () => {
    onApplyRewrite(evidenceQuote, suggestedRewrite);
    setIsApplied(true);
    setTimeout(() => {
      setIsApplied(false);
    }, 2000);
  };

  // Format rule label nicely (e.g., "R-TONE-01" -> "Tone", "R-PRECISION-02" -> "Precision", "R-CLARITY-03" -> "Clarity")
  const getRuleCategoryLabel = (id: string) => {
    const upper = id.toUpperCase();
    if (upper.includes('TONE')) return 'Tone';
    if (upper.includes('PRECISION')) return 'Precision';
    if (upper.includes('CLARITY')) return 'Clarity';
    if (upper.includes('COLOR') || upper.includes('VIS')) return 'Visual';
    if (upper.includes('VOCAB') || upper.includes('TERM')) return 'Precision';
    // Fallback: clean up any leading R- and trailing numbers
    return id.replace(/^R-?/i, '').replace(/-\d+$/, '');
  };

  const ruleLabel = getRuleCategoryLabel(ruleId);

  const glowColor: GlowColor = isApplied
    ? 'teal'
    : severity === 'CRITICAL' || severity === 'HIGH'
    ? 'rose'
    : severity === 'MEDIUM'
    ? 'amber'
    : 'cyan';

  return (
    <BorderGlow
      borderRadius="rounded-3xl"
      glowColor={glowColor}
      active={isApplied}
      intensity={severity === 'CRITICAL' ? 'strong' : 'medium'}
    >
      <div className={`p-5 rounded-3xl transition-all duration-300 ${
        isApplied 
          ? 'border-2 border-teal-400 bg-teal-950/30 shadow-[0_0_30px_rgba(45,212,191,0.4)]' 
          : 'neo-liquid-card'
      }`}>
        {/* Top Header with Category Word on left and Severity Badge on right */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-bold text-white font-lexend tracking-wide">
            {ruleLabel}
          </span>
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.classes}`}>
            {badge.icon}
            {badge.label}
          </span>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Confidence: <span className="font-semibold text-white">{Math.round(confidence * 100)}%</span>
        </div>
      </div>

      {/* Finding Diagnostic Summary */}
      <p className="text-xs text-slate-200 mb-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizedSummary }} />

      {/* Side-by-Side Visual Diff */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 p-3.5 rounded-2xl bg-[#02050f]/80 border border-cyan-500/10 shadow-inner">
        {/* Flagged Original Text */}
        <div className="space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Detected Issue
          </div>
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200 line-through decoration-rose-400 decoration-1 leading-relaxed">
            &ldquo;{sanitizedEvidence}&rdquo;
          </div>
        </div>

        {/* Suggested Rewrite */}
        <div className="space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-400 flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            Suggested Alignment
          </div>
          <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/40 text-xs text-teal-100 font-medium leading-relaxed shadow-sm">
            &ldquo;{sanitizedRewrite}&rdquo;
          </div>
        </div>
      </div>

      {/* 1-Click Action Bar */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleApply}
          disabled={isApplied}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
            isApplied
              ? 'bg-teal-600 text-white shadow-[0_0_20px_rgba(45,212,191,0.6)]'
              : 'neo-liquid-btn-primary shadow-md'
          }`}
        >
          {isApplied ? (
            <>
              <Check className="w-4 h-4" />
              Applied to Draft!
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-200" />
              Apply Suggestion
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </>
          )}
        </button>
      </div>
    </div>
    </BorderGlow>
  );
};
