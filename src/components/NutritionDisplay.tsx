
import { CheckCircle, Lightbulb } from "lucide-react";
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

  return (
    <div className="space-y-6">
      {/* Drink Image Card */}
      <div className="bg-gray-soft rounded-3xl p-8 flex justify-center">
        {drink.image ? (
          <img
            src={drink.image}
            alt={drink.name}
            className="w-48 h-48 object-contain"
          />
        ) : (
          <div className="w-48 h-48 bg-orange-brand rounded-2xl flex items-center justify-center">
            <div className="text-white text-6xl">🥤</div>
          </div>
        )}
      </div>

      {/* Success Message */}
      <div className="flex items-center space-x-3 px-4">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <span className="text-lg font-medium text-gray-900">
          {drink.name} logged.
        </span>
      </div>

      {/* Health Insight */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-8 h-8 bg-orange-brand rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <div className="text-white text-sm">▼</div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Show Health Insight
            </h3>
            <div className="flex items-start space-x-3 mb-4">
              <Lightbulb className="w-5 h-5 text-orange-brand flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">
                {drink.healthInsight || "High sugar. Consider drinking this in moderation."}
              </p>
            </div>
            
            {drink.alternative && (
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="text-gray-700">🥤</div>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Alternative:</p>
                  <p className="text-gray-700">{drink.alternative}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nutrition Facts */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100">
          <div>
            <p className="text-2xl font-bold text-gray-900">{drink.calories} kcal</p>
            <p className="text-gray-500">Calories</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{drink.sugar}g sugar</p>
            <p className="text-gray-500">Sugar</p>
          </div>
        </div>
      </div>

      {/* Scan Another Button */}
      <Button
        onClick={handleScanAnother}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-2xl text-lg font-medium"
      >
        Scan Another Drink
      </Button>
    </div>
  );
};
