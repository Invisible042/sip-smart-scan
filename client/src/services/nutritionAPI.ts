
import { DrinkData } from "@/contexts/DrinkContext";

// DEPRECATED: This file is replaced by the Python FastAPI backend
// All nutrition analysis is now handled by the backend at /upload endpoint

// Legacy nutrition database kept for reference only
const nutritionDatabase: Record<string, Omit<DrinkData, 'id' | 'timestamp' | 'image'>> = {
  'coca-cola': {
    name: 'Coca-Cola Classic',
    calories: 140,
    sugar: 39,
    caffeine: 34,
    healthInsight: 'High sugar content (39g) exceeds daily recommended intake for added sugars. Contains phosphoric acid which may affect bone health.',
    alternative: 'Try Coke Zero Sugar (0 calories) or sparkling water with a splash of fruit juice.'
  },
  'pepsi': {
    name: 'Pepsi Cola',
    calories: 150,
    sugar: 41,
    caffeine: 38,
    healthInsight: 'Very high sugar content. One can contains more sugar than the WHO recommends for an entire day.',
    alternative: 'Consider Pepsi Zero Sugar or infused water with natural flavors.'
  },
  'orange juice': {
    name: 'Orange Juice',
    calories: 110,
    sugar: 24,
    caffeine: 0,
    healthInsight: 'High natural sugar content but provides Vitamin C and folate. Better consumed with meals to slow sugar absorption.',
    alternative: 'Try eating whole oranges for fiber, or dilute with sparkling water.'
  },
  'apple juice': {
    name: 'Apple Juice',
    calories: 114,
    sugar: 24,
    caffeine: 0,
    healthInsight: 'Contains natural sugars but lacks fiber found in whole apples. May cause blood sugar spikes.',
    alternative: 'Eat whole apples or try diluted apple juice with sparkling water.'
  },
  'green tea': {
    name: 'Green Tea',
    calories: 2,
    sugar: 0,
    caffeine: 25,
    healthInsight: 'Excellent choice! Rich in antioxidants (catechins) that may boost metabolism and support heart health.',
    alternative: 'Perfect as is. Try different varieties like matcha or jasmine green tea.'
  },
  'black coffee': {
    name: 'Black Coffee',
    calories: 5,
    sugar: 0,
    caffeine: 95,
    healthInsight: 'Great choice! Rich in antioxidants and may improve focus and metabolism. Moderate caffeine content.',
    alternative: 'Already optimal. Add cinnamon for extra antioxidants if desired.'
  },
  'sparkling water': {
    name: 'Sparkling Water',
    calories: 0,
    sugar: 0,
    caffeine: 0,
    healthInsight: 'Perfect hydration choice! Zero calories, helps with fullness, and provides the satisfaction of carbonation.',
    alternative: 'Add fresh lemon, lime, or cucumber for natural flavor enhancement.'
  },
  'energy drink': {
    name: 'Energy Drink',
    calories: 160,
    sugar: 37,
    caffeine: 160,
    healthInsight: 'Very high caffeine and sugar content. May cause jitters, crashes, and sleep disruption. Not recommended for daily consumption.',
    alternative: 'Try green tea or black coffee for natural energy, or electrolyte water for hydration.'
  },
  'sports drink': {
    name: 'Sports Drink',
    calories: 80,
    sugar: 21,
    caffeine: 0,
    healthInsight: 'Designed for intense exercise recovery. High sugar content unnecessary for daily activities.',
    alternative: 'Plain water for normal activities, coconut water for natural electrolytes.'
  },
  'diet soda': {
    name: 'Diet Soda',
    calories: 0,
    sugar: 0,
    caffeine: 40,
    healthInsight: 'Zero calories but contains artificial sweeteners. Better than regular soda but not ideal for frequent consumption.',
    alternative: 'Sparkling water with natural fruit essence or kombucha for probiotics.'
  }
};

// Simulate API delay for realistic experience
const simulateAPIDelay = (ms: number = 1500) => 
  new Promise(resolve => setTimeout(resolve, ms));

