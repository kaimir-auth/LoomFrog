import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrandDNAProfile, AuditReport, LifecycleState } from '../types/brandDna';
import { DEFAULT_BRAND_PROFILES, PRECOMPUTED_DEMO_AUDIT } from '../data/sampleBrandProfiles';
import { DEFAULT_MODEL } from '../services/geminiSemanticEngine';

interface KeyContextType {
  // In-Memory API Key (never written to storage)
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  hasApiKey: boolean;

  // Demo Mode State
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  toggleDemoMode: () => void;

  // Model Selection
  selectedModel: string;
  setSelectedModel: (model: string) => void;

  // Brand Profiles (Persisted locally in localStorage)
  brandProfiles: BrandDNAProfile[];
  activeProfile: BrandDNAProfile;
  setActiveProfileById: (brandName: string) => void;
  saveBrandProfile: (profile: BrandDNAProfile) => void;
  deleteBrandProfile: (brandName: string) => void;
  setProfileLifecycleState: (brandName: string, state: LifecycleState) => void;
  importProfilesFromJson: (jsonStr: string) => boolean;
  exportProfilesToJson: () => string;
  resetToDefaultProfiles: () => void;

  // Audit History (Persisted locally in localStorage)
  auditHistory: AuditReport[];
  addAuditToHistory: (report: AuditReport) => void;
  clearAuditHistory: () => void;

  // Current draft state
  currentDraftText: string;
  setCurrentDraftText: (text: string) => void;

  // UI Navigation
  activeTab: 'audit' | 'brand_dna' | 'privacy';
  setActiveTab: (tab: 'audit' | 'brand_dna' | 'privacy') => void;

  // Key Modal Control
  isKeyModalOpen: boolean;
  setIsKeyModalOpen: (open: boolean) => void;
}

const LOCAL_STORAGE_PROFILES_KEY = 'loomfrog_brand_profiles_v1';
const LOCAL_STORAGE_HISTORY_KEY = 'loomfrog_audit_history_v1';
const LOCAL_STORAGE_ACTIVE_PROFILE_KEY = 'loomfrog_active_profile_name';

const KeyContext = createContext<KeyContextType | undefined>(undefined);

