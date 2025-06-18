
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
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="flex items-center pt-6 px-6 pb-4">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
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
  );
};

export default Settings;
