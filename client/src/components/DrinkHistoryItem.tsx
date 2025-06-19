
import { DrinkData } from "@/contexts/DrinkContext";

interface DrinkHistoryItemProps {
  drink: DrinkData;
  date?: string;
}

export const DrinkHistoryItem = ({ drink, date }: DrinkHistoryItemProps) => {
  return (
    <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-4 border border-white/10 backdrop-blur-sm">
      <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
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
          <h3 className="font-semibold text-white">{drink.name}</h3>
          {date && <span className="text-slate-400 text-sm">{date}</span>}
        </div>
        <div className="flex space-x-4 text-sm text-slate-400">
          <span>{drink.calories} kcal</span>
          <span>{drink.sugar}g sugar</span>
        </div>
      </div>
    </div>
  );
};
