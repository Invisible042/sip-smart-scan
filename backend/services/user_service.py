import json
import os
from datetime import datetime, date
from typing import Dict, List, Optional
from models.user_models import (
    UserProfile, NotificationSettings, HealthPreferences, PrivacySettings,
    DailyGoal, CreateDailyGoal, UpdateDailyGoal, UpdateNotificationSettings,
    UpdateHealthPreferences, UpdatePrivacySettings, GoalType
)
import uuid

class UserService:
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        os.makedirs(data_dir, exist_ok=True)
        self.users_file = os.path.join(data_dir, "users.json")
        self.drinks_file = os.path.join(data_dir, "drinks.json")
        self._load_data()

    def _load_data(self):
        """Load user data from file"""
        try:
            with open(self.users_file, 'r') as f:
                self.users_data = json.load(f)
        except FileNotFoundError:
            self.users_data = {}

    def _save_data(self):
        """Save user data to file"""
        with open(self.users_file, 'w') as f:
            json.dump(self.users_data, f, indent=2, default=str)

    def get_or_create_user(self, user_id: str = "default") -> UserProfile:
        """Get user profile or create default one"""
        if user_id not in self.users_data:
            # Create default user profile
            now = datetime.now()
            default_goals = [
                DailyGoal(
                    id=str(uuid.uuid4()),
                    name="Daily Calories",
                    target=2000,
                    unit="kcal",
                    type=GoalType.calories,
                    created_at=now,
                    current=0
                ),
                DailyGoal(
                    id=str(uuid.uuid4()),
                    name="Daily Water",
                    target=2000,
                    unit="ml",
                    type=GoalType.water,
                    created_at=now,
                    current=0
                ),
                DailyGoal(
                    id=str(uuid.uuid4()),
                    name="Sugar Limit",
                    target=50,
                    unit="g",
                    type=GoalType.sugar,
                    created_at=now,
                    current=0
                )
            ]
            
            user_profile = UserProfile(
                user_id=user_id,
                daily_goals=default_goals,
                created_at=now,
                updated_at=now
            )
            self.users_data[user_id] = user_profile.dict()
            self._save_data()
        
        user_data = self.users_data[user_id]
        return UserProfile(**user_data)

    def update_notifications(self, user_id: str, settings: UpdateNotificationSettings) -> NotificationSettings:
        """Update notification settings"""
        user = self.get_or_create_user(user_id)
        
        # Update only provided fields
        update_data = settings.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user.notifications, key, value)
        
        user.updated_at = datetime.now()
        self.users_data[user_id] = user.dict()
        self._save_data()
        
        return user.notifications

    def update_health_preferences(self, user_id: str, preferences: UpdateHealthPreferences) -> HealthPreferences:
        """Update health preferences"""
        user = self.get_or_create_user(user_id)
        
        # Update only provided fields
        update_data = preferences.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user.health_preferences, key, value)
        
        # Auto-calculate target calories based on health data
        if user.health_preferences.age and user.health_preferences.weight and user.health_preferences.height:
            target_calories = self._calculate_target_calories(user.health_preferences)
            user.health_preferences.target_calories = target_calories
        
        user.updated_at = datetime.now()
        self.users_data[user_id] = user.dict()
        self._save_data()
        
        return user.health_preferences

    def update_privacy_settings(self, user_id: str, settings: UpdatePrivacySettings) -> PrivacySettings:
        """Update privacy settings"""
        user = self.get_or_create_user(user_id)
        
        # Update only provided fields
        update_data = settings.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user.privacy_settings, key, value)
        
        user.updated_at = datetime.now()
        self.users_data[user_id] = user.dict()
        self._save_data()
        
        return user.privacy_settings

    def create_daily_goal(self, user_id: str, goal_data: CreateDailyGoal) -> DailyGoal:
        """Create a new daily goal"""
        user = self.get_or_create_user(user_id)
        
        new_goal = DailyGoal(
            id=str(uuid.uuid4()),
            name=goal_data.name,
            target=goal_data.target,
            unit=goal_data.unit,
            type=goal_data.type,
            created_at=datetime.now(),
            current=0
        )
        
        user.daily_goals.append(new_goal)
        user.updated_at = datetime.now()
        self.users_data[user_id] = user.dict()
        self._save_data()
        
        return new_goal

    def update_daily_goal(self, user_id: str, goal_id: str, goal_update: UpdateDailyGoal) -> DailyGoal:
        """Update an existing daily goal"""
        user = self.get_or_create_user(user_id)
        
        goal_index = next((i for i, g in enumerate(user.daily_goals) if g.id == goal_id), None)
        if goal_index is None:
            raise ValueError(f"Goal with id {goal_id} not found")
        
        goal = user.daily_goals[goal_index]
        update_data = goal_update.dict(exclude_unset=True)
        
        for key, value in update_data.items():
            setattr(goal, key, value)
        
        # Check if goal is achieved
        goal.is_achieved = goal.current >= goal.target
        
        user.updated_at = datetime.now()
        self.users_data[user_id] = user.dict()
        self._save_data()
        
        return goal

    def get_daily_goals(self, user_id: str) -> List[DailyGoal]:
        """Get all daily goals for user"""
        user = self.get_or_create_user(user_id)
        return user.daily_goals

    def update_goals_from_drink(self, user_id: str, nutrition_data: Dict):
        """Update daily goals based on consumed drink"""
        user = self.get_or_create_user(user_id)
        
        # Reset daily goals if it's a new day
        self._reset_daily_goals_if_new_day(user)
        
        # Update each goal based on nutrition data
        for goal in user.daily_goals:
            if goal.type == GoalType.calories:
                goal.current += nutrition_data.get('calories', 0)
            elif goal.type == GoalType.sugar:
                goal.current += nutrition_data.get('sugar_g', 0)
            elif goal.type == GoalType.caffeine:
                goal.current += nutrition_data.get('caffeine_mg', 0)
            elif goal.type == GoalType.water:
                goal.current += nutrition_data.get('water_ml', 0)
            elif goal.type == GoalType.sodium:
                goal.current += nutrition_data.get('sodium_mg', 0)
            
            # Check if goal is achieved
            goal.is_achieved = goal.current >= goal.target
        
        user.updated_at = datetime.now()
        self.users_data[user_id] = user.dict()
        self._save_data()
        
        return user.daily_goals

    def _reset_daily_goals_if_new_day(self, user: UserProfile):
        """Reset daily goal progress if it's a new day"""
        today = date.today()
        last_update = user.updated_at.date() if isinstance(user.updated_at, datetime) else date.fromisoformat(user.updated_at)
        
        if today > last_update:
            for goal in user.daily_goals:
                goal.current = 0
                goal.is_achieved = False

    def _calculate_target_calories(self, health_prefs: HealthPreferences) -> int:
        """Calculate target daily calories using Mifflin-St Jeor equation"""
        if not all([health_prefs.age, health_prefs.weight, health_prefs.height]):
            return 2000  # Default
        
        # Assume male for simplicity (in real app, add gender field)
        bmr = 10 * health_prefs.weight + 6.25 * health_prefs.height - 5 * health_prefs.age + 5
        
        # Activity multipliers
        activity_multipliers = {
            "sedentary": 1.2,
            "light": 1.375,
            "moderate": 1.55,
            "active": 1.725,
            "very_active": 1.9
        }
        
        multiplier = activity_multipliers.get(health_prefs.activity_level, 1.55)
        return int(bmr * multiplier)

    def get_achievements(self, user_id: str) -> List[Dict]:
        """Get user achievements based on goals"""
        user = self.get_or_create_user(user_id)
        achievements = []
        
        for goal in user.daily_goals:
            if goal.is_achieved:
                achievements.append({
                    "goal_name": goal.name,
                    "target": goal.target,
                    "current": goal.current,
                    "unit": goal.unit,
                    "achieved_at": datetime.now().isoformat()
                })
        
        return achievements

    def get_user_stats(self, user_id: str) -> Dict:
        """Get comprehensive user statistics"""
        user = self.get_or_create_user(user_id)
        
        total_goals = len(user.daily_goals)
        achieved_goals = sum(1 for goal in user.daily_goals if goal.is_achieved)
        
        return {
            "total_goals": total_goals,
            "achieved_goals": achieved_goals,
            "achievement_rate": achieved_goals / total_goals if total_goals > 0 else 0,
            "goals": [goal.dict() for goal in user.daily_goals],
            "health_preferences": user.health_preferences.dict(),
            "notifications": user.notifications.dict(),
            "privacy": user.privacy_settings.dict()
        }