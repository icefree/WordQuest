'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'success' | 'gold' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    loading?: boolean;
    children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            icon: Icon,
            iconPosition = 'left',
            loading = false,
            children,
            className = '',
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-semibold rounded-lg transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-dark)]
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

        const variantStyles = {
            primary: `
        bg-gradient-to-r from-purple-600 to-cyan-500
        text-white shadow-lg shadow-purple-500/30
        hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5
        focus:ring-purple-500
      `,
            secondary: `
        bg-[var(--bg-card)] border border-purple-500/30
        text-white
        hover:bg-[var(--bg-card-hover)] hover:border-purple-500
        focus:ring-purple-500
      `,
            success: `
        bg-gradient-to-r from-green-500 to-emerald-600
        text-white shadow-lg shadow-green-500/30
        hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5
        focus:ring-green-500
      `,
            gold: `
        bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500
        text-gray-900 shadow-lg shadow-amber-500/30
        hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5
        focus:ring-amber-500
      `,
            ghost: `
        bg-transparent text-gray-300
        hover:bg-white/10 hover:text-white
        focus:ring-purple-500
      `,
        };

        const sizeStyles = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-5 py-2.5 text-base',
            lg: 'px-8 py-3.5 text-lg',
        };

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.97 }}
                className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                )}
                {!loading && Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
                {children}
                {!loading && Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';
