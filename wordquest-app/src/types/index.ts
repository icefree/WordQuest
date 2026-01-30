// ========================================
// WordQuest Type Definitions
// ========================================

// ===== Word Types =====
export interface Word {
  id: string;
  word: string;
  meaning: string;
  definitionEn?: string;
  imageUrl?: string;
  pronunciation?: string;
  example?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  wordbookId?: string;
}

export interface Wordbook {
  id: string;
  name: string;
  description: string;
  wordCount: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

// ===== Learning Record Types =====
export type LearningStatus = 'new' | 'learning' | 'reviewing' | 'mastered';

export interface LearningRecord {
  id: string;
  wordId: string;
  memoryStrength: number; // 0-1
  reviewCount: number;
  correctCount: number;
  lastReviewAt: string;
  nextReviewAt: string;
  status: LearningStatus;
}

// ===== User Types =====
export interface UserProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  level: number;
  exp: number;
  gold: number;
  streakDays: number;
  createdAt: string;
  todayLearned: number;
  todayReviewed: number;
}

// ===== Game Types =====
export interface GameProgress {
  dungeonFloor: number;
  maxCombo: number;
  totalKills: number;
  bossKills: number;
  pvpRating: number;
  achievements: string[];
}

export interface Monster {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  imageUrl?: string;
  isBoss: boolean;
  words: Word[];
}

export interface DungeonState {
  currentFloor: number;
  currentMonster: Monster | null;
  playerHp: number;
  maxPlayerHp: number;
  combo: number;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
}

// ===== Combat Result =====
export interface CombatResult {
  isCorrect: boolean;
  damageDealt: number;
  damageReceived: number;
  expGained: number;
  goldGained: number;
  comboCount: number;
}

// ===== Plant/Farm Types =====
export type PlantStage = 'seed' | 'sprout' | 'growing' | 'mature' | 'flower' | 'wilting';

export interface Plant {
  wordId: string;
  stage: PlantStage;
  lastWateredAt: string;
  waterCount: number;
}

export interface FarmState {
  plants: Plant[];
  maxPlots: number;
  waterRemaining: number;
  maxWaterPerDay: number;
}

// ===== Achievement Types =====
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  target: number;
  unlockedAt?: string;
}

// ===== Review Session Types =====
export interface ReviewSession {
  totalWords: number;
  completedWords: number;
  correctCount: number;
  wrongWords: Word[];
  startTime: string;
  endTime?: string;
}

// ===== Feedback Types =====
export type FeedbackType = 'correct' | 'wrong' | 'combo' | 'levelUp' | 'achievement' | 'bossDefeated';

export interface FeedbackEvent {
  type: FeedbackType;
  message?: string;
  value?: number;
  duration?: number;
}

// ===== Statistics Types =====
export interface DailyStats {
  date: string;
  wordsLearned: number;
  wordsReviewed: number;
  correctRate: number;
  studyTime: number; // in minutes
  expGained: number;
  goldGained: number;
}

export interface OverallStats {
  totalWordsLearned: number;
  totalWordsMastered: number;
  longestStreak: number;
  currentStreak: number;
  totalStudyTime: number; // in minutes
  averageCorrectRate: number;
  dungeonHighestFloor: number;
  maxCombo: number;
}
