import React, { useState } from 'react';
import { Sparkles, X, AlertCircle, RefreshCw } from 'lucide-react';
import { useKeyContext } from '../../context/KeyContext';
import { extractBrandDNAWithAI, GeminiApiError } from '../../services/geminiSemanticEngine';
import { BrandDNAProfile } from '../../types/brandDna';

interface AiExtractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileExtracted: (profile: Partial<BrandDNAProfile>) => void;
}

export const AiExtractModal: React.FC<AiExtractModalProps> = ({ isOpen, onClose, onProfileExtracted }) => {
  const { apiKey, hasApiKey, selectedModel, isDemoMode, setIsKeyModalOpen } = useKeyContext();

  const [rawText, setRawText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExtract = async () => {
    if (!rawText.trim()) return;

    setIsExtracting(true);
    setError(null);

    try {
      if (isDemoMode) {
        // Simulated AI extraction in Demo Mode
        await new Promise((r) => setTimeout(r, 1200));
        const sampleExtracted: Partial<BrandDNAProfile> = {
          metadata: {
            brandName: 'Nova FinTech Group',
            brandVersion: '1.0.0',
            schemaVersion: '1.0',
            updatedAt: new Date().toISOString(),
            description: 'AI-generated Brand DNA from unstructured brand book memo.'
          },
          lifecycleState: 'AI_GENERATED',
          voice: {
            primaryTone: 'Trustworthy, innovative, institutional-grade, customer-focused',
            formalityScore: 0.88,
            toneAttributes: ['Regulatory confidence', 'Clear financial metrics', 'Empowering simplicity', 'Zero jargon']
          },
          vocabulary: {
            forbidden: [
              { term: 'get rich quick', reason: 'Misleading consumer claim violating compliance.' },
              { term: 'guaranteed returns', reason: 'Regulatory risk without explicit statutory disclosures.' },
              { term: 'crypto moon', reason: 'Unprofessional speculative colloquialism.' },
              { term: 'cheap', reason: 'Use "transparent, low-cost fee structure".' }
            ],
            preferred: [
              'Institutional-grade security',
              'Transparent ledger',
              'Fiduciary responsibility',
              'Real-time reconciliation'
            ]
          },
          colors: {
            primaryHex: ['#040918', '#06B6D4', '#2DD4BF'],
            secondaryHex: ['#0284C7', '#64748B'],
            strictCompliance: true
          },
          rules: [
            {
              ruleId: 'R-VOCAB-01',
              category: 'Text',
              description: 'Zero tolerance for speculative or non-compliant financial marketing promises.',
              weight: 3.0,
              evaluatorType: 'Deterministic'
            },
            {
              ruleId: 'R-TONE-01',
              category: 'Text',
              description: 'Strict adherence to fiduciary tone and institutional confidence.',
              weight: 2.5,
              evaluatorType: 'Semantic'
            },
            {
              ruleId: 'R-COLOR-01',
              category: 'Visual',
              description: 'Deep navy, Electric Blue, and Cyan palette compliance.',
              weight: 2.0,
              evaluatorType: 'Deterministic'
            }
          ]
        };
        onProfileExtracted(sampleExtracted);
        onClose();
        return;
      }

      if (!hasApiKey) {
        setIsKeyModalOpen(true);
        throw new Error('API key required for live AI extraction.');
      }

      const extracted = await extractBrandDNAWithAI(apiKey, selectedModel, rawText);
      onProfileExtracted(extracted);
      onClose();
    } catch (err: any) {
      if (err instanceof GeminiApiError) {
        setError(err.message);
      } else {
        setError(err.message || 'Failed to extract Brand DNA profile.');
      }
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl neo-liquid-panel shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/20 bg-[#030816]/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Sparkles className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-lexend">AI Brand DNA Extractor</h2>
              <p className="text-xs text-slate-400">Convert raw guidelines into structured machine-readable JSON</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-[#02050f] hover:bg-white/[0.08] border border-cyan-500/20 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-cyan-200 mb-1.5 font-lexend">
              Paste Brand Guidelines, Style Guide, or Corporate Narrative
            </label>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={8}
              placeholder="e.g. Acme Corp is an enterprise AI infrastructure company. Our tone is authoritative, humble, and engineering-first. We never use buzzwords like 'supercharge' or 'game changer'. Our brand colors are deep navy (#040918), cyan (#06B6D4) and prismarine (#2DD4BF)..."
              className="w-full p-4 rounded-2xl neo-liquid-input text-xs text-white placeholder-slate-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-cyan-500/10">
            <button
              type="button"
              onClick={() => {
                setRawText(
                  `Nova FinTech: We are an institutional wealth platform. Tone must be authoritative and compliance-adherent. Banned terms: 'get rich quick', 'guaranteed returns', 'crypto moon', 'cheap'. Primary colors: Deep Navy (#040918), Cyan (#06B6D4), Prismarine (#2DD4BF). Formality should be 0.90.`
                );
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium cursor-pointer text-left"
            >
              Insert Sample Guidelines
            </button>

            <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-2xl text-xs font-medium text-slate-300 hover:text-white bg-[#02050f] hover:bg-white/[0.08] border border-cyan-500/20 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExtract}
                disabled={isExtracting || !rawText.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white neo-liquid-btn-primary shadow-lg disabled:opacity-50 transition-all cursor-pointer"
              >
                {isExtracting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Extracting Schema...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                    Extract Brand DNA
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
