'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Droplets,
    Sprout,
    Flower2,
    TreePine,
    Sparkles,
    Sun,
    Clock,
} from 'lucide-react';
import { useUserStore } from '@/lib/stores/userStore';
import { words } from '@/lib/data/words';
import { Plant, PlantStage, Word } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

// 植物阶段配置
const PLANT_STAGES: Record<PlantStage, { emoji: string; label: string; color: string }> = {
    seed: { emoji: '🌰', label: '种子', color: 'text-amber-600' },
    sprout: { emoji: '🌱', label: '发芽', color: 'text-green-400' },
    growing: { emoji: '🌿', label: '成长中', color: 'text-green-500' },
    mature: { emoji: '🌳', label: '成熟', color: 'text-green-600' },
    flower: { emoji: '🌸', label: '开花', color: 'text-pink-400' },
    wilting: { emoji: '🥀', label: '枯萎', color: 'text-red-400' },
};

// 生成示例农场数据
function generateFarmData(words: Word[]): Plant[] {
    const stages: PlantStage[] = ['seed', 'sprout', 'growing', 'mature', 'flower'];
    return words.slice(0, 12).map((word, index) => ({
        wordId: word.id,
        stage: stages[index % stages.length],
        lastWateredAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
        waterCount: Math.floor(Math.random() * 5),
    }));
}

