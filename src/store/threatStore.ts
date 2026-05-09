import { create } from 'zustand';
import type { ThreatAlert, AnomalyScore, IpReputation } from '@/types';

interface ThreatStore {
  alerts:        ThreatAlert[];
  anomalies:     AnomalyScore[];
  ipReputation:  IpReputation[];
  setAlerts:     (a: ThreatAlert[]) => void;
  dismissAlert:  (id: string) => void;
  setAnomalies:  (a: AnomalyScore[]) => void;
  setIpRep:      (ips: IpReputation[]) => void;
}

export const useThreatStore = create<ThreatStore>((set) => ({
  alerts:       [],
  anomalies:    [],
  ipReputation: [],

  setAlerts: (alerts) => set({ alerts }),

  dismissAlert: (id) => set((s) => ({
    alerts: s.alerts.map((a) => a.id === id ? { ...a, dismissed: true } : a),
  })),

  setAnomalies: (anomalies) => set({ anomalies }),
  setIpRep:     (ips) => set({ ipReputation: ips }),
}));
