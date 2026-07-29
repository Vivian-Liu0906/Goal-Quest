import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Language = "zh" | "en";

const STORAGE_KEY = "goal-quest-lang";

const dict = {
  "app.title": { zh: "Goal Quest", en: "Goal Quest" },
  "app.loading": { zh: "加载中...", en: "Loading..." },
  "app.signOut": { zh: "退出登录", en: "Sign out" },
  "app.loadError": { zh: "加载数据失败，请刷新重试", en: "Failed to load data, please refresh" },

  "nav.goals": { zh: "目标", en: "Goals" },
  "nav.pomodoro": { zh: "番茄钟", en: "Pomodoro" },
  "nav.todos": { zh: "每日待办", en: "Daily To-Do" },

  "auth.signIn": { zh: "登录", en: "Sign In" },
  "auth.signUp": { zh: "注册", en: "Sign Up" },
  "auth.email": { zh: "邮箱", en: "Email" },
  "auth.password": { zh: "密码", en: "Password" },
  "auth.passwordHint": { zh: "至少6位", en: "At least 6 characters" },
  "auth.processing": { zh: "处理中...", en: "Processing..." },
  "auth.signUpSuccess": {
    zh: "注册成功！如果开启了邮箱验证，请去邮箱点确认链接后再登录。",
    en: "Signed up! If email confirmation is on, please check your inbox before signing in.",
  },
  "auth.error.invalidCreds": { zh: "邮箱或密码不正确", en: "Incorrect email or password" },
  "auth.error.alreadyRegistered": {
    zh: "这个邮箱已经注册过了，试试直接登录",
    en: "This email is already registered, try signing in instead",
  },
  "auth.error.weakPassword": { zh: "密码至少需要6位", en: "Password must be at least 6 characters" },
  "auth.error.invalidEmail": { zh: "邮箱格式不正确", en: "Invalid email format" },
  "auth.error.generic": { zh: "出错了，请重试", en: "Something went wrong, please try again" },

  "dashboard.title": { zh: "我的目标", en: "My Goals" },
  "dashboard.subtitle": {
    zh: "每完成一个小任务，就离目标更近一步",
    en: "Every small task finished brings you closer to your goal",
  },
  "dashboard.newGoal": { zh: "新建目标", en: "New Goal" },
  "dashboard.empty": {
    zh: "还没有目标，创建第一个开始你的旅程吧",
    en: "No goals yet — create your first one to start your journey",
  },
  "dashboard.taskCount": { zh: "个任务", en: "tasks" },
  "dashboard.completed": { zh: "目标已完成", en: "Goal completed" },
  "dashboard.progressLabel": { zh: "完成度", en: "Progress" },

  "goal.back": { zh: "返回全部目标", en: "Back to all goals" },
  "goal.totalProgress": { zh: "目标总进度", en: "Total progress" },
  "goal.journey": { zh: "旅程", en: "Journey" },
  "goal.addMilestone": { zh: "加个里程碑", en: "Add milestone" },
  "goal.pendingTasks": { zh: "待完成任务", en: "Pending tasks" },
  "goal.newTask": { zh: "新建任务", en: "New Task" },
  "goal.noTasks": {
    zh: "暂无待完成任务，点击右上角添加一个吧",
    en: "No pending tasks yet — add one from the top right",
  },
  "goal.doneTasks": { zh: "已完成", en: "Completed" },
  "goal.start": { zh: "出发", en: "Start" },
  "goal.finish": { zh: "目标达成", en: "Goal reached" },
  "goal.deleteMilestone": { zh: "删除里程碑", en: "Delete milestone" },

  "modal.newGoal.title": { zh: "新建目标", en: "New Goal" },
  "modal.newGoal.name": { zh: "目标名称", en: "Goal name" },
  "modal.newGoal.namePlaceholder": {
    zh: "例如：完成机器学习专项课程",
    en: "e.g. Finish the Machine Learning specialization",
  },
  "modal.newGoal.desc": { zh: "描述（可选）", en: "Description (optional)" },
  "modal.newGoal.descPlaceholder": { zh: "这个目标是为了什么？", en: "What's this goal for?" },
  "modal.newGoal.targetXp": {
    zh: "目标总经验值（预估完成所有任务需要的总XP）",
    en: "Target total XP (estimated total XP to finish all tasks)",
  },
  "modal.newGoal.color": { zh: "主题色", en: "Theme color" },
  "modal.newGoal.submit": { zh: "创建目标", en: "Create Goal" },

  "modal.newTask.title": { zh: "新建任务", en: "New Task" },
  "modal.newTask.content": { zh: "任务内容", en: "Task" },
  "modal.newTask.placeholder": { zh: "例如：完成本周编程作业", en: "e.g. Finish this week's assignment" },
  "modal.newTask.xp": { zh: "经验值（按难度/时长估算）", en: "XP (estimate by difficulty/time)" },
  "modal.newTask.submit": { zh: "添加任务", en: "Add Task" },

  "modal.newMilestone.title": { zh: "新建里程碑", en: "New Milestone" },
  "modal.newMilestone.name": { zh: "里程碑名称", en: "Milestone name" },
  "modal.newMilestone.placeholder": {
    zh: "例如：完成课程第一模块",
    en: "e.g. Finish module one",
  },
  "modal.newMilestone.threshold": {
    zh: "达到多少经验值时解锁",
    en: "Unlocks at how much XP",
  },
  "modal.newMilestone.submit": { zh: "添加里程碑", en: "Add Milestone" },

  "modal.close": { zh: "关闭", en: "Close" },

  "task.markDone": { zh: "标记为完成", en: "Mark as done" },
  "task.markUndone": { zh: "标记为未完成", en: "Mark as not done" },
  "task.delete": { zh: "删除任务", en: "Delete task" },
  "goal.delete": { zh: "删除目标", en: "Delete goal" },

  "pomodoro.title": { zh: "专注番茄钟", en: "Focus Pomodoro" },
  "pomodoro.subtitle": {
    zh: "专注25分钟，休息一下，再继续下一个",
    en: "Focus for 25 minutes, take a break, then go again",
  },
  "pomodoro.focus": { zh: "专注时间", en: "Focus" },
  "pomodoro.break": { zh: "休息时间", en: "Break" },
  "pomodoro.start": { zh: "开始", en: "Start" },
  "pomodoro.pause": { zh: "暂停", en: "Pause" },
  "pomodoro.reset": { zh: "重置", en: "Reset" },
  "pomodoro.todaySessions": { zh: "今天已完成", en: "Completed today" },
  "pomodoro.sessionsUnit": { zh: "个番茄钟", en: "pomodoros" },
  "pomodoro.completedToast": { zh: "完成一个番茄钟！休息一下吧", en: "Pomodoro complete! Take a break" },
  "pomodoro.settings": { zh: "时长设置", en: "Duration settings" },
  "pomodoro.focusMinutesLabel": { zh: "专注时长（分钟）", en: "Focus duration (min)" },
  "pomodoro.breakMinutesLabel": { zh: "休息时长（分钟）", en: "Break duration (min)" },
  "pomodoro.runningHint": {
    zh: "计时进行中，暂停或重置后可修改时长",
    en: "Timer is running — pause or reset to change duration",
  },

  "todo.title": { zh: "每日待办", en: "Daily To-Do" },
  "todo.subtitle": { zh: "今天要做的事，做完就划掉", en: "What to do today — check it off when done" },
  "todo.addPlaceholder": { zh: "添加一件今天要做的事...", en: "Add something to do today..." },
  "todo.add": { zh: "添加", en: "Add" },
  "todo.empty": { zh: "今天还没有待办事项，添加一个吧", en: "Nothing here yet — add your first to-do" },
  "todo.delete": { zh: "删除", en: "Delete" },
  "todo.doneCount": { zh: "已完成", en: "done" },
} as const;

export type TranslationKey = keyof typeof dict;

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "en" || saved === "zh" ? saved : "zh";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = (next: Language) => setLangState(next);

  const t = (key: TranslationKey) => dict[key][lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
