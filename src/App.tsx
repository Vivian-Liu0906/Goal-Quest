import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "./useAuth";
import { useGoals } from "./useGoals";
import { LanguageProvider, useLanguage } from "./i18n";
import Dashboard from "./components/Dashboard";
import GoalDetail from "./components/GoalDetail";
import AddGoalModal from "./components/AddGoalModal";
import AuthPage from "./components/AuthPage";
import LanguageSwitch from "./components/LanguageSwitch";
import NavTabs from "./components/NavTabs";
import type { View } from "./components/NavTabs";
import PomodoroPage from "./components/PomodoroPage";
import DailyTodoPage from "./components/DailyTodoPage";
import StatisticsPage from "./components/StatisticsPage";

function AppInner() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthPage onSignIn={signIn} onSignUp={signUp} />;
  }

  return <AuthedApp userId={user.id} userEmail={user.email ?? ""} onSignOut={signOut} />;
}

function LoadingScreen() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <p className="text-sm text-neutral-400">{t("app.loading")}</p>
    </div>
  );
}

function AuthedApp({
  userId,
  userEmail,
  onSignOut,
}: {
  userId: string;
  userEmail: string;
  onSignOut: () => void;
}) {
  const { t } = useLanguage();
  const {
    goals,
    loading,
    error,
    addGoal,
    deleteGoal,
    addTask,
    toggleTask,
    deleteTask,
    addMilestone,
    deleteMilestone,
  } = useGoals(userId);

  const [view, setView] = useState<View>("goals");
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [showAddGoal, setShowAddGoal] = useState(false);

  const selectedGoal = goals.find((g) => g.id === selectedGoalId) ?? null;

  const handleChangeView = (next: View) => {
    setSelectedGoalId(null);
    setView(next);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex justify-between items-center gap-3 px-4 pt-4 max-w-2xl mx-auto">
        <NavTabs active={view} onChange={handleChangeView} />
        <div className="flex items-center gap-3 shrink-0">
          <LanguageSwitch />
          <span className="hidden sm:inline text-xs text-neutral-400">{userEmail}</span>
          <button
            onClick={onSignOut}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800"
          >
            <LogOut size={13} /> {t("app.signOut")}
          </button>
        </div>
      </div>

      {view === "pomodoro" ? (
        <PomodoroPage userId={userId} />
      ) : view === "todos" ? (
        <DailyTodoPage userId={userId} />
      ) : view === "statistics" ? (
        <StatisticsPage />
      ) : loading ? (
        <p className="text-center text-sm text-neutral-400 py-20">{t("app.loading")}</p>
      ) : error ? (
        <p className="text-center text-sm text-red-500 py-20">{t("app.loadError")}</p>
      ) : selectedGoal ? (
        <GoalDetail
          goal={selectedGoal}
          onBack={() => setSelectedGoalId(null)}
          onAddTask={(input) => addTask(selectedGoal.id, input)}
          onToggleTask={(taskId) => toggleTask(selectedGoal.id, taskId)}
          onDeleteTask={(taskId) => deleteTask(selectedGoal.id, taskId)}
          onAddMilestone={(input) => addMilestone(selectedGoal.id, input)}
          onDeleteMilestone={(milestoneId) => deleteMilestone(selectedGoal.id, milestoneId)}
        />
      ) : (
        <Dashboard
          goals={goals}
          onOpenGoal={setSelectedGoalId}
          onDeleteGoal={(goalId) => {
            deleteGoal(goalId);
            if (selectedGoalId === goalId) setSelectedGoalId(null);
          }}
          onAddGoal={() => setShowAddGoal(true)}
        />
      )}

      {showAddGoal && (
        <AddGoalModal onClose={() => setShowAddGoal(false)} onCreate={(input) => addGoal(input)} />
      )}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}

export default App;
