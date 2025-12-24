'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Monster as MonsterType } from '@/types';
import { HealthBar } from '@/components/ui/ProgressBar';
import { Skull, Crown } from 'lucide-react';

interface MonsterProps {
    monster: MonsterType;
    isHit?: boolean;
    className?: string;
}

export function Monster({ monster, isHit = false, className = '' }: MonsterProps) {
    // 根据怪物类型选择 emoji
    const monsterEmojis: Record<string, string> = {
        '哥布林': '👺',
        '史莱姆': '🟢',
        '骷髅兵': '💀',
        '蝙蝠': '🦇',
        '毒蜘蛛': '🕷️',
        '狼人': '🐺',
        '石像鬼': '🗿',
        '幽灵': '👻',
        '食人花': '🌺',
        '小恶魔': '😈',
        '遗忘之王': '👑',
        '词汇暴君': '🔥',
        '语法魔王': '⚡',
        '拼写噩梦': '💀',
        '记忆吞噬者': '🌀',
    };

    const emoji = monsterEmojis[monster.name] || (monster.isBoss ? '👹' : '👾');
    const hpPercentage = (monster.currentHp / monster.maxHp) * 100;

    return (
        <motion.div
            className={`flex flex-col items-center ${className}`}
            animate={isHit ? { x: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
        >
            {/* Boss 标识 */}
            {monster.isBoss && (
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-2 mb-2"
                >
                    <Crown className="w-6 h-6 text-amber-400" />
                    <span className="text-amber-400 font-bold text-lg">BOSS</span>
                    <Crown className="w-6 h-6 text-amber-400" />
                </motion.div>
            )}

            {/* 怪物名字 */}
            <motion.h3
                className={`
          text-xl font-bold mb-2
          ${monster.isBoss
                        ? 'text-amber-400 text-shadow-lg'
                        : 'text-white'
                    }
        `}
            >
                {monster.name}
            </motion.h3>

            {/* 怪物图像 */}
            <motion.div
                className={`
          relative w-40 h-40 flex items-center justify-center
          rounded-full
          ${monster.isBoss
                        ? 'bg-gradient-to-br from-amber-500/20 to-red-500/20 border-2 border-amber-500/50'
                        : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30'
                    }
        `}
                animate={isHit ? {
                    filter: ['brightness(1)', 'brightness(3)', 'brightness(1)'],
                    scale: [1, 0.95, 1],
                } : {}}
                transition={{ duration: 0.3 }}
            >
                {/* 背景光效 */}
                <motion.div
                    className={`
            absolute inset-0 rounded-full
            ${monster.isBoss
                            ? 'bg-gradient-to-br from-amber-500/10 to-red-500/10'
                            : 'bg-gradient-to-br from-purple-500/10 to-cyan-500/10'
                        }
          `}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />

                {/* 怪物 Emoji */}
                <motion.span
                    className={`text-7xl ${monster.isBoss ? 'text-8xl' : ''}`}
                    animate={monster.isBoss ? {
                        y: [0, -5, 0],
                        rotate: [0, -5, 5, 0],
                    } : {
                        y: [0, -3, 0],
                    }}
                    transition={{ repeat: Infinity, duration: monster.isBoss ? 3 : 2 }}
                >
                    {emoji}
                </motion.span>

                {/* 受击特效 */}
                <AnimatePresence>
                    {isHit && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 rounded-full border-4 border-red-500"
                        />
                    )}
                </AnimatePresence>
            </motion.div>

            {/* 血条 */}
            <div className="w-48 mt-4">
                <HealthBar
                    current={monster.currentHp}
                    max={monster.maxHp}
                    label={monster.isBoss ? '⚔️ BOSS HP' : '❤️ HP'}
                    showNumbers={true}
                />
            </div>

            {/* 剩余单词数 */}
            <motion.div
                className="mt-2 flex items-center gap-1 text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <Skull className="w-4 h-4" />
                <span>剩余 {monster.words.length} 个单词</span>
            </motion.div>
        </motion.div>
    );
}

// 怪物死亡动画组件
interface MonsterDeathProps {
    onComplete: () => void;
}

export function MonsterDeath({ onComplete }: MonsterDeathProps) {
    return (
        <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{
                opacity: 0,
                scale: 1.5,
                rotate: [0, 10, -10, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            onAnimationComplete={onComplete}
            className="text-8xl"
        >
            💥
        </motion.div>
    );
}
