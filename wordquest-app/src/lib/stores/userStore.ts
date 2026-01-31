// ========================================
// User Store - Zustand
// ========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, GameProgress, LearningRecord, Plant, ExportedData } from '@/types';

interface UserState {
  // User Profile
  user: UserProfile;
  gameProgress: GameProgress;
  learningRecords: LearningRecord[];
  plants: Plant[];

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
  learnWord: (wordId: string) => void;
  setPlants: (plants: Plant[]) => void;
  processReviewResult: (wordId: string, isCorrect: boolean) => void;
  resetProgress: () => void;
  exportProgress: () => ExportedData;
  importProgress: (data: ExportedData) => void;
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
      plants: [],

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

      // 新增：学习并播种单词
      learnWord: (wordId: string) => {
        const state = get();
        const existingRecord = state.learningRecords.find(r => r.wordId === wordId);

        if (!existingRecord) {
          const newRecord: LearningRecord = {
            id: `record_${Date.now()}_${wordId}`,
            wordId,
            memoryStrength: 0.2,
            reviewCount: 0,
            correctCount: 1,
            lastReviewAt: new Date().toISOString(),
            nextReviewAt: new Date(Date.now() + 86400000).toISOString(), // 明天复习
            status: 'learning'
          };

          const newPlant: Plant = {
            wordId,
            stage: 'seed',
            lastWateredAt: new Date().toISOString(),
            waterCount: 0
          };

          set((state) => ({
            learningRecords: [...state.learningRecords, newRecord],
            plants: state.plants.length < 12 ? [...state.plants, newPlant] : state.plants,
          }));
        } else {
          // 如果已存在，更新记忆强度和次数
          state.updateLearningRecord(wordId, {
            correctCount: existingRecord.correctCount + 1,
            memoryStrength: Math.min(1, existingRecord.memoryStrength + 0.1),
            lastReviewAt: new Date().toISOString(),
          });
        }
      },

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

      setPlants: (plants: Plant[]) => set({ plants }),

      processReviewResult: (wordId: string, isCorrect: boolean) => {
        const state = get();
        const record = state.learningRecords.find(r => r.wordId === wordId);
        if (!record) return;

        const updates: Partial<LearningRecord> = {
          reviewCount: record.reviewCount + 1,
          lastReviewAt: new Date().toISOString(),
          correctCount: isCorrect ? record.correctCount + 1 : record.correctCount,
          memoryStrength: isCorrect 
            ? Math.min(1, record.memoryStrength + 0.15) 
            : Math.max(0, record.memoryStrength - 0.1),
        };

        // 状态晋级逻辑
        if (updates.memoryStrength! >= 0.9) {
          updates.status = 'mastered';
        } else if (updates.memoryStrength! >= 0.5) {
          updates.status = 'reviewing';
        } else {
          updates.status = 'learning';
        }

        state.updateLearningRecord(wordId, updates);
      },

      resetProgress: () => {
        set({
          user: initialUser,
          gameProgress: initialGameProgress,
          learningRecords: [],
          plants: [],
        });
      },

      exportProgress: () => {
        const state = get();
        return {
          user: state.user,
          gameProgress: state.gameProgress,
          learningRecords: state.learningRecords,
          plants: state.plants,
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
        };
      },

      importProgress: (data) => {
        set({
          user: data.user,
          gameProgress: data.gameProgress,
          learningRecords: data.learningRecords,
          plants: data.plants,
        });
      },
    }),
    {
      name: 'wordquest-user-storage',
    }
  )
);
