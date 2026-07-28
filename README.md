# Goal Quest

一个把长期目标拆解成每日小任务的打卡工具。每完成一个任务获得经验值(XP)，
经验值累积对应目标的总体完成进度，让枯燥的日常学习变得像游戏通关一样有盼头。

## 功能

- 创建多个目标（Goal），每个目标设定一个总经验值(XP)作为终点
- 在目标下添加任务(Task)，每个任务对应一定XP，勾选完成即可获得经验值
- 目标详情页展示整体进度条，以及一条带里程碑(Milestone)的"旅程"路径
- 数据保存在浏览器 localStorage，无需注册登录，刷新页面不丢失

## 技术栈

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Supabase（账号登录注册 + 云端数据库）
- lucide-react（图标）

## 账号系统

现在每个人需要注册自己的邮箱账号才能使用。登录后只能看到和管理自己的目标/任务，
数据存在 Supabase 云端数据库，换设备登录也能看到。数据库开启了 Row Level Security，
从数据库层面保证用户之间互相看不到对方的数据。

数据库建表脚本在 `supabase/schema.sql`，如果要另建一个 Supabase 项目，把这段脚本
在 Supabase 的 SQL Editor 里跑一遍即可。

## 本地运行

先在项目根目录新建一个 `.env.local` 文件（这个文件不会被提交到 git），内容参考 `.env.example`：

```
VITE_SUPABASE_URL=你的Supabase项目URL
VITE_SUPABASE_ANON_KEY=你的Supabase publishable key
```

这两个值在 Supabase 项目的 Project Settings → Data API 里能找到。

```bash
npm install
npm run dev
```

打开终端提示的本地地址（一般是 http://localhost:5173）即可查看。

## 构建生产版本

```bash
npm run build
npm run preview   # 本地预览构建产物
```

## 部署

推荐使用 Vercel 或 Netlify，两者都支持：

1. 把这个仓库推送到 GitHub
2. 在 Vercel / Netlify 中选择 "Import Project"，连接这个 GitHub 仓库
3. Build command 填 `npm run build`，输出目录填 `dist`
4. **重要**：在项目的 Environment Variables 设置里，添加两个变量：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   （因为 `.env.local` 不会被提交到 GitHub，所以线上环境需要手动填这两个值，
   否则部署上去的网站登录注册会失败）
5. 点击部署，几分钟后即可拿到一个线上地址

## 数据模型

```ts
interface Task {
  id: string;
  title: string;
  xp: number;
  done: boolean;
}

interface Milestone {
  id: string;
  title: string;
  thresholdXp: number; // 达到多少XP时解锁
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetXp: number;      // 目标总经验值
  tasks: Task[];
  milestones: Milestone[];
}
```

## 后续可以扩展的方向

- 接入 Supabase / Firebase，实现云端同步和多设备访问
- 数据导出/导入 JSON 备份
- 任务完成模式的数据分析（比如哪几天完成率更高）
- 多目标总览仪表盘
