import { create } from 'zustand';
import type { RootKey, Kek, Dek, HsmCluster, RotationEntry } from '@/types';

interface KeysStore {
  rootKeys:          RootKey[];
  keks:              Kek[];
  deks:              Dek[];
  hsmClusters:       HsmCluster[];
  rotationSchedule:  RotationEntry[];
  setKeyHierarchy:   (rk: RootKey[], keks: Kek[], deks: Dek[]) => void;
  setHsmClusters:    (clusters: HsmCluster[]) => void;
  setRotationSchedule: (entries: RotationEntry[]) => void;
}

export const useKeysStore = create<KeysStore>((set) => ({
  rootKeys:         [],
  keks:             [],
  deks:             [],
  hsmClusters:      [],
  rotationSchedule: [],

  setKeyHierarchy: (rk, keks, deks) => set({ rootKeys: rk, keks, deks }),
  setHsmClusters:  (clusters) => set({ hsmClusters: clusters }),
  setRotationSchedule: (entries) => set({ rotationSchedule: entries }),
}));
