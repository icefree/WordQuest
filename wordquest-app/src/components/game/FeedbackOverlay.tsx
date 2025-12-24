'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FeedbackEvent } from '@/types';
import { CheckCircle, XCircle, Flame, Trophy, Star } from 'lucide-react';

interface FeedbackOverlayProps {
    events: FeedbackEvent[];
    onClear: () => void;
}

export function FeedbackOverlay({ events }: FeedbackOverlayProps) {
    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            <AnimatePresence>
                {events.map((event, index) => (
                    <FeedbackItem key={`${event.type}-${index}`} event={event} index={index} />
                ))}
            </AnimatePresence>
        </div>
    );
}

interface FeedbackItemProps {
    event: FeedbackEvent;
    index: number;
}

function FeedbackItem({ event, index }: FeedbackItemProps) {
    switch (event.type) {
        case 'correct':
            return <CorrectFeedback value={event.value} />;
        case 'wrong':
            return <WrongFeedback correctWord={event.message} />;
        case 'combo':
            return <ComboFeedback value={event.value || 0} />;
        case 'levelUp':
            return <LevelUpFeedback />;
        case 'achievement':
            return <AchievementFeedback message={event.message} />;
        case 'bossDefeated':
            return <BossDefeatedFeedback />;
        default:
            return null;
    }
}

function CorrectFeedback({ value }: { value?: number }) {
    return (
        <>
            {/* 屏幕边缘绿色闪光 */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
                style={{
                    boxShadow: 'inset 0 0 100px rgba(34, 197, 94, 0.5)',
                }}
            />

            {/* 分数飞出 */}
            <motion.div
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={{ opacity: 0, y: -100, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <div className="flex items-center gap-2 text-green-400 font-bold text-3xl">
                    <CheckCircle className="w-8 h-8" />
                    <span>+{value || 10} EXP</span>
                </div>
            </motion.div>

            {/* 粒子效果 */}
            <Particles color="green" />
        </>
    );
}

function WrongFeedback({ correctWord }: { correctWord?: string }) {
    return (
        <>
            {/* 屏幕边缘红色闪光 */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
                style={{
                    boxShadow: 'inset 0 0 100px rgba(239, 68, 68, 0.5)',
                }}
            />

            {/* 错误提示 */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <div className="flex flex-col items-center gap-2 p-6 bg-red-500/20 rounded-2xl border border-red-500/50 backdrop-blur-lg">
                    <XCircle className="w-12 h-12 text-red-400" />
                    <span className="text-red-400 font-bold text-xl">答错了！</span>
                    {correctWord && (
                        <span className="text-white text-lg">
                            正确答案: <span className="text-green-400 font-bold">{correctWord}</span>
                        </span>
                    )}
                </div>
            </motion.div>
        </>
    );
}

function ComboFeedback({ value }: { value: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2"
        >
            <div className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl border border-orange-500/50 backdrop-blur-lg">
                <Flame className="w-10 h-10 text-orange-400 animate-pulse" />
                <div>
                    <p className="text-orange-400 font-black text-4xl">{value}x COMBO!</p>
                    <p className="text-orange-300 text-sm">连击不断！</p>
                </div>
            </div>
        </motion.div>
    );
}

function LevelUpFeedback() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50"
        >
            <div className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-3xl border border-amber-500/50 backdrop-blur-lg">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                >
                    <Star className="w-20 h-20 text-amber-400 fill-amber-400" />
                </motion.div>
                <p className="text-amber-400 font-black text-4xl">LEVEL UP!</p>
                <p className="text-amber-300 text-lg">恭喜升级！</p>
            </div>
        </motion.div>
    );
}

function AchievementFeedback({ message }: { message?: string }) {
    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute top-4 right-4"
        >
            <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/50 backdrop-blur-lg">
                <Trophy className="w-8 h-8 text-amber-400" />
                <div>
                    <p className="text-amber-400 font-bold">成就解锁！</p>
                    <p className="text-white text-sm">{message}</p>
                </div>
            </div>
        </motion.div>
    );
}

function BossDefeatedFeedback() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60"
        >
            <div className="flex flex-col items-center gap-4 p-10">
                <motion.span
                    className="text-[100px]"
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -10, 10, 0],
                    }}
                    transition={{ duration: 0.5, repeat: 3 }}
                >
                    🎊
                </motion.span>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl font-black bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
                >
                    BOSS 击败！
                </motion.p>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl text-amber-300"
                >
                    获得稀有奖励！
                </motion.p>
            </div>
        </motion.div>
    );
}

// 粒子效果组件
function Particles({ color }: { color: 'green' | 'gold' | 'purple' }) {
    const colorClasses = {
        green: 'bg-green-400',
        gold: 'bg-amber-400',
        purple: 'bg-purple-400',
    };

    return (
        <>
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 1,
                        x: '50vw',
                        y: '50vh',
                        scale: 1,
                    }}
                    animate={{
                        opacity: 0,
                        x: `calc(50vw + ${(Math.random() - 0.5) * 200}px)`,
                        y: `calc(50vh + ${(Math.random() - 0.5) * 200}px)`,
                        scale: 0,
                    }}
                    transition={{
                        duration: 0.8,
                        delay: i * 0.02,
                        ease: 'easeOut',
                    }}
                    className={`absolute w-3 h-3 rounded-full ${colorClasses[color]}`}
                />
            ))}
        </>
    );
}

// 分数弹出组件
interface ScorePopupProps {
    score: number;
    x: number;
    y: number;
}

export function ScorePopup({ score, x, y }: ScorePopupProps) {
    return (
        <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -50, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute pointer-events-none font-bold text-2xl text-amber-400"
            style={{ left: x, top: y }}
        >
            +{score}
        </motion.div>
    );
}
