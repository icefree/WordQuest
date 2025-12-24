# 🎮 WordQuest - 词汇大冒险

> **把学习变成娱乐，让背单词像玩游戏一样上瘾！**

这是一个游戏化的英语单词学习应用，通过地下城闯关、农场养成、科学复习等多元玩法，让你在"玩"中不知不觉掌握词汇。

## ✨ 项目特点

- 🏰 **单词地下城** - 化身冒险者，用正确拼写击败怪物，触发连击获得加成
- 🌱 **单词农场** - 将学习进度可视化为植物生长，浇水培育词汇花园
- 🔄 **科学复习** - 基于艾宾浩斯遗忘曲线的间隔重复算法
- 🎨 **精美界面** - 暗色魔幻主题，丝滑动画，Glassmorphism 设计
- 📊 **数据统计** - 追踪学习进度、连击记录、成就解锁
- 💾 **本地存储** - 纯前端实现，数据持久化到 localStorage

## 🚀 快速开始

```bash
# 进入项目目录
cd wordquest-app

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

访问 http://localhost:3000 开始冒险！

## 🛠️ 技术栈

| 技术 | 用途 |
|-----|-----|
| **Next.js 16** | React 框架，App Router |
| **TypeScript** | 类型安全 |
| **Tailwind CSS 4** | 原子化样式 |
| **Zustand** | 轻量级状态管理 |
| **Framer Motion** | 流畅动画 |
| **Lucide Icons** | 图标库 |

## 📁 项目结构

```
wordquest-app/
├── src/
│   ├── app/                    # 页面路由
│   │   ├── page.tsx           # 首页
│   │   ├── dungeon/           # 地下城游戏
│   │   ├── farm/              # 单词农场
│   │   ├── review/            # 复习页面
│   │   └── profile/           # 个人中心
│   ├── components/
│   │   ├── ui/                # 基础 UI 组件
│   │   ├── game/              # 游戏专用组件
│   │   └── layout/            # 布局组件
│   ├── lib/
│   │   ├── stores/            # Zustand 状态
│   │   ├── data/              # 单词数据
│   │   └── utils/             # 工具函数
│   └── types/                 # TypeScript 类型
└── public/                    # 静态资源
```

## 🎯 MVP 功能清单

### ✅ 已实现

- [x] 首页 - 用户状态展示、游戏模式入口
- [x] 单词地下城 - 战斗系统、连击机制、Boss 战
- [x] 单词农场 - 植物可视化、浇水交互
- [x] 每日复习 - 卡片翻转、认识/不认识标记
- [x] 个人中心 - 统计数据、成就系统
- [x] 数据持久化 - localStorage 存储
- [x] 即时反馈 - 答对/答错动画特效
- [x] 连击系统 - 伤害倍率、视觉特效

### 🔜 后续规划

- [ ] 接入 Supabase 后端
- [ ] 用户认证系统
- [ ] PvP 对战模式
- [ ] 更多词库支持
- [ ] 移动端适配
- [ ] 音效系统

## 📄 相关文档

- [产品需求文档 (PRD)](./WordQuest_PRD_产品需求文档.md)
- [技术架构文档](./WordQuest_技术架构文档.md)

## 📝 开发说明

这是一个纯前端 MVP 版本，所有数据存储在浏览器 localStorage 中。后续计划接入 Supabase 实现云端存储和用户系统。

---

*Made with ❤️ for word learners everywhere*
