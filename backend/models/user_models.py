from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class ActivityLevel(str, Enum):
    sedentary = "sedentary"
    light = "light"
    moderate = "moderate"
    active = "active"
    very_active = "very_active"

class GoalType(str, Enum):
    calories = "calories"
    sugar = "sugar"
    caffeine = "caffeine"
    water = "water"
    sodium = "sodium"

class NotificationSettings(BaseModel):
    daily_reminders: bool = True
    goal_achievements: bool = True
    health_tips: bool = False
    weekly_reports: bool = True
    reminder_time: str = "09:00"  # HH:MM format

class HealthPreferences(BaseModel):
    age: Optional[int] = None
    weight: Optional[float] = None  # kg
    height: Optional[float] = None  # cm
    activity_level: ActivityLevel = ActivityLevel.moderate
    dietary_restrictions: Optional[str] = None
    health_goals: Optional[str] = None
    target_calories: Optional[int] = None
    target_water_ml: Optional[int] = None

class PrivacySettings(BaseModel):
    data_collection: bool = True
    analytics_tracking: bool = False
    personalized_ads: bool = False
    share_with_partners: bool = False

class DailyGoal(BaseModel):
    id: str
    name: str
    target: float
    current: float = 0.0
    unit: str
    type: GoalType
    created_at: datetime
    is_achieved: bool = False

class UserProfile(BaseModel):
    user_id: str
    notifications: NotificationSettings = NotificationSettings()
    health_preferences: HealthPreferences = HealthPreferences()
    privacy_settings: PrivacySettings = PrivacySettings()
    daily_goals: List[DailyGoal] = []
    created_at: datetime
    updated_at: datetime

class UpdateNotificationSettings(BaseModel):
    daily_reminders: Optional[bool] = None
    goal_achievements: Optional[bool] = None
    health_tips: Optional[bool] = None
    weekly_reports: Optional[bool] = None
    reminder_time: Optional[str] = None

class UpdateHealthPreferences(BaseModel):
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    activity_level: Optional[ActivityLevel] = None
    dietary_restrictions: Optional[str] = None
    health_goals: Optional[str] = None
    target_calories: Optional[int] = None
    target_water_ml: Optional[int] = None

class UpdatePrivacySettings(BaseModel):
    data_collection: Optional[bool] = None
    analytics_tracking: Optional[bool] = None
    personalized_ads: Optional[bool] = None
    share_with_partners: Optional[bool] = None

class CreateDailyGoal(BaseModel):
    name: str
    target: float
    unit: str
    type: GoalType

class UpdateDailyGoal(BaseModel):
    target: Optional[float] = None
    current: Optional[float] = None