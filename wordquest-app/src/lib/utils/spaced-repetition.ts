// ========================================
// Spaced Repetition Algorithm
// Based on SuperMemo SM-2 Algorithm
// ========================================

import { LearningRecord, LearningStatus, Word } from '@/types';

// 复习间隔（天数）
const REVIEW_INTERVALS = [1, 3, 7, 15, 30, 60];

/**
 * 计算新的记忆强度
 * @param currentStrength 当前记忆强度 (0-1)
 * @param isCorrect 是否答对
 * @param responseTime 响应时间（毫秒）
 * @param difficulty 单词难度 (1-5)
 */
export function calculateMemoryStrength(
  currentStrength: number,
  isCorrect: boolean,
  responseTime: number,
  difficulty: number
): number {
  // 基础变化量
  let delta = 0;

  if (isCorrect) {
    // 答对：增加记忆强度
    // 响应越快，增加越多
    const speedBonus = responseTime < 3000 ? 0.1 : responseTime < 5000 ? 0.05 : 0;
    delta = 0.15 + speedBonus;

    // 难度越高，增加越少
    delta *= (6 - difficulty) / 5;
  } else {
    // 答错：降低记忆强度
    delta = -0.2;

    // 难度越高，降低越多
    delta *= 1 + (difficulty - 1) * 0.1;
  }

  // 计算新强度，限制在 0-1 之间
  const newStrength = Math.max(0, Math.min(1, currentStrength + delta));
  
  return Math.round(newStrength * 100) / 100;
}

/**
 * 计算下次复习时间
 * @param memoryStrength 记忆强度 (0-1)
 * @param reviewCount 已复习次数
 */
export function calculateNextReview(
  memoryStrength: number,
  reviewCount: number
): Date {
  let intervalDays: number;

  if (memoryStrength < 0.3) {
    // 记忆较弱，需要尽快复习
    intervalDays = 0; // 当天复习
  } else if (memoryStrength < 0.5) {
    intervalDays = REVIEW_INTERVALS[0]; // 1天后
  } else if (memoryStrength < 0.7) {
    const index = Math.min(reviewCount, 2);
    intervalDays = REVIEW_INTERVALS[index];
  } else if (memoryStrength < 0.9) {
    const index = Math.min(reviewCount, 4);
    intervalDays = REVIEW_INTERVALS[index];
  } else {
    // 已掌握
    intervalDays = REVIEW_INTERVALS[5] || 60;
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);
  nextDate.setHours(0, 0, 0, 0);
  
  return nextDate;
}

/**
 * 确定学习状态
 * @param memoryStrength 记忆强度
 * @param reviewCount 复习次数
 */
export function determineStatus(
  memoryStrength: number,
  reviewCount: number
): LearningStatus {
  if (reviewCount === 0) return 'new';
  if (memoryStrength >= 0.8 && reviewCount >= 3) return 'mastered';
  if (memoryStrength >= 0.5) return 'reviewing';
  return 'learning';
}

/**
 * 创建新的学习记录
 */
export function createLearningRecord(wordId: string): LearningRecord {
  const now = new Date().toISOString();
  return {
    id: `lr_${wordId}_${Date.now()}`,
    wordId,
    memoryStrength: 0,
    reviewCount: 0,
    correctCount: 0,
    lastReviewAt: now,
    nextReviewAt: now, // 立即可复习
    status: 'new',
  };
}

/**
 * 更新学习记录
 */
export function updateLearningRecord(
  record: LearningRecord,
  isCorrect: boolean,
  responseTime: number,
  difficulty: number
): LearningRecord {
  const newStrength = calculateMemoryStrength(
    record.memoryStrength,
    isCorrect,
    responseTime,
    difficulty
  );

  const newReviewCount = record.reviewCount + 1;
  const nextReview = calculateNextReview(newStrength, newReviewCount);
  const newStatus = determineStatus(newStrength, newReviewCount);

  return {
    ...record,
    memoryStrength: newStrength,
    reviewCount: newReviewCount,
    correctCount: record.correctCount + (isCorrect ? 1 : 0),
    lastReviewAt: new Date().toISOString(),
    nextReviewAt: nextReview.toISOString(),
    status: newStatus,
  };
}

/**
 * 获取今日需要复习的单词
 */
export function getTodayReviewWords(
  records: LearningRecord[],
  allWords: Word[]
): Word[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const needReviewIds = records
    .filter((r) => {
      const nextReview = new Date(r.nextReviewAt);
      nextReview.setHours(0, 0, 0, 0);
      return nextReview <= now && r.status !== 'mastered';
    })
    .map((r) => r.wordId);

  return allWords.filter((w) => needReviewIds.includes(w.id));
}

/**
 * 获取学习统计
 */
export function getStudyStats(records: LearningRecord[]) {
  const total = records.length;
  const mastered = records.filter((r) => r.status === 'mastered').length;
  const learning = records.filter((r) => r.status === 'learning').length;
  const reviewing = records.filter((r) => r.status === 'reviewing').length;
  const newWords = records.filter((r) => r.status === 'new').length;

  const avgStrength =
    total > 0
      ? records.reduce((sum, r) => sum + r.memoryStrength, 0) / total
      : 0;

  const totalCorrect = records.reduce((sum, r) => sum + r.correctCount, 0);
  const totalReviews = records.reduce((sum, r) => sum + r.reviewCount, 0);
  const correctRate = totalReviews > 0 ? totalCorrect / totalReviews : 0;

  return {
    total,
    mastered,
    learning,
    reviewing,
    newWords,
    avgStrength: Math.round(avgStrength * 100),
    correctRate: Math.round(correctRate * 100),
  };
}
