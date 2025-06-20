# SnapDrink AI API Reference

## Base URL

```
http://localhost:8000
```

## Authentication

Currently uses default user ID (`default`). In production, implement proper authentication middleware.

## Response Format

All API responses follow standard HTTP status codes with JSON payloads.

### Success Response (200)

```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response (4xx/5xx)

```json
{
  "detail": "Error description",
  "status_code": 400
}
```

## Core Endpoints

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "services": {
    "vision": false,
    "nutrition": true,
    "health_tips": true,
    "user_service": true
  }
}
```

### Image Analysis

#### Upload and Analyze Drink

```http
POST /upload
Content-Type: multipart/form-data
```

**Request Body:**

- `file`: Image file (JPEG/PNG, max 10MB)

**Response:**

```json
{
  "drink_name": "Coca Cola Classic",
  "nutrition": {
    "calories": 140.0,
    "sugar_g": 39.0,
    "caffeine_mg": 34.0,
    "water_ml": 330.0,
    "sodium_mg": 45.0,
    "carbs_g": 39.0,
    "protein_g": 0.0
  },
  "health_tip": "High sugar content (39g) exceeds daily recommended intake...",
  "confidence_score": 0.85
}
```

**Error Cases:**

- `400`: Invalid file format
- `413`: File too large
- `500`: Analysis failed

## User Management

### Get User Profile

```http
GET /user/{user_id}/profile
```

**Response:**

```json
{
  "user_id": "default",
  "notifications": { ... },
  "health_preferences": { ... },
  "privacy_settings": { ... },
  "daily_goals": [ ... ],
  "created_at": "2025-06-19T14:30:00Z",
  "updated_at": "2025-06-19T14:30:00Z"
}
```

### Get User Statistics

```http
GET /user/{user_id}/stats
```

**Response:**

```json
{
  "total_goals": 3,
  "achieved_goals": 1,
  "achievement_rate": 0.33,
  "goals": [ ... ],
  "health_preferences": { ... },
  "notifications": { ... },
  "privacy": { ... }
}
```

## Settings Management

### Notifications

#### Get Notification Settings

```http
GET /user/{user_id}/notifications
```

**Response:**

```json
{
  "daily_reminders": true,
  "goal_achievements": true,
  "health_tips": false,
  "weekly_reports": true,
  "reminder_time": "09:00"
}
```

#### Update Notification Settings

```http
PUT /user/{user_id}/notifications
Content-Type: application/json
```

**Request Body:**

```json
{
  "daily_reminders": false,
  "health_tips": true,
  "reminder_time": "08:30"
}
```

**Response:**

```json
{
  "message": "Notification settings updated",
  "settings": { ... }
}
```

### Health Preferences

#### Get Health Preferences

```http
GET /user/{user_id}/health-preferences
```

**Response:**

```json
{
  "age": 30,
  "weight": 70.0,
  "height": 175.0,
  "activity_level": "moderate",
  "dietary_restrictions": "Low sugar",
  "health_goals": "Weight loss",
  "target_calories": 2200,
  "target_water_ml": 2000
}
```

#### Update Health Preferences

```http
PUT /user/{user_id}/health-preferences
Content-Type: application/json
```

**Request Body:**

```json
{
  "age": 31,
  "weight": 68.0,
  "activity_level": "active",
  "dietary_restrictions": "Diabetic"
}
```

**Response:**

```json
{
  "message": "Health preferences updated",
  "preferences": { ... }
}
```

**Notes:**

- BMR calculation triggered when age, weight, height provided
- Target calories automatically calculated based on activity level

### Privacy Settings

#### Get Privacy Settings

```http
GET /user/{user_id}/privacy
```

**Response:**

```json
{
  "data_collection": true,
  "analytics_tracking": false,
  "personalized_ads": false,
  "share_with_partners": false
}
```

#### Update Privacy Settings

```http
PUT /user/{user_id}/privacy
Content-Type: application/json
```

**Request Body:**

```json
{
  "data_collection": false,
  "analytics_tracking": true
}
```

## Daily Goals

### Get Daily Goals

```http
GET /user/{user_id}/daily-goals
```

**Response:**

```json
{
  "goals": [
    {
      "id": "goal_1",
      "name": "Daily Calories",
      "target": 2000.0,
      "current": 450.0,
      "unit": "kcal",
      "type": "calories",
      "created_at": "2025-06-19T08:00:00Z",
      "is_achieved": false
    },
    {
      "id": "goal_2",
      "name": "Daily Water",
      "target": 2000.0,
      "current": 750.0,
      "unit": "ml",
      "type": "water",
      "created_at": "2025-06-19T08:00:00Z",
      "is_achieved": false
    }
  ]
}
```

### Create Daily Goal

```http
POST /user/{user_id}/daily-goals
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Caffeine Limit",
  "target": 400.0,
  "unit": "mg",
  "type": "caffeine"
}
```

**Response:**

