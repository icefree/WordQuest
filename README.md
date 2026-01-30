# WordQuest 词汇大冒险

<p align="center">
  <img src="wordquest-app/public/images/words/abandon.png" width="200" alt="WordQuest Logo" />
</p>

WordQuest 是一款将**背单词**与**角色扮演游戏 (RPG)** 完美融合的开源学习应用。通过击败地下城中的怪物、经营个性化的单词农场，让词汇学习变得象玩游戏一样充满乐趣和成就感。

🚀 **[立即在线试玩 (Demo)](https://icefree.github.io/WordQuest/)**

---

## ✨ 核心特性

- 🗡️ **地下城模式**：化身冒险者，用单词作为武器。拼写正确即可发动攻击，连续答对还能触发超华丽的连击 (Combo) 效果！
- 🌱 **单词农场**：你在地下城学到的每个单词都会化为一颗“种子”。通过每日复习和浇水，见证它从幼苗长成盛开的花朵，并收获丰厚金币奖励。
- 🧠 **科学复习系统 (SRS)**：基于间隔重复原理，智能筛选你需要复习的单词，动态调整记忆强度，确保长久记忆。
- 📊 **成长体系**：完整的等级和经验系统。赚取金币，升级你的冒险者，记录你的每一份进步。
- 📚 **KET 词库**：内置精选的 KET 核心词汇，配有英文释义、例句、图片以及标准发音。
- 🔒 **本地存储**：无需登录，所有进度自动保存到浏览器本地，保护隐私且随时随地继续。

## 🛠️ 技术栈

- **框架**: [Next.js 15 (App Router)](https://nextjs.org/)
- **状态管理**: [Zustand](https://github.com/pmndrs/zustand) (包含持久化中间件)
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **图标**: [Lucide React](https://lucide.dev/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **部署**: GitHub Actions + GitHub Pages (静态导出)

## 🚀 快速开始

### 环境依赖

确保你已安装了 Node.js (推荐 v20+) 和 pnpm。

### 本地运行

1. 克隆仓库

   ```bash
   git clone https://github.com/icefree/WordQuest.git
   cd WordQuest/wordquest-app
   ```

2. 安装依赖

   ```bash
   pnpm install
   ```

3. 启动开发服务器

   ```bash
   pnpm run dev
   ```

4. 打开浏览器访问 `http://localhost:3000`

## 📂 项目结构

```text
wordquest-app/
├── src/
│   ├── app/           # Next.js 页面 (地下城、农场、复习)
│   ├── components/    # 游戏组件 (怪物、进度条、反馈提示)
│   ├── lib/
│   │   ├── stores/    # 全局状态 (User & Game Logic)
│   │   └── data/      # KET 词库数据 (1076词)
│   └── types/         # TypeScript 类型定义
└── public/            # 静态资源 (图片、发音图标)
```

## 📜 许可证

本项目采用 [MIT License](LICENSE) 开源。

---

感谢使用 WordQuest！祝你冒险愉快，词霸天下！🗡️📖
