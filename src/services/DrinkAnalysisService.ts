import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrinkData } from '../types';

const API_BASE_URL = 'http://localhost:8000';

interface BackendResponse {
  drink_name: string;
  nutrition: {
    calories: number;
    sugar_g: number;
    caffeine_mg: number;
    water_ml: number;
    sodium_mg?: number;
    carbs_g?: number;
    protein_g?: number;
  };
  health_tip: string;
  confidence_score: number;
}

export class DrinkAnalysisService {
  static async analyzeDrink(imageUri: string): Promise<DrinkData> {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'drink.jpg',
      } as any);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const backendData: BackendResponse = await response.json();

      const drinkData: DrinkData = {
        id: Date.now().toString(),
        name: backendData.drink_name,
        calories: backendData.nutrition.calories,
        sugar: backendData.nutrition.sugar_g,
        caffeine: backendData.nutrition.caffeine_mg,
        water: backendData.nutrition.water_ml,
        healthTip: backendData.health_tip,
        timestamp: new Date().toISOString(),
        image: imageUri
      };

      await this.saveDrinkLocally(drinkData);
      return drinkData;
      
    } catch (error) {
      console.error('Drink analysis failed:', error);
      throw error;
    }
  }

  private static async saveDrinkLocally(drink: DrinkData): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('drinks');
      const drinks = stored ? JSON.parse(stored) : [];
      drinks.unshift(drink);
      await AsyncStorage.setItem('drinks', JSON.stringify(drinks));
    } catch (error) {
      console.error('Failed to save drink locally:', error);
    }
  }

  static async getDrinksFromStorage(): Promise<DrinkData[]> {
    try {
      const stored = await AsyncStorage.getItem('drinks');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  static async getTodayDrinks(): Promise<DrinkData[]> {
    const drinks = await this.getDrinksFromStorage();
    const today = new Date().toDateString();
    return drinks.filter(drink => 
      new Date(drink.timestamp).toDateString() === today
    );
  }

  static async getTodayStats() {
    const todayDrinks = await this.getTodayDrinks();
    return {
      calories: todayDrinks.reduce((sum, drink) => sum + drink.calories, 0),
      sugar: todayDrinks.reduce((sum, drink) => sum + drink.sugar, 0),
      caffeine: todayDrinks.reduce((sum, drink) => sum + (drink.caffeine || 0), 0),
      water: todayDrinks.reduce((sum, drink) => sum + (drink.water || 0), 0),
      drinkCount: todayDrinks.length
    };
  }
}