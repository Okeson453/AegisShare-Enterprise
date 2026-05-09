import { useState, useCallback, useEffect } from 'react';
import { useThreatStore } from '@/store';
import { threatService } from '@/services/threat';
import { MOCK_THREATS, MOCK_ANOMALIES, MOCK_IP_REPUTATION } from '@/services/mock/threat';

const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

export function useThreatIntel() {
    const { alerts, anomalies, ipReputation, setAlerts, setAnomalies, setIpRep, dismissAlert } = useThreatStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                if (MOCK_MODE) {
                    await new Promise(r => setTimeout(r, 320));
                    setAlerts(MOCK_THREATS);
                    setAnomalies(MOCK_ANOMALIES);
                    setIpRep(MOCK_IP_REPUTATION);
                } else {
                    const alerts = await threatService.getAlerts();
                    const anomalies = await threatService.getAnomalies();
                    setAlerts(alerts);
                    setAnomalies(anomalies);
                    // For IP reputation, use mock data for now (service design limitation)
                    setIpRep(MOCK_IP_REPUTATION);
                }
            } catch (e: any) {
                setError(e.message);
                setAlerts(MOCK_THREATS);
                setAnomalies(MOCK_ANOMALIES);
                setIpRep(MOCK_IP_REPUTATION);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [setAlerts, setAnomalies, setIpRep]);

    const dismiss = useCallback(async (id: string) => {
        try {
            if (MOCK_MODE) {
                await new Promise(r => setTimeout(r, 150));
            } else {
                await threatService.dismissAlert(id);
            }
            dismissAlert(id);
        } catch (e: any) {
            setError(e.message);
            dismissAlert(id);
        }
    }, [dismissAlert]);

    return { alerts, anomalies, ipReputation, loading, error, dismiss };
}
