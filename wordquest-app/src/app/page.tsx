'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Swords,
  Sprout,
  RotateCcw,
  BookOpen,
  Trophy,
  Flame,
  Star,
  Coins,
  Target,
  Zap,
  TrendingUp,
  Clock,
  Trash2,
  Volume2,
} from 'lucide-react';
import { useUserStore } from '@/lib/stores/userStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

// 经验值升级表
const EXP_TABLE = [
  0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,
  4000, 5000, 6200, 7600, 9200, 11000, 13000, 15200, 17600, 20200,
];

export default function HomePage() {
  const { user, gameProgress, learningRecords, resetProgress } = useUserStore();

  const handleReset = () => {
    if (window.confirm('确定要重置所有学习进度吗？此操作不可撤销，你的金币、等级和农场植物都将被清空。')) {
      resetProgress();
    }
  };

  // 计算升级进度
  const currentLevelExp = EXP_TABLE[user.level - 1] || 0;
  const nextLevelExp = EXP_TABLE[user.level] || currentLevelExp + 1000;
  const expProgress = user.exp - currentLevelExp;
  const expNeeded = nextLevelExp - currentLevelExp;

  // 统计数据
  const masteredCount = learningRecords.filter(r => r.status === 'mastered').length;
  const learningCount = learningRecords.filter(r => r.status === 'learning' || r.status === 'reviewing').length;

  const featuredModes = [
    {
      name: '单词地下城',
      description: '化身冒险者，用词汇击败怪物！',
      icon: Swords,
      href: '/dungeon',
      gradient: 'from-purple-600 to-pink-600',
      shadowColor: 'shadow-purple-500/30',
    },
    {
      name: '单词农场',
      description: '播种单词，收获知识的果实',
      icon: Sprout,
      href: '/farm',
      gradient: 'from-green-600 to-emerald-600',
      shadowColor: 'shadow-green-500/30',
    },
    {
      name: '每日复习',
      description: '科学复习，巩固记忆',
      icon: RotateCcw,
      href: '/review',
      gradient: 'from-cyan-600 to-blue-600',
      shadowColor: 'shadow-cyan-500/30',
    },
  ];

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
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-12">
        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.h1
              className="text-5xl md:text-6xl font-black mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                WordQuest
              </span>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-400 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              词汇大冒险 · 让背单词像玩游戏一样上瘾
            </motion.p>

            {/* Quick Start Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/dungeon">
                <Button size="lg" icon={Swords} className="text-lg px-8 py-4">
                  开始冒险
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* User Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <Card glow className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar & Level */}
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white">
                      {user.username[0]}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-gray-900">
                      {user.level}
                    </div>
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{user.username}</h2>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>Lv.{user.level} 冒险者</span>
                      </div>
                      <button 
                        onClick={() => {
                          const utterance = new SpeechSynthesisUtterance('Welcome back, adventurer');
                          utterance.lang = 'en-US';
                          speechSynthesis.speak(utterance);
                        }}
                        className="p-1 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-colors"
                        title="测试发音"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* EXP Bar */}
                <div className="flex-1 w-full md:w-auto">
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

                {/* Stats */}
                <div className="flex gap-4">
                  <div className="text-center px-4 py-2 rounded-xl bg-orange-500/10">
                    <Flame className="w-5 h-5 mx-auto text-orange-400" />
                    <p className="text-lg font-bold text-white">{user.streakDays}</p>
                    <p className="text-xs text-gray-400">连续天数</p>
                  </div>
                  <div className="text-center px-4 py-2 rounded-xl bg-amber-500/10">
                    <Coins className="w-5 h-5 mx-auto text-amber-400" />
                    <p className="text-lg font-bold text-white">{user.gold}</p>
                    <p className="text-xs text-gray-400">金币</p>
                  </div>
                  <div className="text-center px-4 py-2 rounded-xl bg-purple-500/10">
                    <Trophy className="w-5 h-5 mx-auto text-purple-400" />
                    <p className="text-lg font-bold text-white">{gameProgress.dungeonFloor}</p>
                    <p className="text-xs text-gray-400">当前层</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-white mb-6 flex items-center gap-2"
          >
            <Zap className="w-6 h-6 text-amber-400" />
            选择游戏模式
          </motion.h2>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {featuredModes.map((mode) => (
              <motion.div key={mode.name} variants={item}>
                <Link href={mode.href}>
                  <Card hover glow className="h-full overflow-hidden group">
                    <CardContent className="p-6">
                      <div
                        className={`
                          w-16 h-16 rounded-2xl mb-4
                          bg-gradient-to-br ${mode.gradient}
                          flex items-center justify-center
                          shadow-lg ${mode.shadowColor}
                          group-hover:scale-110 transition-transform
                        `}
                      >
                        <mode.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{mode.name}</h3>
                      <p className="text-gray-400">{mode.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Today's Stats */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-white mb-6 flex items-center gap-2"
          >
            <Target className="w-6 h-6 text-green-400" />
            今日学习
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div variants={item} initial="hidden" animate="show">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{user.todayLearned}</p>
                    <p className="text-sm text-gray-400">今日学习</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={item} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{user.todayReviewed}</p>
                    <p className="text-sm text-gray-400">今日复习</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={item} initial="hidden" animate="show" transition={{ delay: 0.2 }}>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{learningCount}</p>
                    <p className="text-sm text-gray-400">学习中</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={item} initial="hidden" animate="show" transition={{ delay: 0.3 }}>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{masteredCount}</p>
                    <p className="text-sm text-gray-400">已掌握</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Clock className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">今日目标：学习 30 个单词</h3>
                  <p className="text-gray-400">已完成 {user.todayLearned} / 30</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href="/dungeon">
                  <Button variant="primary" icon={Swords}>
                    继续冒险
                  </Button>
                </Link>
                <Link href="/review">
                  <Button variant="secondary" icon={RotateCcw}>
                    复习单词
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-4">
              <ProgressBar
                value={user.todayLearned}
                max={30}
                variant="default"
                size="sm"
              />
            </div>
          </Card>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="px-6 py-8 opacity-50 hover:opacity-100 transition-opacity">
        <div className="max-w-6xl mx-auto flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            className="text-red-500 hover:bg-red-500/10"
            onClick={handleReset}
          >
            重置所有进度
          </Button>
        </div>
      </section>
    </div>
  );
}
