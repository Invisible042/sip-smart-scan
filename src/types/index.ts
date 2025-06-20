export interface DrinkData {
  id: string;
  name: string;
  calories: number;
  sugar: number;
  caffeine?: number;
  water?: number;
  image?: string;
  timestamp: string;
  healthTip?: string;
}

export interface DailyGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  type: 'calories' | 'drinks' | 'sugar' | 'caffeine' | 'water';
  is_achieved?: boolean;
}

export interface NotificationSettings {
  daily_reminders: boolean;
  goal_achievements: boolean;
  health_tips: boolean;
  weekly_reports: boolean;
  reminder_time: string;
}

export interface HealthPreferences {
  age?: number;
  weight?: number;
  height?: number;
  activity_level: string;
  dietary_restrictions?: string;
  health_goals?: string;
  target_calories?: number;
  target_water_ml?: number;
}

export interface PrivacySettings {
  data_collection: boolean;
  analytics_tracking: boolean;
  personalized_ads: boolean;
  share_with_partners: boolean;
}
