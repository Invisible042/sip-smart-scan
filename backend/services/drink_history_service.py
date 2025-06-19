import json
import os
from datetime import datetime, date, timedelta
from typing import List, Dict, Optional
from models.response_models import NutritionData

class DrinkHistoryService:
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        os.makedirs(data_dir, exist_ok=True)
        self.drinks_file = os.path.join(data_dir, "drink_history.json")
        self._load_data()

    def _load_data(self):
        """Load drink history from file"""
        try:
            with open(self.drinks_file, 'r') as f:
                self.drinks_data = json.load(f)
        except FileNotFoundError:
            self.drinks_data = {}

    def _save_data(self):
        """Save drink history to file"""
        with open(self.drinks_file, 'w') as f:
            json.dump(self.drinks_data, f, indent=2, default=str)

    def add_drink(self, user_id: str, drink_name: str, nutrition: NutritionData, health_tip: str) -> Dict:
        """Add a drink to user's history"""
        if user_id not in self.drinks_data:
            self.drinks_data[user_id] = []

        drink_entry = {
            "id": f"{user_id}_{len(self.drinks_data[user_id]) + 1}_{int(datetime.now().timestamp())}",
            "name": drink_name,
            "calories": nutrition.calories,
            "sugar_g": nutrition.sugar_g,
            "caffeine_mg": nutrition.caffeine_mg,
            "water_ml": nutrition.water_ml,
            "sodium_mg": nutrition.sodium_mg,
            "carbs_g": nutrition.carbs_g,
            "protein_g": nutrition.protein_g,
            "health_tip": health_tip,
            "timestamp": datetime.now().isoformat(),
            "date": date.today().isoformat()
        }

        self.drinks_data[user_id].append(drink_entry)
        self._save_data()
        return drink_entry

    def get_user_drinks(self, user_id: str, limit: Optional[int] = None) -> List[Dict]:
        """Get all drinks for a user"""
        user_drinks = self.drinks_data.get(user_id, [])
        # Sort by timestamp (newest first)
        user_drinks.sort(key=lambda x: x['timestamp'], reverse=True)
        
        if limit:
            return user_drinks[:limit]
        return user_drinks

    def get_today_drinks(self, user_id: str) -> List[Dict]:
        """Get today's drinks for a user"""
        today = date.today().isoformat()
        user_drinks = self.drinks_data.get(user_id, [])
        return [drink for drink in user_drinks if drink.get('date') == today]

    def get_drinks_by_date_range(self, user_id: str, start_date: date, end_date: date) -> List[Dict]:
        """Get drinks within a date range"""
        user_drinks = self.drinks_data.get(user_id, [])
        filtered_drinks = []
        
        for drink in user_drinks:
            drink_date = date.fromisoformat(drink.get('date', '1970-01-01'))
            if start_date <= drink_date <= end_date:
                filtered_drinks.append(drink)
        
        return filtered_drinks

    def get_weekly_stats(self, user_id: str) -> Dict:
        """Get weekly drinking statistics"""
        end_date = date.today()
        start_date = end_date - timedelta(days=7)
        week_drinks = self.get_drinks_by_date_range(user_id, start_date, end_date)
        
        total_calories = sum(drink.get('calories', 0) for drink in week_drinks)
        total_sugar = sum(drink.get('sugar_g', 0) for drink in week_drinks)
        total_caffeine = sum(drink.get('caffeine_mg', 0) for drink in week_drinks)
        total_water = sum(drink.get('water_ml', 0) for drink in week_drinks)
        
        # Group by drink type
        drink_types = {}
        for drink in week_drinks:
            name = drink.get('name', 'Unknown')
            if name not in drink_types:
                drink_types[name] = 0
            drink_types[name] += 1
        
        # Get most consumed drink
        most_consumed = max(drink_types.items(), key=lambda x: x[1]) if drink_types else ('None', 0)
        
        return {
            "total_drinks": len(week_drinks),
            "total_calories": total_calories,
            "total_sugar_g": total_sugar,
            "total_caffeine_mg": total_caffeine,
            "total_water_ml": total_water,
            "avg_calories_per_day": total_calories / 7,
            "avg_drinks_per_day": len(week_drinks) / 7,
            "most_consumed_drink": most_consumed[0],
            "most_consumed_count": most_consumed[1],
            "drink_breakdown": drink_types,
            "period": f"{start_date} to {end_date}"
        }

    def get_daily_totals(self, user_id: str) -> Dict:
        """Get today's totals for dashboard"""
        today_drinks = self.get_today_drinks(user_id)
        
        return {
            "calories": sum(drink.get('calories', 0) for drink in today_drinks),
            "sugar_g": sum(drink.get('sugar_g', 0) for drink in today_drinks),
            "caffeine_mg": sum(drink.get('caffeine_mg', 0) for drink in today_drinks),
            "water_ml": sum(drink.get('water_ml', 0) for drink in today_drinks),
            "drink_count": len(today_drinks),
            "drinks": today_drinks
        }

    def delete_drink(self, user_id: str, drink_id: str) -> bool:
        """Delete a specific drink"""
        if user_id not in self.drinks_data:
            return False
        
        user_drinks = self.drinks_data[user_id]
        for i, drink in enumerate(user_drinks):
            if drink.get('id') == drink_id:
                del user_drinks[i]
                self._save_data()
                return True
        
        return False

    def get_health_insights(self, user_id: str) -> List[str]:
        """Generate health insights based on drinking patterns"""
        week_stats = self.get_weekly_stats(user_id)
        today_totals = self.get_daily_totals(user_id)
        insights = []
        
        # High sugar warning
        if today_totals['sugar_g'] > 50:
            insights.append(f"You've consumed {today_totals['sugar_g']:.1f}g of sugar today, which exceeds the recommended daily limit.")
        
        # High caffeine warning
        if today_totals['caffeine_mg'] > 400:
            insights.append(f"Your caffeine intake ({today_totals['caffeine_mg']}mg) is above the recommended daily limit of 400mg.")
        
        # Hydration encouragement
        if today_totals['water_ml'] < 1000:
            insights.append("Consider drinking more water to stay properly hydrated throughout the day.")
        
        # Weekly patterns
        if week_stats['avg_drinks_per_day'] > 5:
            insights.append("You're averaging more than 5 drinks per day. Consider moderating your intake.")
        
        # Positive reinforcement
        if len(insights) == 0:
            insights.append("Great job maintaining a balanced drinking pattern!")
        
        return insights