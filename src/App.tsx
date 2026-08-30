/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KeyProvider, useKeyContext } from './context/KeyContext';
import { Header } from './components/Header';
import { KeyModal } from './components/KeyModal';
import { ApiKeySuccessModal } from './components/ApiKeySuccessModal';
import { CreateProfileModal } from './components/CreateProfileModal';
import { OnboardingModal } from './components/OnboardingModal';
import { DemoOutputPromptModal } from './components/DemoOutputPromptModal';
import { AuditStudio } from './components/AuditStudio/AuditStudio';
import { BrandDnaManager } from './components/BrandDnaManager/BrandDnaManager';
import { PrivacyPanel } from './components/PrivacyPanel/PrivacyPanel';
import { LoomFrogIcon } from './components/LoomFrogLogo';

function MainAppContent() {
  const { activeTab, isOnboardingModalOpen, setIsOnboardingModalOpen } = useKeyContext();

  return (
    <div className="min-h-screen bg-[#02050f] text-[#f8fafc] flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Living Atmospheric Aura Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Deep Cyan Nebula Orb */}
        <div className="absolute -top-48 -left-48 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '9s' }} />
        {/* Prismarine Glow Orb */}
        <div className="absolute top-1/3 -right-48 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s' }} />
        {/* Bottom Indigo Wash */}
        <div className="absolute -bottom-48 left-1/4 w-[750px] h-[750px] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '14s' }} />
        {/* Specular Radial Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.06)_0%,rgba(0,0,0,0)_65%)]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <KeyModal />
        <ApiKeySuccessModal />
        <CreateProfileModal />
        <OnboardingModal
          isOpen={isOnboardingModalOpen}
          onClose={() => setIsOnboardingModalOpen(false)}
        />
        <DemoOutputPromptModal />

        <main className="flex-1 pb-10">
          <AnimatePresence mode="wait">
            {activeTab === 'audit' && (
              <motion.div
                key="audit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <AuditStudio />
              </motion.div>
            )}

            {activeTab === 'brand_dna' && (
              <motion.div
                key="brand_dna"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <BrandDnaManager />
              </motion.div>
            )}

            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PrivacyPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Liquid Status Footer */}
        <footer className="border-t border-cyan-500/20 py-6 bg-[#02050f]/80 backdrop-blur-xl text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <LoomFrogIcon size={20} glow={true} />
              <span className="font-lexend font-bold text-white tracking-tight">LoomFrog</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-slate-400">Zero-Server Brand DNA &amp; Tone Consistency Guardian</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.9)] animate-ping"></span>
              <span className="text-slate-200 font-semibold">In-Memory Key Isolation</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-slate-400">Dual-Tier Verification</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <KeyProvider>
      <MainAppContent />
    </KeyProvider>
  );
}
