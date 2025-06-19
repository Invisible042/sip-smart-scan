
import { DrinkData } from "@/contexts/DrinkContext";
import { LocalDatabase } from "./localDatabase";

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

export const analyzeDrink = async (imageFile: File): Promise<DrinkData> => {
  console.log('Starting drink analysis with backend...');
  
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    
    const backendData: BackendResponse = await response.json();
    
    // Convert backend response to frontend format
    const drinkData: DrinkData = {
      id: Date.now().toString(),
      name: backendData.drink_name,
      calories: backendData.nutrition.calories,
      sugar: backendData.nutrition.sugar_g,
      caffeine: backendData.nutrition.caffeine_mg,
      water: backendData.nutrition.water_ml,
      healthTip: backendData.health_tip,
      timestamp: new Date().toISOString(),
      imageUrl: URL.createObjectURL(imageFile)
    };
    
    // Save to local database
    await LocalDatabase.saveDrink(drinkData);
    
    // Update daily goals in backend
    try {
      await fetch(`${API_BASE_URL}/user/default/daily-goals`, {
        method: 'GET',
      });
    } catch (error) {
      console.warn('Could not sync with backend goals:', error);
    }
    
    console.log('Drink analyzed and saved:', drinkData.name);
    return drinkData;
    
  } catch (error) {
    console.error('Drink analysis failed:', error);
    throw error;
  }
};
