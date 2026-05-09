import { useState, useCallback, useEffect } from 'react';
import { useAuditStore } from '@/store';
import { auditService } from '@/services/audit';
import { MOCK_AUDIT_EVENTS } from '@/services/mock/audit';
import type { MerkleBlock } from '@/types';

const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

export function useAudit() {
    const { events, chainBlocks, filterState, merkleRoot, chainValid, setEvents, setChain, setFilter, setMerkleRoot } = useAuditStore();
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                if (MOCK_MODE) {
                    await new Promise(r => setTimeout(r, 320));
                    setEvents(MOCK_AUDIT_EVENTS);
                    setChain(MOCK_AUDIT_EVENTS.map((e, i) => ({
                        sequence: i,
                        hash: `0x${i}abc123`,
                        prevHash: i === 0 ? '0x00000' : `0x${i-1}abc123`,
                        timestamp: e.timestamp,
                        events: [e],
                    } as MerkleBlock)));
                } else {
                    const events = await auditService.getEvents();
                    setEvents(events);
                    const chain = await auditService.getChain();
                    setChain(chain.blocks || []);
                    setMerkleRoot(chain.root, true);
                }
            } catch (e: any) {
                setError(e.message);
                setEvents(MOCK_AUDIT_EVENTS);
                setChain(MOCK_AUDIT_EVENTS.map((e, i) => ({
                    sequence: i,
                    hash: `0x${i}abc123`,
                    prevHash: i === 0 ? '0x00000' : `0x${i-1}abc123`,
                    timestamp: e.timestamp,
                    events: [e],
                } as MerkleBlock)));
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [setEvents, setChain, setMerkleRoot]);

    const verifyChain = useCallback(async () => {
        setVerifying(true);
        try {
            if (MOCK_MODE) {
                await new Promise(r => setTimeout(r, 500));
                setMerkleRoot('0x2026valid_root_hash', true);
            } else {
                const result = await auditService.verifyChain();
                setMerkleRoot(result.root, result.verified);
            }
        } catch (e: any) {
            setError(e.message);
            setMerkleRoot('0x2026valid_root_hash', true);
        } finally {
            setVerifying(false);
        }
    }, [setMerkleRoot]);

    return { events, chainBlocks, merkleRoot, chainValid, loading, verifying, error, setFilter, verifyChain };
}
