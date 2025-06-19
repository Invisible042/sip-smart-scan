
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, History, Home, BarChart3 } from "lucide-react";
import { useDrink } from "@/contexts/DrinkContext";
import { LocalDatabase } from "@/services/localDatabase";
import { CameraCapture } from "@/components/CameraCapture";
import { NutritionDisplay } from "@/components/NutritionDisplay";

const Index = () => {
  const { currentDrink, getTodayDrinks } = useDrink();
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState("Today");
  const navigate = useNavigate();

  const todayCalories = LocalDatabase.getTodayCalories();
  const todaySugar = LocalDatabase.getTodaySugar();
  const todayCaffeine = LocalDatabase.getTodayCaffeine();
  const todayDrinks = getTodayDrinks();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (currentDrink && !isScanning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-sm mx-auto bg-slate-900 min-h-screen">
          <div className="p-6">
            <NutritionDisplay drink={currentDrink} />
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex justify-between items-center p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-yellow-400 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
              🥤
            </div>
            <h1 className="text-2xl font-bold text-white">SnapDrink</h1>
          </div>
          <button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20"
          >
            👤
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-5 gap-8 mb-5">
          {["Today", "Yesterday"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-lg font-semibold transition-colors relative ${
                activeTab === tab ? "text-white" : "text-slate-400"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-yellow-400 rounded"></div>
              )}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="px-5">
          {/* Calories Card */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-5 text-white relative overflow-hidden border border-white/10 shadow-lg">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full"></div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <div>
                <div className="text-5xl font-extrabold leading-none">{todayCalories}</div>
                <div className="text-white/90 mt-1">Calories consumed</div>
              </div>
              <div className="w-20 h-20 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="#4ade80"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="188"
                    strokeDashoffset={188 - (todayCalories / 2000) * 188}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xl">🔥</div>
              </div>
            </div>
          </div>

          {/* Nutrition Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">{todaySugar}g</div>
              <div className="text-slate-400 text-sm mb-3">Sugar</div>
              <div className="w-10 h-10 mx-auto relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="20" cy="20" r="15" stroke="rgba(255,107,107,0.2)" strokeWidth="4" fill="none" />
                  <circle
                    cx="20"
                    cy="20"
                    r="15"
                    stroke="#ff6b6b"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="94"
                    strokeDashoffset={94 - (todaySugar / 50) * 94}
                  />
                </svg>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">{todayCaffeine}mg</div>
              <div className="text-slate-400 text-sm mb-3">Caffeine</div>
              <div className="w-10 h-10 mx-auto relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="20" cy="20" r="15" stroke="rgba(245,158,11,0.2)" strokeWidth="4" fill="none" />
                  <circle
                    cx="20"
                    cy="20"
                    r="15"
                    stroke="#16a085"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="94"
                    strokeDashoffset={94 - (todayCaffeine / 400) * 94}
                  />
                </svg>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">0.2L</div>
              <div className="text-slate-400 text-sm mb-3">Water</div>
              <div className="w-10 h-10 mx-auto relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="20" cy="20" r="15" stroke="rgba(59,130,246,0.2)" strokeWidth="4" fill="none" />
                  <circle
                    cx="20"
                    cy="20"
                    r="15"
                    stroke="#f4d03f"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="94"
                    strokeDashoffset={85}
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Recent Drinks */}
          <div className="mb-24">
            <h3 className="text-xl font-bold text-white mb-4">Recent Drinks</h3>
            {todayDrinks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🥤</div>
                <p className="text-slate-400">No drinks logged today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayDrinks.slice(0, 3).map((drink) => (
                  <div key={drink.id} className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/10 backdrop-blur-sm">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-yellow-400 rounded-xl flex items-center justify-center text-2xl">
                      🥤
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white mb-1">{drink.name}</div>
                      <div className="text-slate-400 text-sm flex gap-4">
                        <span>🔥 {drink.calories} kcal</span>
                        <span>⚡ {drink.sugar}g</span>
                        <span>☕ {drink.caffeine || 0}mg</span>
                      </div>
                    </div>
                    <div className="text-slate-400 text-sm">
                      {formatTime(drink.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Camera Capture Overlay */}
        {isScanning && (
          <div className="fixed inset-0 bg-slate-900 z-20">
            <CameraCapture isScanning={isScanning} setIsScanning={setIsScanning} />
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 h-22 bg-slate-900/95 border-t border-white/10 flex justify-around items-center pb-5 backdrop-blur-xl">
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center gap-1 text-teal-500 text-xs"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setIsScanning(true)}
            className="bg-gradient-to-r from-teal-500 to-yellow-400 rounded-2xl px-4 py-3 flex flex-col items-center gap-1 text-white text-xs shadow-lg"
          >
            <div className="text-2xl">📷</div>
            <span>Scan</span>
          </button>
          <button
            onClick={() => navigate("/history")}
            className="flex flex-col items-center gap-1 text-slate-400 text-xs"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Stats</span>
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="flex flex-col items-center gap-1 text-slate-400 text-xs"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