export const KeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. IN-MEMORY KEY ONLY - Absolutely NO localStorage/sessionStorage persistence
  const [apiKey, setApiKeyState] = useState<string>('');

  const setApiKey = (key: string) => {
    setApiKeyState(key.trim());
  };

  const clearApiKey = () => {
    setApiKeyState('');
  };

  const hasApiKey = Boolean(apiKey && apiKey.length > 5);

  // 2. Demo Mode
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true); // default to true so user immediately experiences interactive UI

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
  };

  // 3. Model Configuration
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);

  // 4. Navigation
  const [activeTab, setActiveTab] = useState<'audit' | 'brand_dna' | 'privacy'>('audit');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);

  // 5. Current Draft in editor
  const [currentDraftText, setCurrentDraftText] = useState<string>(
    `Hey team! We are thrilled to announce that our new platform will supercharge your entire workflow with pure magic! It is a total game changer that provides cheap cloud compute for everyone. With cross-system synergy, deployment is easy-peasy and delivers unmatched results instantly.`
  );

  // 6. Brand Profiles (Persisted locally)
  const [brandProfiles, setBrandProfiles] = useState<BrandDNAProfile[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_BRAND_PROFILES;
  });

  const [activeProfileName, setActiveProfileName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ACTIVE_PROFILE_KEY);
      if (saved) return saved;
    } catch {
      // fallback
    }
    return DEFAULT_BRAND_PROFILES[0]?.metadata.brandName || 'Apex Cloud Systems';
  });

  // 7. Audit History (Persisted locally)
  const [auditHistory, setAuditHistory] = useState<AuditReport[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [PRECOMPUTED_DEMO_AUDIT];
  });

  // Sync Profiles to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(brandProfiles));
    } catch (e) {
      console.warn('Failed to save profiles to localStorage', e);
    }
  }, [brandProfiles]);

  // Sync Active Profile Name to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_PROFILE_KEY, activeProfileName);
    } catch (e) {
      console.warn('Failed to save active profile name', e);
    }
  }, [activeProfileName]);

  // Sync Audit History to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(auditHistory));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [auditHistory]);

  const activeProfile =
    brandProfiles.find((p) => p.metadata.brandName === activeProfileName) ||
    brandProfiles[0] ||
    DEFAULT_BRAND_PROFILES[0];

  const setActiveProfileById = (brandName: string) => {
    setActiveProfileName(brandName);
  };

  const saveBrandProfile = (updatedProfile: BrandDNAProfile) => {
    setBrandProfiles((prev) => {
      const existingIdx = prev.findIndex((p) => p.metadata.brandName === updatedProfile.metadata.brandName);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...updatedProfile,
          metadata: {
            ...updatedProfile.metadata,
            updatedAt: new Date().toISOString()
          }
        };
        return copy;
      }
      return [...prev, updatedProfile];
    });
  };

  const deleteBrandProfile = (brandName: string) => {
    if (brandProfiles.length <= 1) return;
    setBrandProfiles((prev) => prev.filter((p) => p.metadata.brandName !== brandName));
    if (activeProfileName === brandName) {
      const remaining = brandProfiles.filter((p) => p.metadata.brandName !== brandName);
      if (remaining[0]) {
        setActiveProfileName(remaining[0].metadata.brandName);
      }
    }
  };

  const setProfileLifecycleState = (brandName: string, newState: LifecycleState) => {
    setBrandProfiles((prev) =>
      prev.map((p) => {
        if (p.metadata.brandName === brandName) {
          // If setting to ACTIVE, demote other ACTIVE profiles to APPROVED
          return { ...p, lifecycleState: newState };
        }
        if (newState === 'ACTIVE' && p.lifecycleState === 'ACTIVE') {
          return { ...p, lifecycleState: 'APPROVED' };
        }
        return p;
      })
    );
  };

  const importProfilesFromJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      const profilesToImport = Array.isArray(data) ? data : [data];

      // Simple schema validation
      const validProfiles = profilesToImport.filter(
        (p) => p.metadata?.brandName && p.voice && p.vocabulary && p.rules
      );

      if (validProfiles.length === 0) return false;

      setBrandProfiles((prev) => {
        const merged = [...prev];
        validProfiles.forEach((newP) => {
          const idx = merged.findIndex((m) => m.metadata.brandName === newP.metadata.brandName);
          if (idx >= 0) {
            merged[idx] = newP;
          } else {
            merged.push(newP);
          }
        });
        return merged;
      });

      setActiveProfileName(validProfiles[0].metadata.brandName);
      return true;
    } catch {
      return false;
    }
  };

  const exportProfilesToJson = (): string => {
    return JSON.stringify(brandProfiles, null, 2);
  };

  const resetToDefaultProfiles = () => {
    setBrandProfiles(DEFAULT_BRAND_PROFILES);
    setActiveProfileName(DEFAULT_BRAND_PROFILES[0].metadata.brandName);
  };

  const addAuditToHistory = (report: AuditReport) => {
    setAuditHistory((prev) => [report, ...prev.slice(0, 19)]); // keep last 20 reports
  };

  const clearAuditHistory = () => {
    setAuditHistory([]);
  };

  return (
    <KeyContext.Provider
      value={{
        apiKey,
        setApiKey,
        clearApiKey,
        hasApiKey,
        isDemoMode,
        setIsDemoMode,
        toggleDemoMode,
        selectedModel,
        setSelectedModel,
        brandProfiles,
        activeProfile,
        setActiveProfileById,
        saveBrandProfile,
        deleteBrandProfile,
        setProfileLifecycleState,
        importProfilesFromJson,
        exportProfilesToJson,
        resetToDefaultProfiles,
        auditHistory,
        addAuditToHistory,
        clearAuditHistory,
        currentDraftText,
        setCurrentDraftText,
        activeTab,
        setActiveTab,
        isKeyModalOpen,
        setIsKeyModalOpen
      }}
    >
      {children}
    </KeyContext.Provider>
  );
};

export const useKeyContext = (): KeyContextType => {
  const context = useContext(KeyContext);
  if (!context) {
    throw new Error('useKeyContext must be used within a KeyProvider');
  }
  return context;
};
