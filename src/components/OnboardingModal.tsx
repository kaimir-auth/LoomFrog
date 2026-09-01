import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Key, ArrowRight } from 'lucide-react';
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
    setActiveTab('audit');
    setCurrentDraftText(''); // Clean fresh draft
    onClose();
    setIsKeyModalOpen(true); // Direct prompt to set API Key
  };

  const steps = [
    {
      num: '01',
      title: 'Brand DNA',
      desc: 'Define your Brand DNA. Tell us what to keep in mind as the standard.'
    },
    {
      num: '02',
      title: 'Content',
      desc: 'Paste text or upload a visual.'
    },
    {
      num: '03',
      title: 'Audit',
      desc: 'Run the deterministic and AI-powered checks.'
    },
    {
      num: '04',
      title: 'Improve',
      desc: 'Review findings and apply suggested fixes.'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-2xl bg-[#0B101D] border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2),0_25px_50px_rgba(0,0,0,0.9)] p-6 sm:p-8 relative overflow-hidden text-left"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close 'X' Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Close guide"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#091529] border border-cyan-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.25)] shrink-0">
              <LoomFrogIcon size={32} glow={true} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-lexend text-white tracking-tight">
                New to LoomFrog?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-medium mt-0.5">
                Four steps. That&apos;s all you need.
              </p>
            </div>
          </div>

          {/* 4 Steps (2x2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-[#111827]/90 border border-slate-800/90 hover:border-cyan-500/40 rounded-2xl p-4 sm:p-5 transition-all group"
              >
                <div className="flex items-baseline gap-2.5 mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">
                    {step.num}
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {step.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pl-6">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-5 border-t border-slate-800/80">
            <button
              onClick={handleTryDemo}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0B132B] hover:bg-[#101D3F] text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 text-sm font-semibold transition-all shadow-sm cursor-pointer group active:scale-95"
            >
              <Play size={15} className="fill-cyan-400/20 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Try Demo</span>
            </button>

            <button
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 text-sm font-bold transition-all shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] cursor-pointer active:scale-95 group"
            >
              <Key size={15} className="text-slate-950" />
              <span>Get Started</span>
              <ArrowRight size={15} className="text-slate-950 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
