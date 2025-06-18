
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Privacy = () => {
  const navigate = useNavigate();
  const [privacy, setPrivacy] = useState({
    dataCollection: true,
    analyticsTracking: false,
    personalizedAds: false,
    shareWithPartners: false
  });

  const handleToggle = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex items-center pt-6 px-6 pb-4">
        <button
          onClick={() => navigate("/settings")}
          className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Privacy</h1>
      </div>

      <div className="px-6 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Data Collection</h3>
              <p className="text-sm text-gray-600">Allow app to collect usage data</p>
            </div>
            <Switch
              checked={privacy.dataCollection}
              onCheckedChange={() => handleToggle('dataCollection')}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Analytics Tracking</h3>
              <p className="text-sm text-gray-600">Help improve the app with analytics</p>
            </div>
            <Switch
              checked={privacy.analyticsTracking}
              onCheckedChange={() => handleToggle('analyticsTracking')}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Personalized Ads</h3>
              <p className="text-sm text-gray-600">Show relevant advertisements</p>
            </div>
            <Switch
              checked={privacy.personalizedAds}
              onCheckedChange={() => handleToggle('personalizedAds')}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Share with Partners</h3>
              <p className="text-sm text-gray-600">Share anonymized data with partners</p>
            </div>
            <Switch
              checked={privacy.shareWithPartners}
              onCheckedChange={() => handleToggle('shareWithPartners')}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm mt-6">
          <h3 className="font-medium text-gray-900 mb-2">Data Management</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-2 text-blue-600 hover:bg-gray-50 rounded">
              Download My Data
            </button>
            <button className="w-full text-left p-2 text-red-600 hover:bg-gray-50 rounded">
              Delete All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
