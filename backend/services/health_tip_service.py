import os
from models.response_models import NutritionData
from typing import Dict, Any

# Conditional import for OpenAI
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    OpenAI = None

class HealthTipService:
    def __init__(self):
        # Initialize OpenAI client for OpenRouter
        self.client = None
        self._setup_client()
        
        # Predefined health tips for fallback
        self.health_tips_database = {
            "high_sugar": [
                "This drink is high in sugar. Consider limiting to occasional treats to maintain stable blood sugar levels.",
                "High sugar content detected. Try diluting with water or choosing sugar-free alternatives.",
                "Sweet drinks can lead to energy crashes. Consider pairing with protein for better energy balance."
            ],
            "high_caffeine": [
                "High caffeine content. Avoid drinking late in the day to prevent sleep disruption.",
                "This drink contains significant caffeine. Monitor your total daily intake to stay under 400mg.",
                "Caffeine can be dehydrating. Make sure to drink extra water throughout the day."
            ],
            "high_calories": [
                "This drink is calorie-dense. Consider it as part of your daily caloric intake rather than extra.",
                "High-calorie beverages can contribute to weight gain. Try smaller portions or lower-calorie alternatives.",
                "Liquid calories add up quickly. Consider whether you're getting nutritional value for these calories."
            ],
            "healthy": [
                "Great choice! This drink provides hydration with minimal added sugars.",
                "This is a nutritious option that supports your daily fluid and nutrient needs.",
                "Excellent selection for maintaining good health and energy levels."
            ],
            "moderate": [
                "This drink is okay in moderation. Balance it with water and nutrient-dense foods.",
                "Not bad as an occasional treat. Consider the timing and portion size.",
                "Moderate choice - enjoy mindfully and consider your overall daily nutrition."
            ]
        }
    
    def _setup_client(self):
        """Initialize OpenAI client for OpenRouter"""
        try:
            openrouter_api_key = os.getenv('OPENROUTER_API_KEY')
            if OPENAI_AVAILABLE and openrouter_api_key:
                self.client = OpenAI(
                    base_url="https://openrouter.ai/api/v1",
                    api_key=openrouter_api_key,
                )
        except Exception as e:
            print(f"OpenRouter setup failed: {e}")
            self.client = None
    
    async def generate_health_tip(self, drink_name: str, nutrition_data: NutritionData) -> str:
        """Generate a health tip based on drink and nutrition data"""
        if self.client:
            try:
                return await self._generate_ai_tip(drink_name, nutrition_data)
            except Exception as e:
                print(f"AI health tip generation failed: {e}")
                return self._generate_fallback_tip(nutrition_data)
        else:
            return self._generate_fallback_tip(nutrition_data)
    
    async def _generate_ai_tip(self, drink_name: str, nutrition_data: NutritionData) -> str:
        """Generate health tip using AI"""
        prompt = f"""
        As a friendly nutritionist, provide a short, positive health tip (max 2 sentences) for someone who just consumed {drink_name}.
        
        Nutrition facts:
        - Calories: {nutrition_data.calories}
        - Sugar: {nutrition_data.sugar_g}g
        - Caffeine: {nutrition_data.caffeine_mg}mg
        - Sodium: {nutrition_data.sodium_mg}mg
        
        Make the tip practical, encouraging, and focused on balance rather than restriction.
        """
        
        response = self.client.chat.completions.create(
            model="anthropic/claude-3.5-sonnet",  # You can change this to other models
            messages=[
                {"role": "system", "content": "You are a friendly, knowledgeable nutritionist who gives practical, positive health advice."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
    
    def _generate_fallback_tip(self, nutrition_data: NutritionData) -> str:
        """Generate health tip from predefined database"""
        import random
        
        # Categorize the drink based on nutrition
        category = self._categorize_drink(nutrition_data)
        
        # Get appropriate tips for the category
        tips = self.health_tips_database.get(category, self.health_tips_database["moderate"])
        
        return random.choice(tips)
    
    def _categorize_drink(self, nutrition_data: NutritionData) -> str:
        """Categorize drink based on nutritional content"""
        # High sugar threshold (>20g per serving)
        if nutrition_data.sugar_g > 20:
            return "high_sugar"
        
        # High caffeine threshold (>80mg per serving)
        if nutrition_data.caffeine_mg > 80:
            return "high_caffeine"
        
        # High calories threshold (>150 per serving)
        if nutrition_data.calories > 150:
            return "high_calories"
        
        # Healthy drink (low sugar, low calories)
        if nutrition_data.sugar_g < 5 and nutrition_data.calories < 50:
            return "healthy"
        
        # Everything else is moderate
        return "moderate"
    
    def is_available(self) -> bool:
        """Check if health tip service is available"""
        return True  # Always available due to fallback tips