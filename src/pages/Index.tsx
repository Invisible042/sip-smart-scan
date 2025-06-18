
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, History } from "lucide-react";
import { DrinkLogo } from "@/components/DrinkLogo";
import { CameraCapture } from "@/components/CameraCapture";
import { NutritionDisplay } from "@/components/NutritionDisplay";
import { DailyCalorieStrip } from "@/components/DailyCalorieStrip";
import { useDrink } from "@/contexts/DrinkContext";

const Index = () => {
  const { currentDrink } = useDrink();
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top Navigation */}
      <div className="flex justify-between items-center pt-6 px-6 pb-4">
        <button
          onClick={() => navigate("/history")}
          className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center"
        >
          <History className="w-5 h-5 text-gray-700" />
        </button>
        
        <DrinkLogo />
        
        <button
          onClick={() => navigate("/settings")}
          className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center"
        >
          <Settings className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Main Content - Full height minus top nav */}
      <div className="flex-1 px-6 pb-6">
        {currentDrink ? (
          <NutritionDisplay drink={currentDrink} />
        ) : (
          <>
            <CameraCapture 
              isScanning={isScanning} 
              setIsScanning={setIsScanning} 
            />
            <DailyCalorieStrip />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
