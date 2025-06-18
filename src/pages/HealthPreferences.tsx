
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const HealthPreferences = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    age: "",
    weight: "",
    height: "",
    activityLevel: "moderate",
    dietaryRestrictions: "",
    healthGoals: ""
  });

  const handleSave = () => {
    // Save preferences logic here
    console.log("Saving preferences:", preferences);
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex items-center pt-6 px-6 pb-4">
        <button
          onClick={() => navigate("/settings")}
          className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Health Preferences</h1>
      </div>

      <div className="px-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <Input
              type="number"
              value={preferences.age}
              onChange={(e) => setPreferences(prev => ({ ...prev, age: e.target.value }))}
              placeholder="Enter your age"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <Input
              type="number"
              value={preferences.weight}
              onChange={(e) => setPreferences(prev => ({ ...prev, weight: e.target.value }))}
              placeholder="Enter your weight"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
            <Input
              type="number"
              value={preferences.height}
              onChange={(e) => setPreferences(prev => ({ ...prev, height: e.target.value }))}
              placeholder="Enter your height"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900">Health Goals</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions</label>
            <Input
              value={preferences.dietaryRestrictions}
              onChange={(e) => setPreferences(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
              placeholder="e.g., Diabetic, Low sugar, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Health Goals</label>
            <Input
              value={preferences.healthGoals}
              onChange={(e) => setPreferences(prev => ({ ...prev, healthGoals: e.target.value }))}
              placeholder="e.g., Weight loss, Better hydration"
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full bg-orange-brand hover:bg-orange-600">
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default HealthPreferences;
