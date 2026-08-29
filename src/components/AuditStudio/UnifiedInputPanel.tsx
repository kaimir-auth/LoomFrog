import React, { useState, useRef, useMemo } from 'react';
import { Upload, FileText, Image, Table, Sparkles, AlertCircle, RefreshCw, X, Eye, Edit3 } from 'lucide-react';
import { useKeyContext } from '../../context/KeyContext';
import { extractInputData, FileExtractionError } from '../../services/fileExtractor';
import { scanForbiddenVocabulary } from '../../services/deterministicEngine';
import { CanvasColorInspector } from './CanvasColorInspector';
import { DEMO_SAMPLE_DRAFTS } from '../../data/sampleBrandProfiles';
import { DetectedInputType, DeterministicTextMatch } from '../../types/brandDna';

interface UnifiedInputPanelProps {
  onRunAudit: (text: string, imageDataUrl?: string, inputType?: DetectedInputType) => void;
  onClear?: () => void;
  isAuditing: boolean;
}

export const UnifiedInputPanel: React.FC<UnifiedInputPanelProps> = ({ onRunAudit, onClear, isAuditing }) => {
  const { currentDraftText, setCurrentDraftText, activeProfile } = useKeyContext();

  const [isDragOver, setIsDragOver] = useState(false);
  const [extractedFileName, setExtractedFileName] = useState<string | null>(null);
  const [detectedType, setDetectedType] = useState<DetectedInputType>('plain_text');
  const [extractedImageDataUrl, setExtractedImageDataUrl] = useState<string | null>(null);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [activeTooltipTerm, setActiveTooltipTerm] = useState<DeterministicTextMatch | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'highlight'>('edit');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Real-time live inline regex scanning against active Brand DNA forbidden vocabulary
  const liveViolations: DeterministicTextMatch[] = useMemo(() => {
    if (detectedType === 'image' || !currentDraftText) return [];
    return scanForbiddenVocabulary(currentDraftText, activeProfile);
  }, [currentDraftText, activeProfile, detectedType]);

  const handleFileDrop = async (file: File) => {
    setIsProcessingFile(true);
    setExtractionError(null);
    try {
      const result = await extractInputData(file);
      setDetectedType(result.type);
      setExtractedFileName(result.fileName || file.name);

      if (result.type === 'image' && result.imageDataUrl) {
        setExtractedImageDataUrl(result.imageDataUrl);
        setCurrentDraftText('');
      } else if (result.textContent) {
        setCurrentDraftText(result.textContent);
        setExtractedImageDataUrl(null);
      }
    } catch (err) {
      if (err instanceof FileExtractionError) {
        setExtractionError(err.message);
      } else {
        setExtractionError('Failed to process uploaded file.');
      }
    } finally {
      setIsProcessingFile(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileDrop(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileDrop(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setCurrentDraftText('');
    setExtractedImageDataUrl(null);
    setExtractedFileName(null);
    setDetectedType('plain_text');
    setExtractionError(null);
    setActiveTooltipTerm(null);
    onClear?.();
  };

  const handleSelectSample = (sampleText: string) => {
    setCurrentDraftText(sampleText);
    setExtractedImageDataUrl(null);
    setExtractedFileName(null);
    setDetectedType('plain_text');
    setExtractionError(null);
    setActiveTooltipTerm(null);
  };

  const handleQuickSwapWord = (forbiddenTerm: string, preferredReplacement: string) => {
    if (!currentDraftText) return;
    const regex = new RegExp(`\\b${forbiddenTerm}\\b`, 'gi');
    const updated = currentDraftText.replace(regex, preferredReplacement);
    setCurrentDraftText(updated);
    setActiveTooltipTerm(null);
  };

  const handleExecuteAudit = () => {
    if (detectedType === 'image' && extractedImageDataUrl) {
      onRunAudit('', extractedImageDataUrl, 'image');
    } else if (currentDraftText.trim()) {
      onRunAudit(currentDraftText, undefined, detectedType);
    }
  };

  const wordCount = currentDraftText.trim() ? currentDraftText.trim().split(/\s+/).length : 0;
  const charCount = currentDraftText.length;

  /**
   * Renders real-time interactive inline text with tooltips on forbidden terms
   */
  const renderInlineHighlightedText = () => {
    if (!currentDraftText) return <p className="text-slate-500 italic">No text provided.</p>;
    if (liveViolations.length === 0) {
      return (
        <div className="whitespace-pre-wrap text-sm text-slate-200 leading-relaxed font-sans">
          {currentDraftText}
        </div>
      );
    }

    // Sort matches by startIndex
    const sorted = [...liveViolations].sort((a, b) => a.startIndex - b.startIndex);
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    sorted.forEach((match, i) => {
      // Append text before this match
      if (match.startIndex > lastIndex) {
        elements.push(
          <span key={`text-${i}`}>
            {currentDraftText.substring(lastIndex, match.startIndex)}
          </span>
        );
      }

      const termText = currentDraftText.substring(match.startIndex, match.endIndex);
      const isSelected = activeTooltipTerm?.startIndex === match.startIndex;

      elements.push(
        <span
          key={`term-${i}-${match.startIndex}`}
          onClick={() => setActiveTooltipTerm(isSelected ? null : match)}
          className={`inline-block relative px-1.5 py-0.5 mx-0.5 rounded-lg cursor-pointer font-semibold transition-all ${
            isSelected
              ? 'bg-rose-500 text-white ring-2 ring-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
          }`}
          title={`${match.term}: ${match.reason}`}
        >
          {termText}
        </span>
      );

      lastIndex = match.endIndex;
    });

    if (lastIndex < currentDraftText.length) {
      elements.push(
        <span key="text-end">
          {currentDraftText.substring(lastIndex)}
        </span>
      );
    }

    return (
      <div className="whitespace-pre-wrap text-sm text-slate-200 leading-relaxed font-sans">
        {elements}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Panel Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider font-mono">
            Unified Input Surface
          </span>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#02050f]/80 text-cyan-300 border border-cyan-500/30 font-mono shadow-[inset_1px_1px_3px_rgba(0,0,0,0.6)]">
            {detectedType === 'image'
              ? 'Visual Asset'
              : detectedType === 'spreadsheet'
              ? 'Spreadsheet'
              : detectedType === 'document'
              ? 'Document'
              : 'Direct Text'}
          </span>
        </div>

        {/* Quick Sample Selector (Developer Pill Badges) */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="text-[11px] text-slate-400 hidden sm:inline font-medium">Load:</span>
          <button
            onClick={() => handleSelectSample(DEMO_SAMPLE_DRAFTS[0].content)}
            className="text-[11px] px-2.5 sm:px-3 py-1 rounded-xl bg-[#02050f]/80 text-slate-300 hover:text-white hover:bg-rose-950/40 border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Misaligned Draft
          </button>
          <button
            onClick={() => handleSelectSample(DEMO_SAMPLE_DRAFTS[1].content)}
            className="text-[11px] px-2.5 sm:px-3 py-1 rounded-xl bg-[#02050f]/80 text-slate-300 hover:text-white hover:bg-teal-950/40 border border-teal-500/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            Compliant Draft
          </button>
        </div>
      </div>

      {/* Unified Drag & Drop / Input Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative rounded-3xl transition-all p-5 ${
          isDragOver
            ? 'border-2 border-cyan-400 bg-cyan-950/30 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
            : 'neo-liquid-panel'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.docx,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.webp"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* File Ingestion Notification Banner */}
        {extractedFileName && (
          <div className="mb-3 flex items-center justify-between p-2.5 rounded-2xl bg-[#02050f]/80 border border-cyan-500/30 text-xs shadow-inner">
            <div className="flex items-center gap-2 text-cyan-300">
              {detectedType === 'image' ? (
                <Image className="w-4 h-4 text-cyan-400" />
              ) : detectedType === 'spreadsheet' ? (
                <Table className="w-4 h-4 text-teal-400" />
              ) : (
                <FileText className="w-4 h-4 text-cyan-400" />
              )}
              <span className="font-medium text-white truncate max-w-[200px]">{extractedFileName}</span>
              <span className="text-[10px] text-slate-400 font-mono">client-side extracted</span>
            </div>
            <button
              onClick={handleClear}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] cursor-pointer"
              title="Clear File"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Extraction Error Notice */}
        {extractionError && (
          <div className="mb-3 p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{extractionError}</span>
          </div>
        )}

        {/* Visual Image View (Canvas Loupe) or Text Editor */}
        {detectedType === 'image' && extractedImageDataUrl ? (
          <CanvasColorInspector
            imageDataUrl={extractedImageDataUrl}
            activeBrandDNA={activeProfile}
          />
        ) : (
          <div className="space-y-3">
            {/* Live Inline Forbidden Term Highlights Banner */}
            {liveViolations.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-[#0c1626]/70 to-[#02050f]/90 border border-rose-500/30 text-xs text-rose-200 space-y-2 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-semibold text-rose-300">
                    <AlertCircle className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
                    <span>
                      Inline Alert: {liveViolations.length} forbidden term{liveViolations.length > 1 ? 's' : ''} detected
                    </span>
                  </div>

                  {/* Mode switcher */}
                  <div className="flex items-center gap-1 bg-[#02050f]/80 p-1 rounded-xl border border-cyan-500/20 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setViewMode('edit')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        viewMode === 'edit'
                          ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Edit3 className="w-3 h-3 inline mr-1 text-cyan-400" />
                      Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('highlight')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        viewMode === 'highlight'
                          ? 'bg-rose-500/30 text-rose-100 border border-rose-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Eye className="w-3 h-3 inline mr-1 text-rose-300" />
                      Inline Inspector
                    </button>
                  </div>
                </div>

                {/* Interactive Tooltip Card when a term is selected */}
                {activeTooltipTerm && (
                  <div className="p-3 rounded-2xl bg-[#02050f]/95 border border-rose-500/40 text-xs space-y-2 animate-fade-in shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-lg bg-rose-500/25 text-rose-200 font-mono font-bold text-xs border border-rose-500/30">
                          {activeTooltipTerm.term}
                        </span>
                        <span className="text-[11px] text-slate-400">Line {activeTooltipTerm.line}</span>
                      </div>
                      <button
                        onClick={() => setActiveTooltipTerm(null)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-300">
                      <strong className="text-rose-300">Why Banned:</strong> {activeTooltipTerm.reason}
                    </p>

                    {/* Preferred alternatives */}
                    {activeProfile.vocabulary?.preferred && activeProfile.vocabulary.preferred.length > 0 && (
                      <div className="flex items-center flex-wrap gap-1.5 pt-1 border-t border-cyan-500/10">
                        <span className="text-[10px] text-cyan-300">1-Click Swap:</span>
                        {activeProfile.vocabulary.preferred.slice(0, 4).map((pref, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => handleQuickSwapWord(activeTooltipTerm.term, pref)}
                            className="px-2.5 py-0.5 rounded-lg bg-teal-950/40 text-teal-300 hover:bg-teal-900/50 border border-teal-500/30 text-[10px] font-semibold transition-all cursor-pointer active:scale-95"
                          >
                            &rarr; {pref}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* View Mode: Raw Textarea vs Interactive Inline Highlighting */}
            {viewMode === 'highlight' ? (
              <div className="p-4 rounded-2xl neo-debossed min-h-[220px] max-h-[380px] overflow-y-auto">
                <div className="text-[11px] text-cyan-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Click any highlighted term to view brand rationale and 1-click swap alternatives.
                </div>
                {renderInlineHighlightedText()}
              </div>
            ) : (
              <div className="relative">
                <textarea
                  value={currentDraftText}
                  onChange={(e) => {
                    setCurrentDraftText(e.target.value);
                    if (detectedType === 'image') setDetectedType('plain_text');
                  }}
                  rows={10}
                  placeholder="Type or paste your draft copy here, or drop a Word document, spreadsheet, or image..."
                  className="w-full p-4 rounded-2xl neo-liquid-input text-sm text-slate-100 placeholder-slate-500 leading-relaxed resize-y font-sans transition-all"
                />
              </div>
            )}
          </div>
        )}

        {/* Drag Drop Hint & Drop Zone Trigger */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-cyan-500/10 text-xs">
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              Upload Document, Spreadsheet, or Image
            </button>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">.docx, .xlsx, .csv, .txt, .png, .jpg</span>
          </div>

          {detectedType !== 'image' && (
            <div className="text-[11px] font-mono text-slate-300">
              <strong className="text-white font-bold">{wordCount}</strong> words &bull;{' '}
              <strong className="text-white font-bold">{charCount}</strong> characters
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-400 flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.8)] shrink-0" />
          <span className="truncate">Benchmark: <strong className="text-slate-200 font-semibold">{activeProfile.metadata.brandName}</strong></span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {currentDraftText || extractedImageDataUrl ? (
            <button
              onClick={handleClear}
              className="px-3.5 py-2.5 rounded-2xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.08] border border-cyan-500/20 transition-all cursor-pointer shadow-sm shrink-0"
            >
              Clear
            </button>
          ) : null}

          <button
            onClick={handleExecuteAudit}
            disabled={isAuditing || (!currentDraftText.trim() && !extractedImageDataUrl)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold text-white neo-liquid-btn-primary active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.35)]"
          >
            {isAuditing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                Executing Dual-Tier Audit...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                Run Brand Consistency Audit
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
