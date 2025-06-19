import os
import requests
from typing import Dict, Any
from models.response_models import NutritionData

class NutritionService:
    def __init__(self):
        self.nutritionix_app_id = os.getenv('NUTRITIONIX_APP_ID')
        self.nutritionix_app_key = os.getenv('NUTRITIONIX_APP_KEY')
        self.base_url = "https://trackapi.nutritionix.com/v2"
        
        # Comprehensive nutrition database for common drinks
        self.nutrition_database = {
            "Coca Cola": {"calories": 140, "sugar_g": 39, "caffeine_mg": 34, "water_ml": 330, "sodium_mg": 45, "carbs_g": 39},
            "Pepsi": {"calories": 150, "sugar_g": 41, "caffeine_mg": 38, "water_ml": 330, "sodium_mg": 30, "carbs_g": 41},
            "Sprite": {"calories": 140, "sugar_g": 38, "caffeine_mg": 0, "water_ml": 330, "sodium_mg": 65, "carbs_g": 38},
            "Fanta": {"calories": 160, "sugar_g": 44, "caffeine_mg": 0, "water_ml": 330, "sodium_mg": 45, "carbs_g": 44},
            "Orange Juice": {"calories": 110, "sugar_g": 22, "caffeine_mg": 0, "water_ml": 240, "sodium_mg": 2, "carbs_g": 26, "protein_g": 2},
            "Apple Juice": {"calories": 114, "sugar_g": 24, "caffeine_mg": 0, "water_ml": 240, "sodium_mg": 10, "carbs_g": 28, "protein_g": 0.2},
            "Coffee": {"calories": 5, "sugar_g": 0, "caffeine_mg": 95, "water_ml": 240, "sodium_mg": 5, "carbs_g": 1, "protein_g": 0.3},
            "Tea": {"calories": 2, "sugar_g": 0, "caffeine_mg": 47, "water_ml": 240, "sodium_mg": 7, "carbs_g": 0.7, "protein_g": 0},
            "Water": {"calories": 0, "sugar_g": 0, "caffeine_mg": 0, "water_ml": 500, "sodium_mg": 0, "carbs_g": 0, "protein_g": 0},
            "Beer": {"calories": 154, "sugar_g": 0, "caffeine_mg": 0, "water_ml": 355, "sodium_mg": 14, "carbs_g": 13, "protein_g": 1.6},
            "Wine": {"calories": 125, "sugar_g": 1, "caffeine_mg": 0, "water_ml": 147, "sodium_mg": 6, "carbs_g": 4, "protein_g": 0.1},
            "Red Bull": {"calories": 110, "sugar_g": 27, "caffeine_mg": 80, "water_ml": 250, "sodium_mg": 105, "carbs_g": 28},
            "Monster Energy": {"calories": 210, "sugar_g": 54, "caffeine_mg": 160, "water_ml": 473, "sodium_mg": 370, "carbs_g": 54, "protein_g": 0},
            "Gatorade": {"calories": 80, "sugar_g": 21, "caffeine_mg": 0, "water_ml": 355, "sodium_mg": 160, "carbs_g": 21},
            "Powerade": {"calories": 80, "sugar_g": 21, "caffeine_mg": 0, "water_ml": 355, "sodium_mg": 150, "carbs_g": 21},
            "Energy Drink": {"calories": 160, "sugar_g": 40, "caffeine_mg": 120, "water_ml": 330, "sodium_mg": 200, "carbs_g": 42},
            "Sports Drink": {"calories": 80, "sugar_g": 21, "caffeine_mg": 0, "water_ml": 355, "sodium_mg": 155, "carbs_g": 21}
        }
    
    async def get_nutrition_info(self, drink_name: str) -> NutritionData:
        """Get nutrition information for a drink"""
        # First try Nutritionix API if available
        if self.nutritionix_app_id and self.nutritionix_app_key:
            try:
                nutrition_data = await self._get_from_nutritionix(drink_name)
                if nutrition_data:
                    return nutrition_data
            except Exception as e:
                print(f"Nutritionix API failed: {e}")
        
        # Fallback to local database
        return self._get_from_database(drink_name)
    
    async def _get_from_nutritionix(self, drink_name: str) -> NutritionData:
        """Get nutrition data from Nutritionix API"""
        headers = {
            'x-app-id': self.nutritionix_app_id,
            'x-app-key': self.nutritionix_app_key,
            'Content-Type': 'application/json'
        }
        
        data = {
            "query": drink_name,
            "num_servings": 1
        }
        
        response = requests.post(
            f"{self.base_url}/natural/nutrients",
            headers=headers,
            json=data,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get('foods'):
                food = result['foods'][0]
                return NutritionData(
                    calories=food.get('nf_calories', 0),
                    sugar_g=food.get('nf_sugars', 0),
                    caffeine_mg=food.get('nf_caffeine', 0) or 0,
                    water_ml=food.get('serving_weight_grams', 250),  # Approximate
                    sodium_mg=food.get('nf_sodium', 0),
                    carbs_g=food.get('nf_total_carbohydrate', 0),
                    protein_g=food.get('nf_protein', 0)
                )
        
        return None
    
    def _get_from_database(self, drink_name: str) -> NutritionData:
        """Get nutrition data from local database"""
        # Direct match first
        if drink_name in self.nutrition_database:
            data = self.nutrition_database[drink_name]
            return NutritionData(**data)
        
        # Fuzzy matching for similar drinks
        drink_lower = drink_name.lower()
        for key, data in self.nutrition_database.items():
            if key.lower() in drink_lower or drink_lower in key.lower():
                return NutritionData(**data)
        
        # Default values for unknown drinks
        return NutritionData(
            calories=100,
            sugar_g=25,
            caffeine_mg=0,
            water_ml=250,
            sodium_mg=10,
            carbs_g=25,
            protein_g=0
        )
    
    def is_available(self) -> bool:
        """Check if nutrition service is available"""
        return True  # Always available due to fallback database