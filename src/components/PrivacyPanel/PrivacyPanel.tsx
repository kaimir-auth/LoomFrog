import React, { useState } from 'react';
import { Shield, Lock, Eye, Server, RefreshCw, Cpu, Database, CheckCircle2, AlertTriangle, FileCode, AlertOctagon, Terminal } from 'lucide-react';
import { useKeyContext } from '../../context/KeyContext';

export const PrivacyPanel: React.FC = () => {
  const { hasApiKey, clearApiKey, isDemoMode } = useKeyContext();
  const [activeDiagramNode, setActiveDiagramNode] = useState<'client' | 'key' | 'gemini' | 'storage'>('client');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      {/* Top Title Banner */}
      <div className="p-6 rounded-3xl neo-liquid-panel flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 via-teal-300/50 to-transparent pointer-events-none" />

        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-400/35 text-cyan-300 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Shield className="w-5 h-5 text-cyan-400" />
            </span>
            <h1 className="text-xl font-bold text-white font-lexend tracking-tight">
              Privacy Bounds &amp; Security Transparency
            </h1>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            LoomFrog is built on a zero-server architecture. All preprocessing, Regex analysis, and Canvas color sampling execute locally in your browser. API keys are maintained exclusively in temporary application runtime memory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-[#02050f]/80 border border-cyan-500/20 text-xs backdrop-blur-md shadow-[inset_1px_1px_3px_rgba(0,0,0,0.7)]">
            <div className="text-[10px] text-cyan-300/80 font-semibold uppercase tracking-wider">Key Memory State</div>
            <div className={`font-mono font-bold text-sm ${hasApiKey ? 'text-teal-300' : 'text-teal-300'}`}>
              {hasApiKey ? '1 Key in RAM' : '0 Keys (Demo Mode)'}
            </div>
          </div>

          {hasApiKey && (
            <button
              onClick={() => {
                clearApiKey();
                alert('In-memory API key has been immediately purged.');
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 transition-all backdrop-blur-md active:scale-95 cursor-pointer shadow-sm"
            >
              Purge RAM Key Now
            </button>
          )}
        </div>
      </div>

      {/* Critical Explicit Disclosures & Honest Risk Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risk Disclosure: Browser Extension Warning */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0c1e38]/70 via-[#071328]/80 to-[#020612]/95 backdrop-blur-2xl border border-teal-500/30 shadow-[6px_8px_20px_rgba(0,0,0,0.6)] space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-2 text-teal-300 font-bold text-xs font-lexend">
            <AlertTriangle className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span>Honesty About Risk: Browser Environment Integrity</span>
          </div>
          <p className="text-xs text-white/90 leading-relaxed">
            Because LoomFrog executes entirely on your device with no intermediary server, it cannot protect your API key or content if your browser itself is compromised (for example, by malicious browser extensions with broad DOM-reading permissions or infected machine processes). Always run your audits in a trusted, secure browser profile.
          </p>
        </div>

        {/* Sensitive Content Direct-to-Gemini Notice */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-950/30 via-[#0c1626]/70 to-[#020612]/90 backdrop-blur-2xl border border-cyan-500/30 shadow-[6px_8px_20px_rgba(0,0,0,0.6)] space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs font-lexend">
            <Server className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Caution: Direct-to-Google Gemini Transmission</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            When you click &ldquo;Run Brand Consistency Audit&rdquo;, your draft text and optional image are dispatched directly from your browser to Google&rsquo;s Gemini API endpoints using your personal API key. Do not upload strictly confidential, unreleased, or highly regulated trade secrets without understanding Google&rsquo;s standard API terms of service.
          </p>
        </div>
      </div>

      {/* Interactive Client-Side Execution Architecture Diagram */}
      <div className="p-6 rounded-3xl neo-liquid-panel space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
              Interactive Execution &amp; Trust Boundaries
            </h2>
            <p className="text-xs text-slate-400">Click any component to inspect its data flow and isolation guarantees.</p>
          </div>
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-md shadow-sm">
            100% Zero-Server
          </span>
        </div>

        {/* Diagram Visual Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          {/* Node 1: Browser Runtime & Regex Engine */}
          <div
            onClick={() => setActiveDiagramNode('client')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
              activeDiagramNode === 'client'
                ? 'bg-cyan-500/20 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                : 'bg-[#02050f]/80 border-cyan-500/15 hover:border-cyan-400/40 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.6)]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-cyan-400">
              <Cpu className="w-4 h-4" />
              <span className="font-bold text-xs text-white font-lexend">Browser Client Engine</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Local regex scanning, HTML5 Canvas pixel extraction, and Delta-E computations.
            </p>
          </div>

          {/* Node 2: BYOK Memory State */}
          <div
            onClick={() => setActiveDiagramNode('key')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
              activeDiagramNode === 'key'
                ? 'bg-teal-500/20 border-teal-400/60 shadow-[0_0_20px_rgba(45,212,191,0.3)]'
                : 'bg-[#02050f]/80 border-cyan-500/15 hover:border-teal-400/40 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.6)]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-teal-400">
              <Lock className="w-4 h-4" />
              <span className="font-bold text-xs text-white font-lexend">In-Memory Key State</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Key held exclusively in React state RAM. Never stored in cookies/localStorage. Purged on tab close.
            </p>
          </div>

          {/* Node 3: Direct Gemini API Calls */}
          <div
            onClick={() => setActiveDiagramNode('gemini')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
              activeDiagramNode === 'gemini'
                ? 'bg-blue-500/20 border-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                : 'bg-[#02050f]/80 border-cyan-500/15 hover:border-blue-400/40 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.6)]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-blue-400">
              <Server className="w-4 h-4" />
              <span className="font-bold text-xs text-white font-lexend">Direct Gemini API</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Direct HTTPS fetch from browser to <code className="text-[10px] text-cyan-200">generativelanguage.googleapis.com</code>.
            </p>
          </div>

          {/* Node 4: On-Device Profile Storage */}
          <div
            onClick={() => setActiveDiagramNode('storage')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
              activeDiagramNode === 'storage'
                ? 'bg-indigo-500/20 border-indigo-400/60 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                : 'bg-[#02050f]/80 border-cyan-500/15 hover:border-indigo-400/40 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.6)]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <Database className="w-4 h-4" />
              <span className="font-bold text-xs text-white font-lexend">Local Brand Storage</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Brand DNA profiles and audit logs stored on your device only (<code className="text-[10px] text-cyan-300">localStorage</code>).
            </p>
          </div>
        </div>

        {/* Dynamic Detail Card */}
        <div className="p-4 rounded-2xl bg-[#02050f]/90 border border-cyan-500/15 text-xs space-y-2 backdrop-blur-md shadow-[inset_1px_1px_3px_rgba(0,0,0,0.7)]">
          {activeDiagramNode === 'client' && (
            <div>
              <h4 className="font-bold text-cyan-300 mb-1 font-lexend">Client-Side Isolation Verification</h4>
              <p className="text-slate-300 leading-relaxed">
                When you paste text, drop a Word doc (.docx), or inspect a visual asset, all tokenization, regex matching, and canvas color extractions occur directly inside your browser’s JavaScript thread. No draft data passes through any middleman or third-party tracking servers.
              </p>
            </div>
          )}

          {activeDiagramNode === 'key' && (
            <div>
              <h4 className="font-bold text-teal-300 mb-1 font-lexend">Strict Memory-Only Key Isolation (Zero Disk Persistence)</h4>
              <p className="text-slate-300 leading-relaxed">
                LoomFrog adheres to a strict zero-persistence rule for API credentials. Your Gemini API key is retained strictly in volatile browser RAM (<code className="text-cyan-200 font-mono">useState</code>). It is never saved to <code className="text-cyan-200 font-mono">localStorage</code>, <code className="text-cyan-200 font-mono">sessionStorage</code>, <code className="text-cyan-200 font-mono">IndexedDB</code>, or <code className="text-cyan-200 font-mono">cookies</code>. Refreshing the browser or closing the tab destroys the key permanently.
              </p>
            </div>
          )}

          {activeDiagramNode === 'gemini' && (
            <div>
              <h4 className="font-bold text-blue-300 mb-1 font-lexend">Direct Google Gemini HTTPS Protocol</h4>
              <p className="text-slate-300 leading-relaxed">
                During an explicit audit action, requests are dispatched straight from your browser to Google’s official Gemini REST endpoints. Payloads are encapsulated inside structural <code className="text-cyan-200 font-mono">&lt;untrusted_user_draft&gt;</code> XML tags with prompt-injection defense directives and structured JSON schema enforcement.
              </p>
            </div>
          )}

          {activeDiagramNode === 'storage' && (
            <div>
              <h4 className="font-bold text-indigo-300 mb-1 font-lexend">On-Device Brand Profile &amp; History Persistence</h4>
              <p className="text-slate-300 leading-relaxed">
                Unlike API keys (which are strictly temporary in-memory), Brand DNA profiles, rule configurations, and past audit reports are saved to your browser&rsquo;s on-device <code className="text-cyan-300 font-mono">localStorage</code>. This ensures your brand definitions survive page refreshes while remaining 100% private to your machine. You can export or import these profiles at any time via JSON.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Security Threat Model & Defense Table */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
          Plain-Terms Privacy &amp; Security Specification Table
        </h2>

        <div className="overflow-x-auto rounded-3xl border border-cyan-500/15 bg-gradient-to-br from-[#09152f]/60 via-[#040a1c]/80 to-[#02050f] backdrop-blur-2xl shadow-[6px_8px_24px_rgba(0,0,0,0.7)]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-cyan-500/15 bg-[#02050f]/80 text-cyan-200">
                <th className="p-4 font-bold font-lexend">Privacy Domain</th>
                <th className="p-4 font-bold font-lexend">What is Processed &amp; Where</th>
                <th className="p-4 font-bold font-lexend">Implementation Guarantee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10 text-slate-300">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-medium text-white flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Local Preprocessing
                </td>
                <td className="p-4">
                  100% client-side. Regex forbidden word scans, Canvas color sampling, and deltaE calculations execute in local browser memory.
                </td>
                <td className="p-4 font-mono text-teal-300 text-[11px] font-semibold">
                  Zero Server Intermediaries
                </td>
              </tr>

              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-medium text-white flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                  API Key Handling
                </td>
                <td className="p-4">
                  Keys live only in browser temporary memory for that session. Never written to localStorage, cookies, or disk. Wiped upon tab close or reload.
                </td>
                <td className="p-4 font-mono text-teal-300 text-[11px] font-semibold">
                  Temporary RAM Only
                </td>
              </tr>

              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-medium text-white flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  Profile &amp; History Storage
                </td>
                <td className="p-4">
                  Brand DNA profiles and audit logs are saved locally in browser localStorage so your hard work isn't lost on refresh. Export/import available as JSON.
                </td>
                <td className="p-4 font-mono text-teal-300 text-[11px] font-semibold">
                  On-Device LocalStorage
                </td>
              </tr>

              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-medium text-white flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  Remote Network Traffic
                </td>
                <td className="p-4">
                  Nothing is ever sent to any server except Google's Gemini API, and only when you actively trigger an audit. No company server, analytics, or tracking scripts.
                </td>
                <td className="p-4 font-mono text-teal-300 text-[11px] font-semibold">
                  0 Analytics &amp; 0 Trackers
                </td>
              </tr>

              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-medium text-white flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-teal-400" />
                  Untrusted Input &amp; Output
                </td>
                <td className="p-4">
                  Pasted text and files are treated as untrusted data wrapped in safe XML tags to prevent prompt injection. All AI outputs are sanitized before DOM rendering.
                </td>
                <td className="p-4 font-mono text-teal-300 text-[11px] font-semibold">
                  Prompt-Defended &amp; Sanitized
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
