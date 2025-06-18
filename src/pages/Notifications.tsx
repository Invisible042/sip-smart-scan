
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    goalAchievements: true,
    healthTips: false,
    weeklyReports: true
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
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
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
      </div>

      <div className="px-6 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Daily Reminders</h3>
              <p className="text-sm text-gray-600">Get reminded to log your drinks</p>
            </div>
            <Switch
              checked={notifications.dailyReminders}
              onCheckedChange={() => handleToggle('dailyReminders')}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Goal Achievements</h3>
              <p className="text-sm text-gray-600">Celebrate when you reach your goals</p>
            </div>
            <Switch
              checked={notifications.goalAchievements}
              onCheckedChange={() => handleToggle('goalAchievements')}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Health Tips</h3>
              <p className="text-sm text-gray-600">Receive personalized health advice</p>
            </div>
            <Switch
              checked={notifications.healthTips}
              onCheckedChange={() => handleToggle('healthTips')}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Weekly Reports</h3>
              <p className="text-sm text-gray-600">Get weekly nutrition summaries</p>
            </div>
            <Switch
              checked={notifications.weeklyReports}
              onCheckedChange={() => handleToggle('weeklyReports')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
