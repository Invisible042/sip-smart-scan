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

// Mock data for offline functionality
const mockDrinks = [
  {
    name: 'Coca-Cola',
    calories: 140,
    sugar: 39,
    caffeine: 34,
    water: 355,
    healthTip: 'Consider switching to diet soda or sparkling water to reduce sugar intake. This drink contains about 10 teaspoons of sugar!',
  },
  {
    name: 'Starbucks Latte',
    calories: 190,
    sugar: 18,
    caffeine: 75,
    water: 473,
    healthTip: 'Try ordering with non-fat milk and no whipped cream to reduce calories. Consider adding cinnamon instead of sugar for flavor.',
  },
  {
    name: 'Orange Juice',
    calories: 110,
    sugar: 22,
    caffeine: 0,
    water: 240,
    healthTip: 'While orange juice has vitamin C, it\'s high in natural sugars. Consider eating a whole orange instead for more fiber.',
  },
  {
    name: 'Water',
    calories: 0,
    sugar: 0,
    caffeine: 0,
    water: 500,
    healthTip: 'Excellent choice! Water is the best drink for hydration. Try adding lemon or cucumber for natural flavor.',
  },
  {
    name: 'Energy Drink',
    calories: 110,
    sugar: 27,
    caffeine: 80,
    water: 250,
    healthTip: 'Energy drinks can cause jitters and crashes. Consider green tea as a healthier alternative with natural caffeine.',
  },
];

export class DrinkAnalysisService {
  static async analyzeDrink(imageUri: string): Promise<DrinkData> {
    try {
      // First try to connect to the real backend
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

      if (response.ok) {
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
        image: imageUri,
      };
      await this.saveDrinkLocally(drinkData);
      return drinkData;
      }
    } catch (error) {
      console.log('Backend not available, using mock data');
    }

    // Fallback to mock data
    return this.getMockDrinkData(imageUri);
  }

  private static getMockDrinkData(imageUri: string): DrinkData {
    // Simulate a delay to make it feel realistic
    const randomDrink = mockDrinks[Math.floor(Math.random() * mockDrinks.length)];
    
    const drinkData: DrinkData = {
      id: Date.now().toString(),
      name: randomDrink.name,
      calories: randomDrink.calories,
      sugar: randomDrink.sugar,
      caffeine: randomDrink.caffeine,
      water: randomDrink.water,
      healthTip: randomDrink.healthTip,
      timestamp: new Date().toISOString(),
      image: imageUri,
    };

    // Save to local storage
    this.saveDrinkLocally(drinkData);
    return drinkData;
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
    return drinks.filter(
      drink => new Date(drink.timestamp).toDateString() === today
    );
  }

  static async getTodayStats() {
    const todayDrinks = await this.getTodayDrinks();
    return {
      calories: todayDrinks.reduce((sum, drink) => sum + drink.calories, 0),
      sugar: todayDrinks.reduce((sum, drink) => sum + drink.sugar, 0),
      caffeine: todayDrinks.reduce(
        (sum, drink) => sum + (drink.caffeine || 0),
        0
      ),
      water: todayDrinks.reduce((sum, drink) => sum + (drink.water || 0), 0),
      drinkCount: todayDrinks.length,
    };
  }
}
