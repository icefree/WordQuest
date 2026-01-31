'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    User,
    Trophy,
    Star,
    Flame,
    Coins,
    BookOpen,
    Target,
    Zap,
    Award,
    TrendingUp,
    Calendar,
    Edit2,
    Download,
    Upload,
    Database,
    Trash2,
} from 'lucide-react';
import { useUserStore } from '@/lib/stores/userStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

// 成就列表
const ACHIEVEMENTS = [
    {
        id: 'first_word',
        name: '初出茅庐',
        description: '学习第一个单词',
        icon: '📚',
        unlocked: true,
    },
    {
        id: 'combo_5',
        name: '连击新手',
        description: '达成 5 连击',
        icon: '⚡',
        unlocked: true,
    },
    {
        id: 'combo_10',
        name: '连击达人',
        description: '达成 10 连击',
        icon: '🔥',
        unlocked: false,
    },
    {
        id: 'floor_10',
        name: '地下城探索者',
        description: '到达地下城第 10 层',
        icon: '🏰',
        unlocked: false,
    },
    {
        id: 'boss_kill',
        name: 'Boss 猎人',
        description: '击败第一个 Boss',
        icon: '👑',
        unlocked: false,
    },
    {
        id: 'streak_7',
        name: '坚持不懈',
        description: '连续学习 7 天',
        icon: '📆',
        unlocked: false,
    },
    {
        id: 'mastered_50',
        name: '词汇收藏家',
        description: '掌握 50 个单词',
        icon: '🎯',
        unlocked: false,
    },
    {
        id: 'perfect_review',
        name: '完美复习',
        description: '复习全对 10 个单词',
        icon: '✨',
        unlocked: false,
    },
];

// 经验值升级表
const EXP_TABLE = [
    0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,
    4000, 5000, 6200, 7600, 9200, 11000, 13000, 15200, 17600, 20200,
];

