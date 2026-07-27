import { useState } from "react";
import { useGoals } from "./useGoals";
import Dashboard from "./components/Dashboard";
import GoalDetail from "./components/GoalDetail";
import AddGoalModal from "./components/AddGoalModal";

function App() {
  const {
    goals,
    addGoal,
    deleteGoal,
    addTask,
    toggleTask,
    deleteTask,
    addMilestone,
    deleteMilestone,
  } = useGoals();

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [showAddGoal, setShowAddGoal] = useState(false);

  const selectedGoal = goals.find((g) => g.id === selectedGoalId) ?? null;

  return (
    <div className="min-h-screen bg-neutral-50">
      {selectedGoal ? (
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
        <AddGoalModal
          onClose={() => setShowAddGoal(false)}
          onCreate={(input) => addGoal(input)}
        />
      )}
    </div>
  );
}

export default App;
