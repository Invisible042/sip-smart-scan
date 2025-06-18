
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DrinkHistoryItem } from "@/components/DrinkHistoryItem";
import { useDrink } from "@/contexts/DrinkContext";

const History = () => {
  const navigate = useNavigate();
  const { scannedDrinks } = useDrink();

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="flex items-center pt-6 px-6 pb-4">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Drink History</h1>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {scannedDrinks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
              <div className="text-3xl">📋</div>
            </div>
            <p className="text-gray-600 text-lg">No drinks scanned yet</p>
            <p className="text-gray-500 mt-2">Start by scanning your first drink!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scannedDrinks.map((drink) => (
              <DrinkHistoryItem key={drink.id} drink={drink} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
