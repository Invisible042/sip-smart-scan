
import { DrinkData } from "@/contexts/DrinkContext";
import { NutritionAPI } from "./nutritionAPI";
import { LocalDatabase } from "./localDatabase";

export const analyzeDrink = async (imageFile: File): Promise<DrinkData> => {
  console.log('🔍 Starting drink analysis process...');
  
  try {
    // Use the enhanced nutrition API
    const drinkData = await NutritionAPI.analyzeDrink(imageFile);
    
    // Save to local database
    await LocalDatabase.saveDrink(drinkData);
    
    console.log('✅ Drink analyzed and saved:', drinkData.name);
    return drinkData;
    
  } catch (error) {
    console.error('❌ Drink analysis failed:', error);
    throw error;
  }
};

// Legacy functions for backward compatibility
export const detectDrinkFromImage = async (imageFile: File): Promise<string> => {
  return await NutritionAPI.detectDrinkFromImage(imageFile);
};

export const getNutritionData = async (drinkName: string) => {
  return await NutritionAPI.getNutritionData(drinkName);
};

// New health insights function
export const getHealthInsights = (drinks: DrinkData[]): string[] => {
  return NutritionAPI.getHealthRecommendations(drinks);
};
