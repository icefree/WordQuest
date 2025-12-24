'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Swords,
    Sprout,
    RotateCcw,
    Home,
    User,
    Trophy,
    Settings,
    Flame,
    Star,
    Coins,
} from 'lucide-react';
import { useUserStore } from '@/lib/stores/userStore';

interface NavItem {
    name: string;
    href: string;
    icon: typeof Home;
}

const navItems: NavItem[] = [
    { name: '首页', href: '/', icon: Home },
    { name: '地下城', href: '/dungeon', icon: Swords },
    { name: '农场', href: '/farm', icon: Sprout },
    { name: '复习', href: '/review', icon: RotateCcw },
    { name: '我的', href: '/profile', icon: User },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, gameProgress } = useUserStore();

    return (
        <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--bg-dark-secondary)] border-r border-purple-500/20 flex flex-col"
        >
            {/* Logo */}
            <div className="p-6 border-b border-purple-500/20">
                <Link href="/">
                    <motion.h1
                        whileHover={{ scale: 1.02 }}
                        className="text-2xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
                    >
                        ⚔️ WordQuest
                    </motion.h1>
                </Link>
                <p className="text-gray-500 text-sm mt-1">词汇大冒险</p>
            </div>

            {/* User Stats */}
            <div className="p-4 border-b border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xl font-bold">
                        {user.username[0]}
                    </div>
                    <div>
                        <p className="font-bold text-white">{user.username}</p>
                        <div className="flex items-center gap-1 text-amber-400 text-sm">
                            <Star className="w-4 h-4 fill-amber-400" />
                            <span>Lv.{user.level}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 rounded-lg bg-purple-500/10">
                        <Flame className="w-4 h-4 mx-auto text-orange-400" />
                        <p className="text-xs text-gray-400 mt-1">连续</p>
                        <p className="font-bold text-white">{user.streakDays}天</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-purple-500/10">
                        <Coins className="w-4 h-4 mx-auto text-amber-400" />
                        <p className="text-xs text-gray-400 mt-1">金币</p>
                        <p className="font-bold text-white">{user.gold}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-purple-500/10">
                        <Trophy className="w-4 h-4 mx-auto text-purple-400" />
                        <p className="text-xs text-gray-400 mt-1">层数</p>
                        <p className="font-bold text-white">{gameProgress.dungeonFloor}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${isActive
                                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25'
                                        : 'text-gray-400 hover:bg-purple-500/10 hover:text-white'
                                    }
                `}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="ml-auto w-2 h-2 rounded-full bg-white"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-purple-500/20">
                <Link href="/settings">
                    <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-purple-500/10 hover:text-white transition-all"
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">设置</span>
                    </motion.div>
                </Link>

                {/* Version */}
                <p className="text-center text-gray-600 text-xs mt-4">
                    WordQuest MVP v0.1.0
                </p>
            </div>
        </motion.aside>
    );
}
