// ========================================
// Game Store - Zustand
// ========================================

import { create } from 'zustand';
import { DungeonState, Monster, Word, CombatResult, FeedbackEvent } from '@/types';
import { getRandomWords } from '@/lib/data/words';

interface GameState {
  // Dungeon State
  dungeon: DungeonState;
  currentWord: Word | null;
  inputValue: string;
  startTime: number;
  feedbackEvents: FeedbackEvent[];

  // Monster pool for current floor
  remainingWords: Word[];

  // Actions
  initDungeon: () => void;
  spawnMonster: () => void;
  setInputValue: (value: string) => void;
  submitAnswer: () => CombatResult;
  takeDamage: (damage: number) => void;
  nextWord: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  addFeedback: (event: FeedbackEvent) => void;
  clearFeedback: () => void;
}

// 怪物名字池
const MONSTER_NAMES = [
  '哥布林', '史莱姆', '骷髅兵', '蝙蝠', '毒蜘蛛',
  '狼人', '石像鬼', '幽灵', '食人花', '小恶魔',
];

const BOSS_NAMES = [
  '遗忘之王', '词汇暴君', '语法魔王', '拼写噩梦', '记忆吞噬者',
];

function createMonster(floor: number, isBoss: boolean): Monster {
  const wordCount = isBoss ? 10 : Math.min(3 + Math.floor(floor / 3), 8);
  const monsterWords = getRandomWords(wordCount);
  
  const baseHp = isBoss ? 100 + floor * 20 : 30 + floor * 5;
  const namePool = isBoss ? BOSS_NAMES : MONSTER_NAMES;
  
  return {
    id: `monster_${Date.now()}`,
    name: namePool[Math.floor(Math.random() * namePool.length)],
    maxHp: baseHp,
    currentHp: baseHp,
    isBoss,
    words: monsterWords,
  };
}

const initialDungeon: DungeonState = {
  currentFloor: 1,
  currentMonster: null,
  playerHp: 100,
  maxPlayerHp: 100,
  combo: 0,
  score: 0,
  isGameOver: false,
  isPaused: false,
};

