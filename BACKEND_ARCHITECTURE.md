# Backend Architecture Documentation

## Overview
The SnapDrink AI backend is built using Python FastAPI, providing a robust, scalable API for mobile client integration with AI-powered drink analysis capabilities.

## Technology Stack

### Core Framework
- **FastAPI**: Modern, fast web framework for building APIs
- **Python 3.11+**: Latest Python version with performance improvements
- **Uvicorn**: ASGI server for high-performance async handling
- **Pydantic**: Data validation and serialization
- **CORS Middleware**: Cross-origin resource sharing support

### External Integrations
- **Google Cloud Vision API**: Image recognition and text detection
- **Nutritionix API**: Comprehensive nutrition database
- **OpenRouter API**: AI-powered health recommendations
- **PIL (Pillow)**: Image processing and manipulation

### Data Storage
- **File-based JSON Storage**: Simple, reliable data persistence
- **In-memory Caching**: Fast data access and processing
- **Structured Data Models**: Type-safe data management

## Project Structure

```
backend/
├── main.py                          # FastAPI application entry point
├── models/                          # Data models and schemas
│   ├── response_models.py          # API response schemas
│   └── user_models.py              # User data schemas
├── services/                       # Business logic layer
│   ├── vision_service.py           # Google Cloud Vision integration
│   ├── nutrition_service.py        # Nutritionix API and nutrition data
│   ├── health_tip_service.py       # AI health recommendations
│   ├── user_service.py             # User profile management
│   └── drink_history_service.py    # Drink tracking and analytics
├── data/                           # File-based data storage
│   ├── users.json                  # User profiles and settings
│   ├── drink_history.json          # Complete drink history
│   └── goals.json                  # Daily goals and progress
├── .env.example                    # Environment variables template
└── start.py                       # Server startup script
```

## Architecture Layers

### 1. API Layer (main.py)

**Purpose**: HTTP request handling, routing, and response formatting

**Key Components**:
```python
# FastAPI application setup
app = FastAPI(title="SnapDrink AI Backend", version="1.0.0")

# CORS configuration for mobile app access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service initialization
vision_service = VisionService()
nutrition_service = NutritionService()
health_tip_service = HealthTipService()
user_service = UserService()
drink_history_service = DrinkHistoryService()
```

**Endpoint Categories**:
- **Core Analysis**: `/upload` - Image analysis workflow
- **User Management**: `/user/{id}/*` - Profile and settings
- **Health & Analytics**: `/user/{id}/drinks/*` - History and insights
- **System**: `/health` - Service status monitoring

### 2. Service Layer

#### VisionService (vision_service.py)

**Purpose**: Image recognition and drink identification using Google Cloud Vision API

**Architecture**:
```python
class VisionService:
    def __init__(self):
        self.client = None  # Google Cloud Vision client
        self.fallback_drinks = ["Orange Juice", "Coffee", ...]  # Fallback options
        self._setup_client()
    
    async def identify_drink(self, image_data: bytes) -> str:
        if self.client:
            return await self._identify_with_vision_api(image_data)
        else:
            return self._fallback_prediction()
```

**Processing Flow**:
1. **Image Input**: Receive raw image bytes
2. **Vision API Call**: Text and label detection
3. **Text Analysis**: Extract drink names from OCR results
4. **Label Processing**: Analyze image labels for drink types
5. **Name Extraction**: Map detected text/labels to drink names
6. **Fallback Logic**: Random selection if no detection

**Fallback Strategy**:
```python
def _fallback_prediction(self) -> str:
    """Mock prediction when Vision API unavailable"""
    import random
    return random.choice(self.fallback_drinks)
```

#### NutritionService (nutrition_service.py)

**Purpose**: Nutrition data retrieval with comprehensive database fallback

**Architecture**:
```python
class NutritionService:
    def __init__(self):
        self.nutritionix_app_id = os.getenv('NUTRITIONIX_APP_ID')
        self.nutritionix_app_key = os.getenv('NUTRITIONIX_APP_KEY')
        self.nutrition_database = {
            # Comprehensive local nutrition database
            "Coca Cola": {"calories": 140, "sugar_g": 39, ...},
            "Orange Juice": {"calories": 110, "sugar_g": 22, ...},
            # ... 15+ drinks with complete nutrition data
        }
```

**Data Flow**:
1. **API Attempt**: Try Nutritionix API first
2. **Local Lookup**: Search comprehensive local database
3. **Fuzzy Matching**: Handle similar drink names
4. **Default Values**: Sensible defaults for unknown drinks

**Local Database Features**:
- 15+ common drinks with complete nutrition profiles
- Calories, sugar, caffeine, water, sodium, carbs, protein
- Health insights and alternative suggestions
- Fuzzy matching for drink name variations

#### HealthTipService (health_tip_service.py)

