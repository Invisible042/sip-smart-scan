
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DrinkHistoryItem } from "@/components/DrinkHistoryItem";
import { useDrink } from "@/contexts/DrinkContext";

const History = () => {
  const navigate = useNavigate();
  const { scannedDrinks } = useDrink();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-sm mx-auto bg-slate-900 min-h-screen relative">
        {/* Status Bar */}
        <div className="flex justify-between items-center pt-3 px-5 pb-2 text-white text-sm font-semibold">
          <div>9:41</div>
          <div className="flex gap-1 items-center">
            <span>••••</span>
            <span>📶</span>
            <div className="w-6 h-3 border border-white rounded-sm relative">
              <div className="w-4/5 h-full bg-green-400 rounded-sm"></div>
              <div className="absolute -right-1 top-1 w-1 h-1 bg-white rounded-r"></div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center pt-6 px-6 pb-4">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-4 border border-white/20"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Drink History</h1>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {scannedDrinks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <div className="text-3xl">📋</div>
              </div>
              <p className="text-white text-lg">No drinks scanned yet</p>
              <p className="text-slate-400 mt-2">Start by scanning your first drink!</p>
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
    </div>
  );
};

export default History;
