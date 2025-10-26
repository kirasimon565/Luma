import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { pb } from '@/lib/pocketbase';
import { Record } from 'pocketbase';

interface AuthState {
  user: Record | null;
  token: string | null;
  isLoggedIn: () => boolean;
  login: (data: any) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: () => !!get().token,
      login: async (data) => {
        const { record: user, token } = await pb.collection('users').authWithPassword(data.email, data.password);
        set({ user, token });
      },
      logout: () => {
        pb.authStore.clear();
        set({ user: null, token: null });
      },
      register: async (data) => {
        const user = await pb.collection('users').create(data);
        set({ user, token: pb.authStore.token });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