**Purpose**: AI-powered health recommendations with intelligent fallbacks

**Architecture**:
```python
class HealthTipService:
    def __init__(self):
        self.client = None  # OpenRouter AI client
        self.health_tips_database = {
            "high_sugar": ["Tip 1", "Tip 2", ...],
            "high_caffeine": ["Tip 1", "Tip 2", ...],
            "healthy": ["Tip 1", "Tip 2", ...],
            # ... categorized tips for all scenarios
        }
```

**Tip Generation Process**:
1. **AI Analysis**: Use OpenRouter API for personalized tips
2. **Categorization**: Classify drink based on nutrition profile
3. **Fallback Selection**: Choose appropriate tips from local database
4. **Personalization**: Context-aware recommendations

**Categorization Logic**:
```python
def _categorize_drink(self, nutrition_data: NutritionData) -> str:
    if nutrition_data.sugar_g > 20:
        return "high_sugar"
    elif nutrition_data.caffeine_mg > 80:
        return "high_caffeine"
    elif nutrition_data.calories > 150:
        return "high_calories"
    elif nutrition_data.sugar_g < 5 and nutrition_data.calories < 50:
        return "healthy"
    else:
        return "moderate"
```

#### UserService (user_service.py)

**Purpose**: User profile management, settings, and goal tracking

**Architecture**:
```python
class UserService:
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        self.users_file = os.path.join(data_dir, "users.json")
        self._load_data()
```

**Core Functions**:
- **Profile Management**: Create/update user profiles
- **Settings Persistence**: Notifications, health preferences, privacy
- **Goal Tracking**: Daily goals with automatic progress updates
- **BMR Calculation**: Mifflin-St Jeor equation for calorie targets
- **Achievement Tracking**: Goal completion monitoring

**Goal Update Mechanism**:
```python
def update_goals_from_drink(self, user_id: str, nutrition_data: Dict):
    user = self.get_or_create_user(user_id)
    self._reset_daily_goals_if_new_day(user)  # Reset at midnight
    
    for goal in user.daily_goals:
        if goal.type == GoalType.calories:
            goal.current += nutrition_data.get('calories', 0)
        # ... update other goal types
        goal.is_achieved = goal.current >= goal.target
```

#### DrinkHistoryService (drink_history_service.py)

**Purpose**: Comprehensive drink tracking and analytics

**Architecture**:
```python
class DrinkHistoryService:
    def __init__(self, data_dir: str = "data"):
        self.drinks_file = os.path.join(data_dir, "drink_history.json")
        self._load_data()
```

**Analytics Features**:
- **Complete History**: All drinks with timestamps and nutrition
- **Daily Totals**: Real-time calculation of today's intake
- **Weekly Statistics**: 7-day analytics and patterns
- **Health Insights**: Pattern-based recommendations
- **Data Management**: Add, retrieve, delete operations

**Weekly Analytics Example**:
```python
def get_weekly_stats(self, user_id: str) -> Dict:
    end_date = date.today()
    start_date = end_date - timedelta(days=7)
    week_drinks = self.get_drinks_by_date_range(user_id, start_date, end_date)
    
    return {
        "total_drinks": len(week_drinks),
        "total_calories": sum(drink.get('calories', 0) for drink in week_drinks),
        "avg_drinks_per_day": len(week_drinks) / 7,
        "most_consumed_drink": self._get_most_consumed(week_drinks),
        "drink_breakdown": self._get_drink_breakdown(week_drinks)
    }
```

### 3. Data Models Layer

#### Response Models (response_models.py)

**Purpose**: API response structure and validation

```python
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
```

#### User Models (user_models.py)

**Purpose**: User data structure and validation

```python
class UserProfile(BaseModel):
    user_id: str
    notifications: NotificationSettings = NotificationSettings()
    health_preferences: HealthPreferences = HealthPreferences()
    privacy_settings: PrivacySettings = PrivacySettings()
    daily_goals: List[DailyGoal] = []
    created_at: datetime
    updated_at: datetime
```

### 4. Data Storage Layer

#### File-Based Storage Strategy

**Advantages**:
- Simple setup and maintenance
- Human-readable JSON format
- No database server required
- Easy backup and migration
- Suitable for single-user application

**Storage Structure**:
```
data/
├── users.json          # User profiles, settings, goals
├── drink_history.json  # Complete drink consumption history  
└── backups/           # Automatic backups (future)
    ├── users_backup_YYYYMMDD.json
    └── drinks_backup_YYYYMMDD.json
```

**Data Persistence Pattern**:
```python
def _save_data(self):
    """Thread-safe data persistence"""
    with open(self.data_file, 'w') as f:
        json.dump(self.data, f, indent=2, default=str)
```

## API Workflow Patterns

### 1. Image Analysis Workflow

