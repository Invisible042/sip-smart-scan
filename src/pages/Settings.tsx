
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SettingsItem } from "@/components/SettingsItem";

const Settings = () => {
  const navigate = useNavigate();

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
        <SettingsItem icon="🔔" title="Notifications" hasArrow />
        <SettingsItem icon="🎯" title="Daily Goals" hasArrow />
        <SettingsItem icon="📊" title="Health Preferences" hasArrow />
        <SettingsItem icon="🔒" title="Privacy" hasArrow />
        <SettingsItem icon="❓" title="Help & Support" hasArrow />
        <SettingsItem icon="ℹ️" title="About" hasArrow />
      </div>
    </div>
  );
};

export default Settings;
