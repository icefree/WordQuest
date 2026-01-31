'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Word } from '@/types';
import { Volume2, Image as ImageIcon } from 'lucide-react';

interface WordCardProps {
    word: Word;
    showWord?: boolean;
    showHint?: boolean;
    showExample?: boolean;
    className?: string;
}

export function WordCard({
    word,
    showWord = false,
    showHint = false,
    showExample = false,
    className = '',
}: WordCardProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`
        relative p-8 rounded-2xl
        bg-gradient-to-br from-purple-900/40 to-indigo-900/40
        border-2 border-purple-500/30
        backdrop-blur-lg min-h-[220px] flex flex-col justify-center
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
                {/* 单词图片 */}
                {showHint && word.imageUrl && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex justify-center mb-4"
                    >
                        <div className="relative w-32 h-32">
                            {!imageError ? (
                                <Image
                                    src={word.imageUrl}
                                    alt={word.word}
                                    fill
                                    unoptimized
                                    className="object-cover rounded-xl border-2 border-purple-500/50 shadow-lg shadow-purple-500/20"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-purple-900/30 rounded-xl border-2 border-purple-500/30 shadow-lg shadow-purple-500/10">
                                    <ImageIcon className="w-12 h-12 text-purple-400/50" />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* 释义显示区域 */}
                <motion.div
                    key={word.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center space-y-2"
                >
                    {/* 默认显示题目（可以是英文定义或占位符） */}
                    {!showHint ? (
                        <p className="text-xl text-purple-100 font-medium italic px-4">
                            {word.definitionEn || "Guess the word!"}
                        </p>
                    ) : (
                        <>
                            {word.definitionEn && (
                                <p className="text-lg text-purple-200/70 italic px-4">
                                    {word.definitionEn}
                                </p>
                            )}
                            {word.meaning && word.meaning !== word.definitionEn && (
                                <p className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                                    {word.meaning}
                                </p>
                            )}
                            {word.translation && (
                                <p className="text-2xl font-bold text-cyan-400 mt-2">
                                    {word.translation}
                                </p>
                            )}
                        </>
                    )}
                </motion.div>

                {/* 发音按钮 - 即使数据中没有音标也允许播放读音 */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(word.word);
                        utterance.lang = 'en-US';
                        speechSynthesis.speak(utterance);
                    }}
                    className="flex items-center justify-center gap-2 text-purple-300/80 hover:text-purple-200 transition-colors mx-auto px-4 py-2 rounded-full hover:bg-purple-500/10"
                    title="点击播放读音"
                >
                    <Volume2 className="w-4 h-4" />
                    {word.pronunciation ? (
                        <span className="text-sm font-mono tracking-wide">/{word.pronunciation}/</span>
                    ) : (
                        <span className="text-xs uppercase tracking-tighter">Listen</span>
                    )}
                </motion.button>

                {/* 单词显示（答对后或出错后显示） */}
                {showWord && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-2"
                    >
                        <div className="text-2xl font-bold text-green-400">{word.word}</div>
                        {word.translation && (
                            <div className="text-lg text-cyan-300">{word.translation}</div>
                        )}
                    </motion.div>
                )}

                {/* 例句 */}
                {showExample && word.example && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-gray-400 text-center italic"
                    >
                        &ldquo;{word.example}&rdquo;
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

export const WordInput = forwardRef<HTMLInputElement, WordInputProps>(({
    value,
    onChange,
    onSubmit,
    disabled = false,
    isCorrect = null,
    placeholder = '输入单词...',
}, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!);

    useEffect(() => {
        if (!disabled && isCorrect === null) {
            inputRef.current?.focus();
        }
    }, [disabled, isCorrect]);

    const lastSubmitTime = useRef(0);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !disabled) {
            const now = Date.now();
            if (now - lastSubmitTime.current > 500) { // 500ms 防抖
                lastSubmitTime.current = now;
                onSubmit();
            }
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
                ref={inputRef}
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
});

WordInput.displayName = 'WordInput';
