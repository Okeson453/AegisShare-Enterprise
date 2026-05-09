import { useState, useCallback } from 'react';
import { policyService } from '@/services/policies';
import type { PdpRequest, PdpResult, PdpTraceStep } from '@/types';

const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

const MOCK_TRACE: PdpTraceStep[] = [
    { step: 1, rule: 'Auth Check', matched: true, reason: 'User authenticated' },
    { step: 2, rule: 'RBAC Evaluation', matched: true, reason: 'User has finance role' },
    { step: 3, rule: 'ABAC Rules', matched: true, reason: 'Time within business hours' },
    { step: 4, rule: 'Audit Log', matched: true, reason: 'Event recorded' },
    { step: 5, rule: 'Final Decision', matched: true, reason: 'ALLOW' },
];

const MOCK_POLICY_RESULT: PdpResult = {
    decision: 'ALLOW',
    matchedRule: 'rule_finance_read',
    trace: MOCK_TRACE,
    evalTime: 11.3,
    latencyMs: 11.3,
};

export function usePolicy() {
    const [pdpResult, setPdpResult] = useState<PdpResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const simulate = useCallback(async (req: PdpRequest): Promise<PdpResult> => {
        setLoading(true);
        setPdpResult(null);
        try {
            let result: PdpResult;
            if (MOCK_MODE) {
                await new Promise(r => setTimeout(r, 300));
                result = MOCK_POLICY_RESULT;
            } else {
                result = await policyService.simulatePdp(req);
            }
            setPdpResult(result);
            return result;
        } catch (e: any) {
            setError(e.message);
            setPdpResult(MOCK_POLICY_RESULT);
            return MOCK_POLICY_RESULT;
        } finally {
            setLoading(false);
        }
    }, []);

    return { pdpResult, loading, error, simulate };
}
