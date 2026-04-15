import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import type { LoginRequest, LoginResponse, User } from '@/types/auth';

type AuthState = {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (creds: LoginRequest) => Promise<void>;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (creds) => {
                set({ isLoading: true });
                try {
                    const { data } = await api.post<LoginResponse>('/auth/login', creds);
                    const { accessToken, refreshToken, ...user } = data;
                    set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
                } catch (err) {
                    set({ isLoading: false });
                    throw err;
                }
            },

            logout: () => set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
            }),
        }),
        {
            name: 'auth-storage',
            partialize: (s) => ({
                user: s.user,
                accessToken: s.accessToken,
                refreshToken: s.refreshToken,
                isAuthenticated: s.isAuthenticated,
            }),
        }
    )
);
