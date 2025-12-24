'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    RotateCcw,
    Check,
    X,
    ChevronRight,
    BookOpen,
    Brain,
    Sparkles,
    Trophy,
} from 'lucide-react';
import { useUserStore } from '@/lib/stores/userStore';
import { words, getRandomWords } from '@/lib/data/words';
import { Word } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface ReviewCard {
    word: Word;
    isFlipped: boolean;
    result?: 'correct' | 'wrong';
}

export default function ReviewPage() {
    const { incrementTodayReviewed, addExp, addGold } = useUserStore();

    const [reviewWords, setReviewWords] = useState<Word[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionStats, setSessionStats] = useState({
        correct: 0,
        wrong: 0,
        total: 0,
    });
    const [isSessionComplete, setIsSessionComplete] = useState(false);

    // 初始化复习单词
    useEffect(() => {
        const wordsToReview = getRandomWords(10);
        setReviewWords(wordsToReview);
        setSessionStats({ correct: 0, wrong: 0, total: wordsToReview.length });
    }, []);

    const currentWord = reviewWords[currentIndex];
    const progress = ((currentIndex) / reviewWords.length) * 100;

    // 翻转卡片
    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    // 标记结果
    const handleResult = (isCorrect: boolean) => {
        if (isCorrect) {
            setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
            addExp(5);
            addGold(2);
        } else {
            setSessionStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
        }

        incrementTodayReviewed();

        // 移动到下一个单词
        if (currentIndex < reviewWords.length - 1) {
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setIsFlipped(false);
            }, 300);
        } else {
            // 复习完成
            setIsSessionComplete(true);
        }
    };

    // 重新开始复习
    const handleRestart = () => {
        const newWords = getRandomWords(10);
        setReviewWords(newWords);
        setCurrentIndex(0);
        setIsFlipped(false);
        setSessionStats({ correct: 0, wrong: 0, total: newWords.length });
        setIsSessionComplete(false);
    };

    if (reviewWords.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-400">正在加载复习单词...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* 顶部导航栏 */}
            <header className="sticky top-0 z-40 bg-[var(--bg-dark)]/80 backdrop-blur-lg border-b border-purple-500/20">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost" size="sm" icon={ArrowLeft}>
                            返回
                        </Button>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                            <RotateCcw className="w-4 h-4 text-cyan-400" />
                            <span className="font-bold text-white">每日复习</span>
                        </div>

                        <div className="text-sm text-gray-400">
                            {currentIndex + 1} / {reviewWords.length}
                        </div>
                    </div>
                </div>

                {/* 进度条 */}
                <div className="max-w-4xl mx-auto px-4 pb-3">
                    <ProgressBar
                        value={currentIndex}
                        max={reviewWords.length}
                        variant="default"
                        size="sm"
                    />
                </div>
            </header>

            {/* 主内容区域 */}
            <main className="max-w-2xl mx-auto px-4 py-12">
                <AnimatePresence mode="wait">
                    {!isSessionComplete ? (
                        <motion.div
                            key={currentWord?.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* 复习卡片 */}
                            <div className="perspective-1000">
                                <motion.div
                                    className="relative w-full h-80 cursor-pointer"
                                    onClick={handleFlip}
                                    style={{ transformStyle: 'preserve-3d' }}
                                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {/* 正面 - 单词 */}
                                    <Card
                                        className="absolute inset-0 flex flex-col items-center justify-center backface-hidden"
                                        hover={false}
                                    >
                                        <CardContent className="text-center">
                                            <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                                            <h2 className="text-4xl font-bold text-white mb-4">
                                                {currentWord?.word}
                                            </h2>
                                            {currentWord?.pronunciation && (
                                                <p className="text-gray-400 text-lg mb-4">
                                                    {currentWord.pronunciation}
                                                </p>
                                            )}
                                            <p className="text-gray-500 text-sm mt-4">
                                                点击卡片查看释义
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* 背面 - 释义 */}
                                    <Card
                                        className="absolute inset-0 flex flex-col items-center justify-center backface-hidden"
                                        hover={false}
                                        style={{ transform: 'rotateY(180deg)' }}
                                    >
                                        <CardContent className="text-center">
                                            <BookOpen className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                                            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                                                {currentWord?.meaning}
                                            </h3>
                                            {currentWord?.example && (
                                                <p className="text-gray-400 text-sm italic">
                                                    "{currentWord.example}"
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* 操作按钮 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex justify-center gap-6 mt-8"
                            >
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    onClick={() => handleResult(false)}
                                    className="w-32 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                                >
                                    <X className="w-6 h-6 mr-2" />
                                    不认识
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="lg"
                                    onClick={() => handleResult(true)}
                                    className="w-32 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30"
                                >
                                    <Check className="w-6 h-6 mr-2" />
                                    认识
                                </Button>
                            </motion.div>

                            {/* 提示 */}
                            <p className="text-center text-gray-500 text-sm mt-6">
                                {!isFlipped ? '点击卡片翻转查看释义' : '选择你是否认识这个单词'}
                            </p>
                        </motion.div>
                    ) : (
                        /* 复习完成界面 */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="mb-6"
                            >
                                <span className="text-8xl">🎉</span>
                            </motion.div>

                            <h2 className="text-3xl font-bold text-white mb-2">复习完成！</h2>
                            <p className="text-gray-400 mb-8">做得很棒，继续保持！</p>

                            {/* 统计卡片 */}
                            <Card className="p-6 mb-8">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                                            <Check className="w-8 h-8 text-green-400" />
                                        </div>
                                        <p className="text-3xl font-bold text-green-400">{sessionStats.correct}</p>
                                        <p className="text-sm text-gray-400">认识</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2">
                                            <X className="w-8 h-8 text-red-400" />
                                        </div>
                                        <p className="text-3xl font-bold text-red-400">{sessionStats.wrong}</p>
                                        <p className="text-sm text-gray-400">不认识</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-2">
                                            <Trophy className="w-8 h-8 text-amber-400" />
                                        </div>
                                        <p className="text-3xl font-bold text-amber-400">
                                            {Math.round((sessionStats.correct / sessionStats.total) * 100)}%
                                        </p>
                                        <p className="text-sm text-gray-400">正确率</p>
                                    </div>
                                </div>
                            </Card>

                            {/* 获得奖励 */}
                            <Card className="p-4 mb-8 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/30">
                                <div className="flex items-center justify-center gap-4">
                                    <Sparkles className="w-5 h-5 text-amber-400" />
                                    <span className="text-gray-300">
                                        获得 <span className="text-purple-400 font-bold">{sessionStats.correct * 5} EXP</span> 和{' '}
                                        <span className="text-amber-400 font-bold">{sessionStats.correct * 2} 金币</span>
                                    </span>
                                </div>
                            </Card>

                            {/* 操作按钮 */}
                            <div className="flex justify-center gap-4">
                                <Button onClick={handleRestart} icon={RotateCcw}>
                                    继续复习
                                </Button>
                                <Link href="/">
                                    <Button variant="secondary" icon={ArrowLeft}>
                                        返回首页
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* 样式 */}
            <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
        </div>
    );
}
