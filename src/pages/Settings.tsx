
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SettingsItem } from "@/components/SettingsItem";

const Settings = () => {
  const navigate = useNavigate();

  const handleSettingsClick = (setting: string) => {
    switch (setting) {
      case "Notifications":
        navigate("/notifications");
        break;
      case "Daily Goals":
        navigate("/daily-goals");
        break;
      case "Health Preferences":
        navigate("/health-preferences");
        break;
      case "Privacy":
        navigate("/privacy");
        break;
      case "About":
        navigate("/about");
        break;
      default:
        console.log(`${setting} clicked`);
    }
  };

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
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>

        {/* Settings List */}
        <div className="px-6 space-y-4">
          <div onClick={() => handleSettingsClick("Notifications")}>
            <SettingsItem icon="🔔" title="Notifications" hasArrow />
          </div>
          <div onClick={() => handleSettingsClick("Daily Goals")}>
            <SettingsItem icon="🎯" title="Daily Goals" hasArrow />
          </div>
          <div onClick={() => handleSettingsClick("Health Preferences")}>
            <SettingsItem icon="📊" title="Health Preferences" hasArrow />
          </div>
          <div onClick={() => handleSettingsClick("Privacy")}>
            <SettingsItem icon="🔒" title="Privacy" hasArrow />
          </div>
          <div onClick={() => handleSettingsClick("About")}>
            <SettingsItem icon="ℹ️" title="About" hasArrow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
