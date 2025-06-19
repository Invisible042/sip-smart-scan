
import { DrinkData } from "@/contexts/DrinkContext";

// Local storage keys
const DRINKS_KEY = 'snapdrink_drinks';
const DAILY_GOALS_KEY = 'snapdrink_daily_goals';
const USER_PREFERENCES_KEY = 'snapdrink_user_preferences';

export interface UserPreferences {
  notifications: boolean;
  healthInsights: boolean;
  dailyReminders: boolean;
  theme: 'light' | 'dark';
}

export interface StoredDrink extends Omit<DrinkData, 'timestamp'> {
  timestamp: string; // Store as ISO string for localStorage
}

// Database operations
export class LocalDatabase {
  // Drinks operations
  static async saveDrink(drink: DrinkData): Promise<void> {
    const drinks = this.getAllDrinks();
    const storedDrink: StoredDrink = {
      ...drink,
      timestamp: drink.timestamp.toISOString()
    };
    drinks.unshift(storedDrink);
    localStorage.setItem(DRINKS_KEY, JSON.stringify(drinks));
  }

  static getAllDrinks(): StoredDrink[] {
    const stored = localStorage.getItem(DRINKS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static getDrinksForDate(date: Date): StoredDrink[] {
    const drinks = this.getAllDrinks();
    const dateString = date.toDateString();
    return drinks.filter(drink => 
      new Date(drink.timestamp).toDateString() === dateString
    );
  }

  static getTodayCalories(): number {
    const today = new Date();
    const todayDrinks = this.getDrinksForDate(today);
    return todayDrinks.reduce((total, drink) => total + drink.calories, 0);
  }

  static getTodaySugar(): number {
    const today = new Date();
    const todayDrinks = this.getDrinksForDate(today);
    return todayDrinks.reduce((total, drink) => total + drink.sugar, 0);
  }

  static getTodayCaffeine(): number {
    const today = new Date();
    const todayDrinks = this.getDrinksForDate(today);
    return todayDrinks.reduce((total, drink) => total + (drink.caffeine || 0), 0);
  }

  // Goals operations
  static saveGoals(goals: any[]): void {
    localStorage.setItem(DAILY_GOALS_KEY, JSON.stringify(goals));
  }

  static getGoals(): any[] {
    const stored = localStorage.getItem(DAILY_GOALS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // User preferences
  static saveUserPreferences(preferences: UserPreferences): void {
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
  }

  static getUserPreferences(): UserPreferences {
    const stored = localStorage.getItem(USER_PREFERENCES_KEY);
    return stored ? JSON.parse(stored) : {
      notifications: true,
      healthInsights: true,
      dailyReminders: true,
      theme: 'light'
    };
  }

  // Clear all data
  static clearAllData(): void {
    localStorage.removeItem(DRINKS_KEY);
    localStorage.removeItem(DAILY_GOALS_KEY);
    localStorage.removeItem(USER_PREFERENCES_KEY);
  }
}