export default function ProfilePage() {
    const { user, gameProgress, learningRecords, exportProgress, importProgress, resetProgress } = useUserStore();

    const handleExport = () => {
        const data = exportProgress();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `wordquest-progress-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                // 简单的验证
                if (data.user && data.learningRecords) {
                    if (confirm('导入将覆盖当前所有进度，确定要继续吗？')) {
                        importProgress(data);
                        alert('进度导入成功！');
                        window.location.reload(); // 刷新页面以确保所有状态同步
                    }
                } else {
                    alert('无效的备份文件');
                }
            } catch (err) {
                console.error('Import error:', err);
                alert('读取文件失败');
            }
        };
        reader.readAsText(file);
    };

    const handleReset = () => {
        if (confirm('确定要重置所有进度吗？此操作不可撤销！')) {
            resetProgress();
            alert('进度已重置');
        }
    };

    // 计算升级进度
    const currentLevelExp = EXP_TABLE[user.level - 1] || 0;
    const nextLevelExp = EXP_TABLE[user.level] || currentLevelExp + 1000;
    const expProgress = user.exp - currentLevelExp;
    const expNeeded = nextLevelExp - currentLevelExp;

    // 学习统计
    const stats = {
        totalLearned: learningRecords.length,
        mastered: learningRecords.filter(r => r.status === 'mastered').length,
        learning: learningRecords.filter(r => r.status === 'learning' || r.status === 'reviewing').length,
        correctRate: learningRecords.length > 0
            ? Math.min(100, Math.round(
                (learningRecords.reduce((sum, r) => sum + r.correctCount, 0) /
                    Math.max(1, learningRecords.reduce((sum, r) => sum + r.reviewCount, 0))) * 100
            ))
            : 0,
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen pb-8">
            {/* 顶部导航栏 */}
            <header className="sticky top-0 z-40 bg-[var(--bg-dark)]/80 backdrop-blur-lg border-b border-purple-500/20">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost" size="sm" icon={ArrowLeft}>
                            返回
                        </Button>
                    </Link>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30">
                        <User className="w-4 h-4 text-purple-400" />
                        <span className="font-bold text-white">个人中心</span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* 用户信息卡片 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card glow className="p-6 mb-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* 头像 */}
                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-4xl font-bold text-white"
                                >
                                    {user.username[0]}
                                </motion.div>
                                <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-lg font-bold text-gray-900 border-4 border-[var(--bg-dark)]">
                                    {user.level}
                                </div>
                                <button className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 hover:bg-purple-500/30 transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* 用户信息 */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-2xl font-bold text-white mb-1">{user.username}</h1>
                                <p className="text-gray-400 mb-4">Lv.{user.level} 冒险者</p>

                                {/* 经验条 */}
                                <div className="max-w-md">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">经验值</span>
                                        <span className="text-purple-400">{expProgress} / {expNeeded}</span>
                                    </div>
                                    <ProgressBar
                                        value={expProgress}
                                        max={expNeeded}
                                        variant="exp"
                                        size="md"
                                    />
                                </div>
                            </div>

                            {/* 主要数据 */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                    <Flame className="w-6 h-6 mx-auto text-orange-400 mb-1" />
                                    <p className="text-xl font-bold text-white">{user.streakDays}</p>
                                    <p className="text-xs text-gray-400">连续天数</p>
                                </div>
                                <div className="text-center px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <Coins className="w-6 h-6 mx-auto text-amber-400 mb-1" />
                                    <p className="text-xl font-bold text-white">{user.gold}</p>
                                    <p className="text-xs text-gray-400">金币</p>
                                </div>
                                <div className="text-center px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                    <Star className="w-6 h-6 mx-auto text-purple-400 fill-purple-400 mb-1" />
                                    <p className="text-xl font-bold text-white">{user.exp}</p>
                                    <p className="text-xs text-gray-400">总经验</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* 学习统计 */}
                <motion.section
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="mb-8"
                >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        学习统计
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <motion.div variants={item}>
                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{stats.totalLearned}</p>
                                        <p className="text-sm text-gray-400">已学单词</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div variants={item}>
                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                        <Target className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{stats.mastered}</p>
                                        <p className="text-sm text-gray-400">已掌握</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div variants={item}>
                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{stats.learning}</p>
                                        <p className="text-sm text-gray-400">学习中</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div variants={item}>
                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                        <Award className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{stats.correctRate}%</p>
                                        <p className="text-sm text-gray-400">正确率</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </motion.section>

                {/* 游戏数据 */}
                <motion.section
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="mb-8"
                >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-400" />
                        游戏数据
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <motion.div variants={item}>
                            <Card className="p-4 text-center">
                                <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                    {gameProgress.dungeonFloor}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">地下城层数</p>
                            </Card>
                        </motion.div>

                        <motion.div variants={item}>
                            <Card className="p-4 text-center">
                                <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                    {gameProgress.maxCombo}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">最高连击</p>
                            </Card>
                        </motion.div>

                        <motion.div variants={item}>
                            <Card className="p-4 text-center">
                                <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                    {gameProgress.totalKills}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">击杀怪物</p>
                            </Card>
                        </motion.div>

                        <motion.div variants={item}>
                            <Card className="p-4 text-center">
                                <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                                    {gameProgress.bossKills}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">击杀 Boss</p>
                            </Card>
                        </motion.div>
                    </div>
                </motion.section>

                {/* 成就系统 */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-400" />
                        成就
                        <span className="text-sm text-gray-400 font-normal">
                            ({ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length})
                        </span>
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ACHIEVEMENTS.map((achievement, index) => (
                            <motion.div
                                key={achievement.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    className={`p-4 ${achievement.unlocked ? '' : 'opacity-50 grayscale'}`}
                                    hover={achievement.unlocked}
                                >
                                    <div className="text-center">
                                        <motion.span
                                            className="text-3xl block mb-2"
                                            animate={achievement.unlocked ? { scale: [1, 1.1, 1] } : {}}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        >
                                            {achievement.icon}
                                        </motion.span>
                                        <h3 className="font-bold text-white text-sm mb-1">{achievement.name}</h3>
                                        <p className="text-xs text-gray-400">{achievement.description}</p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* 最近活动 */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8"
                >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-cyan-400" />
                        今日数据
                    </h2>

                    <Card className="p-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">今日学习</p>
                                <p className="text-3xl font-bold text-white">{user.todayLearned} <span className="text-sm font-normal text-gray-400">个单词</span></p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-1">今日复习</p>
                                <p className="text-3xl font-bold text-white">{user.todayReviewed} <span className="text-sm font-normal text-gray-400">个单词</span></p>
                            </div>
                        </div>
                    </Card>
                </motion.section>

                {/* 数据管理 */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                >
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5 text-purple-400" />
                        数据管理
                    </h2>

                    <Card className="p-6 border-red-500/20">
                        <div className="flex flex-col md:flex-row gap-4">
                            <Button 
                                onClick={handleExport}
                                icon={Download}
                                className="flex-1 bg-purple-600 hover:bg-purple-700"
                            >
                                导出备份
                            </Button>
                            
                            <div className="flex-1 relative">
                                <Button 
                                    icon={Upload}
                                    variant="secondary"
                                    className="w-full border-purple-500/30 hover:bg-purple-500/10"
                                >
                                    导入备份
                                </Button>
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleImport}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>

                            <Button 
                                onClick={handleReset}
                                icon={Trash2}
                                variant="ghost"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                                重置所有进度
                            </Button>
                        </div>
                        <p className="mt-4 text-xs text-gray-500 text-center">
                            提示：备份文件包含您的学习记录、游戏进度和个人资产。建议定期备份以防数据丢失。
                        </p>
                    </Card>
                </motion.section>
            </main>
        </div>
    );
}
