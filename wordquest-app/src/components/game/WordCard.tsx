'use client';

import { motion } from 'framer-motion';
import { Word } from '@/types';
import { Volume2 } from 'lucide-react';

interface WordCardProps {
    word: Word;
    showWord?: boolean;
    showExample?: boolean;
    className?: string;
}

export function WordCard({
    word,
    showWord = false,
    showExample = false,
    className = '',
}: WordCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`
        relative p-8 rounded-2xl
        bg-gradient-to-br from-purple-900/40 to-indigo-900/40
        border-2 border-purple-500/30
        backdrop-blur-lg
        ${className}
      `}
        >
            {/* 装饰性光效 */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <motion.div
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                />
            </div>

            <div className="relative z-10 space-y-4">
                {/* 中文释义 - 主要显示内容 */}
                <motion.div
                    key={word.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                >
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                        {word.meaning}
                    </p>
                </motion.div>

                {/* 音标 */}
                {word.pronunciation && (
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Volume2 className="w-4 h-4" />
                        <span className="text-sm">{word.pronunciation}</span>
                    </div>
                )}

                {/* 单词显示（答对后显示） */}
                {showWord && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <span className="text-2xl font-bold text-green-400">{word.word}</span>
                    </motion.div>
                )}

                {/* 例句 */}
                {showExample && word.example && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-gray-400 text-center italic"
                    >
                        "{word.example}"
                    </motion.p>
                )}

                {/* 难度指示器 */}
                <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                        <motion.div
                            key={level}
                            className={`
                w-2 h-2 rounded-full
                ${level <= word.difficulty
                                    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                                    : 'bg-gray-700'
                                }
              `}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: level * 0.05 }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

interface WordInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    disabled?: boolean;
    isCorrect?: boolean | null;
    placeholder?: string;
}

export function WordInput({
    value,
    onChange,
    onSubmit,
    disabled = false,
    isCorrect = null,
    placeholder = '输入单词...',
}: WordInputProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !disabled) {
            onSubmit();
        }
    };

    const getBorderColor = () => {
        if (isCorrect === true) return 'border-green-500 shadow-green-500/30';
        if (isCorrect === false) return 'border-red-500 shadow-red-500/30';
        return 'border-purple-500/50 focus:border-purple-400';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
        >
            <motion.input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                placeholder={placeholder}
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                animate={isCorrect === false ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`
          w-full px-6 py-4 text-2xl text-center font-mono
          bg-gray-900/80 rounded-xl
          border-2 ${getBorderColor()}
          text-white placeholder-gray-500
          focus:outline-none focus:shadow-lg
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
            />

            {/* 提交提示 */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-gray-500 text-sm mt-2"
            >
                按 <kbd className="px-2 py-0.5 bg-gray-700 rounded text-gray-300">Enter</kbd> 提交答案
            </motion.p>
        </motion.div>
    );
}
