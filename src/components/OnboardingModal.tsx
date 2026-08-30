import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Dna, FileText, CheckCircle, ArrowRight, Play, X, Key, Globe, ShieldCheck } from 'lucide-react';
import { LoomFrogIcon } from './LoomFrogLogo';
import { useKeyContext } from '../context/KeyContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { 
    setIsDemoMode, 
    setActiveTab, 
    setIsKeyModalOpen, 
    setCurrentDraftText,
    setCurrentReport,
    setIsDemoOutputPromptOpen,
    setHasCompletedOnboarding
  } = useKeyContext();

  if (!isOpen) return null;

  const handleTryDemo = () => {
    setIsDemoMode(true);
    setHasCompletedOnboarding(true);
    setActiveTab('audit');
    setCurrentDraftText('');
    setCurrentReport(null);
    onClose();
    setIsDemoOutputPromptOpen(true);
  };

  const handleGetStarted = () => {
    setIsDemoMode(false);
    setHasCompletedOnboarding(true);
    setCurrentDraftText(''); // Clean fresh draft
    onClose();
    setIsKeyModalOpen(true); // Direct prompt to set API Key
  };

  const steps = [
    {
      num: '01',
      title: 'Brand DNA',
      desc: 'Define your Brand DNA. Tell us what to keep in mind as the standard.',
      icon: Dna,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    },
    {
      num: '02',
      title: 'Content',
      desc: 'Paste text or upload a visual.',
      icon: FileText,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20'
    },
    {
      num: '03',
      title: 'Audit',
      desc: 'Run the deterministic and AI-powered checks.',
      icon: ShieldCheck,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      num: '04',
      title: 'Improve',
      desc: 'Review findings and apply suggested fixes.',
      icon: Sparkles,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="w-full max-w-2xl bg-[#090e1f] border border-cyan-500/30 rounded-2xl shadow-[0_0_60px_rgba(6,182,212,0.18)] p-6 sm:p-8 relative overflow-hidden"
        >
          {/* Ambient Corner Flare */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            title="Close onboarding"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <LoomFrogIcon size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-lexend text-white tracking-tight">
                New to LoomFrog?
              </h2>
              <p className="text-sm font-medium text-slate-300">
                Four steps. That&apos;s all you need.
              </p>
            </div>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-[#0f172e]/80 border border-slate-700/60 hover:border-cyan-500/40 rounded-xl p-4 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-cyan-400 transition-colors pt-0.5">
                      {step.num}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">
                          {step.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={handleTryDemo}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/50 font-medium text-sm transition-all shadow-sm group"
            >
              <Play size={15} className="fill-cyan-400/20 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Try Demo</span>
            </button>

            <button
              onClick={handleGetStarted}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-semibold text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_28px_rgba(6,182,212,0.5)] group"
            >
              <Key size={15} />
              <span>Get Started</span>
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
