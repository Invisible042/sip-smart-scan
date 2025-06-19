import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyGoal, NotificationSettings, HealthPreferences, PrivacySettings } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export class UserService {
  private static userId = 'default';

  static async getNotifications(): Promise<NotificationSettings> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${this.userId}/notifications`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      // Silent fallback
    }
    
    const stored = await AsyncStorage.getItem('notifications');
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
      // Silent fallback
    }
    
    const current = await this.getNotifications();
    await AsyncStorage.setItem('notifications', JSON.stringify({ ...current, ...settings }));
  }

  static async getDailyGoals(): Promise<DailyGoal[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${this.userId}/daily-goals`);
      if (response.ok) {
        const data = await response.json();
        return data.goals;
      }
    } catch (error) {
      // Silent fallback
    }
    
    return [
      {
        id: '1',
        name: 'Daily Calories',
        target: 2000,
        current: 0,
        unit: 'kcal',
        type: 'calories',
        is_achieved: false
      },
      {
        id: '2',
        name: 'Daily Water',
        target: 2000,
        current: 0,
        unit: 'ml',
        type: 'water',
        is_achieved: false
      },
      {
        id: '3',
        name: 'Sugar Limit',
        target: 50,
        current: 0,
        unit: 'g',
        type: 'sugar',
        is_achieved: false
      }
    ];
  }

  static async getTodayDrinks() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${this.userId}/drinks/today`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      // Silent fallback
    }
    
    return { 
      drinks: [], 
      totals: { 
        calories: 0, 
        sugar_g: 0, 
        caffeine_mg: 0, 
        water_ml: 0, 
        drink_count: 0 
      } 
    };
  }
}