```json
{
  "message": "Daily goal created",
  "goal": {
    "id": "goal_new",
    "name": "Caffeine Limit",
    "target": 400.0,
    "current": 0.0,
    "unit": "mg",
    "type": "caffeine",
    "created_at": "2025-06-19T14:30:00Z",
    "is_achieved": false
  }
}
```

### Update Daily Goal

```http
PUT /user/{user_id}/daily-goals/{goal_id}
Content-Type: application/json
```

**Request Body:**

```json
{
  "target": 1800.0,
  "current": 500.0
}
```

**Response:**

```json
{
  "message": "Daily goal updated",
  "goal": { ... }
}
```

## Drink History & Analytics

### Get Drink History

```http
GET /user/{user_id}/drinks
GET /user/{user_id}/drinks?limit=10
```

**Query Parameters:**

- `limit` (optional): Number of drinks to return

**Response:**

```json
{
  "drinks": [
    {
      "id": "drink_123",
      "name": "Orange Juice",
      "calories": 110.0,
      "sugar_g": 22.0,
      "caffeine_mg": 0.0,
      "water_ml": 240.0,
      "sodium_mg": 2.0,
      "carbs_g": 26.0,
      "protein_g": 2.0,
      "health_tip": "Contains natural sugars but lacks fiber...",
      "timestamp": "2025-06-19T10:30:00Z",
      "date": "2025-06-19"
    }
  ]
}
```

### Get Today's Drinks

```http
GET /user/{user_id}/drinks/today
```

**Response:**

```json
{
  "drinks": [ ... ],
  "totals": {
    "calories": 340.0,
    "sugar_g": 45.0,
    "caffeine_mg": 95.0,
    "water_ml": 720.0,
    "drink_count": 3,
    "drinks": [ ... ]
  }
}
```

### Get Weekly Statistics

```http
GET /user/{user_id}/drinks/weekly-stats
```

**Response:**

```json
{
  "weekly_stats": {
    "total_drinks": 21,
    "total_calories": 2940.0,
    "total_sugar_g": 315.0,
    "total_caffeine_mg": 665.0,
    "total_water_ml": 5040.0,
    "avg_calories_per_day": 420.0,
    "avg_drinks_per_day": 3.0,
    "most_consumed_drink": "Coffee",
    "most_consumed_count": 8,
    "drink_breakdown": {
      "Coffee": 8,
      "Orange Juice": 6,
      "Water": 7
    },
    "period": "2025-06-12 to 2025-06-19"
  }
}
```

### Get Health Insights

```http
GET /user/{user_id}/health-insights
```

**Response:**

```json
{
  "insights": [
    "You've consumed 45g of sugar today, which exceeds the recommended daily limit.",
    "Consider drinking more water to stay properly hydrated throughout the day.",
    "Great job maintaining a balanced drinking pattern!"
  ]
}
```

### Get User Achievements

```http
GET /user/{user_id}/achievements
```

**Response:**

```json
{
  "achievements": [
    {
      "goal_name": "Daily Water",
      "target": 2000.0,
      "current": 2100.0,
      "unit": "ml",
      "achieved_at": "2025-06-19T16:30:00Z"
    }
  ]
}
```

### Delete Drink

```http
DELETE /user/{user_id}/drinks/{drink_id}
```

**Response:**

```json
{
  "message": "Drink deleted successfully"
}
```

**Error Response:**

```json
{
  "detail": "Drink not found"
}
```

## Data Types Reference

### Goal Types

- `calories`: Daily caloric intake
- `drinks`: Number of drinks consumed
- `sugar`: Sugar intake in grams
- `caffeine`: Caffeine intake in milligrams
- `water`: Water intake in milliliters

### Activity Levels

- `sedentary`: Little to no exercise
- `light`: Light exercise 1-3 days/week
- `moderate`: Moderate exercise 3-5 days/week
- `active`: Heavy exercise 6-7 days/week
- `very_active`: Very heavy exercise, twice per day

### Nutrition Units

- Calories: `kcal`
- Sugar: `g` (grams)
- Caffeine: `mg` (milligrams)
- Water: `ml` (milliliters)
- Sodium: `mg` (milligrams)
- Carbohydrates: `g` (grams)
- Protein: `g` (grams)

## Rate Limiting

Currently no rate limiting implemented. Recommended for production:

- 100 requests per minute per user
- 10 image uploads per minute per user

## Error Codes

| Code | Description                              |
| ---- | ---------------------------------------- |
| 200  | Success                                  |
| 400  | Bad Request - Invalid input              |
| 404  | Not Found - Resource doesn't exist       |
| 413  | Payload Too Large - File size exceeded   |
| 422  | Unprocessable Entity - Validation failed |
| 500  | Internal Server Error - Server issue     |

## Webhook Support (Future)

Planned webhook endpoints for real-time updates:

- Goal achievements
- Weekly reports
- Health alerts

## SDKs and Libraries

- Python: Use `requests` library
- JavaScript: Use `fetch` API or `axios`
- React Native: Built-in `fetch` support

## Support

For API issues and feature requests, refer to the main documentation or backend logs.
