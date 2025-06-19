
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { UserService } from "@/services/userService";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    daily_reminders: true,
    goal_achievements: true,
    health_tips: false,
    weekly_reports: true
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const settings = await UserService.getNotifications();
      setNotifications(settings);
    } catch (error) {
      console.warn('Using default notification settings');
    }
  };

  const handleToggle = async (key: keyof typeof notifications) => {
    const newValue = !notifications[key];
    setNotifications(prev => ({
      ...prev,
      [key]: newValue
    }));
    
    await UserService.updateNotifications({ [key]: newValue });
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
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
        </div>

        <div className="px-6 space-y-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Daily Reminders</h3>
                <p className="text-sm text-slate-400">Get reminded to log your drinks</p>
              </div>
              <Switch
                checked={notifications.daily_reminders}
                onCheckedChange={() => handleToggle('daily_reminders')}
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Goal Achievements</h3>
                <p className="text-sm text-slate-400">Celebrate when you reach your goals</p>
              </div>
              <Switch
                checked={notifications.goal_achievements}
                onCheckedChange={() => handleToggle('goal_achievements')}
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Health Tips</h3>
                <p className="text-sm text-slate-400">Receive personalized health advice</p>
              </div>
              <Switch
                checked={notifications.health_tips}
                onCheckedChange={() => handleToggle('health_tips')}
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Weekly Reports</h3>
                <p className="text-sm text-slate-400">Get weekly nutrition summaries</p>
              </div>
              <Switch
                checked={notifications.weekly_reports}
                onCheckedChange={() => handleToggle('weekly_reports')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
