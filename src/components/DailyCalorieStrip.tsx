
import { useDrink } from "@/contexts/DrinkContext";

export const DailyCalorieStrip = () => {
  const { getTodayCalories } = useDrink();
  const todayCalories = getTodayCalories();

  return (
    <div className="bg-white rounded-lg px-3 py-1 shadow-sm border border-gray-100 mt-2">
      <span className="text-gray-700 text-sm font-medium">
        Total today: <span className="font-bold text-gray-900">{todayCalories} kcal</span>
      </span>
    </div>
  );
};
