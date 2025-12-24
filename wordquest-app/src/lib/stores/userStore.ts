// ========================================
// User Store - Zustand
// ========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, GameProgress, LearningRecord } from '@/types';

interface UserState {
  // User Profile
  user: UserProfile;
  gameProgress: GameProgress;
  learningRecords: LearningRecord[];

  // Actions
  updateUser: (updates: Partial<UserProfile>) => void;
  addExp: (exp: number) => void;
  addGold: (gold: number) => void;
  updateStreak: () => void;
  updateGameProgress: (updates: Partial<GameProgress>) => void;
  addLearningRecord: (record: LearningRecord) => void;
  updateLearningRecord: (wordId: string, updates: Partial<LearningRecord>) => void;
  getLearningRecord: (wordId: string) => LearningRecord | undefined;
  incrementTodayLearned: () => void;
  incrementTodayReviewed: () => void;
  resetDailyStats: () => void;
}

// 经验值升级表
const EXP_TABLE = [
  0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,
  4000, 5000, 6200, 7600, 9200, 11000, 13000, 15200, 17600, 20200,
];

function calculateLevel(exp: number): number {
  for (let i = EXP_TABLE.length - 1; i >= 0; i--) {
    if (exp >= EXP_TABLE[i]) return i + 1;
  }
  return 1;
}

const initialUser: UserProfile = {
  id: 'local_user',
  username: '冒险者',
  level: 1,
  exp: 0,
  gold: 100,
  streakDays: 0,
  createdAt: new Date().toISOString(),
  todayLearned: 0,
  todayReviewed: 0,
};

const initialGameProgress: GameProgress = {
  dungeonFloor: 1,
  maxCombo: 0,
  totalKills: 0,
  bossKills: 0,
  pvpRating: 1000,
  achievements: [],
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: initialUser,
      gameProgress: initialGameProgress,
      learningRecords: [],

      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),

      addExp: (exp) =>
        set((state) => {
          const newExp = state.user.exp + exp;
          const newLevel = calculateLevel(newExp);
          return {
            user: {
              ...state.user,
              exp: newExp,
              level: newLevel,
            },
          };
        }),

      addGold: (gold) =>
        set((state) => ({
          user: {
            ...state.user,
            gold: state.user.gold + gold,
          },
        })),

      updateStreak: () =>
        set((state) => ({
          user: {
            ...state.user,
            streakDays: state.user.streakDays + 1,
          },
        })),

      updateGameProgress: (updates) =>
        set((state) => ({
          gameProgress: { ...state.gameProgress, ...updates },
        })),

      addLearningRecord: (record) =>
        set((state) => ({
          learningRecords: [...state.learningRecords, record],
        })),

      updateLearningRecord: (wordId, updates) =>
        set((state) => ({
          learningRecords: state.learningRecords.map((r) =>
            r.wordId === wordId ? { ...r, ...updates } : r
          ),
        })),

      getLearningRecord: (wordId) => {
        return get().learningRecords.find((r) => r.wordId === wordId);
      },

      incrementTodayLearned: () =>
        set((state) => ({
          user: {
            ...state.user,
            todayLearned: state.user.todayLearned + 1,
          },
        })),

      incrementTodayReviewed: () =>
        set((state) => ({
          user: {
            ...state.user,
            todayReviewed: state.user.todayReviewed + 1,
          },
        })),

      resetDailyStats: () =>
        set((state) => ({
          user: {
            ...state.user,
            todayLearned: 0,
            todayReviewed: 0,
          },
        })),
    }),
    {
      name: 'wordquest-user-storage',
    }
  )
);
