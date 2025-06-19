
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { UserService } from "@/services/userService";

const Privacy = () => {
  const navigate = useNavigate();
  const [privacy, setPrivacy] = useState({
    data_collection: true,
    analytics_tracking: false,
    personalized_ads: false,
    share_with_partners: false
  });

  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async () => {
    try {
      const settings = await UserService.getPrivacySettings();
      setPrivacy(settings);
    } catch (error) {
      console.warn('Using default privacy settings');
    }
  };

  const handleToggle = async (key: keyof typeof privacy) => {
    const newValue = !privacy[key];
    setPrivacy(prev => ({
      ...prev,
      [key]: newValue
    }));
    
    await UserService.updatePrivacySettings({ [key]: newValue });
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

        <div className="flex items-center pt-6 px-6 pb-4">
          <button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-4 border border-white/20"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Privacy</h1>
        </div>

        <div className="px-6 space-y-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Data Collection</h3>
                <p className="text-sm text-slate-400">Allow app to collect usage data</p>
              </div>
              <Switch
                checked={privacy.data_collection}
                onCheckedChange={() => handleToggle('data_collection')}
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Analytics Tracking</h3>
                <p className="text-sm text-slate-400">Help improve the app with analytics</p>
              </div>
              <Switch
                checked={privacy.analytics_tracking}
                onCheckedChange={() => handleToggle('analytics_tracking')}
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Personalized Ads</h3>
                <p className="text-sm text-slate-400">Show relevant advertisements</p>
              </div>
              <Switch
                checked={privacy.personalized_ads}
                onCheckedChange={() => handleToggle('personalized_ads')}
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Share with Partners</h3>
                <p className="text-sm text-slate-400">Share anonymized data with partners</p>
              </div>
              <Switch
                checked={privacy.share_with_partners}
                onCheckedChange={() => handleToggle('share_with_partners')}
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm mt-6">
            <h3 className="font-medium text-white mb-2">Data Management</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-2 text-teal-400 hover:bg-white/5 rounded">
                Download My Data
              </button>
              <button className="w-full text-left p-2 text-red-400 hover:bg-white/5 rounded">
                Delete All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
