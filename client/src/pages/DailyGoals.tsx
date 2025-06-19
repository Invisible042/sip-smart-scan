
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit3, Check } from "lucide-react";
import { useDrink } from "@/contexts/DrinkContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserService } from "@/services/userService";

const DailyGoals = () => {
  const navigate = useNavigate();
  const { dailyGoals, updateDailyGoal, addDailyGoal } = useDrink();
  const [backendGoals, setBackendGoals] = useState<any[]>([]);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    unit: "",
    type: "calories" as const
  });

  useEffect(() => {
    loadBackendGoals();
  }, []);

  const loadBackendGoals = async () => {
    try {
      const goals = await UserService.getDailyGoals();
      setBackendGoals(goals);
    } catch (error) {
      console.warn('Using local goals only');
    }
  };

  const handleEditGoal = (goalId: string, currentTarget: number) => {
    setEditingGoal(goalId);
    setEditValue(currentTarget.toString());
  };

  const handleSaveGoal = async (goalId: string) => {
    const target = parseInt(editValue);
    if (!isNaN(target) && target > 0) {
      updateDailyGoal(goalId, target);
      await UserService.updateDailyGoal(goalId, { target });
      await loadBackendGoals();
    }
    setEditingGoal(null);
    setEditValue("");
  };

  const handleAddGoal = async () => {
    const target = parseInt(newGoal.target);
    if (newGoal.name && !isNaN(target) && target > 0 && newGoal.unit) {
      addDailyGoal({
        name: newGoal.name,
        target,
        unit: newGoal.unit,
        type: newGoal.type
      });
      await UserService.createDailyGoal({
        name: newGoal.name,
        target,
        unit: newGoal.unit,
        type: newGoal.type
      });
      await loadBackendGoals();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-sm mx-auto bg-slate-900 min-h-screen relative">
        {/* Status Bar */}
        <div className="flex justify-between items-center pt-3 px-5 pb-2 text-white text-sm font-semibold">
          <div>9:41</div>
          <div className="flex gap-1 items-center">
            <span>••••</span>
            <span>📶</span>
            <div className="w-6 h-3 border border-white rounded-sm relative">
              <div className="w-4/5 h-full bg-green-400 rounded-sm"></div>
              <div className="absolute -right-1 top-1 w-1 h-1 bg-white rounded-r"></div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pt-6 px-6 pb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/settings")}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-4 border border-white/20"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">Daily Goals</h1>
          </div>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <button className="w-10 h-10 bg-gradient-to-r from-teal-500 to-yellow-400 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Goal name"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                />
                <Input
                  placeholder="Target value"
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                />
                <Input
                  placeholder="Unit (e.g., kcal, g, drinks)"
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                />
                <Button 
                  onClick={handleAddGoal} 
                  className="w-full bg-gradient-to-r from-teal-500 to-yellow-400 hover:from-teal-600 hover:to-yellow-500"
                >
                  Add Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goals List */}
        <div className="px-6 space-y-4">
          {dailyGoals.map((goal) => (
            <div key={goal.id} className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{goal.name}</h3>
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
                    <Edit3 className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm text-slate-400 mb-1">
                  <span>{goal.current} {goal.unit}</span>
                  <span>{goal.target} {goal.unit}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isGoalCompleted(goal.current, goal.target)
                        ? 'bg-green-500'
                        : 'bg-gradient-to-r from-teal-500 to-yellow-400'
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
                    className="flex-1 bg-white/5 border-white/10 text-white"
                  />
                  <Button
                    onClick={() => handleSaveGoal(goal.id)}
                    size="sm"
                    className="bg-gradient-to-r from-teal-500 to-yellow-400"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setEditingGoal(null)}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  Target: {goal.target} {goal.unit}
                  {isGoalCompleted(goal.current, goal.target) && (
                    <span className="ml-2 text-green-400 font-medium">✓ Completed!</span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyGoals;
