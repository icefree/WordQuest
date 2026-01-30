'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Pause,
    Play,
    RotateCcw,
    Zap,
    Star,
    Coins,
    Trophy,
    Lightbulb,
} from 'lucide-react';
import { useGameStore } from '@/lib/stores/gameStore';
import { useUserStore } from '@/lib/stores/userStore';
import { Monster } from '@/components/game/Monster';
import { WordCard, WordInput } from '@/components/game/WordCard';
import { ComboCounter, ComboMultiplierBadge } from '@/components/game/ComboCounter';
import { FeedbackOverlay } from '@/components/game/FeedbackOverlay';
import { HealthBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function DungeonPage() {
    const {
        dungeon,
        currentWord,
        inputValue,
        feedbackEvents,
        setInputValue,
        submitAnswer,
        initDungeon,
        pauseGame,
        resumeGame,
        resetGame,
        clearFeedback,
    } = useGameStore();

    const { user, addExp, addGold, updateGameProgress, incrementTodayLearned, learnWord } = useUserStore();

    const [isHit, setIsHit] = useState(false);
    const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
    const [showGameOver, setShowGameOver] = useState(false);
    const [showVictory, setShowVictory] = useState(false);
    const [showHint, setShowHint] = useState(false);

    // 初始化游戏
    useEffect(() => {
        initDungeon();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 切换单词时重置提示
    useEffect(() => {
        setShowHint(false);
    }, [currentWord?.id]);

    // 检查游戏结束
    useEffect(() => {
        if (dungeon.isGameOver) {
            setShowGameOver(true);
        }
    }, [dungeon.isGameOver]);

    // 更新最高记录
    useEffect(() => {
        if (dungeon.combo > 0) {
            updateGameProgress({
                maxCombo: Math.max(dungeon.combo, user.level > 0 ? dungeon.combo : 0),
            });
        }
    }, [dungeon.combo, updateGameProgress, user.level]);

    // 清理反馈事件
    useEffect(() => {
        if (feedbackEvents.length > 0) {
            const timer = setTimeout(clearFeedback, 2000);
            return () => clearTimeout(timer);
        }
    }, [feedbackEvents, clearFeedback]);

    // 提交答案处理
    const handleSubmit = useCallback(() => {
        if (!currentWord || dungeon.isPaused || dungeon.isGameOver) return;

        const result = submitAnswer();
        setLastResult(result.isCorrect ? 'correct' : 'wrong');

        if (result.isCorrect) {
            setIsHit(true);
            setTimeout(() => setIsHit(false), 400);

            // 更新用户数据
            addExp(result.expGained);
            addGold(result.goldGained);
            incrementTodayLearned();
            learnWord(currentWord.id);
        } else {
            // 第一次输入错误后自动显示提示并自动朗读
            setShowHint(true);
            
            // 自动朗读
            const utterance = new SpeechSynthesisUtterance(currentWord.word);
            utterance.lang = 'en-US';
            speechSynthesis.speak(utterance);
        }

        // 重置答题状态
        setTimeout(() => {
            setLastResult(null);
        }, 500);
    }, [currentWord, dungeon.isPaused, dungeon.isGameOver, submitAnswer, addExp, addGold, incrementTodayLearned, learnWord]);

    // 重新开始游戏
    const handleRestart = () => {
        setShowGameOver(false);
        setShowVictory(false);
        resetGame();
        initDungeon();
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* 反馈特效层 */}
            <FeedbackOverlay events={feedbackEvents} onClear={clearFeedback} />

            {/* 顶部导航栏 */}
            <header className="sticky top-0 z-40 bg-[var(--bg-dark)]/80 backdrop-blur-lg border-b border-purple-500/20">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost" size="sm" icon={ArrowLeft}>
                            返回
                        </Button>
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* 楼层显示 */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            <span className="font-bold text-white">第 {dungeon.currentFloor} 层</span>
                        </div>

                        {/* 分数 */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="font-bold text-white">{dungeon.score}</span>
                        </div>

                        {/* 暂停按钮 */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={dungeon.isPaused ? resumeGame : pauseGame}
                            icon={dungeon.isPaused ? Play : Pause}
                        />
                    </div>
                </div>
            </header>

            {/* 主内容区域 */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* 玩家状态栏 */}
                <div className="mb-8 flex items-center gap-6">
                    {/* 玩家血条 */}
                    <div className="flex-1">
                        <HealthBar
                            current={dungeon.playerHp}
                            max={dungeon.maxPlayerHp}
                            label="❤️ 冒险者 HP"
                            showNumbers
                        />
                    </div>

                    {/* 连击显示 */}
                    <div className="flex items-center gap-3">
                        <ComboCounter combo={dungeon.combo} />
                        <ComboMultiplierBadge combo={dungeon.combo} />
                    </div>
                </div>

                {/* 战斗区域 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* 怪物区域 */}
                    <div className="flex justify-center">
                        {dungeon.currentMonster && (
                            <Monster monster={dungeon.currentMonster} isHit={isHit} />
                        )}
                    </div>

                    {/* 答题区域 */}
                    <div className="space-y-6">
                        {/* 单词卡片 */}
                        {currentWord && (
                            <AnimatePresence mode="wait">
                                <WordCard
                                    key={currentWord.id}
                                    word={currentWord}
                                    showWord={lastResult === 'wrong'}
                                    showHint={showHint}
                                />
                            </AnimatePresence>
                        )}

                        {/* 输入框和提示按钮 */}
                        <div className="space-y-4">
                            <WordInput
                                value={inputValue}
                                onChange={setInputValue}
                                onSubmit={handleSubmit}
                                disabled={dungeon.isPaused || dungeon.isGameOver}
                                isCorrect={lastResult === null ? null : lastResult === 'correct'}
                            />

                            <div className="flex justify-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowHint(true)}
                                    disabled={showHint || dungeon.isPaused || dungeon.isGameOver}
                                    icon={Lightbulb}
                                    className="text-amber-400 hover:bg-amber-400/10"
                                >
                                    获取提示
                                </Button>
                            </div>
                        </div>

                        {/* 提示信息 */}
                        <div className="flex justify-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-amber-400" />
                                连击: {dungeon.combo}
                            </span>
                            <span className="flex items-center gap-1">
                                <Coins className="w-4 h-4 text-amber-400" />
                                金币: {user.gold}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Boss 提示 */}
                {dungeon.currentFloor % 10 === 0 && dungeon.currentMonster?.isBoss && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-center"
                    >
                        <p className="text-red-400 font-bold">🔥 BOSS 战！击败他获得丰厚奖励！</p>
                    </motion.div>
                )}
            </main>

            {/* 暂停覆盖层 */}
            <AnimatePresence>
                {dungeon.isPaused && !dungeon.isGameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
                    >
                        <Card className="p-8 text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">游戏暂停</h2>
                            <p className="text-gray-400 mb-6">休息一下，准备好了继续冒险！</p>
                            <div className="flex gap-4 justify-center">
                                <Button onClick={resumeGame} icon={Play}>
                                    继续游戏
                                </Button>
                                <Button variant="secondary" onClick={handleRestart} icon={RotateCcw}>
                                    重新开始
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 游戏结束覆盖层 */}
            <AnimatePresence>
                {showGameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                        >
                            <Card className="p-8 text-center max-w-md">
                                <motion.div
                                    initial={{ y: -20 }}
                                    animate={{ y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <span className="text-6xl">💀</span>
                                </motion.div>

                                <h2 className="text-3xl font-bold text-red-400 mt-4 mb-2">游戏结束</h2>
                                <p className="text-gray-400 mb-6">冒险者倒下了...</p>

                                {/* 战斗统计 */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="p-3 rounded-lg bg-purple-500/10">
                                        <p className="text-2xl font-bold text-white">{dungeon.currentFloor}</p>
                                        <p className="text-xs text-gray-400">到达层数</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-amber-500/10">
                                        <p className="text-2xl font-bold text-white">{dungeon.score}</p>
                                        <p className="text-xs text-gray-400">获得分数</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-orange-500/10">
                                        <p className="text-2xl font-bold text-white">{dungeon.combo}</p>
                                        <p className="text-xs text-gray-400">最高连击</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <Button onClick={handleRestart} icon={RotateCcw}>
                                        再来一次
                                    </Button>
                                    <Link href="/">
                                        <Button variant="secondary" icon={ArrowLeft}>
                                            返回首页
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 连击火焰边框效果 */}
            {dungeon.combo >= 10 && (
                <motion.div
                    className="fixed inset-0 pointer-events-none z-30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        boxShadow: `inset 0 0 ${dungeon.combo * 3}px rgba(249, 115, 22, ${Math.min(0.5, dungeon.combo * 0.02)})`,
                    }}
                />
            )}
        </div>
    );
}
