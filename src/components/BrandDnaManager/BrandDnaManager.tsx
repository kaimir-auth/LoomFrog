import React, { useState } from 'react';
import { useKeyContext } from '../../context/KeyContext';
import { LifecycleStepper } from './LifecycleStepper';
import { AiExtractModal } from './AiExtractModal';
import { BrandDNAProfile, BrandRule, LifecycleState, BrandSource } from '../../types/brandDna';
import { extractWebpage, isValidHttpUrl, normalizeUrl, ExtractedWebpageData } from '../../services/webExtractor';
import {
  Plus,
  Trash2,
  Download,
  Upload,
  Sparkles,
  CheckCircle2,
  Shield,
  Palette,
  Sliders,
  FileText,
  Volume2,
  AlertTriangle,
  Flame,
  RotateCcw,
  Globe,
  ExternalLink,
  Edit2,
  Check,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const BrandDnaManager: React.FC = () => {
  const {
    brandProfiles,
    activeProfile,
    setActiveProfileById,
    saveBrandProfile,
    deleteBrandProfile,
    renameBrandProfile,
    addBrandSource,
    removeBrandSource,
    setProfileLifecycleState,
    importProfilesFromJson,
    exportProfilesToJson,
    resetToDefaultProfiles,
    setIsCreateProfileModalOpen
  } = useKeyContext();

  const [isAiModalOpen, setIsAiModalOpen] = useState(true);
  const [selectedBrandName, setSelectedBrandName] = useState(activeProfile?.metadata?.brandName || '');
  const [activeTabSub, setActiveTabSub] = useState<'voice' | 'vocabulary' | 'colors' | 'rules' | 'sources'>('voice');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Sync selected profile name if activeProfile changes or on initial render
  React.useEffect(() => {
    if (activeProfile?.metadata?.brandName) {
      setSelectedBrandName(activeProfile.metadata.brandName);
    }
  }, [activeProfile?.metadata?.brandName]);

  // Renaming state
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameInput, setRenameInput] = useState('');

  // Delete modal state
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);

  // New item inputs
  const [newForbiddenTerm, setNewForbiddenTerm] = useState('');
  const [newForbiddenReason, setNewForbiddenReason] = useState('');
  const [newPreferredTerm, setNewPreferredTerm] = useState('');
  const [newToneAttr, setNewToneAttr] = useState('');
  const [newPrimaryHex, setNewPrimaryHex] = useState('#06B6D4');
  const [newSecondaryHex, setNewSecondaryHex] = useState('#2DD4BF');

  // Source URL inputs
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [sourceFetchStatus, setSourceFetchStatus] = useState<Record<string, { loading: boolean; data?: ExtractedWebpageData; error?: string }>>({});

  const currentProfile =
    brandProfiles.find((p) => p.metadata.brandName === selectedBrandName) || activeProfile;

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage(null);
    }, 3000);
  };

  const handleUpdateProfile = (updates: Partial<BrandDNAProfile>) => {
    const updated: BrandDNAProfile = {
      ...currentProfile,
      ...updates,
      metadata: {
        ...currentProfile.metadata,
        ...(updates.metadata || {}),
        updatedAt: new Date().toISOString()
      }
    };
    saveBrandProfile(updated);
    showStatus('Brand DNA profile saved.');
  };

  // Renaming Profile
  const handleStartRename = () => {
    setRenameInput(currentProfile.metadata.brandName);
    setIsRenaming(true);
  };

  const handleSaveRename = () => {
    const trimmed = renameInput.trim();
    if (!trimmed || trimmed === currentProfile.metadata.brandName) {
      setIsRenaming(false);
      return;
    }
    const success = renameBrandProfile(currentProfile.metadata.brandName, trimmed);
    if (success) {
      setSelectedBrandName(trimmed);
      showStatus(`Renamed brand profile to "${trimmed}".`);
    } else {
      showStatus('A brand with that name already exists.');
    }
    setIsRenaming(false);
  };

  // Brand Sources Management
  const handleAddSource = async () => {
    const trimmed = newSourceUrl.trim();
    if (!trimmed) return;
    const normalized = normalizeUrl(trimmed);
    if (!isValidHttpUrl(normalized)) {
      showStatus('Please enter a valid URL (e.g. https://company.com)');
      return;
    }

    addBrandSource(currentProfile.metadata.brandName, normalized);
    setNewSourceUrl('');
    showStatus(`Added brand source URL.`);
  };

  const handleTestFetchSource = async (sourceId: string, url: string) => {
    setSourceFetchStatus((prev) => ({
      ...prev,
      [sourceId]: { loading: true }
    }));

    try {
      const data = await extractWebpage(url);
      setSourceFetchStatus((prev) => ({
        ...prev,
        [sourceId]: { loading: false, data }
      }));
      showStatus(`Successfully fetched content for ${url}`);
    } catch (err: any) {
      setSourceFetchStatus((prev) => ({
        ...prev,
        [sourceId]: { loading: false, error: err.message || 'Failed to fetch webpage.' }
      }));
    }
  };

  const handleAddForbiddenTerm = () => {
    if (!newForbiddenTerm.trim()) return;
    const currentForbidden = currentProfile.vocabulary?.forbidden || [];
    const updatedForbidden = [
      ...currentForbidden,
      { term: newForbiddenTerm.trim(), reason: newForbiddenReason.trim() || 'Brand tone misalignment.' }
    ];
    handleUpdateProfile({
      vocabulary: {
        ...currentProfile.vocabulary,
        forbidden: updatedForbidden
      }
    });
    setNewForbiddenTerm('');
    setNewForbiddenReason('');
  };

  const handleRemoveForbiddenTerm = (index: number) => {
    const updated = (currentProfile.vocabulary?.forbidden || []).filter((_, i) => i !== index);
    handleUpdateProfile({
      vocabulary: {
        ...currentProfile.vocabulary,
        forbidden: updated
      }
    });
  };

  const handleAddPreferredTerm = () => {
    if (!newPreferredTerm.trim()) return;
    const updated = [...(currentProfile.vocabulary?.preferred || []), newPreferredTerm.trim()];
    handleUpdateProfile({
      vocabulary: {
        ...currentProfile.vocabulary,
        preferred: updated
      }
    });
    setNewPreferredTerm('');
  };

  const handleRemovePreferredTerm = (index: number) => {
    const updated = (currentProfile.vocabulary?.preferred || []).filter((_, i) => i !== index);
    handleUpdateProfile({
      vocabulary: {
        ...currentProfile.vocabulary,
        preferred: updated
      }
    });
  };

  const handleAddToneAttr = () => {
    if (!newToneAttr.trim()) return;
    const updated = [...(currentProfile.voice?.toneAttributes || []), newToneAttr.trim()];
    handleUpdateProfile({
      voice: {
        ...currentProfile.voice,
        toneAttributes: updated
      }
    });
    setNewToneAttr('');
  };

  const handleRemoveToneAttr = (index: number) => {
    const updated = (currentProfile.voice?.toneAttributes || []).filter((_, i) => i !== index);
    handleUpdateProfile({
      voice: {
        ...currentProfile.voice,
        toneAttributes: updated
      }
    });
  };

  const handleAddPrimaryHex = () => {
    if (!/^#([A-Fa-f0-9]{6})$/.test(newPrimaryHex)) return;
    const updated = [...(currentProfile.colors?.primaryHex || []), newPrimaryHex.toUpperCase()];
    handleUpdateProfile({
      colors: {
        ...currentProfile.colors,
        primaryHex: updated
      }
    });
  };

  const handleRemovePrimaryHex = (index: number) => {
    const updated = (currentProfile.colors?.primaryHex || []).filter((_, i) => i !== index);
    handleUpdateProfile({
      colors: {
        ...currentProfile.colors,
        primaryHex: updated
      }
    });
  };

  const handleAddSecondaryHex = () => {
    if (!/^#([A-Fa-f0-9]{6})$/.test(newSecondaryHex)) return;
    const updated = [...(currentProfile.colors?.secondaryHex || []), newSecondaryHex.toUpperCase()];
    handleUpdateProfile({
      colors: {
        ...currentProfile.colors,
        secondaryHex: updated
      }
    });
  };

  const handleRemoveSecondaryHex = (index: number) => {
    const updated = (currentProfile.colors?.secondaryHex || []).filter((_, i) => i !== index);
    handleUpdateProfile({
      colors: {
        ...currentProfile.colors,
        secondaryHex: updated
      }
    });
  };

  const handleAddRule = () => {
    const newRuleId = `R-CUSTOM-${(currentProfile.rules?.length || 0) + 1}`;
    const newRule: BrandRule = {
      ruleId: newRuleId,
      category: 'Text',
      description: 'New custom brand alignment rule requirement.',
      weight: 2.0,
      evaluatorType: 'Semantic'
    };
    handleUpdateProfile({
      rules: [...(currentProfile.rules || []), newRule]
    });
  };

  const handleUpdateRule = (index: number, ruleUpdates: Partial<BrandRule>) => {
    const updatedRules = [...(currentProfile.rules || [])];
    updatedRules[index] = {
      ...updatedRules[index],
      ...ruleUpdates
    };
    handleUpdateProfile({ rules: updatedRules });
  };

  const handleRemoveRule = (index: number) => {
    const updatedRules = (currentProfile.rules || []).filter((_, i) => i !== index);
    handleUpdateProfile({ rules: updatedRules });
  };

  const handleCreateNewProfile = () => {
    const newName = `Brand DNA ${brandProfiles.length + 1}`;
    const newProf: BrandDNAProfile = {
      metadata: {
        brandName: newName,
        brandVersion: '1.0.0',
        schemaVersion: '1.0',
        updatedAt: new Date().toISOString(),
        description: 'New custom brand profile draft.'
      },
      lifecycleState: 'DRAFT',
      voice: {
        primaryTone: 'Confident, modern, and accessible',
        formalityScore: 0.7,
        toneAttributes: ['Clear', 'Direct', 'Engaging']
      },
      vocabulary: {
        forbidden: [{ term: 'revolutionary', reason: 'Overused buzzword.' }],
        preferred: ['Engineered', 'Reliable']
      },
      colors: {
        primaryHex: ['#040918', '#06B6D4'],
        secondaryHex: ['#2DD4BF', '#0284C7'],
        strictCompliance: false
      },
      rules: [
        {
          ruleId: 'R-VOCAB-01',
          category: 'Text',
          description: 'Zero tolerance for overused buzzwords.',
          weight: 2.5,
          evaluatorType: 'Deterministic'
        },
        {
          ruleId: 'R-TONE-01',
          category: 'Text',
          description: 'Maintain confident and clear voice tone.',
          weight: 2.0,
          evaluatorType: 'Semantic'
        }
      ],
      sources: []
    };
    saveBrandProfile(newProf);
    setSelectedBrandName(newName);
    showStatus(`Created new profile "${newName}".`);
  };

  const handleExportJson = () => {
    const json = exportProfilesToJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loomfrog-brand-profiles-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus('Exported Brand DNA profiles JSON.');
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const success = importProfilesFromJson(reader.result as string);
      if (success) {
        showStatus('Successfully imported Brand DNA profile(s).');
      } else {
        alert('Invalid Brand DNA profile JSON schema.');
      }
    };
    reader.readAsText(file);
  };

  const [activeFallbackNotice, setActiveFallbackNotice] = useState<string | null>(null);

  const handleAiExtractedProfile = (extracted: Partial<BrandDNAProfile>) => {
    if (extracted.metadata?.brandName) {
      saveBrandProfile(extracted as BrandDNAProfile);
      setActiveProfileById(extracted.metadata.brandName);
      setSelectedBrandName(extracted.metadata.brandName);
      if (extracted.fallbackNotice) {
        setActiveFallbackNotice(extracted.fallbackNotice);
        showStatus(`${extracted.fallbackNotice} Drafted: ${extracted.metadata.brandName}`);
      } else {
        setActiveFallbackNotice(null);
        showStatus(`Imported AI-generated profile: ${extracted.metadata.brandName}`);
      }
    } else {
      showStatus('Failed to import profile: missing brand name metadata.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-xs font-bold shadow-[0_8px_32px_rgba(6,182,212,0.4)] animate-fade-in border border-white/20">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {profileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl neo-liquid-panel p-6 space-y-4 shadow-2xl border border-rose-500/30">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Brand Profile?</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete <strong className="text-white">&ldquo;{profileToDelete}&rdquo;</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setProfileToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteBrandProfile(profileToDelete);
                  setProfileToDelete(null);
                  showStatus(`Deleted brand profile.`);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all cursor-pointer shadow-lg shadow-rose-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Extraction Modal */}
      <AiExtractModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onProfileExtracted={handleAiExtractedProfile}
        existingSources={currentProfile.sources || []}
      />

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white font-lexend tracking-tight">
            Brand DNA Manager
          </h1>
          <p className="text-xs text-slate-400">
            Define, calibrate, and lock machine-readable brand guidelines, rulesets, web sources, and color matrices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* AI Extractor Trigger */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold text-white neo-liquid-btn-primary shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            Draft Profile with AI
          </button>

          {/* New Profile */}
          <button
            onClick={() => setIsCreateProfileModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-medium text-slate-200 bg-[#02050f]/80 hover:bg-white/[0.08] border border-cyan-500/20 backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-teal-400" />
            New Profile
          </button>

          {/* Import / Export */}
          <label className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-[#02050f]/80 hover:bg-white/[0.08] border border-cyan-500/20 backdrop-blur-md cursor-pointer transition-all active:scale-95 shadow-sm shrink-0">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            Import JSON
            <input type="file" accept=".json" onChange={handleImportJsonFile} className="hidden" />
          </label>

          <button
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-[#02050f]/80 hover:bg-white/[0.08] border border-cyan-500/20 backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-sm shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            Export JSON
          </button>

          <button
            onClick={resetToDefaultProfiles}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-[#02050f]/80 border border-cyan-500/20 hover:bg-white/[0.08] backdrop-blur-md transition-all cursor-pointer shadow-sm shrink-0"
            title="Reset Profiles to Default"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-300" />
          </button>
        </div>
      </div>

      {brandProfiles.length === 0 ? (
        <div className="p-10 rounded-3xl neo-liquid-panel text-center space-y-5 border border-cyan-500/20 my-8">
          <div className="w-16 h-16 rounded-3xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-white font-lexend">No Brand DNA Profiles Configured</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your API Key is synchronized. Create your first custom Brand DNA profile to establish machine-readable tone guidelines, forbidden buzzwords, and diagnostic metrics.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white neo-liquid-btn-primary shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Draft Profile with AI</span>
            </button>
            <button
              onClick={() => setIsCreateProfileModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-medium text-slate-200 bg-[#02050f]/80 hover:bg-white/[0.08] border border-cyan-500/20 backdrop-blur-md cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 text-teal-400" />
              <span>Blank Profile</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Fallback Notice Banner if Model Fallback Occurred */}
          {(activeFallbackNotice || currentProfile.fallbackNotice) && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-[#040918] to-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(245,158,11,0.15)] animate-fade-in">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="leading-relaxed font-medium">
                  {activeFallbackNotice || currentProfile.fallbackNotice}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  Fallback Model Used
                </span>
                <button
                  type="button"
                  onClick={() => setActiveFallbackNotice(null)}
                  className="text-amber-300/80 hover:text-white text-xs underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Profile Selector & Activation Banner */}
          <div className="p-4 sm:p-5 rounded-3xl neo-liquid-panel flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-cyan-200 font-lexend shrink-0">Selected Profile:</label>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {isRenaming ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                  className="px-3 py-1.5 rounded-xl neo-liquid-input text-xs font-bold text-white font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveRename}
                  className="p-1.5 rounded-lg bg-teal-500 text-black hover:bg-teal-400 cursor-pointer"
                  title="Save Name"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsRenaming(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <select
                  value={selectedBrandName}
                  onChange={(e) => {
                    setSelectedBrandName(e.target.value);
                  }}
                  className="px-3.5 py-2 rounded-xl neo-liquid-input text-xs font-bold text-white cursor-pointer w-full sm:w-auto max-w-full truncate"
                >
                  {brandProfiles.map((p) => (
                    <option key={p.metadata.brandName} value={p.metadata.brandName} className="bg-[#040a1b] text-white">
                      {p.metadata.brandName} (v{p.metadata.brandVersion}) &bull; [{p.lifecycleState}]
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleStartRename}
                  className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 bg-[#02050f]/80 border border-cyan-500/20 transition-colors"
                  title="Rename Brand Profile"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {currentProfile.lifecycleState === 'ACTIVE' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/35 text-xs font-bold backdrop-blur-md shadow-sm shrink-0">
                <Flame className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                Active Benchmark
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full md:w-auto">
          {currentProfile.lifecycleState === 'ACTIVE' ? null : currentProfile.lifecycleState === 'APPROVED' ? (
            <button
              onClick={() => {
                setProfileLifecycleState(currentProfile.metadata.brandName, 'ACTIVE');
                setActiveProfileById(currentProfile.metadata.brandName);
                showStatus(`Set ${currentProfile.metadata.brandName} as ACTIVE benchmark.`);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 hover:from-teal-400 hover:to-cyan-400 shadow-lg shadow-cyan-500/30 border border-white/20 transition-all active:scale-95 cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5" />
              Set as Active Benchmark
            </button>
          ) : currentProfile.lifecycleState === 'USER_REVIEW' ? (
            <button
              onClick={() => {
                setProfileLifecycleState(currentProfile.metadata.brandName, 'APPROVED');
                showStatus(`Approved ${currentProfile.metadata.brandName}. You can now set it as Active.`);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-600/25 border border-teal-300/40 transition-all active:scale-95 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              Approve Profile
            </button>
          ) : (
            <button
              onClick={() => {
                setProfileLifecycleState(currentProfile.metadata.brandName, 'USER_REVIEW');
                showStatus(`Moved to User Review stage.`);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 transition-all active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(45,212,191,0.2)]"
              title="AI-generated profiles require human review and approval before becoming Active"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span className="text-teal-200">Review to Approve</span>
            </button>
          )}

          {brandProfiles.length > 1 && (
            <button
              onClick={() => setProfileToDelete(currentProfile.metadata.brandName)}
              className="p-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer shrink-0"
              title="Delete Profile"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 6-Stage Interactive Lifecycle Stepper (Visual Step 1 + 5 Real States) */}
      <LifecycleStepper
        currentState={currentProfile.lifecycleState}
        onAdvanceState={(newState: LifecycleState) => {
          setProfileLifecycleState(currentProfile.metadata.brandName, newState);
          showStatus(`Advanced stage to ${newState}`);
        }}
        onOpenAiExtract={() => setIsAiModalOpen(true)}
      />

      {/* Ruleset Editor Sub-Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-cyan-500/15 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTabSub('voice')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all backdrop-blur-md cursor-pointer shrink-0 whitespace-nowrap ${
              activeTabSub === 'voice' ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Voice &amp; Formality</span>
          </button>

          <button
            onClick={() => setActiveTabSub('vocabulary')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all backdrop-blur-md cursor-pointer shrink-0 whitespace-nowrap ${
              activeTabSub === 'vocabulary' ? 'bg-rose-500/20 text-rose-200 border border-rose-400/40 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>Forbidden &amp; Preferred Vocabulary</span>
          </button>

          <button
            onClick={() => setActiveTabSub('colors')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all backdrop-blur-md cursor-pointer shrink-0 whitespace-nowrap ${
              activeTabSub === 'colors' ? 'bg-teal-500/20 text-teal-200 border border-teal-400/40 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-teal-400" />
            <span>Color Palette &amp; Matrix</span>
          </button>

          <button
            onClick={() => setActiveTabSub('rules')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all backdrop-blur-md cursor-pointer shrink-0 whitespace-nowrap ${
              activeTabSub === 'rules' ? 'bg-blue-500/20 text-blue-200 border border-blue-400/40 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span>Evaluation Rules ({currentProfile.rules?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTabSub('sources')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all backdrop-blur-md cursor-pointer shrink-0 whitespace-nowrap ${
              activeTabSub === 'sources' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Brand Sources &amp; URLs ({currentProfile.sources?.length || 0})</span>
          </button>
        </div>

        {/* Tab 5: Brand Sources & Web Ingestion */}
        {activeTabSub === 'sources' && (
          <div className="p-6 rounded-3xl neo-liquid-panel space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Ingested Brand Source URLs</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Add official website pages, press centers, or public brand books. LoomFrog extracts live copy and links them directly to this Brand DNA.
                </p>
              </div>
            </div>

            {/* Add URL Form */}
            <div className="p-4 rounded-2xl bg-[#02050f]/80 border border-emerald-500/20 space-y-3">
              <label className="block text-xs font-semibold text-slate-200">
                Add New Public Brand Source URL
              </label>
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <input
                  type="url"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSource()}
                  placeholder="https://acme.com or https://acme.com/about"
                  className="flex-1 px-3.5 py-2 rounded-xl neo-liquid-input text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddSource}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Attach Source</span>
                </button>
              </div>
            </div>

            {/* Sources List */}
            <div className="space-y-3">
              {!currentProfile.sources || currentProfile.sources.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl">
                  <Globe className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No web sources linked to this profile yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">Add a URL above to verify tone and consistency across live web properties.</p>
                </div>
              ) : (
                currentProfile.sources.map((source) => {
                  const fetchInfo = sourceFetchStatus[source.id];
                  return (
                    <div
                      key={source.id}
                      className="p-4 rounded-2xl bg-[#02050f]/90 border border-emerald-500/20 space-y-3 shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-xs font-mono text-white font-semibold truncate">{source.url}</span>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-cyan-300"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => handleTestFetchSource(source.id, source.url)}
                            disabled={fetchInfo?.loading}
                            className="px-3 py-1 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            {fetchInfo?.loading ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                                <span>Testing...</span>
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-3 h-3 text-cyan-400" />
                                <span>Test Web Extraction</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => removeBrandSource(currentProfile.metadata.brandName, source.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                            title="Remove Source"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Live Inspection Card if fetched */}
                      {fetchInfo?.data && (
                        <div className="p-3 rounded-xl bg-[#030a1c] border border-cyan-500/30 text-xs space-y-1.5 animate-fade-in">
                          <div className="flex items-center justify-between text-teal-300 font-semibold text-[11px]">
                            <span>Page Title: {fetchInfo.data.title}</span>
                            <span className="font-mono">{fetchInfo.data.wordCount} words detected</span>
                          </div>
                          {fetchInfo.data.headings.length > 0 && (
                            <p className="text-[11px] text-slate-300 truncate">
                              <span className="text-slate-400">Headings:</span> {fetchInfo.data.headings.slice(0, 4).join(' • ')}
                            </p>
                          )}
                        </div>
                      )}

                      {fetchInfo?.error && (
                        <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>{fetchInfo.error}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 1: Voice & Formality */}
        {activeTabSub === 'voice' && (
          <div className="p-6 rounded-3xl neo-liquid-panel space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-cyan-200 mb-1.5 font-lexend">
                  Brand Name &amp; Version
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentProfile.metadata.brandName}
                    onChange={(e) =>
                      handleUpdateProfile({
                        metadata: { ...currentProfile.metadata, brandName: e.target.value }
                      })
                    }
                    className="flex-1 px-3.5 py-2 rounded-xl neo-liquid-input text-xs text-white"
                  />
                  <input
                    type="text"
                    value={currentProfile.metadata.brandVersion}
                    onChange={(e) =>
                      handleUpdateProfile({
                        metadata: { ...currentProfile.metadata, brandVersion: e.target.value }
                      })
                    }
                    className="w-24 px-3.5 py-2 rounded-xl neo-liquid-input text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-200 mb-1.5 font-lexend">
                  Primary Tone Narrative
                </label>
                <input
                  type="text"
                  value={currentProfile.voice.primaryTone}
                  onChange={(e) =>
                    handleUpdateProfile({
                      voice: { ...currentProfile.voice, primaryTone: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl neo-liquid-input text-xs text-white"
                  placeholder="e.g. Authoritative, precise, pragmatic and empowering"
                />
              </div>
            </div>

            {/* Formality Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-200 font-lexend">
                  Formality Calibrator: <span className="text-cyan-300 font-bold text-sm">{(currentProfile.voice.formalityScore * 100).toFixed(0)}%</span>
                </label>
                <span className="text-xs text-slate-400">
                  {currentProfile.voice.formalityScore >= 0.8
                    ? 'Strict Enterprise & Academic'
                    : currentProfile.voice.formalityScore >= 0.6
                    ? 'Professional Business'
                    : 'Conversational & Casual'}
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={currentProfile.voice.formalityScore}
                onChange={(e) =>
                  handleUpdateProfile({
                    voice: { ...currentProfile.voice, formalityScore: parseFloat(e.target.value) }
                  })
                }
                className="w-full h-2 bg-[#02050f] rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-cyan-500/20"
              />
            </div>

            {/* Tone Attributes Pills */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200 font-lexend">Tone Attributes</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {currentProfile.voice.toneAttributes?.map((attr, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-br from-cyan-950/40 to-[#020612]/90 border border-cyan-400/30 text-xs text-cyan-200 backdrop-blur-md shadow-sm font-medium"
                  >
                    {attr}
                    <button
                      onClick={() => handleRemoveToneAttr(idx)}
                      className="text-slate-400 hover:text-rose-400 ml-1 cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newToneAttr}
                  onChange={(e) => setNewToneAttr(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddToneAttr()}
                  placeholder="Add attribute (e.g. Tactile, Low latency, Quiet luxury)..."
                  className="flex-1 px-3.5 py-2 rounded-xl neo-liquid-input text-xs text-white"
                />
                <button
                  onClick={handleAddToneAttr}
                  className="px-4 py-2 rounded-xl bg-[#02050f]/80 hover:bg-white/[0.08] border border-cyan-500/25 text-xs font-bold text-cyan-200 backdrop-blur-md transition-all cursor-pointer shadow-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Forbidden & Preferred Vocabulary */}
        {activeTabSub === 'vocabulary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Forbidden Vocabulary */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-950/30 via-[#0c1626]/70 to-[#020612]/90 backdrop-blur-2xl border border-rose-500/30 space-y-4 shadow-[6px_8px_20px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider font-mono">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Forbidden Vocabulary ({currentProfile.vocabulary?.forbidden?.length || 0})
                </div>
                <span className="text-[10px] text-cyan-300/80 font-mono">Regex Scanned</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {currentProfile.vocabulary?.forbidden?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#02050f]/85 border border-rose-500/20 flex items-center justify-between gap-2 backdrop-blur-md shadow-[inset_1px_1px_3px_rgba(0,0,0,0.6)]"
                  >
                    <div>
                      <div className="font-mono font-bold text-xs text-rose-300">&ldquo;{item.term}&rdquo;</div>
                      <div className="text-[11px] text-slate-300">{item.reason}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveForbiddenTerm(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2 border-t border-rose-500/20">
                <input
                  type="text"
                  value={newForbiddenTerm}
                  onChange={(e) => setNewForbiddenTerm(e.target.value)}
                  placeholder="Forbidden term (e.g. supercharge, magic)..."
                  className="w-full px-3.5 py-2 rounded-xl neo-liquid-input text-xs text-white"
                />
                <input
                  type="text"
                  value={newForbiddenReason}
                  onChange={(e) => setNewForbiddenReason(e.target.value)}
                  placeholder="Reason / Recommended alternative..."
                  className="w-full px-3.5 py-2 rounded-xl neo-liquid-input text-xs text-white"
                />
                <button
                  onClick={handleAddForbiddenTerm}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 border border-white/20 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  Add Forbidden Term
                </button>
              </div>
            </div>

            {/* Preferred Vocabulary */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-950/30 via-[#0c1626]/70 to-[#020612]/90 backdrop-blur-2xl border border-teal-500/30 space-y-4 shadow-[6px_8px_20px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-xs uppercase tracking-wider font-mono">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  Preferred Brand Lexicon ({currentProfile.vocabulary?.preferred?.length || 0})
                </div>
                <span className="text-[10px] text-cyan-300/80 font-mono">Semantic Guidance</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {currentProfile.vocabulary?.preferred?.map((term, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#02050f]/85 border border-teal-500/20 flex items-center justify-between gap-2 backdrop-blur-md shadow-[inset_1px_1px_3px_rgba(0,0,0,0.6)]"
                  >
                    <span className="text-xs font-semibold text-teal-200">{term}</span>
                    <button
                      onClick={() => handleRemovePreferredTerm(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2 border-t border-teal-500/20">
                <input
                  type="text"
                  value={newPreferredTerm}
                  onChange={(e) => setNewPreferredTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPreferredTerm()}
                  placeholder="Preferred phrase (e.g. Deterministic reliability)..."
                  className="flex-1 px-3.5 py-2 rounded-xl neo-liquid-input text-xs text-white"
                />
                <button
                  onClick={handleAddPreferredTerm}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 border border-teal-300/40 text-xs font-bold text-white shadow-lg shadow-teal-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Colors & Palette */}
        {activeTabSub === 'colors' && (
          <div className="p-6 rounded-3xl neo-liquid-panel space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-cyan-200 uppercase tracking-wider font-mono">
                  Brand Color Palette Matrix
                </h3>
                <p className="text-xs text-slate-400">
                  Used by the HTML5 Canvas visual extractor and Delta-E (ΔE &lt; 16.0) perceptual distance engine.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-[#02050f]/80 px-3.5 py-2 rounded-xl border border-cyan-500/20 backdrop-blur-md shadow-[inset_1px_1px_3px_rgba(0,0,0,0.6)]">
                <input
                  type="checkbox"
                  checked={currentProfile.colors.strictCompliance}
                  onChange={(e) =>
                    handleUpdateProfile({
                      colors: { ...currentProfile.colors, strictCompliance: e.target.checked }
                    })
                  }
                  className="rounded bg-black/60 text-cyan-400 focus:ring-0"
                />
                <span className="text-xs font-semibold text-cyan-200">Strict Compliance (Flag &lt;5% area)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Hex Codes */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-200 font-lexend">Primary Brand Colors</label>
                <div className="flex flex-wrap gap-2.5">
                  {currentProfile.colors.primaryHex?.map((hex, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#02050f]/80 border border-cyan-500/25 backdrop-blur-md shadow-sm"
                    >
                      <div className="w-4 h-4 rounded-md border border-white/40 shadow-sm" style={{ backgroundColor: hex }} />
                      <span className="text-xs font-mono font-bold text-white">{hex}</span>
                      <button onClick={() => handleRemovePrimaryHex(idx)} className="text-slate-400 hover:text-rose-400 text-xs cursor-pointer">
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newPrimaryHex}
                    onChange={(e) => setNewPrimaryHex(e.target.value)}
                    className="w-10 h-9 rounded-lg bg-[#02050f] border border-cyan-500/30 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newPrimaryHex}
                    onChange={(e) => setNewPrimaryHex(e.target.value)}
                    className="w-28 px-3 py-1.5 rounded-xl neo-liquid-input text-xs text-white font-mono uppercase"
                  />
                  <button
                    onClick={handleAddPrimaryHex}
                    className="px-3.5 py-1.5 rounded-xl bg-[#02050f]/80 hover:bg-white/[0.08] border border-cyan-500/25 text-xs font-bold text-cyan-200 backdrop-blur-md transition-all cursor-pointer shadow-sm"
                  >
                    Add Primary
                  </button>
                </div>
              </div>

              {/* Secondary Hex Codes */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-200 font-lexend">Secondary / Neutral Colors</label>
                <div className="flex flex-wrap gap-2.5">
                  {currentProfile.colors.secondaryHex?.map((hex, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#02050f]/80 border border-cyan-500/25 backdrop-blur-md shadow-sm"
                    >
                      <div className="w-4 h-4 rounded-md border border-white/40 shadow-sm" style={{ backgroundColor: hex }} />
                      <span className="text-xs font-mono font-bold text-white">{hex}</span>
                      <button onClick={() => handleRemoveSecondaryHex(idx)} className="text-slate-400 hover:text-rose-400 text-xs cursor-pointer">
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newSecondaryHex}
                    onChange={(e) => setNewSecondaryHex(e.target.value)}
                    className="w-10 h-9 rounded-lg bg-[#02050f] border border-cyan-500/30 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newSecondaryHex}
                    onChange={(e) => setNewSecondaryHex(e.target.value)}
                    className="w-28 px-3 py-1.5 rounded-xl neo-liquid-input text-xs text-white font-mono uppercase"
                  />
                  <button
                    onClick={handleAddSecondaryHex}
                    className="px-3.5 py-1.5 rounded-xl bg-[#02050f]/80 hover:bg-white/[0.08] border border-cyan-500/25 text-xs font-bold text-cyan-200 backdrop-blur-md transition-all cursor-pointer shadow-sm"
                  >
                    Add Secondary
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Evaluation Rules Matrix */}
        {activeTabSub === 'rules' && (
          <div className="p-6 rounded-3xl neo-liquid-panel space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-cyan-200 uppercase tracking-wider font-mono">
                  Configurable Evaluation Rules
                </h3>
                <p className="text-xs text-slate-400">
                  Assign weights (0.1 to 5.0) and evaluator types (Deterministic vs Semantic) to steer compliance scoring.
                </p>
              </div>
              <button
                onClick={handleAddRule}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white neo-liquid-btn-primary shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-200" />
                Add Custom Rule
              </button>
            </div>

            <div className="space-y-3">
              {currentProfile.rules?.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#02050f]/85 border border-cyan-500/15 space-y-2.5 hover:border-cyan-400/40 transition-all backdrop-blur-md shadow-[inset_1px_1px_3px_rgba(0,0,0,0.6)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={rule.ruleId}
                        onChange={(e) => handleUpdateRule(idx, { ruleId: e.target.value })}
                        className="w-28 px-2.5 py-1 rounded-xl bg-black/40 border border-cyan-500/20 text-xs font-mono font-bold text-cyan-300"
                      />
                      <select
                        value={rule.category}
                        onChange={(e) => handleUpdateRule(idx, { category: e.target.value as any })}
                        className="px-2.5 py-1 rounded-xl bg-black/40 border border-cyan-500/20 text-xs text-slate-200 cursor-pointer"
                      >
                        <option value="Text" className="bg-[#040a1b]">Text</option>
                        <option value="Visual" className="bg-[#040a1b]">Visual</option>
                        <option value="Global" className="bg-[#040a1b]">Global</option>
                      </select>
                      <select
                        value={rule.evaluatorType}
                        onChange={(e) => handleUpdateRule(idx, { evaluatorType: e.target.value as any })}
                        className="px-2.5 py-1 rounded-xl bg-black/40 border border-cyan-500/20 text-xs font-semibold text-teal-300 cursor-pointer"
                      >
                        <option value="Deterministic" className="bg-[#040a1b]">Deterministic (Regex/Canvas)</option>
                        <option value="Semantic" className="bg-[#040a1b]">Semantic (Gemini API)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span>Weight:</span>
                        <span className="font-bold text-white text-sm font-mono">{rule.weight.toFixed(1)}</span>
                        <input
                          type="range"
                          min="0.1"
                          max="5.0"
                          step="0.1"
                          value={rule.weight}
                          onChange={(e) => handleUpdateRule(idx, { weight: parseFloat(e.target.value) })}
                          className="w-20 h-1.5 bg-[#02050f] rounded-lg accent-cyan-400 border border-cyan-500/20 cursor-pointer"
                        />
                      </div>

                      <button
                        onClick={() => handleRemoveRule(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={rule.description}
                    onChange={(e) => handleUpdateRule(idx, { description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-cyan-500/15 text-xs text-slate-200 backdrop-blur-sm focus:border-cyan-400"
                    placeholder="Rule description &amp; diagnostic objective..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};
