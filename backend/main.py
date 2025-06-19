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
from models.response_models import DrinkAnalysisResponse

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
        "health_tips": health_tip_service.is_available()
    }}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)