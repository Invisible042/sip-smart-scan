
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { SettingsItem } from "@/components/SettingsItem";

const Settings = () => {
  const navigate = useNavigate();

  const settingsItems = [
    { icon: "👤", title: "Account", hasArrow: true },
    { icon: "🔔", title: "Notifications", hasArrow: true },
    { icon: "✅", title: "Nutrition Goals", hasArrow: true },
    { icon: "🎨", title: "App Appearance", hasArrow: true },
    { icon: "ℹ️", title: "About", hasArrow: true },
  ];

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
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-24">
        <div className="space-y-1">
          {settingsItems.map((item, index) => (
            <SettingsItem
              key={index}
              icon={item.icon}
              title={item.title}
              hasArrow={item.hasArrow}
            />
          ))}
        </div>

        {/* App Name at Bottom */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl font-bold text-gray-900">SnapDrink</h2>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Settings;
