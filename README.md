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
- lucide-react（图标）
- uuid（生成唯一id）

## 本地运行

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
4. 点击部署，几分钟后即可拿到一个线上地址

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
