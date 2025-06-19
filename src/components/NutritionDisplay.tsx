
import { CheckCircle, Lightbulb, ArrowLeft } from "lucide-react";
import { DrinkData } from "@/contexts/DrinkContext";
import { Button } from "@/components/ui/button";
import { useDrink } from "@/contexts/DrinkContext";

interface NutritionDisplayProps {
  drink: DrinkData;
}

export const NutritionDisplay = ({ drink }: NutritionDisplayProps) => {
  const { setCurrentDrink } = useDrink();

  const handleScanAnother = () => {
    setCurrentDrink(null);
  };

  const handleBack = () => {
    setCurrentDrink(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center p-5 pb-4">
        <button
          onClick={handleBack}
          className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl font-bold">Drink Details</h1>
      </div>

      <div className="px-5 space-y-6">
        {/* Drink Image Card */}
        <div className="bg-slate-800 rounded-3xl p-8 flex justify-center border border-white/10">
          {drink.image ? (
            <img
              src={drink.image}
              alt={drink.name}
              className="w-48 h-48 object-contain"
            />
          ) : (
            <div className="w-48 h-48 bg-gradient-to-r from-teal-500 to-yellow-400 rounded-2xl flex items-center justify-center">
              <div className="text-white text-6xl">🥤</div>
            </div>
          )}
        </div>

        {/* Success Message */}
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <span className="text-lg font-medium text-white">
            {drink.name} logged.
          </span>
        </div>

        {/* Health Insight */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <div className="text-white text-sm">▼</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Health Insight
              </h3>
              <div className="flex items-start space-x-3 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-300">
                  {drink.healthInsight || "High sugar content. Consider drinking this in moderation and pairing with water."}
                </p>
              </div>
              
              {drink.alternative && (
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="text-slate-300">🥤</div>
                  </div>
                  <div>
                    <p className="font-medium text-white mb-1">Alternative:</p>
                    <p className="text-slate-300">{drink.alternative}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nutrition Facts */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{drink.calories}</p>
              <p className="text-slate-400">Calories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{drink.sugar}g</p>
              <p className="text-slate-400">Sugar</p>
            </div>
            {drink.caffeine && (
              <div className="text-center col-span-2">
                <p className="text-3xl font-bold text-white">{drink.caffeine}mg</p>
                <p className="text-slate-400">Caffeine</p>
              </div>
            )}
          </div>
        </div>

        {/* Scan Another Button */}
        <Button
          onClick={handleScanAnother}
          className="w-full bg-gradient-to-r from-teal-500 to-yellow-400 hover:from-teal-600 hover:to-yellow-500 text-white py-4 rounded-2xl text-lg font-medium border-0"
        >
          Scan Another Drink
        </Button>
      </div>
    </div>
  );
};
