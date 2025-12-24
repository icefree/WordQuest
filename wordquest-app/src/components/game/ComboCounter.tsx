'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ComboCounterProps {
    combo: number;
    className?: string;
}

export function ComboCounter({ combo, className = '' }: ComboCounterProps) {
    if (combo < 2) return null;

    const getComboStyle = () => {
        if (combo >= 20) return {
            gradient: 'from-red-500 via-orange-500 to-yellow-500',
            glow: 'shadow-red-500/50',
            size: 'text-6xl',
            label: '🔥 超神连击！',
        };
        if (combo >= 10) return {
            gradient: 'from-orange-500 via-pink-500 to-purple-500',
            glow: 'shadow-orange-500/50',
            size: 'text-5xl',
            label: '⚡ 完美连击！',
        };
        if (combo >= 5) return {
            gradient: 'from-purple-500 via-pink-500 to-cyan-500',
            glow: 'shadow-purple-500/50',
            size: 'text-4xl',
            label: '✨ 连击不断！',
        };
        return {
            gradient: 'from-purple-600 to-cyan-500',
            glow: 'shadow-purple-500/30',
            size: 'text-3xl',
            label: 'Combo',
        };
    };

    const style = getComboStyle();

    return (
        <AnimatePresence>
            <motion.div
                key={combo}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`flex flex-col items-center ${className}`}
            >
                <motion.span
                    animate={combo >= 5 ? {
                        scale: [1, 1.1, 1],
                    } : {}}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className={`
            font-black ${style.size}
            bg-gradient-to-r ${style.gradient}
            bg-clip-text text-transparent
            drop-shadow-lg
          `}
                >
                    {combo}x
                </motion.span>
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`
            text-sm font-bold mt-1
            bg-gradient-to-r ${style.gradient}
            bg-clip-text text-transparent
          `}
                >
                    {style.label}
                </motion.span>
            </motion.div>
        </AnimatePresence>
    );
}

interface ComboMultiplierBadgeProps {
    combo: number;
}

export function ComboMultiplierBadge({ combo }: ComboMultiplierBadgeProps) {
    if (combo < 2) return null;

    const getMultiplier = () => {
        if (combo < 2) return 1;
        if (combo < 5) return 1.5;
        if (combo < 10) return 2;
        if (combo < 20) return 3;
        return 5;
    };

    const multiplier = getMultiplier();

    return (
        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`
        px-3 py-1 rounded-full
        bg-gradient-to-r from-amber-500 to-orange-500
        text-gray-900 font-bold text-sm
        shadow-lg shadow-amber-500/30
      `}
        >
            伤害 x{multiplier}
        </motion.div>
    );
}
