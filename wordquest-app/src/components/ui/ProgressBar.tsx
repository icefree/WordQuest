'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
    value: number;
    max: number;
    variant?: 'default' | 'health' | 'exp' | 'mana';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    animated?: boolean;
    className?: string;
}

export function ProgressBar({
    value,
    max,
    variant = 'default',
    size = 'md',
    showLabel = false,
    animated = true,
    className = '',
}: ProgressBarProps) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const sizeStyles = {
        sm: 'h-2',
        md: 'h-4',
        lg: 'h-6',
    };

    const getGradient = () => {
        switch (variant) {
            case 'health':
                if (percentage > 60) return 'from-green-500 to-emerald-400';
                if (percentage > 30) return 'from-yellow-500 to-amber-400';
                return 'from-red-500 to-rose-400';
            case 'exp':
                return 'from-purple-600 to-cyan-400';
            case 'mana':
                return 'from-blue-500 to-indigo-400';
            default:
                return 'from-purple-600 to-pink-500';
        }
    };

    return (
        <div className={`relative ${className}`}>
            <div
                className={`
          w-full rounded-full overflow-hidden
          bg-gray-800/80 border border-white/10
          ${sizeStyles[size]}
        `}
            >
                <motion.div
                    initial={animated ? { width: 0 } : { width: `${percentage}%` }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`
            h-full rounded-full bg-gradient-to-r ${getGradient()}
            relative overflow-hidden
          `}
                >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />

                    {/* Animated shimmer */}
                    {animated && (
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                        />
                    )}
                </motion.div>
            </div>

            {showLabel && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white drop-shadow-lg">
                        {Math.round(value)} / {max}
                    </span>
                </div>
            )}
        </div>
    );
}

interface HealthBarProps {
    current: number;
    max: number;
    label?: string;
    showNumbers?: boolean;
    className?: string;
}

export function HealthBar({
    current,
    max,
    label,
    showNumbers = true,
    className = '',
}: HealthBarProps) {
    const percentage = (current / max) * 100;

    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{label}</span>
                    {showNumbers && (
                        <span className="font-bold text-white">
                            {current} / {max}
                        </span>
                    )}
                </div>
            )}
            <div className="relative h-5 bg-gray-800 rounded-full overflow-hidden border-2 border-gray-700/50">
                <motion.div
                    initial={{ width: `${percentage}%` }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.3 }}
                    className={`
            h-full rounded-full relative
            ${percentage > 60
                            ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                            : percentage > 30
                                ? 'bg-gradient-to-r from-yellow-500 to-amber-400'
                                : 'bg-gradient-to-r from-red-500 to-rose-400'
                        }
          `}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
                </motion.div>
            </div>
        </div>
    );
}
