const API_BASE_URL = 'http://localhost:8000';

interface NotificationSettings {
  daily_reminders: boolean;
  goal_achievements: boolean;
  health_tips: boolean;
  weekly_reports: boolean;
  reminder_time: string;
}

interface HealthPreferences {
  age?: number;
  weight?: number;
  height?: number;
  activity_level: string;
  dietary_restrictions?: string;
  health_goals?: string;
  target_calories?: number;
  target_water_ml?: number;
}

interface PrivacySettings {
  data_collection: boolean;
  analytics_tracking: boolean;
  personalized_ads: boolean;
  share_with_partners: boolean;
}

interface DailyGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  type: string;
  created_at: string;
  is_achieved: boolean;
}

export class UserService {
  private static userId = 'default';

  // Notifications
  static async getNotifications(): Promise<NotificationSettings> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${this.userId}/notifications`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Backend not available, using local settings');
    }
    
    // Fallback to localStorage
    const stored = localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : {
      daily_reminders: true,
      goal_achievements: true,
      health_tips: false,
      weekly_reports: true,
      reminder_time: "09:00"
    };
  }

  static async updateNotifications(settings: Partial<NotificationSettings>): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${this.userId}/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) return;
    } catch (error) {
      console.warn('Backend not available, saving locally');
    }
    
    // Fallback to localStorage
    const current = await this.getNotifications();
    localStorage.setItem('notifications', JSON.stringify({ ...current, ...settings }));
  }

  // Health Preferences
  static async getHealthPreferences(): Promise<HealthPreferences> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${this.userId}/health-preferences`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Backend not available, using local preferences');
    }
    
    // Fallback to localStorage
    const stored = localStorage.getItem('healthPreferences');
    return stored ? JSON.parse(stored) : {
      activity_level: "moderate"
    };
  }

  static async updateHealthPreferences(preferences: Partial<HealthPreferences>): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${this.userId}/health-preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      if (response.ok) return;
    } catch (error) {
      console.warn('Backend not available, saving locally');
    }
    
    // Fallback to localStorage
    const current = await this.getHealthPreferences();
    localStorage.setItem('healthPreferences', JSON.stringify({ ...current, ...preferences }));
  }

  // Privacy Settings
  static async getPrivacySettings(): Promise<PrivacySettings> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${this.userId}/privacy`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Backend not available, using local settings');
    }
    
    // Fallback to localStorage
    const stored = localStorage.getItem('privacySettings');
    return stored ? JSON.parse(stored) : {
      data_collection: true,
      analytics_tracking: false,
      personalized_ads: false,
      share_with_partners: false
    };
  }

  static async updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${this.userId}/privacy`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) return;
    } catch (error) {
      console.warn('Backend not available, saving locally');
    }
    
    // Fallback to localStorage
    const current = await this.getPrivacySettings();
    localStorage.setItem('privacySettings', JSON.stringify({ ...current, ...settings }));
  }

  // Daily Goals
  static async getDailyGoals(): Promise<DailyGoal[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${this.userId}/daily-goals`);
      if (response.ok) {
        const data = await response.json();
        return data.goals;
      }
    } catch (error) {
      console.warn('Backend not available, using default goals');
    }
    
    // Fallback to default goals
    return [
      {
        id: '1',
        name: 'Daily Calories',
        target: 2000,
        current: 0,
        unit: 'kcal',
        type: 'calories',
        created_at: new Date().toISOString(),
        is_achieved: false
      },
      {
        id: '2',
        name: 'Daily Water',
        target: 2000,
        current: 0,
        unit: 'ml',
        type: 'water',
        created_at: new Date().toISOString(),
        is_achieved: false
      },
      {
        id: '3',
        name: 'Sugar Limit',
        target: 50,
        current: 0,
        unit: 'g',
        type: 'sugar',
        created_at: new Date().toISOString(),
        is_achieved: false
      }
    ];
  }

  static async createDailyGoal(goal: { name: string; target: number; unit: string; type: string }): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${this.userId}/daily-goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal)
      });
      if (response.ok) return;
    } catch (error) {
      console.warn('Backend not available, goal not synced');
    }
  }

  static async updateDailyGoal(goalId: string, updates: { target?: number; current?: number }): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${this.userId}/daily-goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) return;
    } catch (error) {
      console.warn('Backend not available, goal update not synced');
    }
  }

  static async getUserStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${this.userId}/stats`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Backend not available for stats');
    }
    
    return {
      total_goals: 3,
      achieved_goals: 0,
      achievement_rate: 0
    };
  }

  // Drink History
  static async getDrinkHistory(limit?: number) {
    try {
      const url = limit ? `${API_BASE_URL}/user/${this.userId}/drinks?limit=${limit}` : `${API_BASE_URL}/user/${this.userId}/drinks`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data.drinks;
      }
    } catch (error) {
      console.warn('Backend not available for drink history');
    }
    
    // Fallback to localStorage
    const stored = localStorage.getItem('drinkHistory');
    return stored ? JSON.parse(stored) : [];
  }

  static async getTodayDrinks() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${this.userId}/drinks/today`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Backend not available for today drinks');
    }
    
    // Fallback to localStorage with date filtering
    const stored = localStorage.getItem('drinkHistory');
    if (stored) {
      const drinks = JSON.parse(stored);
      const today = new Date().toDateString();
      return {
        drinks: drinks.filter((drink: any) => new Date(drink.timestamp).toDateString() === today),
        totals: { calories: 0, sugar_g: 0, caffeine_mg: 0, water_ml: 0, drink_count: 0 }
      };
    }
    
    return { drinks: [], totals: { calories: 0, sugar_g: 0, caffeine_mg: 0, water_ml: 0, drink_count: 0 } };
  }

  static async getWeeklyStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${this.userId}/drinks/weekly-stats`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Backend not available for weekly stats');
    }
    
    return {
      weekly_stats: {
        total_drinks: 0,
        total_calories: 0,
        avg_drinks_per_day: 0,
        most_consumed_drink: 'None'
      }
    };
  }

  static async getHealthInsights() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${this.userId}/health-insights`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Backend not available for health insights');
    }
    
    return { insights: ['Keep tracking your drinks for personalized insights!'] };
  }
}