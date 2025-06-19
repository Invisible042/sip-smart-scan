from pydantic import BaseModel
from typing import Optional

class NutritionData(BaseModel):
    calories: float
    sugar_g: float
    caffeine_mg: float
    water_ml: float
    sodium_mg: Optional[float] = None
    carbs_g: Optional[float] = None
    protein_g: Optional[float] = None

class DrinkAnalysisResponse(BaseModel):
    drink_name: str
    nutrition: NutritionData
    health_tip: str
    confidence_score: float
    
class HealthCheckResponse(BaseModel):
    status: str
    services: dict