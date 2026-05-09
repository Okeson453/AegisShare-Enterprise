import { create } from 'zustand';
import type { AuditEvent, MerkleBlock } from '@/types';

type EventType = string;

export interface FilterState {
    type?: EventType;
    actorId?: string;
    from?: string;
    to?: string;
}

interface AuditStore {
    events: AuditEvent[];
    chainBlocks: MerkleBlock[];
    filterState: FilterState;
    merkleRoot: string | null;
    chainValid: boolean | null;
    setEvents: (e: AuditEvent[]) => void;
    setChain: (blocks: MerkleBlock[]) => void;
    setFilter: (f: Partial<FilterState>) => void;
    setMerkleRoot: (root: string, valid: boolean) => void;
}

export const useAuditStore = create<AuditStore>((set) => ({
    events: [],
    chainBlocks: [],
    filterState: {},
    merkleRoot: null,
    chainValid: null,

    setEvents: (events) => set({ events }),
    setChain: (blocks) => set({ chainBlocks: blocks }),
    setFilter: (filter) => set((s) => ({ filterState: { ...s.filterState, ...filter } })),
    setMerkleRoot: (root, valid) => set({ merkleRoot: root, chainValid: valid }),
}));
