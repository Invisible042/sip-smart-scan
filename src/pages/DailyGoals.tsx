
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit3, Check } from "lucide-react";
import { useDrink } from "@/contexts/DrinkContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const DailyGoals = () => {
  const navigate = useNavigate();
  const { dailyGoals, updateDailyGoal, addDailyGoal } = useDrink();
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    unit: "",
    type: "calories" as const
  });

  const handleEditGoal = (goalId: string, currentTarget: number) => {
    setEditingGoal(goalId);
    setEditValue(currentTarget.toString());
  };

  const handleSaveGoal = (goalId: string) => {
    const target = parseInt(editValue);
    if (!isNaN(target) && target > 0) {
      updateDailyGoal(goalId, target);
    }
    setEditingGoal(null);
    setEditValue("");
  };

  const handleAddGoal = () => {
    const target = parseInt(newGoal.target);
    if (newGoal.name && !isNaN(target) && target > 0 && newGoal.unit) {
      addDailyGoal({
        name: newGoal.name,
        target,
        unit: newGoal.unit,
        type: newGoal.type
      });
      setNewGoal({ name: "", target: "", unit: "", type: "calories" });
      setShowAddDialog(false);
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const isGoalCompleted = (current: number, target: number) => {
    return current >= target;
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="flex items-center justify-between pt-6 px-6 pb-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Daily Goals</h1>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <button className="w-10 h-10 bg-orange-brand rounded-xl shadow-sm flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Goal name"
                value={newGoal.name}
                onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Target value"
                type="number"
                value={newGoal.target}
                onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
              />
              <Input
                placeholder="Unit (e.g., kcal, g, drinks)"
                value={newGoal.unit}
                onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
              />
              <Button onClick={handleAddGoal} className="w-full">
                Add Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals List */}
      <div className="px-6 space-y-4">
        {dailyGoals.map((goal) => (
          <div key={goal.id} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
              <div className="flex items-center space-x-2">
                {isGoalCompleted(goal.current, goal.target) && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <button
                  onClick={() => handleEditGoal(goal.id, goal.target)}
                  className="p-1"
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{goal.current} {goal.unit}</span>
                <span>{goal.target} {goal.unit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    isGoalCompleted(goal.current, goal.target)
                      ? 'bg-green-500'
                      : 'bg-orange-brand'
                  }`}
                  style={{ width: `${getProgressPercentage(goal.current, goal.target)}%` }}
                ></div>
              </div>
            </div>

            {editingGoal === goal.id ? (
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSaveGoal(goal.id)}
                  size="sm"
                >
                  Save
                </Button>
                <Button
                  onClick={() => setEditingGoal(null)}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Target: {goal.target} {goal.unit}
                {isGoalCompleted(goal.current, goal.target) && (
                  <span className="ml-2 text-green-600 font-medium">✓ Completed!</span>
                )}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyGoals;