export class NutritionAPI {
  // Enhanced drink detection with more sophisticated matching
  static async detectDrinkFromImage(imageFile: File): Promise<string> {
    console.log('🔍 Analyzing image for drink detection:', imageFile.name);
    
    await simulateAPIDelay(2000);
    
    // Simulate Google Vision API with weighted random selection
    const drinkKeys = Object.keys(nutritionDatabase);
    const commonDrinks = ['coca-cola', 'pepsi', 'orange juice', 'green tea', 'black coffee'];
    const lessCommon = drinkKeys.filter(drink => !commonDrinks.includes(drink));
    
    // 70% chance of common drinks, 30% chance of less common
    const isCommon = Math.random() < 0.7;
    const selectedDrinks = isCommon ? commonDrinks : lessCommon;
    const detectedDrink = selectedDrinks[Math.floor(Math.random() * selectedDrinks.length)];
    
    console.log('✅ Detected drink:', detectedDrink);
    return detectedDrink;
  }

  // Get comprehensive nutrition data
  static async getNutritionData(drinkName: string): Promise<Omit<DrinkData, 'id' | 'timestamp' | 'image'>> {
    console.log('📊 Fetching nutrition data for:', drinkName);
    
    await simulateAPIDelay(1000);
    
    const nutritionData = nutritionDatabase[drinkName.toLowerCase()] || nutritionDatabase['coca-cola'];
    
    // Add dynamic health insights based on user's daily intake
    const enhancedData = {
      ...nutritionData,
      healthInsight: this.generatePersonalizedHealthInsight(nutritionData)
    };
    
    console.log('✅ Nutrition data retrieved:', enhancedData);
    return enhancedData;
  }

  // Generate personalized health insights
  private static generatePersonalizedHealthInsight(drinkData: any): string {
    const todayCalories = this.getTodayCaloriesFromStorage();
    const baseInsight = drinkData.healthInsight;
    
    let personalizedInsight = baseInsight;
    
    // Add personalized warnings based on daily intake
    if (todayCalories + drinkData.calories > 2000) {
      personalizedInsight += " ⚠️ This will exceed your daily calorie goal.";
    }
    
    if (drinkData.sugar > 30) {
      personalizedInsight += " 🚨 High sugar alert: Consider limiting sugary drinks today.";
    }
    
    if (drinkData.caffeine > 100) {
      personalizedInsight += " ☕ High caffeine content - monitor your total daily intake.";
    }
    
    return personalizedInsight;
  }

  // Helper to get today's calories from localStorage
  private static getTodayCaloriesFromStorage(): number {
    const stored = localStorage.getItem('snapdrink_drinks');
    if (!stored) return 0;
    
    const drinks = JSON.parse(stored);
    const today = new Date().toDateString();
    
    return drinks
      .filter((drink: any) => new Date(drink.timestamp).toDateString() === today)
      .reduce((total: number, drink: any) => total + drink.calories, 0);
  }

  // Comprehensive drink analysis
  static async analyzeDrink(imageFile: File): Promise<DrinkData> {
    console.log('🚀 Starting comprehensive drink analysis...');
    
    try {
      // Step 1: Detect drink from image
      const detectedDrink = await this.detectDrinkFromImage(imageFile);
      
      // Step 2: Get nutrition data
      const nutritionData = await this.getNutritionData(detectedDrink);
      
      // Step 3: Create image URL
      const imageUrl = URL.createObjectURL(imageFile);
      
      // Step 4: Compile final result
      const result: DrinkData = {
        id: Date.now().toString(),
        ...nutritionData,
        image: imageUrl,
        timestamp: new Date()
      };
      
      console.log('✅ Analysis complete:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Error during drink analysis:', error);
      throw new Error('Failed to analyze drink. Please try again.');
    }
  }

  // Get health recommendations based on drinking patterns
  static getHealthRecommendations(drinks: DrinkData[]): string[] {
    const recommendations: string[] = [];
    const totalCalories = drinks.reduce((sum, drink) => sum + drink.calories, 0);
    const totalSugar = drinks.reduce((sum, drink) => sum + drink.sugar, 0);
    const totalCaffeine = drinks.reduce((sum, drink) => sum + (drink.caffeine || 0), 0);
    
    if (totalCalories > 500) {
      recommendations.push("Consider switching to lower-calorie alternatives to manage daily intake.");
    }
    
    if (totalSugar > 50) {
      recommendations.push("You've consumed high amounts of sugar today. Try water or unsweetened beverages.");
    }
    
    if (totalCaffeine > 400) {
      recommendations.push("High caffeine intake detected. Consider limiting coffee/tea for better sleep.");
    }
    
    if (drinks.length > 5) {
      recommendations.push("Great job tracking your drinks! Keep monitoring for better health insights.");
    }
    
    return recommendations;
  }
}
