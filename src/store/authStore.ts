import { create } from 'zustand';
import type { User } from '@/types';

interface AuthStore {
    accessToken: string | null;
    user: User | null;
    mfaVerified: boolean;
    sessionExpiresAt: string | null;
    setAuth: (token: string, user: User, expiresAt: string) => void;
    setMfaVerified: (v: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    accessToken: null,
    user: null,
    mfaVerified: false,
    sessionExpiresAt: null,

    setAuth: (token, user, expiresAt) =>
        set({ accessToken: token, user, sessionExpiresAt: expiresAt, mfaVerified: true }),

    setMfaVerified: (v) => set({ mfaVerified: v }),

    logout: () =>
        set({ accessToken: null, user: null, mfaVerified: false, sessionExpiresAt: null }),
}));
