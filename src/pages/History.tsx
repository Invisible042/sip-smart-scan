
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDrink } from "@/contexts/DrinkContext";
import { DrinkHistoryItem } from "@/components/DrinkHistoryItem";
import { BottomNavigation } from "@/components/BottomNavigation";

const History = () => {
  const navigate = useNavigate();
  const { scannedDrinks } = useDrink();

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center pt-12 pb-8 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 p-2 rounded-full hover:bg-white/50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">History</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-24">
        {scannedDrinks.length === 0 ? (
          <div className="text-center pt-20">
            <p className="text-gray-500 text-lg">No drinks scanned yet</p>
            <p className="text-gray-400 mt-2">Start scanning to see your history</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scannedDrinks.map((drink) => (
              <DrinkHistoryItem
                key={drink.id}
                drink={drink}
                date={formatDate(drink.timestamp)}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default History;
