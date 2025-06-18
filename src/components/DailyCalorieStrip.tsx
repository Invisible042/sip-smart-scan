
import { useDrink } from "@/contexts/DrinkContext";

export const DailyCalorieStrip = () => {
  const { getTodayCalories } = useDrink();
  const todayCalories = getTodayCalories();

  return (
    <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 mb-4">
      <div className="flex justify-center">
        <span className="text-gray-700 font-medium">
          Total today: <span className="font-bold text-gray-900">{todayCalories} kcal</span>
        </span>
      </div>
    </div>
  );
};
