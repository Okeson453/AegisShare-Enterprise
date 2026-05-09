import { create } from 'zustand';
import type { AuditEvent } from '@/types';

export type NavSection =
  | 'overview' | 'vault' | 'compliance' | 'policy'
  | 'audit' | 'threat' | 'keys' | 'access' | 'settings';

export interface Notification {
  id:        string;
  type:      'info' | 'success' | 'warning' | 'error';
  title:     string;
  message:   string;
  createdAt: string;
  read:      boolean;
}

interface UiStore {
  sidebarOpen:      boolean;
  activeNav:        NavSection;
  activeTab:        string;
  uploadModalOpen:  boolean;
  selectedFileId:   string | null;
  notifications:    Notification[];
  liveEvents:       AuditEvent[];
  setSidebarOpen:     (v: boolean) => void;
  setActiveNav:       (nav: NavSection) => void;
  setActiveTab:       (tab: string) => void;
  setUploadModalOpen: (v: boolean) => void;
  setSelectedFileId:  (id: string | null) => void;
  pushNotification:   (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAllRead:        () => void;
  pushLiveEvent:      (e: AuditEvent) => void;
  clearLiveEvents:    () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen:     true,
  activeNav:       'overview',
  activeTab:       'overview',
  uploadModalOpen: false,
  selectedFileId:  null,
  notifications:   [],
  liveEvents:      [],

  setSidebarOpen:     (v) => set({ sidebarOpen: v }),
  setActiveNav:       (nav) => set({ activeNav: nav }),
  setActiveTab:       (tab) => set({ activeTab: tab }),
  setUploadModalOpen: (v) => set({ uploadModalOpen: v }),
  setSelectedFileId:  (id) => set({ selectedFileId: id }),

  pushNotification: (n) => set((s) => ({
    notifications: [
      { ...n, id: crypto.randomUUID(), createdAt: new Date().toISOString(), read: false },
      ...s.notifications,
    ].slice(0, 50),
  })),

  markAllRead: () => set((s) => ({
    notifications: s.notifications.map((n) => ({ ...n, read: true })),
  })),

  pushLiveEvent: (e) => set((s) => ({
    liveEvents: [e, ...s.liveEvents].slice(0, 500),
  })),

  clearLiveEvents: () => set({ liveEvents: [] }),
}));

export { useUiStore as useUIStore };
