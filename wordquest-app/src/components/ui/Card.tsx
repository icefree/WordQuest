'use client';

import { motion } from 'framer-motion';
import { ReactNode, CSSProperties } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    glow?: boolean;
    onClick?: () => void;
    style?: CSSProperties;
}

export function Card({
    children,
    className = '',
    hover = true,
    glow = false,
    onClick,
    style,
}: CardProps) {
    return (
        <motion.div
            whileHover={hover ? { y: -4, scale: 1.02 } : {}}
            whileTap={onClick ? { scale: 0.98 } : {}}
            onClick={onClick}
            style={style}
            className={`
        bg-[var(--bg-card)] rounded-2xl
        border border-purple-500/20 backdrop-blur-md
        transition-all duration-300
        ${hover ? 'hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10' : ''}
        ${glow ? 'shadow-lg shadow-purple-500/20' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
        >
            {children}
        </motion.div>
    );
}

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
    return (
        <div className={`px-6 py-4 border-b border-purple-500/20 ${className}`}>
            {children}
        </div>
    );
}

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
    return <div className={`p-6 ${className}`}>{children}</div>;
}

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
    return (
        <div className={`px-6 py-4 border-t border-purple-500/20 ${className}`}>
            {children}
        </div>
    );
}