export default function FarmPage() {
    const { learningRecords } = useUserStore();
    const [plants, setPlants] = useState<Plant[]>([]);
    const [waterRemaining, setWaterRemaining] = useState(5);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

    // 初始化农场
    useEffect(() => {
        const farmPlants = generateFarmData(words);
        setPlants(farmPlants);
    }, []);

    // 获取单词信息
    const getWordForPlant = (plant: Plant): Word | undefined => {
        return words.find(w => w.id === plant.wordId);
    };

    // 浇水
    const handleWater = (plant: Plant) => {
        if (waterRemaining <= 0) return;

        setPlants(prevPlants =>
            prevPlants.map(p => {
                if (p.wordId === plant.wordId) {
                    // 升级植物阶段
                    const stageOrder: PlantStage[] = ['seed', 'sprout', 'growing', 'mature', 'flower'];
                    const currentIndex = stageOrder.indexOf(p.stage);
                    const nextStage = currentIndex < stageOrder.length - 1
                        ? stageOrder[currentIndex + 1]
                        : p.stage;

                    return {
                        ...p,
                        stage: nextStage,
                        lastWateredAt: new Date().toISOString(),
                        waterCount: p.waterCount + 1,
                    };
                }
                return p;
            })
        );

        setWaterRemaining(prev => prev - 1);
        setSelectedPlant(null);
    };

    // 收获（开花的植物）
    const handleHarvest = (plant: Plant) => {
        if (plant.stage !== 'flower') return;

        setPlants(prevPlants => prevPlants.filter(p => p.wordId !== plant.wordId));
        setSelectedPlant(null);
        // 这里可以添加获得金币等奖励
    };

    // 统计
    const stats = {
        total: plants.length,
        flowers: plants.filter(p => p.stage === 'flower').length,
        growing: plants.filter(p => ['sprout', 'growing', 'mature'].includes(p.stage)).length,
        seeds: plants.filter(p => p.stage === 'seed').length,
    };

    return (
        <div className="min-h-screen">
            {/* 顶部导航栏 */}
            <header className="sticky top-0 z-40 bg-[var(--bg-dark)]/80 backdrop-blur-lg border-b border-purple-500/20">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost" size="sm" icon={ArrowLeft}>
                            返回
                        </Button>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                            <Sprout className="w-4 h-4 text-green-400" />
                            <span className="font-bold text-white">单词农场</span>
                        </div>

                        {/* 浇水次数 */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                            <Droplets className="w-4 h-4 text-cyan-400" />
                            <span className="font-bold text-white">{waterRemaining}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* 主内容 */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* 农场统计 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <TreePine className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-white">{stats.total}</p>
                                <p className="text-xs text-gray-400">总植物</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                                <Flower2 className="w-5 h-5 text-pink-400" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-white">{stats.flowers}</p>
                                <p className="text-xs text-gray-400">待收获</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <Sprout className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-white">{stats.growing}</p>
                                <p className="text-xs text-gray-400">生长中</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                <Droplets className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-white">{waterRemaining}/5</p>
                                <p className="text-xs text-gray-400">今日浇水</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* 农场区域 */}
                <Card className="p-6">
                    <CardHeader className="px-0 pt-0 pb-4 border-b-0">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Sun className="w-5 h-5 text-amber-400" />
                                我的词汇花园
                            </h2>
                            <p className="text-sm text-gray-400">
                                点击植物进行浇水或收获
                            </p>
                        </div>
                    </CardHeader>

                    {/* 植物网格 */}
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {plants.map((plant, index) => {
                            const word = getWordForPlant(plant);
                            const stageInfo = PLANT_STAGES[plant.stage];

                            return (
                                <motion.div
                                    key={plant.wordId}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedPlant(plant)}
                                    className={`
                    relative p-4 rounded-2xl cursor-pointer
                    bg-gradient-to-br from-green-500/10 to-emerald-500/10
                    border-2 transition-all
                    ${selectedPlant?.wordId === plant.wordId
                                            ? 'border-green-400 shadow-lg shadow-green-500/20'
                                            : 'border-green-500/20 hover:border-green-500/40'
                                        }
                  `}
                                >
                                    {/* 植物 emoji */}
                                    <motion.div
                                        className="text-5xl text-center mb-2"
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{ repeat: Infinity, duration: 2, delay: index * 0.1 }}
                                    >
                                        {stageInfo.emoji}
                                    </motion.div>

                                    {/* 单词 */}
                                    <p className="text-sm font-bold text-white text-center truncate">
                                        {word?.word || '???'}
                                    </p>

                                    {/* 阶段标签 */}
                                    <p className={`text-xs text-center mt-1 ${stageInfo.color}`}>
                                        {stageInfo.label}
                                    </p>

                                    {/* 开花标识 */}
                                    {plant.stage === 'flower' && (
                                        <motion.div
                                            className="absolute -top-2 -right-2"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                        >
                                            <Sparkles className="w-5 h-5 text-amber-400" />
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}

                        {/* 空地块 */}
                        {plants.length < 12 && Array.from({ length: 12 - plants.length }).map((_, i) => (
                            <div
                                key={`empty-${i}`}
                                className="p-4 rounded-2xl border-2 border-dashed border-gray-700 flex items-center justify-center min-h-[120px]"
                            >
                                <p className="text-gray-600 text-sm">空地</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* 选中植物的操作面板 */}
                {selectedPlant && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--bg-dark)]/95 backdrop-blur-lg border-t border-purple-500/20"
                    >
                        <div className="max-w-2xl mx-auto">
                            <Card className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl">{PLANT_STAGES[selectedPlant.stage].emoji}</span>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">
                                                {getWordForPlant(selectedPlant)?.word}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {getWordForPlant(selectedPlant)?.meaning}
                                            </p>
                                            <p className={`text-xs mt-1 ${PLANT_STAGES[selectedPlant.stage].color}`}>
                                                阶段: {PLANT_STAGES[selectedPlant.stage].label} · 已浇水 {selectedPlant.waterCount} 次
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {selectedPlant.stage === 'flower' ? (
                                            <Button
                                                variant="gold"
                                                onClick={() => handleHarvest(selectedPlant)}
                                                icon={Sparkles}
                                            >
                                                收获 (+50金币)
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => handleWater(selectedPlant)}
                                                disabled={waterRemaining <= 0}
                                                icon={Droplets}
                                            >
                                                浇水
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            onClick={() => setSelectedPlant(null)}
                                        >
                                            关闭
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {/* 说明区域 */}
                <Card className="mt-8 p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-400" />
                        农场规则
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                        <div className="flex items-start gap-2">
                            <span className="text-green-400">🌱</span>
                            <p>每天学习新单词会在农场播下种子</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-cyan-400">💧</span>
                            <p>每天有 5 次浇水机会，浇水可加速植物生长</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-pink-400">🌸</span>
                            <p>植物开花后可收获，获得金币奖励</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-red-400">🥀</span>
                            <p>7 天不复习的单词对应的植物会枯萎</p>
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    );
}
