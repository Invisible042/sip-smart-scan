from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv
import io
from PIL import Image
import base64

from services.vision_service import VisionService
from services.nutrition_service import NutritionService
from services.health_tip_service import HealthTipService
from services.user_service import UserService
from services.drink_history_service import DrinkHistoryService
from models.response_models import DrinkAnalysisResponse
from models.user_models import (
    UpdateNotificationSettings, UpdateHealthPreferences, UpdatePrivacySettings,
    CreateDailyGoal, UpdateDailyGoal
)

# Load environment variables
load_dotenv()

app = FastAPI(title="SnapDrink AI Backend", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
vision_service = VisionService()
nutrition_service = NutritionService()
health_tip_service = HealthTipService()
user_service = UserService()
drink_history_service = DrinkHistoryService()

@app.get("/")
async def root():
    return {"message": "SnapDrink AI Backend is running"}

@app.post("/upload", response_model=DrinkAnalysisResponse)
async def analyze_drink(file: UploadFile = File(...)):
    """
    Upload an image of a drink and get analysis including:
    - Drink name identification
    - Nutritional information
    - Health tip
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Step 1: Identify drink using Vision API
        drink_name = await vision_service.identify_drink(image_data)
        
        # Step 2: Get nutrition information
        nutrition_data = await nutrition_service.get_nutrition_info(drink_name)
        
        # Step 3: Generate health tip
        health_tip = await health_tip_service.generate_health_tip(drink_name, nutrition_data)
        
        # Step 4: Update daily goals and save drink history
        user_id = "default"  # In real app, get from authentication
        user_service.update_goals_from_drink(user_id, nutrition_data.dict())
        drink_history_service.add_drink(user_id, drink_name, nutrition_data, health_tip)
        
        return DrinkAnalysisResponse(
            drink_name=drink_name,
            nutrition=nutrition_data,
            health_tip=health_tip,
            confidence_score=0.85  # You can make this dynamic based on vision API confidence
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "services": {
        "vision": vision_service.is_available(),
        "nutrition": nutrition_service.is_available(),
        "health_tips": health_tip_service.is_available(),
        "user_service": user_service is not None
    }}

# User Profile Endpoints
@app.get("/user/{user_id}/profile")
async def get_user_profile(user_id: str = "default"):
    """Get complete user profile"""
    user = user_service.get_or_create_user(user_id)
    return user.dict()

@app.get("/user/{user_id}/stats")
async def get_user_stats(user_id: str = "default"):
    """Get user statistics and achievements"""
    return user_service.get_user_stats(user_id)

# Notifications Endpoints
@app.get("/user/{user_id}/notifications")
async def get_notifications(user_id: str = "default"):
    """Get notification settings"""
    user = user_service.get_or_create_user(user_id)
    return user.notifications.dict()

@app.put("/user/{user_id}/notifications")
async def update_notifications(settings: UpdateNotificationSettings, user_id: str = "default"):
    """Update notification settings"""
    updated_settings = user_service.update_notifications(user_id, settings)
    return {"message": "Notification settings updated", "settings": updated_settings.dict()}

# Health Preferences Endpoints
@app.get("/user/{user_id}/health-preferences")
async def get_health_preferences(user_id: str = "default"):
    """Get health preferences"""
    user = user_service.get_or_create_user(user_id)
    return user.health_preferences.dict()

@app.put("/user/{user_id}/health-preferences")
async def update_health_preferences(preferences: UpdateHealthPreferences, user_id: str = "default"):
    """Update health preferences"""
    updated_prefs = user_service.update_health_preferences(user_id, preferences)
    return {"message": "Health preferences updated", "preferences": updated_prefs.dict()}

# Privacy Settings Endpoints
@app.get("/user/{user_id}/privacy")
async def get_privacy_settings(user_id: str = "default"):
    """Get privacy settings"""
    user = user_service.get_or_create_user(user_id)
    return user.privacy_settings.dict()

@app.put("/user/{user_id}/privacy")
async def update_privacy_settings(settings: UpdatePrivacySettings, user_id: str = "default"):
    """Update privacy settings"""
    updated_settings = user_service.update_privacy_settings(user_id, settings)
    return {"message": "Privacy settings updated", "settings": updated_settings.dict()}

# Daily Goals Endpoints
@app.get("/user/{user_id}/daily-goals")
async def get_daily_goals(user_id: str = "default"):
    """Get all daily goals"""
    goals = user_service.get_daily_goals(user_id)
    return {"goals": [goal.dict() for goal in goals]}

@app.post("/user/{user_id}/daily-goals")
async def create_daily_goal(goal_data: CreateDailyGoal, user_id: str = "default"):
    """Create a new daily goal"""
    new_goal = user_service.create_daily_goal(user_id, goal_data)
    return {"message": "Daily goal created", "goal": new_goal.dict()}

@app.put("/user/{user_id}/daily-goals/{goal_id}")
async def update_daily_goal(goal_id: str, goal_update: UpdateDailyGoal, user_id: str = "default"):
    """Update an existing daily goal"""
    try:
        updated_goal = user_service.update_daily_goal(user_id, goal_id, goal_update)
        return {"message": "Daily goal updated", "goal": updated_goal.dict()}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/user/{user_id}/achievements")
async def get_achievements(user_id: str = "default"):
    """Get user achievements"""
    achievements = user_service.get_achievements(user_id)
    return {"achievements": achievements}

# Drink History Endpoints
@app.get("/user/{user_id}/drinks")
async def get_drink_history(user_id: str = "default", limit: int = None):
    """Get user's drink history"""
    drinks = drink_history_service.get_user_drinks(user_id, limit)
    return {"drinks": drinks}

@app.get("/user/{user_id}/drinks/today")
async def get_today_drinks(user_id: str = "default"):
    """Get today's drinks"""
    drinks = drink_history_service.get_today_drinks(user_id)
    totals = drink_history_service.get_daily_totals(user_id)
    return {
        "drinks": drinks,
        "totals": totals
    }

@app.get("/user/{user_id}/drinks/weekly-stats")
async def get_weekly_stats(user_id: str = "default"):
    """Get weekly drinking statistics"""
    stats = drink_history_service.get_weekly_stats(user_id)
    return {"weekly_stats": stats}

@app.get("/user/{user_id}/health-insights")
async def get_health_insights(user_id: str = "default"):
    """Get personalized health insights"""
    insights = drink_history_service.get_health_insights(user_id)
    return {"insights": insights}

@app.delete("/user/{user_id}/drinks/{drink_id}")
async def delete_drink(user_id: str, drink_id: str):
    """Delete a specific drink"""
    success = drink_history_service.delete_drink(user_id, drink_id)
    if success:
        return {"message": "Drink deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Drink not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)