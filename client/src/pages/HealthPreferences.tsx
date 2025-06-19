
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserService } from "@/services/userService";

const HealthPreferences = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    age: "",
    weight: "",
    height: "",
    activity_level: "moderate",
    dietary_restrictions: "",
    health_goals: ""
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await UserService.getHealthPreferences();
      setPreferences({
        age: prefs.age?.toString() || "",
        weight: prefs.weight?.toString() || "",
        height: prefs.height?.toString() || "",
        activity_level: prefs.activity_level || "moderate",
        dietary_restrictions: prefs.dietary_restrictions || "",
        health_goals: prefs.health_goals || ""
      });
    } catch (error) {
      console.warn('Using default health preferences');
    }
  };

  const handleSave = async () => {
    const updateData = {
      age: preferences.age ? parseInt(preferences.age) : undefined,
      weight: preferences.weight ? parseFloat(preferences.weight) : undefined,
      height: preferences.height ? parseFloat(preferences.height) : undefined,
      activity_level: preferences.activity_level,
      dietary_restrictions: preferences.dietary_restrictions || undefined,
      health_goals: preferences.health_goals || undefined
    };
    
    await UserService.updateHealthPreferences(updateData);
    console.log("Health preferences saved successfully");
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

        <div className="flex items-center pt-6 px-6 pb-4">
          <button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-4 border border-white/20"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Health Preferences</h1>
        </div>

        <div className="px-6 space-y-6">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm space-y-4">
            <h3 className="font-semibold text-white">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Age</label>
              <Input
                type="number"
                value={preferences.age}
                onChange={(e) => setPreferences(prev => ({ ...prev, age: e.target.value }))}
                placeholder="Enter your age"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Weight (kg)</label>
              <Input
                type="number"
                value={preferences.weight}
                onChange={(e) => setPreferences(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="Enter your weight"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Height (cm)</label>
              <Input
                type="number"
                value={preferences.height}
                onChange={(e) => setPreferences(prev => ({ ...prev, height: e.target.value }))}
                placeholder="Enter your height"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm space-y-4">
            <h3 className="font-semibold text-white">Health Goals</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Dietary Restrictions</label>
              <Input
                value={preferences.dietary_restrictions}
                onChange={(e) => setPreferences(prev => ({ ...prev, dietary_restrictions: e.target.value }))}
                placeholder="e.g., Diabetic, Low sugar, etc."
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Health Goals</label>
              <Input
                value={preferences.healthGoals}
                onChange={(e) => setPreferences(prev => ({ ...prev, healthGoals: e.target.value }))}
                placeholder="e.g., Weight loss, Better hydration"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            className="w-full bg-gradient-to-r from-teal-500 to-yellow-400 hover:from-teal-600 hover:to-yellow-500 text-white font-semibold"
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HealthPreferences;