export const useGameStore = create<GameState>()((set, get) => ({
  dungeon: initialDungeon,
  currentWord: null,
  inputValue: '',
  startTime: 0,
  feedbackEvents: [],
  remainingWords: [],

  initDungeon: () => {
    set({
      dungeon: { ...initialDungeon },
      currentWord: null,
      inputValue: '',
      remainingWords: [],
    });
    get().spawnMonster();
  },

  spawnMonster: () => {
    const { dungeon } = get();
    const isBoss = dungeon.currentFloor % 10 === 0;
    const monster = createMonster(dungeon.currentFloor, isBoss);
    
    set({
      dungeon: { ...dungeon, currentMonster: monster },
      remainingWords: [...monster.words],
      currentWord: monster.words[0],
      startTime: Date.now(),
      inputValue: '',
    });
  },

  setInputValue: (value) => set({ inputValue: value.toLowerCase() }),

  submitAnswer: () => {
    const { dungeon, currentWord, inputValue, startTime, remainingWords } = get();
    const responseTime = Date.now() - startTime;
    
    if (!currentWord || !dungeon.currentMonster) {
      return {
        isCorrect: false,
        damageDealt: 0,
        damageReceived: 0,
        expGained: 0,
        goldGained: 0,
        comboCount: 0,
      };
    }

    const isCorrect = inputValue.trim().toLowerCase() === currentWord.word.toLowerCase();
    
    let result: CombatResult;

    if (isCorrect) {
      // 计算连击倍率
      const combo = dungeon.combo;
      let comboMultiplier = 1;
      if (combo >= 20) comboMultiplier = 5;
      else if (combo >= 10) comboMultiplier = 3;
      else if (combo >= 5) comboMultiplier = 2;
      else if (combo >= 2) comboMultiplier = 1.5;
      const baseDamage = 10 + currentWord.difficulty * 2;
      const damageDealt = Math.floor(baseDamage * comboMultiplier);
      const newCombo = dungeon.combo + 1;
      
      // 速度奖励
      const speedBonus = responseTime < 3000 ? 2 : responseTime < 5000 ? 1 : 0;
      const expGained = 10 + currentWord.difficulty * 2 + speedBonus;
      const goldGained = 5 + Math.floor(newCombo / 3);

      // 更新怪物血量
      const newMonsterHp = Math.max(0, dungeon.currentMonster.currentHp - damageDealt);
      const monsterDead = newMonsterHp <= 0;

      result = {
        isCorrect: true,
        damageDealt,
        damageReceived: 0,
        expGained,
        goldGained,
        comboCount: newCombo,
      };

      set((state) => ({
        dungeon: {
          ...state.dungeon,
          currentMonster: state.dungeon.currentMonster
            ? { ...state.dungeon.currentMonster, currentHp: newMonsterHp }
            : null,
          combo: newCombo,
          score: state.dungeon.score + damageDealt + expGained,
        },
      }));

      // 添加成功反馈
      get().addFeedback({ type: 'correct', value: expGained, duration: 1000 });

      if (newCombo > 1 && newCombo % 5 === 0) {
        get().addFeedback({ type: 'combo', value: newCombo, duration: 1500 });
      }

      // 怪物死亡处理
      if (monsterDead) {
        if (dungeon.currentMonster.isBoss) {
          get().addFeedback({ type: 'bossDefeated', duration: 2000 });
        }
        
        // 进入下一层
        setTimeout(() => {
          set((state) => ({
            dungeon: {
              ...state.dungeon,
              currentFloor: state.dungeon.currentFloor + 1,
            },
          }));
          get().spawnMonster();
        }, 1500);
      } else {
        // 下一个单词
        get().nextWord();
      }
    } else {
      // 答错处理
      const damageReceived = 10 + dungeon.currentFloor;
      const newPlayerHp = Math.max(0, dungeon.playerHp - damageReceived);

      result = {
        isCorrect: false,
        damageDealt: 0,
        damageReceived,
        expGained: 0,
        goldGained: 0,
        comboCount: 0,
      };

      set((state) => ({
        dungeon: {
          ...state.dungeon,
          playerHp: newPlayerHp,
          combo: 0,
          isGameOver: newPlayerHp <= 0,
        },
      }));

      get().addFeedback({ type: 'wrong', message: currentWord.word, duration: 2000 });

      if (newPlayerHp <= 0) {
        // 游戏结束
      } else {
        // 不再自动跳转，让用户看提示并重新输入
      }
    }

    return result;
  },

  takeDamage: (damage) =>
    set((state) => ({
      dungeon: {
        ...state.dungeon,
        playerHp: Math.max(0, state.dungeon.playerHp - damage),
        isGameOver: state.dungeon.playerHp - damage <= 0,
      },
    })),

  nextWord: () => {
    const { remainingWords, dungeon } = get();
    
    if (remainingWords.length <= 1) {
      // 怪物没词了，直接击杀
      if (dungeon.currentMonster) {
        set((state) => ({
          dungeon: {
            ...state.dungeon,
            currentMonster: state.dungeon.currentMonster
              ? { ...state.dungeon.currentMonster, currentHp: 0 }
              : null,
            currentFloor: state.dungeon.currentFloor + 1,
          },
        }));
        get().spawnMonster();
      }
      return;
    }

    const newRemaining = remainingWords.slice(1);
    set({
      remainingWords: newRemaining,
      currentWord: newRemaining[0],
      inputValue: '',
      startTime: Date.now(),
    });
  },

  pauseGame: () =>
    set((state) => ({
      dungeon: { ...state.dungeon, isPaused: true },
    })),

  resumeGame: () =>
    set((state) => ({
      dungeon: { ...state.dungeon, isPaused: false },
    })),

  resetGame: () => {
    set({
      dungeon: { ...initialDungeon },
      currentWord: null,
      inputValue: '',
      remainingWords: [],
      feedbackEvents: [],
    });
  },

  addFeedback: (event) =>
    set((state) => ({
      feedbackEvents: [...state.feedbackEvents, event],
    })),

  clearFeedback: () => set({ feedbackEvents: [] }),
}));
