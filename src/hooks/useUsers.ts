import { useState, useEffect } from 'react';
import { usersService } from '@/services/users';
import { MOCK_USERS } from '@/services/mock/users';

const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

export interface UserStats {
    total: number;
    highRisk: number;
    noMfa: number;
    activeSessions: number;
}

export function useUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState<UserStats>({ total: 0, highRisk: 0, noMfa: 0, activeSessions: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                if (MOCK_MODE) {
                    await new Promise(r => setTimeout(r, 320));
                    setUsers(MOCK_USERS);
                    computeStats(MOCK_USERS);
                } else {
                    const data = await usersService.listUsers();
                    setUsers(data);
                    computeStats(data);
                }
            } catch (e: any) {
                setError(e.message);
                setUsers(MOCK_USERS);
                computeStats(MOCK_USERS);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const computeStats = (userList: any[]) => {
        const highRisk = userList.filter(u => u.riskLevel === 'HIGH' || u.riskLevel === 'CRITICAL').length;
        const noMfa = userList.filter(u => !u.mfaEnabled).length;
        const activeSessions = userList.filter(u => u.active).length;
        setStats({ total: userList.length, highRisk, noMfa, activeSessions });
    };

    return { users, stats, loading, error };
}
