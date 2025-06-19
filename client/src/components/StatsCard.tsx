import { useState, useEffect } from "react";
import { UserService } from "@/services/userService";

interface StatsCardProps {
  title: string;
  value: number;
  unit: string;
  icon: string;
  color: string;
}

export const StatsCard = ({ title, value, unit, icon, color }: StatsCardProps) => {
  return (
    <div className={`bg-gradient-to-r ${color} rounded-xl p-4 text-white`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm opacity-90">{title}</span>
      </div>
      <div className="text-2xl font-bold">{value}{unit}</div>
    </div>
  );
};

interface WeeklyStatsProps {
  className?: string;
}

export const WeeklyStats = ({ className }: WeeklyStatsProps) => {
  const [stats, setStats] = useState({
    total_drinks: 0,
    total_calories: 0,
    avg_drinks_per_day: 0,
    most_consumed_drink: 'None'
  });

  useEffect(() => {
    loadWeeklyStats();
  }, []);

  const loadWeeklyStats = async () => {
    try {
      const weeklyData = await UserService.getWeeklyStats();
      setStats(weeklyData.weekly_stats);
    } catch (error) {
      console.warn('Could not load weekly stats');
    }
  };

  return (
    <div className={`bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm ${className}`}>
      <h3 className="text-white font-semibold mb-4">Weekly Overview</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-white">
          <span>Total Drinks</span>
          <span className="font-semibold">{stats.total_drinks}</span>
        </div>
        <div className="flex justify-between text-white">
          <span>Total Calories</span>
          <span className="font-semibold">{Math.round(stats.total_calories)}</span>
        </div>
        <div className="flex justify-between text-white">
          <span>Daily Average</span>
          <span className="font-semibold">{stats.avg_drinks_per_day.toFixed(1)} drinks</span>
        </div>
        <div className="flex justify-between text-white">
          <span>Most Consumed</span>
          <span className="font-semibold text-teal-400">{stats.most_consumed_drink}</span>
        </div>
      </div>
    </div>
  );
};