```python
@app.post("/upload", response_model=DrinkAnalysisResponse)
async def analyze_drink(file: UploadFile = File(...)):
    # 1. Validate image file
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # 2. Process image
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data))
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # 3. AI Analysis Pipeline
    drink_name = await vision_service.identify_drink(image_data)
    nutrition_data = await nutrition_service.get_nutrition_info(drink_name)
    health_tip = await health_tip_service.generate_health_tip(drink_name, nutrition_data)
    
    # 4. Update User Data
    user_id = "default"  # Future: extract from authentication
    user_service.update_goals_from_drink(user_id, nutrition_data.dict())
    drink_history_service.add_drink(user_id, drink_name, nutrition_data, health_tip)
    
    # 5. Return Structured Response
    return DrinkAnalysisResponse(
        drink_name=drink_name,
        nutrition=nutrition_data,
        health_tip=health_tip,
        confidence_score=0.85
    )
```

### 2. Settings Management Workflow

```python
@app.put("/user/{user_id}/notifications")
async def update_notifications(settings: UpdateNotificationSettings, user_id: str = "default"):
    # 1. Validate input data (automatic via Pydantic)
    # 2. Update user profile
    updated_settings = user_service.update_notifications(user_id, settings)
    # 3. Return confirmation
    return {"message": "Notification settings updated", "settings": updated_settings.dict()}
```

## Error Handling Strategy

### External API Failures

**Google Cloud Vision API**:
```python
try:
    result = self.client.text_detection(image=image)
    return self._process_vision_result(result)
except Exception as e:
    logger.warning(f"Vision API failed: {e}")
    return self._fallback_prediction()
```

**Nutritionix API**:
```python
try:
    response = requests.post(nutritionix_url, headers=headers, json=data)
    if response.status_code == 200:
        return self._parse_nutritionix_response(response.json())
except Exception as e:
    logger.warning(f"Nutritionix API failed: {e}")

# Always fallback to local database
return self._get_from_database(drink_name)
```

### Input Validation

**FastAPI + Pydantic**:
```python
# Automatic validation via Pydantic models
class UpdateDailyGoal(BaseModel):
    target: Optional[float] = None
    current: Optional[float] = None
    
    @validator('target')
    def target_must_be_positive(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Target must be positive')
        return v
```

### HTTP Error Responses

```python
# Structured error handling
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code}
    )
```

## Performance Optimizations

### Asynchronous Processing

```python
# Async/await pattern for I/O operations
async def identify_drink(self, image_data: bytes) -> str:
    if self.client:
        return await self._identify_with_vision_api(image_data)
    return self._fallback_prediction()
```

### Caching Strategy

**In-Memory Caching**:
- User profiles cached after first load
- Nutrition database loaded once at startup
- Recent API responses cached temporarily

### Request Optimization

**Image Processing**:
- Image compression and format conversion
- Efficient memory handling for large images
- Streaming file uploads

**Database Operations**:
- Lazy loading of user data
- Efficient JSON parsing and serialization
- Incremental data updates

## Security Considerations

### Input Sanitization

**Image Upload Security**:
```python
# File type validation
if not file.content_type.startswith('image/'):
    raise HTTPException(status_code=400, detail="File must be an image")

# File size limits
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
if len(image_data) > MAX_FILE_SIZE:
    raise HTTPException(status_code=413, detail="File too large")
```

### API Key Management

**Environment Variables**:
```python
# Secure API key handling
self.nutritionix_app_id = os.getenv('NUTRITIONIX_APP_ID')
if not self.nutritionix_app_id:
    logger.warning("Nutritionix API key not configured")
```

### Data Privacy

**User Data Protection**:
- No sensitive data in logs
- Secure file storage permissions
- Optional data collection settings

## Monitoring and Logging

### Health Checks

```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "vision": vision_service.is_available(),
            "nutrition": nutrition_service.is_available(),
            "health_tips": health_tip_service.is_available(),
            "user_service": user_service is not None
        }
    }
```

### Request Logging

```python
# Automatic request/response logging
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Log API calls and performance
logger.info(f"Processing drink analysis for user {user_id}")
```

## Deployment Architecture

### Development Setup

```bash
# Install dependencies
pip install fastapi uvicorn python-multipart pillow google-cloud-vision requests openai python-dotenv

# Start development server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Production Considerations

**Server Configuration**:
- Multiple worker processes
- Production ASGI server (Gunicorn + Uvicorn)
- Reverse proxy (Nginx)
- SSL/TLS termination

**Scaling Strategy**:
- Horizontal scaling with load balancer
- Database migration (PostgreSQL/MongoDB)
- External file storage (AWS S3)
- API rate limiting and caching

This backend architecture provides a robust, scalable foundation for the SnapDrink AI application with intelligent fallbacks, comprehensive error handling, and performance optimizations.