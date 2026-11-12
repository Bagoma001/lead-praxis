import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Student, Lecturer, DepartmentAdmin, SuperAdmin } from '@/types';

interface AuthState {
  user: User | Student | Lecturer | DepartmentAdmin | SuperAdmin | null;
  isAuthenticated: boolean;
  setUser: (user: User | Student | Lecturer | DepartmentAdmin | SuperAdmin) => void;
  clearUser: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },

      clearUser: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
