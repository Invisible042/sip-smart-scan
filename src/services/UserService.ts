import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DailyGoal,
  NotificationSettings,
  HealthPreferences,
  PrivacySettings,
} from '../types';

const API_BASE_URL = 'http://localhost:8000';

// Mock daily goals for offline functionality
const mockDailyGoals: DailyGoal[] = [
  {
    id: '1',
    name: 'Daily Calories',
    type: 'calories',
    target: 2000,
    current: 0,
    unit: 'cal',
    is_achieved: false,
  },
  {
    id: '2',
    name: 'Sugar Intake',
    type: 'sugar',
    target: 25,
    current: 0,
    unit: 'g',
    is_achieved: false,
  },
  {
    id: '3',
    name: 'Caffeine Limit',
    type: 'caffeine',
    target: 400,
    current: 0,
    unit: 'mg',
    is_achieved: false,
  },
  {
    id: '4',
    name: 'Water Intake',
    type: 'water',
    target: 2000,
    current: 0,
    unit: 'ml',
    is_achieved: false,
  },
];

export class UserService {
  private userId: string;

  constructor(userId: string = 'default') {
    this.userId = userId;
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/${this.userId}/notifications`
      );
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('Backend not available, using mock data');
    }

    // Fallback to mock data
    const stored = await AsyncStorage.getItem('notifications');
    if (stored) {
      return JSON.parse(stored);
    }

    const defaultSettings: NotificationSettings = {
          daily_reminders: true,
          goal_achievements: true,
          weekly_reports: true,
          reminder_time: '09:00',
        };

    await AsyncStorage.setItem('notifications', JSON.stringify(defaultSettings));
    return defaultSettings;
  }

  async updateNotificationSettings(
    settings: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/${this.userId}/notifications`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(settings),
        }
      );
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('Backend not available, using local storage');
    }

    // Fallback to local storage
    const current = await this.getNotificationSettings();
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
    return updated;
  }

  async getDailyGoals(): Promise<DailyGoal[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/${this.userId}/daily-goals`
      );
      if (response.ok) {
        const data = await response.json();
        return data.goals || [];
      }
    } catch (error) {
      console.log('Backend not available, using mock data');
    }

    // Fallback to mock data
    const stored = await AsyncStorage.getItem('daily_goals');
    if (stored) {
      const goals = JSON.parse(stored);
      // Update current values based on today's drinks
      const todayStats = await this.getTodayStats();
      return goals.map((goal: DailyGoal) => ({
        ...goal,
        current: todayStats[goal.type] || 0,
        is_achieved: (todayStats[goal.type] || 0) >= goal.target,
      }));
    }

    // Return mock goals if nothing stored
    await AsyncStorage.setItem('daily_goals', JSON.stringify(mockDailyGoals));
    return mockDailyGoals;
  }

  async getTodayStats() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/${this.userId}/drinks/today`
      );
      if (response.ok) {
        const data = await response.json();
        return data.totals || {
          calories: 0,
          sugar: 0,
          caffeine: 0,
          water: 0,
        };
      }
    } catch (error) {
      console.log('Backend not available, using local storage');
    }

    // Fallback to local storage calculation
    const drinks = await this.getDrinksFromStorage();
    const today = new Date().toDateString();
    const todayDrinks = drinks.filter(
      drink => new Date(drink.timestamp).toDateString() === today
    );

    return {
      calories: todayDrinks.reduce((sum, drink) => sum + drink.calories, 0),
      sugar: todayDrinks.reduce((sum, drink) => sum + drink.sugar, 0),
      caffeine: todayDrinks.reduce((sum, drink) => sum + (drink.caffeine || 0), 0),
      water: todayDrinks.reduce((sum, drink) => sum + (drink.water || 0), 0),
    };
  }

  async getDrinksFromStorage() {
    try {
      const stored = await AsyncStorage.getItem('drinks');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }
}
