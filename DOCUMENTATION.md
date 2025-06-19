# SnapDrink AI - Comprehensive Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Data Flow Diagrams](#data-flow-diagrams)
3. [Backend API Documentation](#backend-api-documentation)
4. [Frontend Components](#frontend-components)
5. [Data Models & Types](#data-models--types)
6. [Service Layer](#service-layer)
7. [State Management](#state-management)
8. [Storage Strategy](#storage-strategy)
9. [API Integration Patterns](#api-integration-patterns)
10. [Error Handling & Fallbacks](#error-handling--fallbacks)

## Architecture Overview

SnapDrink AI follows a modern client-server architecture with intelligent offline capabilities:

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE CLIENT (React Native)            │
├─────────────────────────────────────────────────────────────┤
│  Presentation Layer                                         │
│  ├── HomeScreen (Dashboard + Camera)                       │
│  ├── HistoryScreen (Drink History)                         │
│  └── SettingsScreen (User Preferences)                     │
├─────────────────────────────────────────────────────────────┤
│  Service Layer                                              │
│  ├── DrinkAnalysisService (AI Integration)                 │
│  ├── UserService (Settings & Goals)                        │
│  └── Local Storage (AsyncStorage)                          │
├─────────────────────────────────────────────────────────────┤
│  Navigation & State                                         │
│  ├── Bottom Tab Navigation                                  │
│  ├── React Hooks (Local State)                             │
│  └── Context API (Optional)                                │
└─────────────────────────────────────────────────────────────┘
                            │
                     HTTPS/JSON API
                            │
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Python FastAPI)                │
├─────────────────────────────────────────────────────────────┤
│  API Layer                                                  │
│  ├── Image Upload (/upload)                                │
│  ├── User Management (/user/{id}/*)                        │
│  ├── Settings Endpoints                                     │
│  └── Health & Analytics                                     │
├─────────────────────────────────────────────────────────────┤
│  Business Logic                                             │
│  ├── VisionService (Google Cloud Vision)                   │
│  ├── NutritionService (Nutritionix API)                    │
│  ├── HealthTipService (OpenRouter AI)                      │
│  ├── UserService (Profile Management)                      │
│  └── DrinkHistoryService (Analytics)                       │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  ├── File-based Storage (JSON)                             │
│  ├── User Profiles                                          │
│  ├── Drink History                                          │
│  └── Settings Persistence                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                     External APIs
                            │
┌─────────────────────────────────────────────────────────────┐
│  External Services                                          │
│  ├── Google Cloud Vision API (Image Recognition)           │
│  ├── Nutritionix API (Nutrition Data)                      │
│  └── OpenRouter API (AI Health Tips)                       │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Drink Analysis Flow

```
USER ACTION: Take Photo / Select Image
    │
    ▼
[HomeScreen] - Camera/Gallery Integration
    │ (imageUri)
    ▼
[DrinkAnalysisService.analyzeDrink()]
    │ (FormData with image)
    ▼
[Backend: POST /upload]
    │
    ├─▶ [VisionService] ──▶ Google Cloud Vision API
    │   │ (image analysis)
    │   ▼
    │   drink_name identification
    │
    ├─▶ [NutritionService] ──▶ Nutritionix API (or local DB)
    │   │ (nutrition lookup)
    │   ▼
    │   calories, sugar, caffeine, water data
    │
    ├─▶ [HealthTipService] ──▶ OpenRouter AI API
    │   │ (health analysis)
    │   ▼
    │   personalized health tip
    │
    └─▶ [UserService] ──▶ Update daily goals
        │ (goal progress)
        ▼
        goal completion tracking
    │
    ▼ (DrinkAnalysisResponse)
[DrinkAnalysisService] - Process backend response
    │ (DrinkData object)
    ▼
[AsyncStorage] - Save drink locally
    │
    ▼
[HomeScreen] - Update UI with results
    │
    ├─▶ Show success alert with drink info
    ├─▶ Refresh today's stats
    └─▶ Update goal progress indicators
```

### 2. Settings Management Flow

```
USER ACTION: Update Settings
    │
    ▼
[SettingsScreen] - User interaction
    │ (settings update)
    ▼
[UserService] - Determine setting type
    │
    ├─▶ Notifications
    │   ├─▶ [Backend: PUT /user/{id}/notifications]
    │   └─▶ [AsyncStorage fallback]
    │
    ├─▶ Health Preferences  
    │   ├─▶ [Backend: PUT /user/{id}/health-preferences]
    │   ├─▶ BMR calculation (if weight/height/age provided)
    │   └─▶ [AsyncStorage fallback]
    │
    ├─▶ Privacy Settings
    │   ├─▶ [Backend: PUT /user/{id}/privacy]
    │   └─▶ [AsyncStorage fallback]
    │
    └─▶ Daily Goals
        ├─▶ [Backend: POST/PUT /user/{id}/daily-goals/{id}]
        └─▶ [AsyncStorage fallback]
    │
    ▼
[Backend Services] - Process and validate
    │
    ├─▶ [UserService] - Update user profile
    ├─▶ [File Storage] - Persist changes
    └─▶ [Business Logic] - Apply calculations
    │
    ▼
[Response] - Success/Error status
    │
    ▼
[SettingsScreen] - Update UI state
```

### 3. Dashboard Data Loading Flow

```
APP STARTUP / SCREEN FOCUS
    │
    ▼
[HomeScreen.loadData()] - Triggered on mount/refresh
    │
    ├─▶ [DrinkAnalysisService.getTodayStats()]
    │   │
    │   ├─▶ [AsyncStorage] - Get local drinks
    │   ├─▶ Filter by today's date
    │   └─▶ Calculate totals (calories, sugar, caffeine, water)
    │
    └─▶ [UserService.getDailyGoals()]
        │
        ├─▶ [Backend: GET /user/{id}/daily-goals]
        │   │ (if available)
        │   ▼
        │   Current progress from backend
        │
        └─▶ [Default Goals] (if backend unavailable)
            │
            ▼
            Static default goal set
    │
    ▼
[State Updates] - Update component state
    │
    ├─▶ todayStats: { calories, sugar, caffeine, water, drinkCount }
    └─▶ goals: DailyGoal[]
    │
    ▼
[UI Rendering] - Display updated information
    │
    ├─▶ Main calories card with progress
    ├─▶ Nutrition grid with individual stats
    ├─▶ Goal progress bars
    └─▶ Achievement indicators
```

### 4. History Data Flow

```
USER ACTION: View History
    │
    ▼
[HistoryScreen.loadDrinks()] - Load drink history
    │
    ▼
[DrinkAnalysisService.getDrinksFromStorage()]
    │
    ▼
[AsyncStorage.getItem('drinks')] - Retrieve stored drinks
    │
    ▼
[Data Processing] - Parse and sort drinks
    │ (sort by timestamp, newest first)
    ▼
[State Update] - Update drinks array
    │
    ▼
[UI Rendering] - Display drink cards
    │
    └─▶ For each drink:
        ├─▶ Drink name and time
        ├─▶ Calorie badge
        ├─▶ Nutrition grid (sugar, caffeine, water)
        └─▶ Health tip (if available)
```

## Backend API Documentation

### Core Endpoints

#### Image Analysis
```
POST /upload
Content-Type: multipart/form-data

Request:
- file: Image file (JPEG/PNG)

Response:
{
  "drink_name": "Coca Cola",
  "nutrition": {
    "calories": 140,
    "sugar_g": 39,
    "caffeine_mg": 34,
    "water_ml": 330,
    "sodium_mg": 45,
    "carbs_g": 39,
    "protein_g": 0
  },
  "health_tip": "High sugar content detected...",
  "confidence_score": 0.85
}
```

#### User Management
```
GET /user/{user_id}/profile
Response: Complete user profile with goals, settings, statistics

GET /user/{user_id}/stats  
Response: User statistics and achievement data

GET /user/{user_id}/daily-goals
Response: { "goals": [DailyGoal] }

PUT /user/{user_id}/daily-goals/{goal_id}
Request: { "target": 2000, "current": 150 }
Response: Updated goal object
```

#### Settings Management
```
GET/PUT /user/{user_id}/notifications
GET/PUT /user/{user_id}/health-preferences  
GET/PUT /user/{user_id}/privacy
```

#### Analytics & History
```
GET /user/{user_id}/drinks
Response: Complete drink history

GET /user/{user_id}/drinks/today
Response: Today's drinks and totals

GET /user/{user_id}/drinks/weekly-stats
Response: Weekly analytics and patterns

GET /user/{user_id}/health-insights
Response: Personalized health recommendations
```

## Frontend Components

### Screen Components

#### HomeScreen.tsx
**Purpose**: Main dashboard with real-time stats and camera integration

**State Management**:
```typescript
const [todayStats, setTodayStats] = useState({
  calories: 0,
  sugar: 0, 
  caffeine: 0,
  water: 0,
  drinkCount: 0
});
const [goals, setGoals] = useState<DailyGoal[]>([]);
const [refreshing, setRefreshing] = useState(false);
```

**Key Functions**:
- `loadData()`: Fetches today's stats and goals
- `showImagePicker()`: Handles camera/gallery selection
- `handleImageResponse()`: Processes captured image
- `onRefresh()`: Pull-to-refresh functionality

**Data Flow**:
1. Mount → loadData() → Service calls → State updates → UI render
2. Camera button → Image picker → Analysis service → Alert + refresh
3. Pull-to-refresh → loadData() → Updated state → UI refresh

#### HistoryScreen.tsx
**Purpose**: Displays chronological drink history with details

**State Management**:
```typescript
const [drinks, setDrinks] = useState<DrinkData[]>([]);
const [refreshing, setRefreshing] = useState(false);
```

**Data Flow**:
1. Mount → loadDrinks() → AsyncStorage → Parse drinks → Sort by date → Render
2. Pull-to-refresh → loadDrinks() → Updated state → UI refresh

#### SettingsScreen.tsx  
**Purpose**: User preferences and app configuration

**Data Flow**:
1. Settings item tap → Alert dialog (placeholder)
2. Future: Navigation to specific setting screens
3. Setting changes → UserService → Backend/AsyncStorage → Confirmation

### Reusable Components

#### DrinkItem Component
**Purpose**: Individual drink display card in history

**Props**:
```typescript
interface DrinkItemProps {
  drink: DrinkData;
}
```

**Renders**:
- Drink name and timestamp
- Calorie badge
- Nutrition grid (sugar, caffeine, water)
- Health tip with icon

#### StatCard Component (Planned)
**Purpose**: Reusable stat display with progress

**Props**:
```typescript
interface StatsCardProps {
  title: string;
  value: number;
  unit: string;
  color: string;
  progress?: number;
}
```

## Data Models & Types

### Core Data Structures

#### DrinkData
```typescript
export interface DrinkData {
  id: string;                    // Unique identifier
  name: string;                  // Drink name from AI analysis
  calories: number;              // Caloric content
  sugar: number;                 // Sugar content in grams
  caffeine?: number;             // Caffeine content in mg (optional)
  water?: number;                // Water content in ml (optional)
  image?: string;                // Local image URI (optional)
  timestamp: string;             // ISO timestamp of consumption
  healthTip?: string;            // AI-generated health advice (optional)
}
```

#### DailyGoal
```typescript
export interface DailyGoal {
  id: string;                    // Unique identifier
  name: string;                  // Goal display name
  target: number;                // Target value to achieve
  current: number;               // Current progress value
  unit: string;                  // Unit of measurement (kcal, g, mg, ml)
  type: 'calories' | 'drinks' | 'sugar' | 'caffeine' | 'water';
  is_achieved?: boolean;         // Achievement status (optional)
}
```

#### User Settings
```typescript
export interface NotificationSettings {
  daily_reminders: boolean;      // Daily drinking reminders
  goal_achievements: boolean;    // Goal completion notifications
  health_tips: boolean;          // Health advice notifications
  weekly_reports: boolean;       // Weekly summary reports
  reminder_time: string;         // Reminder time in HH:MM format
}

export interface HealthPreferences {
  age?: number;                  // User age for BMR calculation
  weight?: number;               // Weight in kg
  height?: number;               // Height in cm
  activity_level: string;        // Activity level for calorie calculation
  dietary_restrictions?: string;  // Special dietary needs
  health_goals?: string;         // Personal health objectives
  target_calories?: number;      // Daily calorie target (calculated)
  target_water_ml?: number;      // Daily water target
}

export interface PrivacySettings {
  data_collection: boolean;      // Allow app data collection
  analytics_tracking: boolean;   // Enable usage analytics
  personalized_ads: boolean;     // Show personalized advertisements
  share_with_partners: boolean;  // Share data with third parties
}
```

### Backend Models

#### Backend Response Format
```typescript
interface BackendResponse {
  drink_name: string;
  nutrition: {
    calories: number;
    sugar_g: number;
    caffeine_mg: number;
    water_ml: number;
    sodium_mg?: number;
    carbs_g?: number;
    protein_g?: number;
  };
  health_tip: string;
  confidence_score: number;
}
```

## Service Layer

### DrinkAnalysisService

**Purpose**: Handles drink analysis and local storage

**Key Methods**:

```typescript
class DrinkAnalysisService {
  // Main analysis function
  static async analyzeDrink(imageUri: string): Promise<DrinkData>
  
  // Local storage management
  private static async saveDrinkLocally(drink: DrinkData): Promise<void>
  static async getDrinksFromStorage(): Promise<DrinkData[]>
  
  // Statistics calculation
  static async getTodayDrinks(): Promise<DrinkData[]>
  static async getTodayStats(): Promise<TodayStats>
}
```

**Data Transformation**:
1. Image URI → FormData → Backend request
2. Backend response → DrinkData conversion
3. DrinkData → AsyncStorage serialization
4. Stored data → Statistics calculation

### UserService

**Purpose**: Manages user settings and goals

**Key Methods**:

```typescript
class UserService {
  // Settings management
  static async getNotifications(): Promise<NotificationSettings>
  static async updateNotifications(settings: Partial<NotificationSettings>): Promise<void>
  
  // Goal management  
  static async getDailyGoals(): Promise<DailyGoal[]>
  static async getTodayDrinks(): Promise<TodayDrinksResponse>
}
```

**Fallback Strategy**:
1. Try backend API call
2. On failure, use AsyncStorage
3. Merge backend and local data when available
4. Silent error handling (no user-facing errors)

## State Management

### Local State Pattern

Each screen manages its own state using React hooks:

```typescript
// Example: HomeScreen state management
const [todayStats, setTodayStats] = useState(initialStats);
const [goals, setGoals] = useState<DailyGoal[]>([]);
const [refreshing, setRefreshing] = useState(false);

// Data loading effect
useEffect(() => {
  loadData();
}, []);

// Refresh handler
const onRefresh = async () => {
  setRefreshing(true);
  await loadData();
  setRefreshing(false);
};
```

### Data Synchronization

**Immediate Updates**: 
- UI updates immediately after user actions
- Background sync with backend
- AsyncStorage backup for offline access

**Refresh Patterns**:
- Pull-to-refresh on all screens
- Automatic refresh after data changes
- Screen focus refresh (when returning to screen)

## Storage Strategy

### AsyncStorage (Client-Side)

**Keys Used**:
```
'drinks'              → DrinkData[]
'notifications'       → NotificationSettings  
'healthPreferences'   → HealthPreferences
'privacySettings'     → PrivacySettings
```

**Data Format**:
- JSON serialization for complex objects
- ISO string format for dates
- Automatic parsing/stringification

### File Storage (Backend)

**Structure**:
```
backend/data/
├── users.json           → User profiles and settings
├── drink_history.json   → Complete drink history
└── goals.json          → Daily goals and progress
```

**Persistence Strategy**:
- Write-through caching (immediate file updates)
- JSON format for human readability
- Automatic backup on writes

## API Integration Patterns

### Request Flow

1. **Authentication**: Default user ID ("default")
2. **Request Formation**: JSON/FormData based on endpoint
3. **Error Handling**: Try-catch with fallback logic
4. **Response Processing**: Type conversion and validation
5. **Local Storage**: Backup copy for offline access

### Retry Logic

```typescript
// Example: Service method with fallback
static async getNotifications(): Promise<NotificationSettings> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${this.userId}/notifications`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    // Silent fallback to AsyncStorage
  }
  
  const stored = await AsyncStorage.getItem('notifications');
  return stored ? JSON.parse(stored) : defaultSettings;
}
```

### Network Resilience

- **No Error Alerts**: Silent fallback to local data
- **Background Sync**: Retry when network available
- **Optimistic Updates**: Update UI immediately, sync later
- **Data Merging**: Combine local and remote data intelligently

## Error Handling & Fallbacks

### Frontend Error Strategy

**Principle**: Never show network errors to users

**Implementation**:
1. All service methods include try-catch blocks
2. Fallback to AsyncStorage on API failures  
3. Default data provided when no local data exists
4. Silent logging for debugging

### Backend Error Handling

**Graceful Degradation**:
- External API failures → Local database fallback
- Invalid requests → Validation errors with suggestions
- System errors → Generic error responses
- Timeout handling → Quick fallbacks

### Data Consistency

**Conflict Resolution**:
1. Backend data is authoritative when available
2. Local data preserved during network outages
3. Merge strategies for conflicting data
4. User preference for data source priority

---

This documentation provides a complete overview of the SnapDrink AI codebase architecture, data flows, and implementation patterns. The system is designed for reliability, offline capability, and smooth user experience across all components.