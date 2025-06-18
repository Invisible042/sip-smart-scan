
import { DrinkData } from "@/contexts/DrinkContext";

interface DrinkHistoryItemProps {
  drink: DrinkData;
  date?: string;
}

export const DrinkHistoryItem = ({ drink, date }: DrinkHistoryItemProps) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center space-x-4">
      <div className="w-16 h-16 bg-gray-soft rounded-xl flex items-center justify-center flex-shrink-0">
        {drink.image ? (
          <img
            src={drink.image}
            alt={drink.name}
            className="w-12 h-12 object-contain"
          />
        ) : (
          <div className="text-2xl">🥤</div>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-gray-900">{drink.name}</h3>
          {date && <span className="text-gray-500 text-sm">{date}</span>}
        </div>
        <div className="flex space-x-4 text-sm text-gray-600">
          <span>{drink.calories} kcal</span>
          <span>{drink.sugar}g sugar</span>
        </div>
      </div>
    </div>
  );
};
