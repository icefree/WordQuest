import { Word, Wordbook } from '@/types';
import ketData from './KET_Vocab_Full_1076.json';

// Type for the JSON structure
interface RawKETWord {
  word: string;
  definition: string;
  image_url: string | null;
}

// Convert JSON data to our Word interface
const convertedWords: Word[] = (ketData as RawKETWord[]).map((raw, index) => ({
  id: `ket_${index}`,
  word: raw.word,
  meaning: '点击「获取提示」查看释义', // Default meaning before hint
  definitionEn: raw.definition,
  imageUrl: raw.image_url || undefined,
  difficulty: 2, // Standard KET difficulty
  wordbookId: 'ket-core',
  pronunciation: '', // Not provided in JSON
  example: '' // Not provided in JSON
}));

export const wordbooks: Wordbook[] = [
  {
    id: 'ket-core',
    name: 'KET 核心词汇',
    description: '剑桥少儿英语 KET 考试全量词汇',
    wordCount: convertedWords.length,
    difficulty: 'medium',
  },
];

export const words: Word[] = convertedWords;

// ===== Helper Functions =====
export function getWordById(id: string): Word | undefined {
  return words.find((w) => w.id === id);
}

export function getWordsByDifficulty(difficulty: 1 | 2 | 3 | 4 | 5): Word[] {
  return words.filter((w) => w.difficulty === difficulty);
}

export function getWordsByWordbook(wordbookId: string): Word[] {
  return words.filter((w) => w.wordbookId === wordbookId);
}

export function getRandomWords(count: number = 30): Word[] {
  // Use a cryptographically strong random sort for total chaos
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
