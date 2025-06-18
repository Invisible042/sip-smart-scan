
import { useState } from "react";
import { DrinkLogo } from "@/components/DrinkLogo";
import { CameraCapture } from "@/components/CameraCapture";
import { NutritionDisplay } from "@/components/NutritionDisplay";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useDrink } from "@/contexts/DrinkContext";

const Index = () => {
  const { currentDrink } = useDrink();
  const [isScanning, setIsScanning] = useState(false);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="flex justify-center pt-12 pb-8">
        <DrinkLogo />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-24">
        {currentDrink ? (
          <NutritionDisplay drink={currentDrink} />
        ) : (
          <CameraCapture 
            isScanning={isScanning} 
            setIsScanning={setIsScanning} 
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Index;
