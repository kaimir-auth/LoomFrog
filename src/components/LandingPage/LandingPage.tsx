import React from 'react';
import {
  ArrowRight,
  Shield,
  Zap,
  Sparkles,
  Layers,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
  ChevronUp,
  Cpu
} from 'lucide-react';
import { useKeyContext } from '../../context/KeyContext';
import { LoomFrogLogo, LoomFrogIcon } from '../LoomFrogLogo';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setIsKeyModalOpen, setIsOnboardingModalOpen } = useKeyContext();

  const handleTryLoomFrog = () => {
    setActiveTab('audit');
    setIsOnboardingModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    if (typeof document !== 'undefined') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F3F4F6] selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col font-sans">
      {/* STICKY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#0B0F17]/90 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Brandmark / Logo */}
          <div
            onClick={scrollToTop}
            className="cursor-pointer transition-opacity hover:opacity-90"
            title="LoomFrog — Return to Top"
          >
            <LoomFrogLogo size="md" />
          </div>

          {/* Center/Right Anchor Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button
              onClick={() => scrollToSection('why-loomfrog')}
              className="hover:text-cyan-300 transition-colors cursor-pointer py-1"
            >
              Why LoomFrog
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-cyan-300 transition-colors cursor-pointer py-1"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('built-for-real-use')}
              className="hover:text-cyan-300 transition-colors cursor-pointer py-1"
            >
              Built for Real Use
            </button>
          </nav>

          {/* Action CTA Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTryLoomFrog}
              className="neo-liquid-btn-primary inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer active:scale-95 transition-all"
            >
              <span>Try LoomFrog</span>
              <ArrowRight className="w-4 h-4 text-cyan-200" />
            </button>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION (Base Shade #0B0F17) */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 bg-[#0B0F17] overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-cyan-500/15 via-teal-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-48 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-48 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Security Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827]/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.9)] animate-pulse" />
            <span>Zero-Server &bull; Pure Client-Side Brand Governance</span>
          </div>

          {/* Exact Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            Your brand&apos;s voice, verified — <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200">
              with real security
            </span>
          </h1>

          {/* Exact Subheadline */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
            LoomFrog audits your writing and visual assets against your own Brand DNA — combining instant rule-based checks with AI judgment, entirely in your browser. No account. No cost. For All.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={handleTryLoomFrog}
              className="w-full sm:w-auto neo-liquid-btn-primary inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] cursor-pointer active:scale-95 transition-all"
            >
              <span>Try LoomFrog</span>
              <ArrowRight className="w-5 h-5 text-cyan-200" />
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-medium text-slate-300 bg-[#111827]/80 hover:bg-[#1F2937] hover:text-white border border-slate-700/80 transition-all cursor-pointer"
            >
              <span>How it works</span>
            </button>
          </div>

          {/* Interactive Diagnostic Preview Card */}
          <div className="max-w-4xl mx-auto bg-[#111827]/90 rounded-2xl border border-cyan-500/25 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-left backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">Live Compliance Diagnostic &bull; Dual-Tier Engine</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-[#0B0F17] px-2.5 py-1 rounded-lg border border-cyan-500/20">
                <Shield className="w-3.5 h-3.5 text-teal-400" />
                <span>100% On-Device Analysis</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Draft sample */}
              <div className="bg-[#0B0F17] p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                    <span>Draft Submission</span>
                    <span className="text-rose-400 font-bold">2 Issues Detected</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-mono">
                    &quot;Our revolutionary platform will{' '}
                    <mark className="bg-rose-500/30 text-rose-200 border-b-2 border-rose-400 px-1 rounded">synergize</mark>{' '}
                    your enterprise workflows and deliver{' '}
                    <mark className="bg-amber-500/30 text-amber-200 border-b-2 border-amber-400 px-1 rounded">cheap</mark>{' '}
                    turnaround times.&quot;
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Lexicon: Strict</span>
                  <span>Formality: 85%</span>
                </div>
              </div>

              {/* Verified Result */}
              <div className="bg-[#0B0F17] p-4 rounded-xl border border-teal-500/30 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-teal-300 mb-2 flex items-center justify-between">
                    <span>Deterministic &amp; AI Diagnosis</span>
                    <span className="text-emerald-400 font-bold">Verified Fix</span>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold shrink-0">&times;</span>
                      <span><strong>Banned Buzzword:</strong> &quot;synergize&quot; violates brand clarity guidelines.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold shrink-0">&bull;</span>
                      <span><strong>Tone Upgrade:</strong> Replace &quot;cheap&quot; with &quot;cost-efficient&quot;.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
                  <span className="text-xs text-teal-300 font-bold">One-Click Rewrite Ready</span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">Score: 94 / 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: WHY LOOMFROG IS DIFFERENT (Surface Shade #111827) */}
      <section id="why-loomfrog" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#111827] border-y border-slate-800/80 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-3 block">
              Core Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Why LoomFrog is different
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Built from first principles for uncompromising privacy, mathematical rigor, and genuine utility.
            </p>
          </div>

          {/* Three Side-by-Side Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Block 1: Actually free */}
            <div className="bg-[#1F2937]/70 rounded-2xl p-7 sm:p-8 border border-slate-700/60 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-105 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Actually free</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  No tiers, no &quot;free trial,&quot; no credit card. You bring your own Gemini key, so there&apos;s no server cost to pass on to you.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center gap-2 text-xs font-mono text-cyan-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Zero Subscription Lock-in</span>
              </div>
            </div>

            {/* Block 2: Actually private */}
            <div className="bg-[#1F2937]/70 rounded-2xl p-7 sm:p-8 border border-slate-700/60 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-950/60 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-105 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Actually private</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Your Brand DNA, your drafts, your API key — none of it touches a company server. Your key lives only in memory and disappears the moment you close the tab.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center gap-2 text-xs font-mono text-teal-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Volatile RAM Execution</span>
              </div>
            </div>

            {/* Block 3: Actually rigorous */}
            <div className="bg-[#1F2937]/70 rounded-2xl p-7 sm:p-8 border border-slate-700/60 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-105 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Actually rigorous</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Every audit runs two checks at once: exact rule-matching for hard requirements (banned words, brand colors) and AI judgment for tone and nuance — so you get both precision and context.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center gap-2 text-xs font-mono text-cyan-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Deterministic + LLM Hybrid</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: HOW IT WORKS (Base Shade #0B0F17) */}
      <section id="how-it-works" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#0B0F17] relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <span className="text-xs font-mono font-bold tracking-widest text-teal-400 uppercase mb-3 block">
              Auditing Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Three straightforward steps from raw brand rules to instant, actionable diagnosis.
            </p>
          </div>

          {/* Three Numbered Steps */}
          <div className="space-y-6 sm:space-y-8">
            {/* Step 1 */}
            <div className="bg-[#111827] rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center gap-6 group hover:border-cyan-500/40 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-[#0B0F17] border border-cyan-500/30 flex items-center justify-center shrink-0">
                <span className="font-serif font-bold text-3xl text-cyan-400">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <span>Define your Brand DNA</span>
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Your voice, banned words, approved colors, and any custom rules.
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#0B0F17] px-3 py-1.5 rounded-xl border border-slate-800">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>JSON Profiles</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#111827] rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center gap-6 group hover:border-teal-500/40 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-[#0B0F17] border border-teal-500/30 flex items-center justify-center shrink-0">
                <span className="font-serif font-bold text-3xl text-teal-400">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  Drop in your content
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Paste text, or upload a document, spreadsheet, or image.
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#0B0F17] px-3 py-1.5 rounded-xl border border-slate-800">
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span>Multi-Modal Input</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#111827] rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center gap-6 group hover:border-cyan-500/40 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-[#0B0F17] border border-cyan-500/30 flex items-center justify-center shrink-0">
                <span className="font-serif font-bold text-3xl text-cyan-400">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  Get a real diagnosis
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  See exactly what&apos;s off, why, and how to fix it — with one-click suggested rewrites.
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#0B0F17] px-3 py-1.5 rounded-xl border border-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Auto-Fix Proposals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION: BUILT FOR REAL USE, NOT A DEMO (Surface Shade #111827 & #1F2937) */}
      <section id="built-for-real-use" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#111827] border-t border-slate-800 relative">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-3 block">
            Enterprise Utility
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
            Built for real use, not a demo
          </h2>

          {/* Exact Section Copy */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
            Supports text, Markdown, Word documents, spreadsheets, and images. No account required. No usage limits — you control your own Gemini quota.
          </p>

          {/* Supported format badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F2937] border border-slate-700 text-xs font-mono text-slate-200">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Documents (.docx, .txt, .md)</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F2937] border border-slate-700 text-xs font-mono text-slate-200">
              <FileSpreadsheet className="w-4 h-4 text-teal-400" />
              <span>Spreadsheets (.xlsx, .csv)</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F2937] border border-slate-700 text-xs font-mono text-slate-200">
              <ImageIcon className="w-4 h-4 text-purple-400" />
              <span>Visual Assets (.png, .jpg, .webp)</span>
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-gradient-to-b from-[#1F2937] to-[#0B0F17] rounded-3xl p-8 sm:p-12 border border-cyan-500/30 max-w-3xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            <div className="w-16 h-16 rounded-2xl bg-[#0B0F17] border border-cyan-500/40 flex items-center justify-center mx-auto mb-6">
              <LoomFrogIcon size={36} glow={true} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to verify your brand compliance?
            </h3>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
              Start auditing instantly with preloaded demo guidelines, or connect your Gemini API key to evaluate your own live brand standards.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleTryLoomFrog}
                className="w-full sm:w-auto neo-liquid-btn-primary inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm sm:text-base font-bold text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer active:scale-95 transition-all"
              >
                <span>Try LoomFrog</span>
                <ArrowRight className="w-4 h-4 text-cyan-200" />
              </button>
              <button
                onClick={() => {
                  setActiveTab('audit');
                  setIsKeyModalOpen(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium text-slate-300 bg-[#0B0F17] hover:bg-slate-800 border border-slate-700 hover:text-white transition-all cursor-pointer"
              >
                <span>Connect API Key</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MINIMAL CORPORATE FOOTER */}
      <footer className="border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 bg-[#0B0F17] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LoomFrogIcon size={20} glow={false} />
            <span className="font-lexend font-bold text-slate-300">LoomFrog</span>
            <span>&bull;</span>
            <span>Brand DNA &amp; Tone Consistency Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('audit')}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Audit Studio
            </button>
            <button
              onClick={() => setActiveTab('brand_dna')}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Brand DNA Manager
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Privacy Bounds
            </button>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-900 text-center sm:text-left text-[11px] text-slate-600">
          &copy; 2026 LoomFrog. Zero-server browser execution. No customer data or credentials stored on external hosts.
        </div>
      </footer>
    </div>
  );
};
